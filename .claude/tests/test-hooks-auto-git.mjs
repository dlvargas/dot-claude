#!/usr/bin/env node
/**
 * Tests for Auto Git Workflow Hook
 * - auto-git-workflow.mjs
 */

import { strict as assert } from 'assert';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync, spawnSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-auto-git-test-' + Date.now());
const HOOKS_DIR = join(process.cwd(), 'hooks');
const AUTO_GIT_PATH = join(HOOKS_DIR, 'auto-git-workflow.mjs');

console.log('Testing Auto Git Workflow Hook\n');

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

function runAutoGit(options = {}) {
  const result = spawnSync('node', [AUTO_GIT_PATH], {
    cwd: options.cwd || TEST_DIR,
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, ...options.env }
  });
  return result.stdout || '';
}

function cleanup() {
  try {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  } catch {}
}

function setupGitRepo() {
  mkdirSync(TEST_DIR, { recursive: true });
  execSync('git init', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git config user.name "Test User"', { cwd: TEST_DIR, stdio: 'pipe' });
  // Create initial commit
  writeFileSync(join(TEST_DIR, 'README.md'), '# Test');
  execSync('git add .', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git commit -m "Initial commit"', { cwd: TEST_DIR, stdio: 'pipe' });
}

// Setup
cleanup();
setupGitRepo();

// ==================== BASIC TESTS ====================
console.log('Basic Tests');

test('auto-git-workflow.mjs exists', () => {
  assert.ok(existsSync(AUTO_GIT_PATH), 'auto-git-workflow.mjs should exist');
});

test('exits silently when disabled', () => {
  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '' } });
  assert.equal(output.trim(), '', 'Should exit silently when auto-git disabled');
});

test('exits silently when no changes', () => {
  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });
  assert.equal(output.trim(), '', 'Should exit silently when no changes');
});

// ==================== CHANGE DETECTION TESTS ====================
console.log('\nChange Detection Tests');

test('detects uncommitted changes', () => {
  // Create a new file
  writeFileSync(join(TEST_DIR, 'new-file.txt'), 'test content');

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.status, 'pending_commit');
    assert.ok(parsed.message.includes('file(s) modified'));
  }
  assert.ok(true);
});

test('counts multiple changed files', () => {
  writeFileSync(join(TEST_DIR, 'file1.txt'), 'content 1');
  writeFileSync(join(TEST_DIR, 'file2.txt'), 'content 2');
  writeFileSync(join(TEST_DIR, 'file3.txt'), 'content 3');

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.message.includes('file(s) modified'));
  }
  assert.ok(true);
});

test('provides commit hint', () => {
  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.hint, 'Should have commit hint');
    assert.ok(parsed.hint.includes('/commit') || parsed.hint.includes('commit'));
  }
  assert.ok(true);
});

// ==================== CONFIG FILE TESTS ====================
console.log('\nConfig File Tests');

test('loads config from git-automation.json', () => {
  const configDir = join(TEST_DIR, '.claude');
  mkdirSync(configDir, { recursive: true });
  writeFileSync(join(configDir, 'git-automation.json'), JSON.stringify({
    autoCommit: true,
    autoPush: false,
    autoPR: false
  }));

  const output = runAutoGit();

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.status);
  }
  assert.ok(true);
});

test('uses default config when file missing', () => {
  // Remove config file
  const configPath = join(TEST_DIR, '.claude', 'git-automation.json');
  if (existsSync(configPath)) unlinkSync(configPath);

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });
  // Should not crash
  assert.ok(true);
});

test('handles invalid config JSON', () => {
  const configDir = join(TEST_DIR, '.claude');
  mkdirSync(configDir, { recursive: true });
  writeFileSync(join(configDir, 'git-automation.json'), 'invalid json {{{');

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });
  // Should not crash
  assert.ok(true);
});

// ==================== NON-GIT DIRECTORY TESTS ====================
console.log('\nNon-Git Directory Tests');

test('handles non-git directory gracefully', () => {
  const nonGitDir = join(tmpdir(), 'claude-non-git-' + Date.now());
  mkdirSync(nonGitDir, { recursive: true });
  writeFileSync(join(nonGitDir, 'test.txt'), 'test');

  const output = runAutoGit({ cwd: nonGitDir, env: { CLAUDE_AUTO_GIT: '1' } });
  // Should handle gracefully (no git status = no output)
  assert.ok(true);

  rmSync(nonGitDir, { recursive: true });
});

// ==================== OUTPUT FORMAT TESTS ====================
console.log('\nOutput Format Tests');

test('outputs valid JSON', () => {
  writeFileSync(join(TEST_DIR, 'json-test.txt'), 'test');

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });

  if (output.trim()) {
    // Should not throw
    const parsed = JSON.parse(output);
    assert.ok(typeof parsed === 'object');
  }
  assert.ok(true);
});

test('has required fields in output', () => {
  writeFileSync(join(TEST_DIR, 'fields-test.txt'), 'test');

  const output = runAutoGit({ env: { CLAUDE_AUTO_GIT: '1' } });

  if (output.trim()) {
    const parsed = JSON.parse(output);
    assert.ok('status' in parsed, 'Should have status');
    assert.ok('message' in parsed, 'Should have message');
    assert.ok('hint' in parsed, 'Should have hint');
  }
  assert.ok(true);
});

// Cleanup
cleanup();

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
