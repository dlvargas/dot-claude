#!/usr/bin/env node
/**
 * Tests for backup-manager.mjs
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const TEST_DIR = join(tmpdir(), 'claude-backup-test-' + Date.now());

// Setup test directory
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude'), { recursive: true });
mkdirSync(join(TEST_DIR, 'src'), { recursive: true });

// Create test files
writeFileSync(join(TEST_DIR, 'src', 'test.js'), 'const x = 1;\nconsole.log(x);');
writeFileSync(join(TEST_DIR, 'config.json'), '{"key": "value"}');

console.log('🧪 Testing backup-manager.mjs\n');
console.log(`Test directory: ${TEST_DIR}`);

// Set process.cwd() to test dir for the module
const originalCwd = process.cwd();
process.chdir(TEST_DIR);

// Dynamic import
const { BackupManager } = await import('../scripts/backup-manager.mjs');

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

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
  }
}

// Tests
console.log('\n📦 Backup Creation Tests');

test('Creates backup of existing file', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-1');
  const testFile = join(TEST_DIR, 'src', 'test.js');
  const backup = manager.backupFile(testFile);

  assert.ok(backup, 'Backup should be created');
  assert.ok(backup.originalPath === testFile, 'Original path recorded');
  assert.ok(existsSync(backup.backupPath), 'Backup file exists');
  assert.ok(backup.hash, 'Hash is generated');
});

test('Returns null for non-existent file', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-2');
  const backup = manager.backupFile(join(TEST_DIR, 'nonexistent.txt'));
  assert.equal(backup, null);
});

test('Backup content matches original', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-3');
  const testFile = join(TEST_DIR, 'config.json');
  const originalContent = readFileSync(testFile, 'utf8');

  const backup = manager.backupFile(testFile);
  const backupContent = readFileSync(backup.backupPath, 'utf8');

  assert.equal(backupContent, originalContent);
});

console.log('\n📝 Diff Generation Tests');

test('Generates diff for file changes', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-4');
  const testFile = join(TEST_DIR, 'src', 'test.js');

  const oldContent = 'const x = 1;';
  const newContent = 'const x = 2;\nconst y = 3;';

  const diff = manager.generateDiff(testFile, oldContent, newContent);

  assert.ok(diff, 'Diff should be generated');
  assert.ok(diff.diffPath, 'Diff path exists');
  assert.ok(existsSync(diff.diffPath), 'Diff file exists');
  assert.ok(diff.linesAdded >= 0, 'Lines added tracked');
  assert.ok(diff.linesRemoved >= 0, 'Lines removed tracked');
});

console.log('\n🗑️ Soft Delete Tests');

test('Soft delete moves file to trash', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-5');
  const testFile = join(TEST_DIR, 'to-delete.txt');
  writeFileSync(testFile, 'delete me');

  assert.ok(existsSync(testFile), 'File exists before delete');

  const result = manager.softDelete(testFile);

  assert.ok(result.success, 'Soft delete succeeded');
  assert.ok(!existsSync(testFile), 'Original file removed');
  assert.ok(existsSync(result.deletion.trashPath), 'File exists in trash');
});

test('Soft delete preserves content', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-6');
  const testFile = join(TEST_DIR, 'preserve-content.txt');
  const content = 'important content here';
  writeFileSync(testFile, content);

  const result = manager.softDelete(testFile);
  const trashedContent = readFileSync(result.deletion.trashPath, 'utf8');

  assert.equal(trashedContent, content);
});

console.log('\n♻️ Restore Tests');

test('Restore from trash works', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-7');
  const testFile = join(TEST_DIR, 'restore-me.txt');
  const content = 'restore this';
  writeFileSync(testFile, content);

  const deleteResult = manager.softDelete(testFile);
  assert.ok(!existsSync(testFile), 'File deleted');

  const restoreResult = manager.restore(deleteResult.deletion.trashPath);
  assert.ok(restoreResult.success, 'Restore succeeded');
  assert.ok(existsSync(testFile), 'File restored');
  assert.equal(readFileSync(testFile, 'utf8'), content);
});

console.log('\n📊 Metadata Tests');

test('Tracks backups in metadata', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-8');
  const testFile = join(TEST_DIR, 'track-me.txt');
  writeFileSync(testFile, 'track this');

  manager.backupFile(testFile);

  const backups = manager.getBackupsForFile(testFile);
  assert.ok(backups.length > 0, 'Backup tracked');
});

test('Summary returns correct counts', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-9');

  // Create some activity
  const file1 = join(TEST_DIR, 'summary-test-1.txt');
  const file2 = join(TEST_DIR, 'summary-test-2.txt');
  writeFileSync(file1, 'test1');
  writeFileSync(file2, 'test2');

  manager.backupFile(file1);
  manager.softDelete(file2);

  const summary = manager.getSummary();

  assert.ok(summary.sessionId, 'Has session ID');
  assert.ok(summary.backupCount >= 1, 'Backup counted');
  assert.ok(summary.deletionCount >= 1, 'Deletion counted');
});

test('Lists restorable files', () => {
  const manager = new BackupManager(TEST_DIR, 'test-session-10');
  const testFile = join(TEST_DIR, 'list-restorable.txt');
  writeFileSync(testFile, 'can restore');

  manager.softDelete(testFile);

  const restorable = manager.getRestorableFiles();
  assert.ok(restorable.length > 0, 'Has restorable files');
  assert.ok(restorable[0].canRestore === true, 'Marked as restorable');
});

// Restore cwd
process.chdir(originalCwd);

// Cleanup
console.log('\n🧹 Cleanup');
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
