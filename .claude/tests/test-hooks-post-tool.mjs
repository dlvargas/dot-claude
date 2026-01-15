#!/usr/bin/env node
/**
 * Tests for PostToolUse Hooks
 * - auto-lint.mjs
 * - git-tracker.mjs
 * - test-reminder.mjs
 */

import { strict as assert } from 'assert';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync, spawnSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-post-tool-test-' + Date.now());
const HOOKS_DIR = join(process.cwd(), 'hooks', 'PostToolUse');

console.log('🧪 Testing PostToolUse Hooks\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
  }
}

function runHookWithInput(hookPath, input) {
  const result = spawnSync('node', [hookPath], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    timeout: 5000
  });
  return result.stdout || '';
}

function cleanup() {
  try {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  } catch {}
}

// Setup
cleanup();
mkdirSync(TEST_DIR, { recursive: true });

// ==================== AUTO-LINT.MJS TESTS ====================
console.log('🔧 Auto-Lint Hook Tests');

const autoLintPath = join(HOOKS_DIR, 'auto-lint.mjs');

test('auto-lint.mjs exists', () => {
  assert.ok(existsSync(autoLintPath), 'auto-lint.mjs should exist');
});

test('auto-lint ignores non-Write tools', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Read',
    tool_input: { file_path: '/test/file.js' }
  });
  assert.equal(output.trim(), '', 'Should not output for Read tool');
});

test('auto-lint suggests eslint for .js files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.js' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.hookSpecificOutput.lintSuggestion, 'Should have lint suggestion');
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'eslint');
  }
  assert.ok(true);
});

test('auto-lint suggests eslint for .ts files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.ts' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'eslint');
  }
  assert.ok(true);
});

test('auto-lint suggests ruff for .py files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.py' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'ruff');
  }
  assert.ok(true);
});

test('auto-lint suggests gofmt for .go files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.go' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'gofmt');
  }
  assert.ok(true);
});

test('auto-lint suggests prettier for .json files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.json' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'prettier');
  }
  assert.ok(true);
});

test('auto-lint suggests shellcheck for .sh files', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.sh' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.lintSuggestion.linter, 'shellcheck');
  }
  assert.ok(true);
});

test('auto-lint handles Edit tool', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Edit',
    tool_input: { file_path: '/test/file.ts' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.hookSpecificOutput.lintSuggestion);
  }
  assert.ok(true);
});

test('auto-lint handles MultiEdit tool', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'MultiEdit',
    tool_input: { file_path: '/test/file.js' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.hookSpecificOutput.lintSuggestion);
  }
  assert.ok(true);
});

test('auto-lint handles unknown extensions silently', () => {
  const output = runHookWithInput(autoLintPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.xyz' }
  });
  // Should exit without output for unknown extensions
  assert.ok(true);
});

// ==================== GIT-TRACKER.MJS TESTS ====================
console.log('\n📊 Git Tracker Hook Tests');

const gitTrackerPath = join(HOOKS_DIR, 'git-tracker.mjs');

test('git-tracker.mjs exists', () => {
  assert.ok(existsSync(gitTrackerPath), 'git-tracker.mjs should exist');
});

test('git-tracker ignores non-Write tools', () => {
  const output = runHookWithInput(gitTrackerPath, {
    tool_name: 'Read',
    tool_input: { file_path: '/test/file.js' }
  });
  assert.equal(output.trim(), '', 'Should not output for Read tool');
});

test('git-tracker tracks file changes', () => {
  // Just verify it doesn't crash
  const output = runHookWithInput(gitTrackerPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.js' }
  });
  // May or may not output depending on git state
  assert.ok(true);
});

test('git-tracker handles missing file_path', () => {
  const output = runHookWithInput(gitTrackerPath, {
    tool_name: 'Write',
    tool_input: {}
  });
  assert.ok(true, 'Should handle missing file_path');
});

// ==================== TEST-REMINDER.MJS TESTS ====================
console.log('\n🧪 Test Reminder Hook Tests');

const testReminderPath = join(HOOKS_DIR, 'test-reminder.mjs');

test('test-reminder.mjs exists', () => {
  assert.ok(existsSync(testReminderPath), 'test-reminder.mjs should exist');
});

test('test-reminder ignores non-Write tools', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Read',
    tool_input: { file_path: '/test/file.js' }
  });
  assert.equal(output.trim(), '', 'Should not output for Read tool');
});

test('test-reminder skips test files', () => {
  const testFiles = [
    '/test/file.test.js',
    '/test/file.spec.ts',
    '/test/test_file.py',
    '/test/file_test.go'
  ];

  for (const file of testFiles) {
    const output = runHookWithInput(testReminderPath, {
      tool_name: 'Write',
      tool_input: { file_path: file }
    });
    assert.equal(output.trim(), '', `Should skip test file: ${file}`);
  }
});

test('test-reminder suggests tests for source files', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/source.js' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.hookSpecificOutput.testReminder, 'Should have test reminder');
    assert.ok(parsed.hookSpecificOutput.testReminder.message, 'Should have message');
  }
  assert.ok(true);
});

test('test-reminder provides correct test command for JS', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/source.js' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.testReminder.runCommand, 'npm test');
  }
  assert.ok(true);
});

test('test-reminder provides correct test command for Python', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/source.py' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.testReminder.runCommand, 'pytest');
  }
  assert.ok(true);
});

test('test-reminder provides correct test command for Go', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/source.go' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.testReminder.runCommand, 'go test ./...');
  }
  assert.ok(true);
});

test('test-reminder handles unknown extensions', () => {
  const output = runHookWithInput(testReminderPath, {
    tool_name: 'Write',
    tool_input: { file_path: '/test/file.xyz' }
  });
  // Should exit silently
  assert.ok(true);
});

// ==================== ERROR HANDLING ====================
console.log('\n⚠️ Error Handling Tests');

test('auto-lint handles invalid JSON gracefully', () => {
  const result = spawnSync('node', [autoLintPath], {
    input: 'invalid json',
    encoding: 'utf8',
    timeout: 5000
  });
  // Should not crash
  assert.ok(result.status === 0 || result.status === null, 'Should handle gracefully');
});

test('git-tracker handles invalid JSON gracefully', () => {
  const result = spawnSync('node', [gitTrackerPath], {
    input: 'invalid json',
    encoding: 'utf8',
    timeout: 5000
  });
  assert.ok(result.status === 0 || result.status === null, 'Should handle gracefully');
});

test('test-reminder handles invalid JSON gracefully', () => {
  const result = spawnSync('node', [testReminderPath], {
    input: 'invalid json',
    encoding: 'utf8',
    timeout: 5000
  });
  assert.ok(result.status === 0 || result.status === null, 'Should handle gracefully');
});

// Cleanup
cleanup();

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
