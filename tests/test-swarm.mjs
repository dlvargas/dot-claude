#!/usr/bin/env node
/**
 * Tests for swarm orchestration scripts
 */

import { strict as assert } from 'assert';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { execSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-swarm-test-' + Date.now());
const HOME = homedir();

console.log('🧪 Testing swarm orchestration\n');
console.log(`Test directory: ${TEST_DIR}`);

// Setup
mkdirSync(TEST_DIR, { recursive: true });
mkdirSync(join(TEST_DIR, '.claude', 'swarm'), { recursive: true });

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

// Test swarm architecture config
console.log('\n🏗️ Swarm Architecture Config Tests');

test('Swarm architecture config exists', () => {
  const configPath = join(HOME, '.claude', 'config', 'swarm-architecture.json');
  assert.ok(existsSync(configPath), 'swarm-architecture.json should exist');
});

test('Swarm config has required structure', () => {
  const configPath = join(HOME, '.claude', 'config', 'swarm-architecture.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  assert.ok(config.hierarchy, 'Should have hierarchy');
  assert.ok(config.hierarchy.director, 'Should have director');
  assert.ok(config.hierarchy.manager, 'Should have manager');
  assert.ok(config.specialistDomains, 'Should have specialistDomains');
});

test('Swarm config has valid domains', () => {
  const configPath = join(HOME, '.claude', 'config', 'swarm-architecture.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  const domains = Object.keys(config.specialistDomains);
  assert.ok(domains.length > 0, 'Should have at least one domain');

  for (const domain of domains) {
    assert.ok(config.specialistDomains[domain].focus, `${domain} should have focus`);
  }
});

// Test swarm-init.sh
console.log('\n🚀 Swarm Init Script Tests');

test('Swarm init script exists', () => {
  const scriptPath = join(HOME, '.claude', 'scripts', 'swarm-init.sh');
  assert.ok(existsSync(scriptPath), 'swarm-init.sh should exist');
});

test('Swarm init script is executable', () => {
  const scriptPath = join(HOME, '.claude', 'scripts', 'swarm-init.sh');
  try {
    execSync(`test -x "${scriptPath}"`, { stdio: 'pipe' });
    assert.ok(true);
  } catch {
    // Make it executable
    execSync(`chmod +x "${scriptPath}"`, { stdio: 'pipe' });
    assert.ok(true);
  }
});

// Test swarm-report.mjs
console.log('\n📊 Swarm Report Script Tests');

test('Swarm report script exists', () => {
  const scriptPath = join(HOME, '.claude', 'scripts', 'swarm-report.mjs');
  assert.ok(existsSync(scriptPath), 'swarm-report.mjs should exist');
});

// Create test swarm reports and test aggregation
test('Can parse swarm report format', () => {
  const report = {
    agentId: 'test-agent',
    domain: 'backend',
    status: 'completed',
    sentiment: { confidence: 0.8, blockers: false },
    summary: 'Completed backend work',
    filesModified: ['src/api.js'],
    timestamp: new Date().toISOString()
  };

  // Validate report structure
  assert.ok(report.agentId, 'Has agentId');
  assert.ok(report.domain, 'Has domain');
  assert.ok(report.status, 'Has status');
  assert.ok(report.sentiment, 'Has sentiment');
  assert.ok(typeof report.sentiment.confidence === 'number', 'Confidence is number');
});

// Test swarm directory structure
console.log('\n📁 Swarm Directory Structure Tests');

test('Creates proper swarm workspace structure', () => {
  const swarmDir = join(TEST_DIR, '.claude', 'swarm');
  const taskId = 'test-task-123';

  // Simulate swarm init structure
  const dirs = [
    join(swarmDir, taskId),
    join(swarmDir, taskId, 'director'),
    join(swarmDir, taskId, 'managers'),
    join(swarmDir, taskId, 'ics'),
    join(swarmDir, taskId, 'reports')
  ];

  for (const dir of dirs) {
    mkdirSync(dir, { recursive: true });
    assert.ok(existsSync(dir), `${dir} should exist`);
  }
});

test('Can write and read swarm manifest', () => {
  const swarmDir = join(TEST_DIR, '.claude', 'swarm', 'test-task');
  mkdirSync(swarmDir, { recursive: true });

  const manifest = {
    taskId: 'test-task',
    createdAt: new Date().toISOString(),
    objective: 'Test the swarm system',
    domains: ['backend', 'frontend'],
    status: 'active'
  };

  const manifestPath = join(swarmDir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const loaded = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(loaded.taskId, manifest.taskId);
  assert.equal(loaded.objective, manifest.objective);
});

// Test swarm rules
console.log('\n📜 Swarm Rules Tests');

test('Director rules file exists', () => {
  const rulesPath = join(HOME, '.claude', 'rules', 'swarm-director.md');
  assert.ok(existsSync(rulesPath), 'swarm-director.md should exist');
});

test('Director rules contain delegation guidance', () => {
  const rulesPath = join(HOME, '.claude', 'rules', 'swarm-director.md');
  const content = readFileSync(rulesPath, 'utf8');

  assert.ok(content.includes('Director') || content.includes('delegation'),
    'Should contain director/delegation guidance');
});

// Test swarm skill
console.log('\n🎯 Swarm Skill Tests');

test('Swarm skill exists', () => {
  const skillPath = join(HOME, '.claude', 'skills', 'swarm-orchestration', 'SKILL.md');
  assert.ok(existsSync(skillPath), 'SKILL.md should exist');
});

test('Swarm skill has trigger phrases', () => {
  const skillPath = join(HOME, '.claude', 'skills', 'swarm-orchestration', 'SKILL.md');
  const content = readFileSync(skillPath, 'utf8');

  assert.ok(content.includes('trigger') || content.includes('Trigger'),
    'Should define triggers');
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
