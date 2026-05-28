import { Controller, Post, Body } from '@nestjs/common';
import { VerifyBugDto, VerifyBugResult } from 'shared-types';

@Controller('sandbox')
export class SandboxController {
  
  @Post('verify-bug')
  verifyBug(@Body() dto: VerifyBugDto): VerifyBugResult {
    const { bugId, selectedLineNumbers } = dto;
    
    if (bugId === 'n1_loop') {
      // Unoptimized DB N+1 Query Loop
      // Correct lines are: 8, 9, 10
      const isCorrect = selectedLineNumbers.includes(8) || 
                        selectedLineNumbers.includes(9) || 
                        selectedLineNumbers.includes(10);
                        
      if (isCorrect) {
        return {
          success: true,
          message: 'Excellent debugging! You successfully spotted the N+1 database querying leak. The system was executing a separate SELECT query inside the loop for every single property record.',
          optimizedCode: `// ── OPTIMIZED PRODUCTION SOLUTION (USING SQL JOINS) ──
async function getPropertiesWithOwners() {
  // Solves the N+1 query vulnerability by fetching all data in a single joined transaction
  const properties = await this.db.query(\`
    SELECT p.*, o.name as owner_name, o.email as owner_email
    FROM properties p
    LEFT JOIN owners o ON p.owner_id = o.id
  \`);
  
  return properties;
}`,
          diffText: `@@ -7,5 +7,3 @@
-  const properties = await this.db.query("SELECT * FROM properties");
-  return Promise.all(properties.map(async (p) => {
-    const owner = await this.db.query("SELECT * FROM owners WHERE id = ?", [p.owner_id]);
-    return { ...p, owner };
-  }));
+  return this.db.query(\`
+    SELECT p.*, o.name as owner_name, o.email as owner_email
+    FROM properties p
+    LEFT JOIN owners o ON p.owner_id = o.id
+  \`);`
        };
      } else {
        return {
          success: false,
          message: 'Incorrect line selection. Hint: Look for where database queries are executing inside an asynchronous loop block (lines 8-10).',
        };
      }
    }
    
    if (bugId === 'race_condition') {
      // Asynchronous billing double-spend race condition
      // Correct lines are: 5, 6, 7
      const isCorrect = selectedLineNumbers.includes(5) || 
                        selectedLineNumbers.includes(6) || 
                        selectedLineNumbers.includes(7);
                        
      if (isCorrect) {
        return {
          success: true,
          message: 'Superb spot! You identified the race condition. The check-then-act balance transaction is non-atomic, allowing duplicate concurrent debit operations before the database persists the state.',
          optimizedCode: `// ── OPTIMIZED PRODUCTION SOLUTION (USING DISTRIBUTED LOCKS) ──
async function processDebitTransaction(userId: string, amount: number) {
  // Establish an atomic Redis lease to prevent concurrent request double-spending
  const lockKey = \`lock:user:\${userId}\`;
  const lockAcquired = await this.redis.set(lockKey, 'locked', 'NX', 'PX', 5000);
  if (!lockAcquired) {
    throw new Error('Transaction in progress. Please retry.');
  }
  
  try {
    return await this.db.transaction(async (tx) => {
      const user = await tx.query("SELECT balance FROM users WHERE id = ? FOR UPDATE", [userId]);
      if (user.balance < amount) throw new Error("Insufficient funds");
      
      await tx.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
      await tx.query("INSERT INTO ledger (user_id, amount) VALUES (?, ?)", [userId, -amount]);
    });
  } finally {
    await this.redis.del(lockKey);
  }
}`,
          diffText: `@@ -4,4 +4,11 @@
-  const balance = await this.db.query("SELECT balance FROM users WHERE id = ?", [userId]);
-  if (balance < amount) throw new Error("Insufficient funds");
-  await this.db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
+  const lockKey = \`lock:user:\${userId}\`;
+  const lockAcquired = await this.redis.set(lockKey, 'locked', 'NX', 'PX', 5000);
+  if (!lockAcquired) throw new Error('Transaction in progress. Please retry.');
+  try {
+    await this.db.transaction(async (tx) => {
+      const user = await tx.query("SELECT balance FROM users WHERE id = ? FOR UPDATE", [userId]);
+      if (user.balance < amount) throw new Error("Insufficient balance");
+      await tx.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
+    });
+  } finally {
+    await this.redis.del(lockKey);
+  } `
        };
      } else {
        return {
          success: false,
          message: 'Incorrect selection. Hint: Look at lines 5-7. The query fetches the user balance and evaluates it *before* lock-in or atomicity controls are established.',
        };
      }
    }
    
    return {
      success: false,
      message: 'Unknown bug puzzle target.',
    };
  }
}
