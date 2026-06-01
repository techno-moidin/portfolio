# Senior Developer’s JavaScript/TypeScript Coding Interview Prep

It is incredibly common for Senior Engineers to fail early screening rounds on basic algorithm puzzles (like Palindromes, Fibonacci, or Primes). In your day-to-day work, you are scaling database migrations, microservices, and Stripe integrations—not writing mathematical sequence generators.

This guide is your **short-term cheat sheet** to quickly rebuild baseline coding muscle memory. Instead of memorizing hundreds of lines of code, focus on the **4 core patterns** below, which solve 95% of basic screening questions.

---

## 1. The 4 Core Coding Patterns

### Pattern A: The Two-Pointer Pattern (For Strings & Arrays)
*   **The Concept:** Start one pointer at the beginning (`left = 0`) and one at the end (`right = length - 1`). Move them toward the middle.
*   **Best Used For:** Palindromes, reversing arrays, finding pairs.

### Pattern B: The Frequency Counter (Hash Map / Object)
*   **The Concept:** Loop through an array or string once and count how many times each character or number appears using a simple key-value object (`{ a: 2, b: 1 }`).
*   **Best Used For:** Anagrams, duplicates, finding the most frequent item, "Two Sum".

### Pattern C: The Slithering Window / Iteration
*   **The Concept:** Maintain a rolling state as you loop through an array (e.g., keeping track of the previous two numbers to generate the next one).
*   **Best Used For:** Fibonacci, sum ranges.

### Pattern D: Basic Math Helpers
*   **The Concept:** Understanding modulo `%` (remainder of division) and square root limits.
*   **Best Used For:** Prime numbers, checking evens/odds.

---

## 2. Basic Level Screeners (The "Filter" Questions)
These are standard entry-level questions designed to filter out non-coders. They are easy to write if you remember the basic tricks.

### 1. FizzBuzz (The Classic)
*   *Question:* Print numbers from 1 to N. But for multiples of 3, print `"Fizz"`; for multiples of 5, print `"Buzz"`; and for multiples of both, print `"FizzBuzz"`.
*   *Memory Hook:* "Check the combined condition `i % 15 === 0` first!"

```javascript
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) { // Or: i % 15 === 0
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}
```

---

### 2. Reverse a String (Without Array Methods)
*   *Question:* Reverse a string without using `.split().reverse().join()`.
*   *Memory Hook:* "Loop backward from `length - 1` and accumulate letters in a new string."

```javascript
function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
```

---

### 3. Max Character (Frequency Counter Pattern)
*   *Question:* Given a string, return the character that is most commonly used in the string.
*   *Memory Hook:* "Build a char map, then loop through the map to find the highest count."

```javascript
function maxChar(str) {
  const charMap = {};
  let maxCount = 0;
  let maxCharacter = "";

  // 1. Build map
  for (const char of str) {
    charMap[char] = (charMap[char] || 0) + 1;
  }

  // 2. Find max key
  for (const char in charMap) {
    if (charMap[char] > maxCount) {
      maxCount = charMap[char];
      maxCharacter = char;
    }
  }

  return maxCharacter;
}
```

---

### 4. Remove Duplicates from an Array
*   *Question:* Given an array of values, return a new array with all duplicates removed.
*   *Memory Hook:* "Use `new Set(arr)` to instantly filter out duplicates, and array spread to return it."

```javascript
function removeDuplicates(arr) {
  // Sets in JavaScript natively store only unique values!
  return [...new Set(arr)];
}
```

---

### 5. Factorial (Recursion vs. Iteration)
*   *Question:* Calculate the factorial of a number `n` (e.g., `5! = 5 * 4 * 3 * 2 * 1 = 120`).
*   *Memory Hook:* "Recursive base case is `n <= 1` return 1."

```javascript
// Iterative Approach (Fast, O(1) memory)
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Recursive Approach (Elegant, O(N) call stack memory)
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}
```

---

### 6. Title Case a Sentence
*   *Question:* Capitalize the first letter of each word in a string (e.g., `"web developer dubai"` ➔ `"Web Developer Dubai"`).
*   *Memory Hook:* "Split the string by spaces, capitalize index 0 of each word, slice the rest, and join."

```javascript
function titleCase(str) {
  const words = str.split(' ');
  const capitalizedWords = words.map(word => {
    if (!word) return "";
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(' ');
}
```

---

## 3. Mid-Level & Screeners (The "Core" Puzzles)
These are slightly more complex than basic loops and test your understanding of data structures.

### 1. Palindrome Checker (Two-Pointer Pattern)
*   *Memory Hook:* "Compare first and last characters, then move inward."

```typescript
function isPalindrome(str: string): boolean {
  // Clean string of non-alphanumeric chars & lowercase it
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}
```

---

### 2. Prime Number Checker (Math Pattern)
*   *Memory Hook:* "Eliminate evens, then loop up to the square root of the number."

```typescript
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n === 2) return true; // 2 is the only even prime
  if (n % 2 === 0) return false; // Exclude all other evens
  
  // Only check odd numbers up to the square root of n (highly optimized!)
  const boundary = Math.sqrt(n);
  for (let i = 3; i <= boundary; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
```

---

### 3. Fibonacci Generator (Slithering Window / Iteration)
*   *Memory Hook:* "Start with `[0, 1]` and add the last two numbers to get the next one."

```typescript
function fibonacci(n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  let prev2 = 0; // f(0)
  let prev1 = 1; // f(1)
  let current = 1;
  
  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return current;
}
```

---

### 4. Valid Anagram (Frequency Counter Pattern)
*   *Memory Hook:* "Count letters in string A, subtract them in string B."

```typescript
function isAnagram(strA: string, strB: string): boolean {
  if (strA.length !== strB.length) return false;
  
  const charCounts: Record<string, number> = {};
  
  // Count characters in the first string
  for (const char of strA) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  // Subtract character counts for the second string
  for (const char of strB) {
    if (!charCounts[char]) {
      return false; // Character missing or used too many times
    }
    charCounts[char]--;
  }
  
  return true;
}
```

---

### 5. Two Sum (Hash Map Pattern)
*   *Memory Hook:* "Keep track of `target - current` in a map as you walk the array."

```typescript
function twoSum(nums: number[], target: number): number[] {
  const seenMap = new Map<number, number>(); // Stores value -> index
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seenMap.has(complement)) {
      return [seenMap.get(complement)!, i];
    }
    
    seenMap.set(nums[i], i);
  }
  
  return [];
}
```

---

### 6. Debounce Function (Senior JavaScript Essential)
*   *Memory Hook:* "Clear the active timeout before starting a new one."

```typescript
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```
