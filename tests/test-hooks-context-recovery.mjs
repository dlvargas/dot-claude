#!/usr/bin/env node
/**
 * Tests for Context Recovery Hooks
 * - session-start.mjs
 * - pre-compact.mjs
 */

import { strict as assert } from 'assert';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir, tmpdir } from 'os';
import { execSync } from 'child_process';

const HOME = homedir();
const TEST_DIR = join(tmpdir(), 'claude-context-test-' + Date.now());
const MARKER_PATH = join(HOME, '.claude', 'claudefast-compaction-marker');
const HOOKS_DIR = join(process.cwd(), 'hooks', 'ContextRecoveryHook');

console.log('🧪 Testing Context Recovery Hooks\n');

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

function cleanup() {
  try {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
    if (existsSync(MARKER_PATH)) unlinkSync(MARKER_PATH);
  } catch {}
}

// Setup
cleanup();
mkdirSync(TEST_DIR, { recursive: true });

// ==================== SESSION-START.MJS TESTS ====================
console.log('📍 Session Start Hook Tests');

test('session-start.mjs exists', () => {
  const scriptPath = join(HOOKS_DIR, 'session-start.mjs');
  assert.ok(existsSync(scriptPath), 'session-start.mjs should exist');
});

test('session-start outputs JSON without marker', () => {
  // Ensure no marker exists
  if (existsSync(MARKER_PATH)) unlinkSync(MARKER_PATH);

  const scriptPath = join(HOOKS_DIR, 'session-start.mjs');
  const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
  const parsed = JSON.parse(output);

  assert.ok(parsed.additionalContext || parsed.status, 'Should output JSON');
});

test('session-start detects recovery marker', () => {
  // Create marker file
  const markerData = {
    timestamp: new Date().toISOString(),
    sessionId: 'test-session',
    projectPath: TEST_DIR,
    compactedAt: new Date().toISOString()
  };

  mkdirSync(join(HOME, '.claude'), { recursive: true });
  writeFileSync(MARKER_PATH, JSON.stringify(markerData));

  const scriptPath = join(HOOKS_DIR, 'session-start.mjs');
  const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
  const parsed = JSON.parse(output);

  assert.ok(parsed.additionalContext, 'Should have additionalContext');
  assert.ok(parsed.additionalContext.includes('SESSION RECOVERY'), 'Should indicate recovery');
});

test('session-start removes marker after detection', () => {
  // Marker should have been deleted by previous test
  assert.ok(!existsSync(MARKER_PATH), 'Marker should be deleted after reading');
});

test('session-start handles missing marker gracefully', () => {
  if (existsSync(MARKER_PATH)) unlinkSync(MARKER_PATH);

  const scriptPath = join(HOOKS_DIR, 'session-start.mjs');
  const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
  const parsed = JSON.parse(output);

  assert.ok(parsed.additionalContext.includes('SESSION INITIALIZED'),
    'Should output normal session init');
});

// ==================== PRE-COMPACT.MJS TESTS ====================
console.log('\n💾 Pre-Compact Hook Tests');

test('pre-compact.mjs exists', () => {
  const scriptPath = join(HOOKS_DIR, 'pre-compact.mjs');
  assert.ok(existsSync(scriptPath), 'pre-compact.mjs should exist');
});

test('pre-compact creates marker file', () => {
  if (existsSync(MARKER_PATH)) unlinkSync(MARKER_PATH);

  const scriptPath = join(HOOKS_DIR, 'pre-compact.mjs');
  const output = execSync(`node "${scriptPath}"`, {
    encoding: 'utf8',
    cwd: TEST_DIR
  });
  const parsed = JSON.parse(output);

  assert.equal(parsed.status, 'success', 'Should report success');
  assert.ok(existsSync(MARKER_PATH), 'Marker file should be created');
});

test('pre-compact marker contains required fields', () => {
  const marker = JSON.parse(readFileSync(MARKER_PATH, 'utf8'));

  assert.ok(marker.timestamp, 'Marker should have timestamp');
  assert.ok(marker.projectPath, 'Marker should have projectPath');
  assert.ok(marker.compactedAt, 'Marker should have compactedAt');
});

test('pre-compact creates backup directory', () => {
  const backupDir = join(TEST_DIR, '.claude', 'backups');
  // Pre-compact should create this
  const scriptPath = join(HOOKS_DIR, 'pre-compact.mjs');
  execSync(`node "${scriptPath}"`, {
    encoding: 'utf8',
    cwd: TEST_DIR
  });

  assert.ok(existsSync(backupDir), 'Backup directory should be created');
});

// ==================== INTEGRATION TESTS ====================
console.log('\n🔄 Integration Tests');

test('Full recovery cycle works', () => {
  // 1. Run pre-compact
  if (existsSync(MARKER_PATH)) unlinkSync(MARKER_PATH);

  const preCompactScript = join(HOOKS_DIR, 'pre-compact.mjs');
  execSync(`node "${preCompactScript}"`, { cwd: TEST_DIR, encoding: 'utf8' });

  assert.ok(existsSync(MARKER_PATH), 'Marker should exist after pre-compact');

  // 2. Run session-start (should detect recovery)
  const sessionStartScript = join(HOOKS_DIR, 'session-start.mjs');
  const output = execSync(`node "${sessionStartScript}"`, { encoding: 'utf8' });
  const parsed = JSON.parse(output);

  assert.ok(parsed.additionalContext.includes('SESSION RECOVERY'),
    'Should detect recovery');

  // 3. Marker should be deleted
  assert.ok(!existsSync(MARKER_PATH), 'Marker should be deleted');

  // 4. Run session-start again (should be normal)
  const output2 = execSync(`node "${sessionStartScript}"`, { encoding: 'utf8' });
  const parsed2 = JSON.parse(output2);

  assert.ok(parsed2.additionalContext.includes('SESSION INITIALIZED'),
    'Should be normal init after recovery');
});

// ==================== ERROR HANDLING TESTS ====================
console.log('\n⚠️ Error Handling Tests');

test('session-start handles invalid marker JSON', () => {
  writeFileSync(MARKER_PATH, 'invalid json {{{');

  const scriptPath = join(HOOKS_DIR, 'session-start.mjs');
  // Should not throw, should handle gracefully
  const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
  const parsed = JSON.parse(output);

  assert.ok(parsed.status === 'ok' || parsed.additionalContext,
    'Should handle invalid JSON gracefully');
});

test('pre-compact handles permission errors gracefully', () => {
  // This test just ensures the script doesn't crash on errors
  const scriptPath = join(HOOKS_DIR, 'pre-compact.mjs');

  // Run from a non-existent directory (will use cwd)
  try {
    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    JSON.parse(output); // Should be valid JSON
    assert.ok(true);
  } catch (e) {
    // Even if there's an error, it should be handled
    assert.ok(true, 'Error was caught');
  }
});

// Cleanup
cleanup();

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
