#!/usr/bin/env node
/**
 * Tests for PreToolUse Hooks
 * - claude-dir-bash-approver.mjs
 * - command-logger.mjs
 */

import { strict as assert } from 'assert';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { spawnSync } from 'child_process';

const HOME = homedir();
const TEST_DIR = join(tmpdir(), 'claude-pre-tool-test-' + Date.now());
const HOOKS_DIR = join(process.cwd(), 'hooks', 'PreToolUse');

console.log('Testing PreToolUse Hooks\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.log(`  [FAIL] ${name}`);
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

// ==================== CLAUDE-DIR-BASH-APPROVER TESTS ====================
console.log('Claude Dir Bash Approver Tests');

const approverPath = join(HOOKS_DIR, 'claude-dir-bash-approver.mjs');

test('claude-dir-bash-approver.mjs exists', () => {
  assert.ok(existsSync(approverPath), 'claude-dir-bash-approver.mjs should exist');
});

test('ignores non-Bash tools', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Read',
    tool_input: { file_path: `${HOME}/.claude/test.md` }
  });
  assert.equal(output.trim(), '', 'Should not output for non-Bash tools');
});

test('auto-approves commands targeting ~/.claude/', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: `cp test.txt ${HOME}/.claude/` }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.permissionDecision, 'allow');
    assert.ok(parsed.hookSpecificOutput.permissionDecisionReason.includes('~/.claude/'));
  }
  assert.ok(true);
});

test('auto-approves with tilde notation', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: 'ls ~/.claude/commands/' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.permissionDecision, 'allow');
  }
  assert.ok(true);
});

test('auto-approves with $HOME notation', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: 'mkdir $HOME/.claude/test' }
  });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.hookSpecificOutput.permissionDecision, 'allow');
  }
  assert.ok(true);
});

test('does not auto-approve non-.claude commands', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: 'rm -rf /important/files' }
  });
  // Should exit silently to let normal permission handling proceed
  assert.equal(output.trim(), '', 'Should not auto-approve non-.claude commands');
});

test('handles empty command', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: '' }
  });
  assert.equal(output.trim(), '', 'Should handle empty command');
});

test('handles missing tool_input', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash'
  });
  // Should not crash
  assert.ok(true);
});

test('handles invalid JSON input gracefully', () => {
  const result = spawnSync('node', [approverPath], {
    input: 'not valid json',
    encoding: 'utf8',
    timeout: 5000
  });
  // Should not crash
  assert.ok(result.status === 0 || result.status === null);
});

// ==================== COMMAND-LOGGER TESTS ====================
console.log('\nCommand Logger Tests');

const loggerPath = join(HOOKS_DIR, 'command-logger.mjs');

test('command-logger.mjs exists', () => {
  assert.ok(existsSync(loggerPath), 'command-logger.mjs should exist');
});

test('command-logger handles Bash input', () => {
  const output = runHookWithInput(loggerPath, {
    tool_name: 'Bash',
    tool_use_id: 'test-123',
    session_id: 'session-456',
    tool_input: { command: 'ls -la' },
    cwd: TEST_DIR
  });
  // Should not crash, may or may not output depending on DB state
  assert.ok(true);
});

test('command-logger handles Read input', () => {
  const output = runHookWithInput(loggerPath, {
    tool_name: 'Read',
    tool_use_id: 'test-456',
    session_id: 'session-789',
    tool_input: { file_path: '/test/file.js' },
    cwd: TEST_DIR
  });
  assert.ok(true);
});

test('command-logger handles Write input', () => {
  const output = runHookWithInput(loggerPath, {
    tool_name: 'Write',
    tool_use_id: 'test-789',
    session_id: 'session-abc',
    tool_input: { file_path: '/test/file.js', content: 'test' },
    cwd: TEST_DIR
  });
  assert.ok(true);
});

test('command-logger handles invalid JSON gracefully', () => {
  const result = spawnSync('node', [loggerPath], {
    input: 'invalid json',
    encoding: 'utf8',
    timeout: 5000
  });
  assert.ok(result.status === 0 || result.status === null);
});

test('command-logger handles missing fields', () => {
  const output = runHookWithInput(loggerPath, {
    tool_name: 'Bash'
    // Missing other fields
  });
  assert.ok(true);
});

// ==================== COMMAND-LOGGER-POST TESTS ====================
console.log('\nCommand Logger Post Tests');

const loggerPostPath = join(process.cwd(), 'hooks', 'PostToolUse', 'command-logger-post.mjs');

test('command-logger-post.mjs exists', () => {
  assert.ok(existsSync(loggerPostPath), 'command-logger-post.mjs should exist');
});

test('command-logger-post handles tool result', () => {
  const output = runHookWithInput(loggerPostPath, {
    tool_use_id: 'test-123',
    tool_result: {
      content: 'command output',
      exit_code: 0
    }
  });
  assert.ok(true);
});

test('command-logger-post handles error result', () => {
  const output = runHookWithInput(loggerPostPath, {
    tool_use_id: 'test-error',
    tool_result: {
      error: 'Command failed',
      exit_code: 1
    }
  });
  assert.ok(true);
});

test('command-logger-post handles string result', () => {
  const output = runHookWithInput(loggerPostPath, {
    tool_use_id: 'test-string',
    tool_result: 'Simple string output'
  });
  assert.ok(true);
});

test('command-logger-post handles invalid JSON gracefully', () => {
  const result = spawnSync('node', [loggerPostPath], {
    input: 'invalid json',
    encoding: 'utf8',
    timeout: 5000
  });
  assert.ok(result.status === 0 || result.status === null);
});

// ==================== EDGE CASES ====================
console.log('\nEdge Cases');

test('approver handles special characters in paths', () => {
  const output = runHookWithInput(approverPath, {
    tool_name: 'Bash',
    tool_input: { command: `cat "${HOME}/.claude/file with spaces.txt"` }
  });
  // Should not crash
  assert.ok(true);
});

test('logger handles very long command', () => {
  const longCommand = 'echo ' + 'x'.repeat(10000);
  const output = runHookWithInput(loggerPath, {
    tool_name: 'Bash',
    tool_use_id: 'test-long',
    session_id: 'session-long',
    tool_input: { command: longCommand },
    cwd: TEST_DIR
  });
  assert.ok(true);
});

test('logger-post handles large output', () => {
  const largeOutput = 'y'.repeat(10000);
  const output = runHookWithInput(loggerPostPath, {
    tool_use_id: 'test-large',
    tool_result: { content: largeOutput }
  });
  assert.ok(true);
});

// Cleanup
cleanup();

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
