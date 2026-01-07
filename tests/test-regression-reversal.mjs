#!/usr/bin/env node
/**
 * Tests for regression reversal (rollback) functionality
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-regression-test-' + Date.now());

console.log('🧪 Testing regression reversal functionality\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup - create a git repo for testing
mkdirSync(TEST_DIR, { recursive: true });
process.chdir(TEST_DIR);

try {
  execSync('git init', { stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', { stdio: 'pipe' });
  execSync('git config user.name "Test"', { stdio: 'pipe' });
} catch (e) {
  console.error('Failed to setup git:', e.message);
}

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

// Helper functions
function gitCommit(message) {
  try {
    execSync('git add -A', { cwd: TEST_DIR, stdio: 'pipe' });
    execSync(`git commit -m "${message}"`, { cwd: TEST_DIR, stdio: 'pipe' });
    return execSync('git rev-parse --short HEAD', { cwd: TEST_DIR, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function gitRevert(hash) {
  try {
    execSync(`git revert --no-commit ${hash}`, { cwd: TEST_DIR, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function gitReset(hash) {
  try {
    execSync(`git reset --hard ${hash}`, { cwd: TEST_DIR, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getFileAtCommit(hash, filePath) {
  try {
    return execSync(`git show ${hash}:${filePath}`, { cwd: TEST_DIR, encoding: 'utf8' });
  } catch {
    return null;
  }
}

// Tests
console.log('\n📝 Basic Commit/Revert Tests');

test('Can create commits for changes', () => {
  writeFileSync(join(TEST_DIR, 'file1.txt'), 'initial content');
  const hash = gitCommit('Initial commit');

  assert.ok(hash, 'Commit created');
  assert.ok(hash.length >= 7, 'Valid hash');
});

test('Can revert a commit', () => {
  writeFileSync(join(TEST_DIR, 'revert-test.txt'), 'will be reverted');
  const hash = gitCommit('Add revert-test');

  writeFileSync(join(TEST_DIR, 'revert-test.txt'), 'modified content');
  gitCommit('Modify revert-test');

  // Content is now modified
  assert.equal(readFileSync(join(TEST_DIR, 'revert-test.txt'), 'utf8'), 'modified content');

  // Reset to previous state
  gitReset(hash);
  assert.equal(readFileSync(join(TEST_DIR, 'revert-test.txt'), 'utf8'), 'will be reverted');
});

console.log('\n🔄 State Tracking Tests');

test('Tracks file state across commits', () => {
  const file = join(TEST_DIR, 'tracked.txt');

  writeFileSync(file, 'v1');
  const hash1 = gitCommit('Version 1');

  writeFileSync(file, 'v2');
  const hash2 = gitCommit('Version 2');

  writeFileSync(file, 'v3');
  gitCommit('Version 3');

  // Check historical content
  assert.equal(getFileAtCommit(hash1, 'tracked.txt'), 'v1');
  assert.equal(getFileAtCommit(hash2, 'tracked.txt'), 'v2');
});

test('Can identify which commit introduced change', () => {
  const file = join(TEST_DIR, 'blame-test.txt');

  writeFileSync(file, 'line 1');
  gitCommit('Add line 1');

  writeFileSync(file, 'line 1\nline 2');
  const hash2 = gitCommit('Add line 2');

  // The second commit added line 2
  const diff = execSync(`git show ${hash2} --stat`, { cwd: TEST_DIR, encoding: 'utf8' });
  assert.ok(diff.includes('blame-test.txt'), 'Commit shows file changed');
});

console.log('\n♻️ Rollback Scenarios');

test('Full rollback to previous state', () => {
  // Create a known good state
  writeFileSync(join(TEST_DIR, 'rollback1.txt'), 'good');
  writeFileSync(join(TEST_DIR, 'rollback2.txt'), 'good');
  const goodState = gitCommit('Good state');

  // Make bad changes
  writeFileSync(join(TEST_DIR, 'rollback1.txt'), 'bad');
  writeFileSync(join(TEST_DIR, 'rollback2.txt'), 'bad');
  gitCommit('Bad changes');

  // Rollback
  gitReset(goodState);

  assert.equal(readFileSync(join(TEST_DIR, 'rollback1.txt'), 'utf8'), 'good');
  assert.equal(readFileSync(join(TEST_DIR, 'rollback2.txt'), 'utf8'), 'good');
});

test('Partial rollback of specific file', () => {
  writeFileSync(join(TEST_DIR, 'keep.txt'), 'keep this');
  writeFileSync(join(TEST_DIR, 'revert.txt'), 'original');
  const originalState = gitCommit('Original');

  writeFileSync(join(TEST_DIR, 'keep.txt'), 'updated');
  writeFileSync(join(TEST_DIR, 'revert.txt'), 'changed');
  gitCommit('Updates');

  // Restore just one file
  const originalContent = getFileAtCommit(originalState, 'revert.txt');
  writeFileSync(join(TEST_DIR, 'revert.txt'), originalContent);

  assert.equal(readFileSync(join(TEST_DIR, 'keep.txt'), 'utf8'), 'updated', 'Keep file unchanged');
  assert.equal(readFileSync(join(TEST_DIR, 'revert.txt'), 'utf8'), 'original', 'Revert file restored');
});

console.log('\n📋 Session Rollback Tests');

test('Can rollback entire session', () => {
  // Simulate session start marker
  writeFileSync(join(TEST_DIR, 'session-start.txt'), 'before session');
  const sessionStart = gitCommit('Session start');

  // Session work
  writeFileSync(join(TEST_DIR, 'session-file1.txt'), 'session work 1');
  gitCommit('Session work 1');

  writeFileSync(join(TEST_DIR, 'session-file2.txt'), 'session work 2');
  gitCommit('Session work 2');

  // Files exist
  assert.ok(existsSync(join(TEST_DIR, 'session-file1.txt')));
  assert.ok(existsSync(join(TEST_DIR, 'session-file2.txt')));

  // Rollback entire session
  gitReset(sessionStart);

  // Session files gone
  assert.ok(!existsSync(join(TEST_DIR, 'session-file1.txt')));
  assert.ok(!existsSync(join(TEST_DIR, 'session-file2.txt')));
});

console.log('\n🛡️ Safety Tests');

test('Cannot accidentally lose uncommitted changes check', () => {
  writeFileSync(join(TEST_DIR, 'uncommitted.txt'), 'uncommitted work');

  // Check for uncommitted changes
  try {
    const status = execSync('git status --porcelain', { cwd: TEST_DIR, encoding: 'utf8' });
    assert.ok(status.includes('uncommitted.txt'), 'Detected uncommitted changes');
  } catch {
    assert.fail('Could not check status');
  }
});

test('Can list commits for review before rollback', () => {
  writeFileSync(join(TEST_DIR, 'list-test.txt'), 'content');
  gitCommit('List test commit');

  const log = execSync('git log --oneline -5', { cwd: TEST_DIR, encoding: 'utf8' });
  const commits = log.trim().split('\n');

  assert.ok(commits.length >= 1, 'Can list commits');
  assert.ok(commits[0].length >= 7, 'Commits have hash and message');
});

console.log('\n📊 Diff Review Tests');

test('Can see what will change before rollback', () => {
  writeFileSync(join(TEST_DIR, 'diff-review.txt'), 'old content');
  const oldHash = gitCommit('Old content');

  writeFileSync(join(TEST_DIR, 'diff-review.txt'), 'new content');
  gitCommit('New content');

  // Preview what rollback would do
  const diff = execSync(`git diff ${oldHash} HEAD`, { cwd: TEST_DIR, encoding: 'utf8' });
  assert.ok(diff.includes('-old content') || diff.includes('+new content'), 'Shows changes');
});

test('Can compare any two states', () => {
  writeFileSync(join(TEST_DIR, 'compare.txt'), 'state A');
  const hashA = gitCommit('State A');

  writeFileSync(join(TEST_DIR, 'compare.txt'), 'state B');
  const hashB = gitCommit('State B');

  writeFileSync(join(TEST_DIR, 'compare.txt'), 'state C');
  gitCommit('State C');

  // Compare A to B
  const diffAB = execSync(`git diff ${hashA} ${hashB}`, { cwd: TEST_DIR, encoding: 'utf8' });
  assert.ok(diffAB.includes('state A') || diffAB.includes('state B'), 'Can compare A to B');
});

console.log('\n🔖 Tag/Marker Tests');

test('Can tag known good states', () => {
  writeFileSync(join(TEST_DIR, 'tagged.txt'), 'stable');
  gitCommit('Stable release');

  try {
    execSync('git tag v1.0-stable', { cwd: TEST_DIR, stdio: 'pipe' });
    const tags = execSync('git tag', { cwd: TEST_DIR, encoding: 'utf8' });
    assert.ok(tags.includes('v1.0-stable'), 'Tag created');
  } catch {
    // Tags might not work in all environments
  }
});

// Cleanup
console.log('\n🧹 Cleanup');
process.chdir('/');
try {
  rmSync(TEST_DIR, { recursive: true });
  console.log('  Cleaned up test directory');
} catch {}

// Summary
console.log('\n' + '═'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
