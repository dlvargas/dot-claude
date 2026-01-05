#!/usr/bin/env node
/**
 * Tests for git-verifier.mjs
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-git-test-' + Date.now());

console.log('🧪 Testing git-verifier.mjs\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup: Create a test git repo
mkdirSync(TEST_DIR, { recursive: true });
process.chdir(TEST_DIR);

try {
  execSync('git init', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git config user.name "Test User"', { cwd: TEST_DIR, stdio: 'pipe' });
  writeFileSync(join(TEST_DIR, 'README.md'), '# Test');
  execSync('git add .', { cwd: TEST_DIR, stdio: 'pipe' });
  execSync('git commit -m "Initial commit"', { cwd: TEST_DIR, stdio: 'pipe' });
} catch (e) {
  console.error('Failed to set up git repo:', e.message);
  process.exit(1);
}

// Dynamic import
const { GitVerifier } = await import('../scripts/git-verifier.mjs');

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

// Tests
console.log('\n📁 Repository Detection Tests');

test('Detects valid git repository', () => {
  const verifier = new GitVerifier(TEST_DIR);
  assert.equal(verifier.isRepo, true);
});

test('Detects non-git directory', () => {
  const nonGitDir = join(tmpdir(), 'non-git-' + Date.now());
  mkdirSync(nonGitDir, { recursive: true });
  const verifier = new GitVerifier(nonGitDir);
  assert.equal(verifier.isRepo, false);
  rmSync(nonGitDir, { recursive: true });
});

console.log('\n🌿 Branch Tests');

test('Gets current branch name', () => {
  const verifier = new GitVerifier(TEST_DIR);
  const branch = verifier.getCurrentBranch();
  // Could be 'main', 'master', or other default
  assert.ok(branch, 'Should return branch name');
});

test('Blocked branches identified', () => {
  const verifier = new GitVerifier(TEST_DIR);
  const result = verifier.isBranchAllowed();
  // Default branch (main/master) should be blocked
  assert.equal(result.allowed, false);
  assert.ok(result.reason.includes('not allowed'), 'Should explain why blocked');
});

test('Feature branch would be allowed', () => {
  const verifier = new GitVerifier(TEST_DIR);
  // Create and switch to feature branch
  try {
    execSync('git checkout -b feature/test-branch', { cwd: TEST_DIR, stdio: 'pipe' });
    const result = verifier.isBranchAllowed();
    assert.equal(result.allowed, true);
    // Switch back
    execSync('git checkout -', { cwd: TEST_DIR, stdio: 'pipe' });
    execSync('git branch -D feature/test-branch', { cwd: TEST_DIR, stdio: 'pipe' });
  } catch {
    // Cleanup if test fails
    try { execSync('git checkout -', { cwd: TEST_DIR, stdio: 'pipe' }); } catch {}
    throw new Error('Feature branch test failed');
  }
});

console.log('\n📝 Changes Detection Tests');

test('Detects uncommitted changes', () => {
  const verifier = new GitVerifier(TEST_DIR);

  // Initially clean (may be empty string or false)
  const initialStatus = verifier.hasUncommittedChanges();
  assert.ok(initialStatus === false || initialStatus === '' || !initialStatus, 'Initially clean');

  // Make changes
  writeFileSync(join(TEST_DIR, 'new-file.txt'), 'test');
  const dirtyStatus = verifier.hasUncommittedChanges();
  assert.ok(dirtyStatus === true || (dirtyStatus && dirtyStatus.length > 0), 'Has uncommitted changes');

  // Cleanup
  rmSync(join(TEST_DIR, 'new-file.txt'));
});

console.log('\n✅ Verification Tests');

test('Full verification passes on clean repo', () => {
  const verifier = new GitVerifier(TEST_DIR);
  const result = verifier.verify({});

  assert.equal(result.isRepo, true);
  assert.ok(result.checks.branch, 'Has branch check');
});

test('Verification fails when clean tree required but dirty', () => {
  const verifier = new GitVerifier(TEST_DIR);

  // Make repo dirty
  writeFileSync(join(TEST_DIR, 'dirty.txt'), 'dirty');

  const result = verifier.verify({ requireCleanTree: true });

  assert.equal(result.passed, false);
  assert.ok(result.errors.length > 0, 'Has errors');

  // Cleanup
  rmSync(join(TEST_DIR, 'dirty.txt'));
});

console.log('\n📊 Status Tests');

test('Returns comprehensive status', () => {
  const verifier = new GitVerifier(TEST_DIR);
  const status = verifier.getStatus();

  assert.equal(status.isRepo, true);
  assert.ok(status.branch, 'Has branch');
  assert.ok(status.lastCommit, 'Has last commit');
  // hasChanges can be boolean, string, or falsy
  assert.ok('hasChanges' in status, 'Has changes field');
});

console.log('\n💾 Session Commit Tests');

test('Session commit with no changes returns noChanges', () => {
  const verifier = new GitVerifier(TEST_DIR);
  const result = verifier.createSessionCommit();

  assert.equal(result.noChanges, true);
});

test('Session commit creates commit when changes exist', () => {
  const verifier = new GitVerifier(TEST_DIR);

  // Make changes
  writeFileSync(join(TEST_DIR, 'session-file.txt'), 'session test');

  const result = verifier.createSessionCommit('Test session commit');

  assert.equal(result.success, true);
  assert.ok(result.hash, 'Has commit hash');
});

// Cleanup
console.log('\n🧹 Cleanup');
process.chdir('/');
try {
  rmSync(TEST_DIR, { recursive: true });
  console.log('  Cleaned up test directory');
} catch (e) {
  console.log('  Warning: Could not clean up test directory');
}

// Summary
console.log('\n' + '═'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
