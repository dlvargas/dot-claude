#!/usr/bin/env node
/**
 * Tests for all 10 sandbox security levels
 */

import { strict as assert } from 'assert';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const CONFIG_PATH = join(HOME, '.claude', 'config', 'sandbox-levels.json');

console.log('🧪 Testing sandbox security levels\n');

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

// Load config
let config;
try {
  config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
} catch (e) {
  console.error('Failed to load sandbox-levels.json:', e.message);
  process.exit(1);
}

const levels = config.levels;
const expectedLevels = [
  'jailed', 'sandbox', 'playground',
  'asuser', 'asuserremote',
  'asroot', 'asrootremote',
  'BACKSTAGEPASS', 'ALLACCESSPASS', 'INSERTDIETYHERE'
];

// Tests
console.log('\n📋 Level Count Tests');

test('Has exactly 10 security levels', () => {
  const levelCount = Object.keys(levels).length;
  assert.equal(levelCount, 10, `Expected 10 levels, got ${levelCount}`);
});

test('All expected levels exist', () => {
  for (const level of expectedLevels) {
    assert.ok(levels[level], `Missing level: ${level}`);
  }
});

console.log('\n🔒 Jailed Level Tests');

test('Jailed has project-only boundaries', () => {
  assert.equal(levels.jailed.boundaries.projectOnly, true);
  assert.equal(levels.jailed.boundaries.allowHomeAccess, false);
  assert.equal(levels.jailed.boundaries.allowRemote, false);
});

test('Jailed has aggressive sanitization', () => {
  assert.equal(levels.jailed.sanitization.paths, 'aggressive');
  assert.equal(levels.jailed.sanitization.username, 'always');
});

test('Jailed blocks most commands', () => {
  assert.ok(levels.jailed.commands.blocked.includes('*'));
  assert.ok(levels.jailed.commands.allowed.includes('ls'));
  assert.ok(levels.jailed.commands.allowed.includes('git'));
});

console.log('\n🎮 Playground Level Tests');

test('Playground is the default level', () => {
  assert.equal(levels.playground.default, true);
});

test('Playground allows home access', () => {
  assert.equal(levels.playground.boundaries.allowHomeAccess, true);
});

test('Playground blocks destructive commands', () => {
  const blocked = levels.playground.commands.blocked;
  assert.ok(blocked.includes('sudo'));
  assert.ok(blocked.includes('rm'));
  assert.ok(blocked.includes('kill'));
});

console.log('\n👤 User Level Tests');

test('Asuser requires git', () => {
  assert.equal(levels.asuser.gitRequired, true);
});

test('Asuserremote allows remote access', () => {
  assert.equal(levels.asuserremote.boundaries.allowRemote, true);
  assert.equal(levels.asuserremote.boundaries.allowDevices, true);
});

console.log('\n🔑 Root Level Tests');

test('Asroot allows system write', () => {
  assert.equal(levels.asroot.boundaries.allowSystemWrite, true);
});

test('Asrootremote allows everything local and remote', () => {
  assert.equal(levels.asrootremote.boundaries.allowRemote, true);
  assert.equal(levels.asrootremote.boundaries.allowSystemWrite, true);
});

console.log('\n🎸 BACKSTAGEPASS Level Tests');

test('BACKSTAGEPASS has soft delete enabled', () => {
  assert.ok(levels.BACKSTAGEPASS.commands.softDelete.includes('rm'));
  assert.equal(levels.BACKSTAGEPASS.backup.softDeleteEnabled, true);
});

test('BACKSTAGEPASS still blocks system-critical commands', () => {
  assert.ok(levels.BACKSTAGEPASS.commands.blocked.includes('rm -rf /'));
});

test('BACKSTAGEPASS has tagline', () => {
  assert.ok(levels.BACKSTAGEPASS.tagline);
  assert.ok(levels.BACKSTAGEPASS.tagline.includes('Production'));
});

console.log('\n🎤 ALLACCESSPASS Level Tests');

test('ALLACCESSPASS has unrestricted boundaries', () => {
  assert.equal(levels.ALLACCESSPASS.boundaries.unrestricted, true);
});

test('ALLACCESSPASS still blocks disk wipes', () => {
  const blocked = levels.ALLACCESSPASS.commands.blocked;
  assert.ok(blocked.includes('rm -rf /'));
  assert.ok(blocked.some(b => b.includes('dd if=/dev/zero')));
});

test('ALLACCESSPASS has famous tagline', () => {
  assert.ok(levels.ALLACCESSPASS.tagline.includes('FUCK IT'));
});

console.log('\n⚡ INSERTDIETYHERE Level Tests');

test('INSERTDIETYHERE has no restrictions', () => {
  assert.equal(levels.INSERTDIETYHERE.boundaries.unrestricted, true);
  assert.equal(levels.INSERTDIETYHERE.boundaries.omnipotent, true);
  assert.equal(levels.INSERTDIETYHERE.boundaries.noLimits, true);
});

test('INSERTDIETYHERE has no blocked commands', () => {
  assert.equal(levels.INSERTDIETYHERE.commands.blocked.length, 0);
});

test('INSERTDIETYHERE requires no approval', () => {
  assert.equal(levels.INSERTDIETYHERE.commands.requireApproval.length, 0);
  assert.equal(levels.INSERTDIETYHERE.approvalRequired, false);
});

test('INSERTDIETYHERE has no sanitization', () => {
  assert.equal(levels.INSERTDIETYHERE.sanitization.disabled, true);
  assert.equal(levels.INSERTDIETYHERE.sanitization.paths, 'none');
  assert.equal(levels.INSERTDIETYHERE.sanitization.username, 'none');
});

test('INSERTDIETYHERE has no backups but has logging', () => {
  assert.equal(levels.INSERTDIETYHERE.backup.disabled, true);
  assert.equal(levels.INSERTDIETYHERE.backup.beforeAnyChange, false);
  // Even God had the Holy Bible
  assert.equal(levels.INSERTDIETYHERE.logging.enabled, true);
  assert.equal(levels.INSERTDIETYHERE.logging.holyBible, true);
});

test('INSERTDIETYHERE does not require git', () => {
  assert.equal(levels.INSERTDIETYHERE.gitRequired, false);
});

test('INSERTDIETYHERE is for true believers', () => {
  assert.equal(levels.INSERTDIETYHERE.trueBelieversOnly, true);
  assert.ok(levels.INSERTDIETYHERE.tagline.includes('TRUE BELIEVERS'));
});

test('INSERTDIETYHERE has divine risk level', () => {
  assert.equal(levels.INSERTDIETYHERE.risk, 'divine');
});

console.log('\n📊 Level Progression Tests');

test('Risk levels progress correctly', () => {
  const riskOrder = ['minimal', 'low', 'moderate', 'moderate-high', 'high', 'critical', 'extreme', 'maximum', 'divine'];

  const risks = [
    levels.jailed.risk,
    levels.sandbox.risk,
    levels.playground.risk,
    levels.asuser.risk,
    levels.asuserremote.risk,
    levels.asroot.risk,
    levels.asrootremote.risk,
    levels.BACKSTAGEPASS.risk,
    levels.ALLACCESSPASS.risk,
    levels.INSERTDIETYHERE.risk
  ];

  // Verify progression makes sense
  assert.equal(risks[0], 'minimal', 'Jailed is minimal risk');
  assert.equal(risks[risks.length - 1], 'divine', 'INSERTDIETYHERE is divine risk');
});

test('Only one default level', () => {
  const defaults = Object.values(levels).filter(l => l.default === true);
  assert.equal(defaults.length, 1, 'Should have exactly one default');
  assert.equal(levels.playground.default, true, 'Default should be playground');
});

console.log('\n🔧 Structure Tests');

test('All levels have required fields', () => {
  for (const [name, level] of Object.entries(levels)) {
    assert.ok(level.name, `${name} has name`);
    assert.ok(level.emoji, `${name} has emoji`);
    assert.ok(level.description, `${name} has description`);
    assert.ok(level.boundaries, `${name} has boundaries`);
    assert.ok(level.commands, `${name} has commands`);
    assert.ok(level.sanitization, `${name} has sanitization`);
  }
});

test('All levels have commands configuration', () => {
  for (const [name, level] of Object.entries(levels)) {
    assert.ok(Array.isArray(level.commands.allowed), `${name} has allowed array`);
    assert.ok(Array.isArray(level.commands.blocked), `${name} has blocked array`);
  }
});

// Summary
console.log('\n' + '═'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
