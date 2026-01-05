#!/usr/bin/env node
/**
 * PostToolUse hook that detects when tests might be needed
 *
 * Triggers when source files are modified that have corresponding test files,
 * or suggests test creation for new files.
 */

import { readFileSync, existsSync } from 'fs';
import { extname, basename, dirname, join } from 'path';

const TEST_PATTERNS = {
  // JavaScript/TypeScript test patterns
  '.js': ['*.test.js', '*.spec.js', '__tests__/*.js'],
  '.jsx': ['*.test.jsx', '*.spec.jsx', '__tests__/*.jsx'],
  '.ts': ['*.test.ts', '*.spec.ts', '__tests__/*.ts'],
  '.tsx': ['*.test.tsx', '*.spec.tsx', '__tests__/*.tsx'],
  '.mjs': ['*.test.mjs', '*.spec.mjs'],

  // Python
  '.py': ['test_*.py', '*_test.py', 'tests/test_*.py'],

  // Go
  '.go': ['*_test.go'],

  // Rust
  '.rs': ['tests/*.rs'], // Plus inline #[test] modules
};

const TEST_COMMANDS = {
  '.js': 'npm test',
  '.jsx': 'npm test',
  '.ts': 'npm test',
  '.tsx': 'npm test',
  '.mjs': 'npm test',
  '.py': 'pytest',
  '.go': 'go test ./...',
  '.rs': 'cargo test',
};

function findTestFile(filePath, ext) {
  const dir = dirname(filePath);
  const base = basename(filePath, ext);

  const testLocations = [
    join(dir, `${base}.test${ext}`),
    join(dir, `${base}.spec${ext}`),
    join(dir, '__tests__', `${base}${ext}`),
    join(dir, '__tests__', `${base}.test${ext}`),
    join(dir, 'tests', `test_${base}${ext}`),
    join(dir, `test_${base}${ext}`),
    join(dir, `${base}_test${ext}`),
  ];

  for (const testPath of testLocations) {
    if (existsSync(testPath)) {
      return testPath;
    }
  }
  return null;
}

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf-8'));

  // Only process Write and Edit tools
  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
    process.exit(0);
  }

  const filePath = input.tool_input?.file_path || input.tool_input?.filePath;
  if (!filePath) {
    process.exit(0);
  }

  // Skip if this IS a test file
  const fileName = basename(filePath);
  if (fileName.includes('.test.') || fileName.includes('.spec.') ||
      fileName.startsWith('test_') || fileName.endsWith('_test.')) {
    process.exit(0);
  }

  const ext = extname(filePath).toLowerCase();
  if (!TEST_PATTERNS[ext]) {
    process.exit(0);
  }

  const existingTest = findTestFile(filePath, ext);
  const testCmd = TEST_COMMANDS[ext];

  const output = {
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      testReminder: {
        sourceFile: filePath,
        hasTests: !!existingTest,
        testFile: existingTest,
        runCommand: testCmd,
        message: existingTest
          ? `Tests exist at ${basename(existingTest)} - consider running: ${testCmd}`
          : `No tests found for ${basename(filePath)} - consider creating tests`
      }
    }
  };

  console.log(JSON.stringify(output));
} catch {
  // Silent failure
}
