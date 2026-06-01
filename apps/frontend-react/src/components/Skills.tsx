import { useState, useEffect } from 'react';
import { RESUME_DATA } from '../data/resume';
import { useRole } from '../utils/RoleContext';
import { logEvent } from './FloatingConsole';
import { CheckCircle, AlertTriangle, Play, RefreshCw, Code, Terminal } from 'lucide-react';

interface SkillMatchResult {
  score: number;
  comment: string;
  highlightedProjects: string[];
  highlights: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Skills() {
  const { role } = useRole();
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [matchLoading, setMatchLoading] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<SkillMatchResult | null>(null);

  // Sandbox states
  const [activeBug, setActiveBug] = useState<'n1_loop' | 'race_condition'>('n1_loop');
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [sandboxFeedback, setSandboxFeedback] = useState<{ success: boolean; message: string; diffText?: string; optimizedCode?: string } | null>(null);

  // ── 1. Skill Matcher API Call with Local Fallback ───────────────────────────
  const handleTagClick = async (tag: string) => {
    if (selectedTag === tag) return;
    setSelectedTag(tag);
    setMatchLoading(true);
    setMatchResult(null);

    const apiPath = `/api/portfolio/skills?match=${encodeURIComponent(tag)}`;
    logEvent('API', `GET ${apiPath} - Pending...`);

    try {
      const response = await fetch(`${API_URL}${apiPath}`);
      if (!response.ok) throw new Error('Backend query failed');
      const data = await response.json();
      
      setMatchResult(data);
      logEvent('API', `GET ${apiPath} - 200 OK (${data.score}% Compatibility calculated)`);
      
      // Dispatch highlight event to Projects grid
      window.dispatchEvent(new CustomEvent('highlight-projects', { detail: data.highlightedProjects }));
    } catch (err) {
      // Offline fallback strategy
      console.warn('Backend offline, running local skill resolver:', err);
      logEvent('LIFECYCLE', 'Backend offline. Running sandboxed local resolver...');

      // Dynamic local simulation
      setTimeout(() => {
        let localData: SkillMatchResult = {
          score: 85,
          comment: `Evaluated ${tag} skills natively from resume content.`,
          highlightedProjects: ['1', '2'],
          highlights: [`Experienced with ${tag} frameworks.`],
        };

        const raw = tag.toLowerCase();
        if (raw === 'react') {
          localData = {
            score: 96,
            comment: 'Highly compatible! Engineered core React states and Redux wrappers across 3 major SaaS platforms.',
            highlightedProjects: ['4', '6', '7'],
            highlights: ['Built MuxEmail dashboard.', 'Developed React Jest testing structures.'],
          };
        } else if (raw === 'nestjs') {
          localData = {
            score: 98,
            comment: 'Elite compatibility! Lead backend architect leveraging microservices and event brokers in NestJS.',
            highlightedProjects: ['1', '3'],
            highlights: ['Developed SoftBuilders Properties Elasticsearch platform.', 'Managed BullMQ event workers.'],
          };
        } else if (raw === 'node.js' || raw === 'node') {
          localData = {
            score: 95,
            comment: 'Expert level! Constructed secure authorization middlewares, Stripe payment flows, and background processing lines.',
            highlightedProjects: ['2', '3', '4'],
            highlights: ['Designed Stripe payment intents and webhooks.', 'Configured Redis server caches.'],
          };
        }

        setMatchResult(localData);
        logEvent('API', `GET ${apiPath} - 200 OK (Local Fallback - ${localData.score}% Compatibility resolved)`);
        window.dispatchEvent(new CustomEvent('highlight-projects', { detail: localData.highlightedProjects }));
      }, 500);
    } finally {
      setMatchLoading(false);
    }
  };

  // Reset states on role shift
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedTag('');
      setMatchResult(null);
      setSelectedLines([]);
      setSandboxFeedback(null);
      window.dispatchEvent(new CustomEvent('highlight-projects', { detail: [] }));
    }, 0);
    return () => clearTimeout(timer);
  }, [role]);

  // ── 2. Sandbox Bug Submission with Local Fallback ──────────────────────────
  const toggleLine = (lineNum: number) => {
    if (selectedLines.includes(lineNum)) {
      setSelectedLines(selectedLines.filter(l => l !== lineNum));
    } else {
      setSelectedLines([...selectedLines, lineNum]);
    }
  };

  const submitSandboxReview = async () => {
    if (selectedLines.length === 0) return;
    setSandboxLoading(true);
    setSandboxFeedback(null);

    const apiPath = '/api/sandbox/verify-bug';
    logEvent('API', `POST ${apiPath} - Evaluating bug selection...`);

    const payload = {
      bugId: activeBug,
      selectedLineNumbers: selectedLines,
    };

    try {
      const response = await fetch(`${API_URL}${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Evaluation failed');
      const data = await response.json();

      setSandboxFeedback(data);
      if (data.success) {
        logEvent('API', `POST ${apiPath} - 200 OK (Vulnerability successfully patched!)`);
      } else {
        logEvent('API', `POST ${apiPath} - 400 Bad Request (Incorrect selection)`);
      }
    } catch (err) {
      console.warn('Backend offline, running local sandbox compiler:', err);
      logEvent('LIFECYCLE', 'Backend offline. Compiling code locally in sandbox fallback...');

      setTimeout(() => {
        if (activeBug === 'n1_loop') {
          const isCorrect = selectedLines.includes(8) || selectedLines.includes(9) || selectedLines.includes(10);
          if (isCorrect) {
            setSandboxFeedback({
              success: true,
              message: 'Excellent debugging! You spotted the N+1 database querying leak locally.',
              optimizedCode: `async function getPropertiesWithOwners() {
  return this.db.query(\`
    SELECT p.*, o.name as owner_name, o.email as owner_email
    FROM properties p
    LEFT JOIN owners o ON p.owner_id = o.id
  \`);
}`,
              diffText: `-  return Promise.all(properties.map(async (p) => {
-    const owner = await this.db.query("SELECT * FROM owners WHERE id = ?", [p.owner_id]);
+  return this.db.query("SELECT p.*, o.name FROM properties p LEFT JOIN owners o ON p.owner_id = o.id");`
            });
            logEvent('API', `POST ${apiPath} - 200 OK (Local verified!)`);
          } else {
            setSandboxFeedback({
              success: false,
              message: 'Incorrect selection. Hint: Spot where the database SELECT query is executing inside a loop.',
            });
            logEvent('API', `POST ${apiPath} - 400 Bad Request (Incorrect selection)`);
          }
        } else {
          // race condition
          const isCorrect = selectedLines.includes(4) || selectedLines.includes(5) || selectedLines.includes(6);
          if (isCorrect) {
            setSandboxFeedback({
              success: true,
              message: 'Superb spot! You identified the concurrency double-spend race condition locally.',
              optimizedCode: `async function processDebitTransaction(userId, amount) {
  const lockKey = \`lock:user:\${userId}\`;
  const lockAcquired = await this.redis.set(lockKey, 'locked', 'NX', 'PX', 5000);
  if (!lockAcquired) throw new Error('Transaction in progress');
  // ...db transactions
}`,
              diffText: `-  const balance = await this.db.query("SELECT balance...");
+  const lockAcquired = await this.redis.set(lockKey, 'locked', 'NX', 'PX', 5000);`
            });
            logEvent('API', `POST ${apiPath} - 200 OK (Local verified!)`);
          } else {
            setSandboxFeedback({
              success: false,
              message: 'Incorrect selection. Hint: Look at lines 4-6 where balance is fetched before any concurrency lock.',
            });
            logEvent('API', `POST ${apiPath} - 400 Bad Request (Incorrect selection)`);
          }
        }
      }, 500);
    } finally {
      setSandboxLoading(false);
    }
  };

  // Puzzles datasets
  const n1LoopCode = [
    `// Fetch properties and populate owners in NestJS`,
    `async function getPropertiesWithOwners() {`,
    `  const properties = await this.db.query(`,
    `    "SELECT * FROM properties"`,
    `  );`,
    ``,
    `  // Unoptimized N+1 db queries executing in loop:`,
    `  return Promise.all(properties.map(async (p) => {`,
    `    const owner = await this.db.query(`,
    `      "SELECT * FROM owners WHERE id = ?",`,
    `      [p.owner_id]`,
    `    );`,
    `    return { ...p, owner };`,
    `  }));`,
    `}`
  ];

  const raceConditionCode = [
    `// Asynchronous check-then-act balance debit`,
    `async function processDebitTransaction(userId, amount) {`,
    `  // Fetch user balance to verify funds`,
    `  const balance = await this.db.query(`,
    `    "SELECT balance FROM users WHERE id = ?",`,
    `    [userId]`,
    `  );`,
    `  if (balance < amount) {`,
    `    throw new Error("Insufficient funds");`,
    `  }`,
    ``,
    `  // Debit the balance without concurrent mutex locks`,
    `  await this.db.query(`,
    `    "UPDATE users SET balance = balance - ? WHERE id = ?",`,
    `    [amount, userId]`,
    `  );`,
    `}`
  ];

  const activeCodeLines = activeBug === 'n1_loop' ? n1LoopCode : raceConditionCode;

  return (
    <section className="py-section-gap max-w-container-max mx-auto px-gutter reveal" id="skills">
      
      {/* Expose API endpoints tags in CTO mode */}
      {role === 'CTO' && (
        <div className="mb-4 flex items-center gap-2 font-mono text-[10px] text-sky-400 bg-sky-950/40 border border-sky-800/40 px-3 py-1 rounded-md max-w-fit">
          <Terminal size={12} />
          <span>SUBSCRIBING: GET /api/portfolio/skills?match=tag | POST /api/sandbox/verify-bug</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg">

        {/* ── Label Column ── */}
        <div className="md:col-span-1">
          <h2 className="font-headline-md text-[28px] md:text-[32px] font-semibold text-on-surface md:sticky md:top-32">
            Technical {role === 'CTO' ? <span className="text-sky-400">Sandbox</span> : <span className="text-primary">Stack</span>}
          </h2>
          <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] text-on-surface-variant">
            {role === 'HR' 
              ? 'Select technology keywords below to evaluate compatibilities instantly.'
              : role === 'CTO'
              ? 'Audit actual system anomalies inside our interactive code sandbox.'
              : 'A specialized toolkit engineered for enterprise scale.'}
          </p>
        </div>

        {/* ── Main Skills Area ── */}
        <div className="md:col-span-3">
          
          {/* 🚀 HR PERSPECTIVE: The Keyword Matcher */}
          {role === 'HR' && (
            <div className="glass-card p-6 border border-primary/30 rounded-xl mb-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <Code size={14} /> Interactive Skill Compatibility Matcher
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'NestJS', 'Node.js', 'Stripe', 'AWS', 'GCP'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    disabled={matchLoading}
                    className={`px-4 py-2 font-code-md text-xs rounded transition-all duration-300 ${
                      selectedTag === tag 
                        ? 'bg-primary text-background font-bold shadow-md shadow-primary/20 scale-105' 
                        : 'bg-surface-container-high hover:bg-surface-container-high/80 text-on-surface border border-outline-variant/60'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {matchLoading && (
                <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs py-4">
                  <RefreshCw className="animate-spin text-primary" size={14} />
                  <span>Requesting API compatibility metrics...</span>
                </div>
              )}

              {matchResult && (
                <div className="flex flex-col md:flex-row gap-6 p-4 bg-black/40 border border-primary/20 rounded-lg animate-fadeIn">
                  
                  {/* Score circle */}
                  <div className="flex flex-col items-center justify-center bg-surface-container-high/60 border border-primary/20 rounded-xl px-6 py-4 shrink-0">
                    <span className="text-3xl font-extrabold text-primary animate-pulse">{matchResult.score}%</span>
                    <span className="text-[10px] font-label-caps text-on-surface-variant mt-1">Compat score</span>
                  </div>

                  {/* Highlights info */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-xs text-on-surface font-semibold">{matchResult.comment}</p>
                    <ul className="list-disc pl-4 text-xs text-on-surface-variant space-y-1.5 mt-2">
                      {matchResult.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-[10px] text-primary italic font-semibold">
                      💡 Project cards linked to this skill are glowing green in the catalog below!
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 💻 CTO PERSPECTIVE: The Code Review Simulator */}
          {role === 'CTO' && (
            <div className="glass-card p-6 border border-sky-500/30 rounded-xl mb-8 shadow-lg">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="text-sky-400" size={16} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-sky-400">Interactive IDE Code Review Sandbox</h3>
                </div>
                
                {/* Puzzle Selector */}
                <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:gap-2">
                  <button
                    onClick={() => { setActiveBug('n1_loop'); setSelectedLines([]); setSandboxFeedback(null); }}
                    className={`px-3 py-1.5 text-[10px] font-mono rounded ${activeBug === 'n1_loop' ? 'bg-sky-500 text-black font-bold' : 'bg-surface-container-high text-on-surface-variant'}`}
                  >
                    1. N+1 DB Queries
                  </button>
                  <button
                    onClick={() => { setActiveBug('race_condition'); setSelectedLines([]); setSandboxFeedback(null); }}
                    className={`px-3 py-1.5 text-[10px] font-mono rounded ${activeBug === 'race_condition' ? 'bg-sky-500 text-black font-bold' : 'bg-surface-container-high text-on-surface-variant'}`}
                  >
                    2. Concurrency Race
                  </button>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant mb-4">
                Review the snippet below representing an active backend issue. <strong className="font-bold text-on-surface">Click on the line(s) causing the performance leak or vulnerability</strong>, and submit your review.
              </p>

              {/* Split Pane Sandbox */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Code Window */}
                <div className="bg-black/80 rounded-lg border border-outline-variant overflow-hidden font-mono text-[11px] leading-relaxed shadow-inner">
                  <div className="bg-surface-container-high px-4 py-2 border-b border-outline-variant/40 flex justify-between items-center text-[10px] text-on-surface-variant">
                    <span>{activeBug === 'n1_loop' ? 'properties.service.ts' : 'ledger.service.ts'}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  </div>
                  
                  <div className="p-3 overflow-x-auto flex flex-col">
                    {activeCodeLines.map((line, idx) => {
                      const lineNum = idx + 1;
                      const isSelected = selectedLines.includes(lineNum);
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleLine(lineNum)}
                          className={`flex items-start select-none cursor-pointer py-0.5 px-2 hover:bg-sky-500/10 transition-colors duration-150 ${isSelected ? 'bg-sky-500/20 border-l-2 border-sky-400' : ''}`}
                        >
                          <span className="w-6 text-on-surface-variant/40 text-right pr-2 shrink-0">{lineNum}</span>
                          <span className={`whitespace-pre ${isSelected ? 'text-sky-300 font-semibold' : 'text-on-surface-variant'}`}>{line}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={submitSandboxReview}
                    disabled={selectedLines.length === 0 || sandboxLoading}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider text-xs rounded transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10"
                  >
                    {sandboxLoading ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} />
                        Evaluating Code Review...
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Submit Code Review ({selectedLines.length} selected)
                      </>
                    )}
                  </button>

                  {sandboxFeedback && (
                    <div className={`p-4 rounded-lg border animate-fadeIn flex flex-col gap-2 ${
                      sandboxFeedback.success 
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' 
                        : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                    }`}>
                      <div className="flex items-start gap-2.5">
                        {sandboxFeedback.success 
                          ? <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                          : <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-400" />}
                        <p className="text-xs leading-relaxed font-semibold">{sandboxFeedback.message}</p>
                      </div>

                      {sandboxFeedback.success && sandboxFeedback.diffText && (
                        <div className="mt-3 bg-black/75 border border-emerald-800/40 rounded overflow-hidden">
                          <div className="bg-emerald-950/40 px-3 py-1.5 border-b border-emerald-800/20 font-mono text-[9px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Code size={11} /> Resolution Patch Diff
                          </div>
                          <pre className="p-3 font-mono text-[10px] text-on-surface-variant overflow-x-auto select-text leading-relaxed">
                            {sandboxFeedback.diffText}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ── Standard Skills Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
            {RESUME_DATA.skills.map((category) => (
              <div
                key={category.title}
                className="glass-card p-stack-md border border-outline-variant rounded-xl group transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-stack-sm text-primary">
                  <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                    {category.icon}
                  </span>
                  <h4 className="font-label-caps font-bold text-[12px] uppercase tracking-wider text-on-surface">
                    {category.title}
                  </h4>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="tech-chip px-3 py-1 rounded font-code-md text-xs bg-surface-container-high/60 border border-outline-variant/40 text-on-surface-variant"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
