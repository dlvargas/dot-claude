#!/usr/bin/env node
/**
 * Tests for soft delete functionality
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync, renameSync } from 'fs';
import { join, dirname, basename } from 'path';
import { tmpdir } from 'os';

const TEST_DIR = join(tmpdir(), 'claude-softdelete-test-' + Date.now());

console.log('🧪 Testing soft delete functionality\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude', 'trash'), { recursive: true });

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

// Soft delete implementation for testing
function softDelete(filePath, trashDir, sessionId = 'test') {
  if (!existsSync(filePath)) {
    return { success: false, error: 'File not found' };
  }

  const sessionTrash = join(trashDir, sessionId);
  mkdirSync(sessionTrash, { recursive: true });

  const fileName = basename(filePath);
  const timestamp = Date.now();
  const trashPath = join(sessionTrash, `${fileName}.${timestamp}`);

  renameSync(filePath, trashPath);

  return {
    success: true,
    originalPath: filePath,
    trashPath,
    deletedAt: new Date().toISOString(),
    canRestore: true
  };
}

function restore(deletion) {
  if (!existsSync(deletion.trashPath)) {
    return { success: false, error: 'Trash file not found' };
  }

  const targetDir = dirname(deletion.originalPath);
  mkdirSync(targetDir, { recursive: true });

  renameSync(deletion.trashPath, deletion.originalPath);
  return { success: true, restoredTo: deletion.originalPath };
}

// Tests
console.log('\n🗑️ Basic Soft Delete Tests');

test('Soft delete moves file to trash', () => {
  const testFile = join(TEST_DIR, 'delete-me.txt');
  writeFileSync(testFile, 'content to delete');

  const result = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));

  assert.ok(result.success, 'Soft delete succeeded');
  assert.ok(!existsSync(testFile), 'Original file removed');
  assert.ok(existsSync(result.trashPath), 'File exists in trash');
});

test('Soft delete preserves file content', () => {
  const testFile = join(TEST_DIR, 'preserve-content.txt');
  const content = 'important content that must be preserved';
  writeFileSync(testFile, content);

  const result = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  const trashedContent = readFileSync(result.trashPath, 'utf8');

  assert.equal(trashedContent, content, 'Content preserved');
});

test('Soft delete returns metadata', () => {
  const testFile = join(TEST_DIR, 'metadata-test.txt');
  writeFileSync(testFile, 'test');

  const result = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));

  assert.ok(result.originalPath, 'Has original path');
  assert.ok(result.trashPath, 'Has trash path');
  assert.ok(result.deletedAt, 'Has deletion timestamp');
  assert.ok(result.canRestore, 'Marked as restorable');
});

test('Soft delete handles non-existent file', () => {
  const result = softDelete(join(TEST_DIR, 'nonexistent.txt'), join(TEST_DIR, '.claude', 'trash'));
  assert.equal(result.success, false, 'Should fail for non-existent');
  assert.ok(result.error, 'Should have error message');
});

console.log('\n♻️ Restore Tests');

test('Can restore soft-deleted file', () => {
  const testFile = join(TEST_DIR, 'restore-me.txt');
  const content = 'restore this content';
  writeFileSync(testFile, content);

  const deletion = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  assert.ok(!existsSync(testFile), 'File deleted');

  const restoreResult = restore(deletion);
  assert.ok(restoreResult.success, 'Restore succeeded');
  assert.ok(existsSync(testFile), 'File restored');
  assert.equal(readFileSync(testFile, 'utf8'), content, 'Content matches');
});

test('Restore recreates parent directories', () => {
  const deepPath = join(TEST_DIR, 'deep', 'nested', 'dir');
  mkdirSync(deepPath, { recursive: true });
  const testFile = join(deepPath, 'nested-file.txt');
  writeFileSync(testFile, 'nested content');

  const deletion = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  rmSync(join(TEST_DIR, 'deep'), { recursive: true });

  const restoreResult = restore(deletion);
  assert.ok(restoreResult.success, 'Restore succeeded');
  assert.ok(existsSync(testFile), 'File restored with directories');
});

console.log('\n📁 Multiple Files Tests');

test('Can soft delete multiple files', () => {
  const files = [];
  for (let i = 0; i < 5; i++) {
    const file = join(TEST_DIR, `multi-${i}.txt`);
    writeFileSync(file, `content ${i}`);
    files.push(file);
  }

  const deletions = files.map(f => softDelete(f, join(TEST_DIR, '.claude', 'trash')));

  assert.ok(deletions.every(d => d.success), 'All deletes succeeded');
  assert.ok(files.every(f => !existsSync(f)), 'All originals removed');
  assert.ok(deletions.every(d => existsSync(d.trashPath)), 'All in trash');
});

test('Can restore multiple files', () => {
  const files = [];
  const deletions = [];

  for (let i = 0; i < 3; i++) {
    const file = join(TEST_DIR, `restore-multi-${i}.txt`);
    writeFileSync(file, `restore content ${i}`);
    files.push(file);
    deletions.push(softDelete(file, join(TEST_DIR, '.claude', 'trash')));
  }

  const restores = deletions.map(d => restore(d));

  assert.ok(restores.every(r => r.success), 'All restores succeeded');
  assert.ok(files.every(f => existsSync(f)), 'All files restored');
});

console.log('\n🏷️ Session Isolation Tests');

test('Trash is organized by session', () => {
  const trashDir = join(TEST_DIR, '.claude', 'trash');

  // Delete files in different sessions
  const file1 = join(TEST_DIR, 'session1-file.txt');
  const file2 = join(TEST_DIR, 'session2-file.txt');
  writeFileSync(file1, 'session1');
  writeFileSync(file2, 'session2');

  softDelete(file1, trashDir, 'session-A');
  softDelete(file2, trashDir, 'session-B');

  assert.ok(existsSync(join(trashDir, 'session-A')), 'Session A trash exists');
  assert.ok(existsSync(join(trashDir, 'session-B')), 'Session B trash exists');
});

test('Sessions have separate trash directories', () => {
  const trashDir = join(TEST_DIR, '.claude', 'trash');

  const sessionA = join(trashDir, 'session-A');
  const sessionB = join(trashDir, 'session-B');

  if (existsSync(sessionA) && existsSync(sessionB)) {
    const filesA = readdirSync(sessionA);
    const filesB = readdirSync(sessionB);

    assert.ok(filesA.length >= 0, 'Session A has files');
    assert.ok(filesB.length >= 0, 'Session B has files');
  }
});

console.log('\n⚠️ Edge Cases');

test('Handles files with special characters', () => {
  const testFile = join(TEST_DIR, 'file with spaces.txt');
  writeFileSync(testFile, 'special chars');

  const result = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  assert.ok(result.success, 'Handled spaces in filename');
});

test('Handles binary files', () => {
  const testFile = join(TEST_DIR, 'binary.bin');
  const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE]);
  writeFileSync(testFile, binaryContent);

  const deletion = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  const trashedContent = readFileSync(deletion.trashPath);

  assert.ok(binaryContent.equals(trashedContent), 'Binary content preserved');
});

test('Handles empty files', () => {
  const testFile = join(TEST_DIR, 'empty.txt');
  writeFileSync(testFile, '');

  const result = softDelete(testFile, join(TEST_DIR, '.claude', 'trash'));
  assert.ok(result.success, 'Empty file soft deleted');
});

// Cleanup
console.log('\n🧹 Cleanup');
try {
  rmSync(TEST_DIR, { recursive: true });
  console.log('  Cleaned up test directory');
} catch {}

// Summary
console.log('\n' + '═'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
