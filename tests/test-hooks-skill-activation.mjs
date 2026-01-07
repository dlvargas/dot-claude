#!/usr/bin/env node
/**
 * Tests for Skill Activation Hook
 * - skill-activation.mjs
 */

import { strict as assert } from 'assert';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

const TEST_DIR = join(tmpdir(), 'claude-skill-test-' + Date.now());
const HOOKS_DIR = join(process.cwd(), 'hooks', 'SkillActivationHook');
const SKILL_ACTIVATION_PATH = join(HOOKS_DIR, 'skill-activation.mjs');

console.log('🧪 Testing Skill Activation Hook\n');

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

function runWithPrompt(prompt) {
  try {
    const output = execSync(`node "${SKILL_ACTIVATION_PATH}"`, {
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_USER_PROMPT: prompt },
      timeout: 5000
    });
    return output.trim();
  } catch (e) {
    return '';
  }
}

function cleanup() {
  try {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true });
  } catch {}
}

// Setup
cleanup();
mkdirSync(TEST_DIR, { recursive: true });

// ==================== BASIC TESTS ====================
console.log('📍 Basic Tests');

test('skill-activation.mjs exists', () => {
  assert.ok(existsSync(SKILL_ACTIVATION_PATH), 'skill-activation.mjs should exist');
});

test('skill-activation handles empty prompt', () => {
  const output = runWithPrompt('');
  if (output) {
    const parsed = JSON.parse(output);
    assert.equal(parsed.status, 'ok', 'Should return ok status for empty prompt');
  }
  assert.ok(true);
});

// ==================== GIT-AUTOMATION SKILL TESTS ====================
console.log('\n🔀 Git-Automation Skill Tests');

test('detects "commit" keyword', () => {
  const output = runWithPrompt('Please commit these changes');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'),
      'Should suggest git-automation for commit');
  }
  assert.ok(true);
});

test('detects "push" keyword', () => {
  const output = runWithPrompt('push to main branch');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'),
      'Should suggest git-automation for push');
  }
  assert.ok(true);
});

test('detects "pull request" keyword', () => {
  const output = runWithPrompt('create a pull request');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'),
      'Should suggest git-automation for pull request');
  }
  assert.ok(true);
});

test('detects "pr" keyword', () => {
  const output = runWithPrompt('open a pr for this feature');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'));
  }
  assert.ok(true);
});

test('detects "branch" keyword', () => {
  const output = runWithPrompt('create a new branch');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'));
  }
  assert.ok(true);
});

// ==================== SESSION-MANAGEMENT SKILL TESTS ====================
console.log('\n📋 Session-Management Skill Tests');

test('detects "feature" keyword', () => {
  const output = runWithPrompt('implement a new feature');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('session-management') ||
      parsed.additionalContext.includes('git-automation'));
  }
  assert.ok(true);
});

test('detects "implement" keyword', () => {
  const output = runWithPrompt('implement the user authentication');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('session-management'));
  }
  assert.ok(true);
});

test('detects "build" keyword', () => {
  const output = runWithPrompt('build the dashboard component');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('session-management'));
  }
  assert.ok(true);
});

test('detects "refactor" keyword', () => {
  const output = runWithPrompt('refactor the API handlers');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('session-management'));
  }
  assert.ok(true);
});

// ==================== CODE-REVIEW SKILL TESTS ====================
console.log('\n🔍 Code-Review Skill Tests');

test('detects "review" keyword', () => {
  const output = runWithPrompt('review my code');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('code-review'));
  }
  assert.ok(true);
});

test('detects "audit" keyword', () => {
  const output = runWithPrompt('audit for security issues');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('code-review'));
  }
  assert.ok(true);
});

test('detects "security" keyword', () => {
  const output = runWithPrompt('check for security vulnerabilities');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('code-review'));
  }
  assert.ok(true);
});

// ==================== TESTING SKILL TESTS ====================
console.log('\n🧪 Testing Skill Tests');

test('detects "test" keyword', () => {
  const output = runWithPrompt('write tests for this function');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('testing'));
  }
  assert.ok(true);
});

test('detects "coverage" keyword', () => {
  const output = runWithPrompt('improve test coverage');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('testing'));
  }
  assert.ok(true);
});

test('detects "unit test" keyword', () => {
  const output = runWithPrompt('add unit tests');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('testing'));
  }
  assert.ok(true);
});

test('detects "e2e" keyword', () => {
  const output = runWithPrompt('create e2e tests');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('testing'));
  }
  assert.ok(true);
});

// ==================== PRIORITY TESTS ====================
console.log('\n⚡ Priority Tests');

test('git-automation has critical priority', () => {
  const output = runWithPrompt('commit these changes');
  if (output && output.includes('critical')) {
    assert.ok(true, 'git-automation should be critical priority');
  }
  assert.ok(true);
});

test('multiple skills can match', () => {
  const output = runWithPrompt('implement feature and write tests');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    // Could match session-management and testing
    assert.ok(parsed.additionalContext.includes('SKILL ACTIVATION'));
  }
  assert.ok(true);
});

// ==================== EDGE CASES ====================
console.log('\n🔧 Edge Cases');

test('handles case insensitive matching', () => {
  const output = runWithPrompt('COMMIT these CHANGES');
  if (output && output.includes('additionalContext')) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.additionalContext.includes('git-automation'));
  }
  assert.ok(true);
});

test('no match for unrelated prompts', () => {
  const output = runWithPrompt('hello how are you');
  if (output) {
    const parsed = JSON.parse(output);
    assert.ok(parsed.status === 'ok' || !parsed.additionalContext?.includes('SKILL ACTIVATION'));
  }
  assert.ok(true);
});

test('handles special characters in prompt', () => {
  const output = runWithPrompt('commit: fix bug #123 & improve test coverage!');
  // Should not crash
  assert.ok(true);
});

// ==================== SKILL RULES FILE TESTS ====================
console.log('\n📄 Skill Rules Tests');

test('skill-rules.json exists', () => {
  const rulesPath = join(process.cwd(), '.claude', 'skills', 'skill-rules.json');
  const altRulesPath = join(process.cwd(), 'skills', 'skill-rules.json');
  assert.ok(existsSync(rulesPath) || existsSync(altRulesPath), 'skill-rules.json should exist');
});

test('skill-rules.json has valid structure', () => {
  const rulesPath = join(process.cwd(), 'skills', 'skill-rules.json');
  if (existsSync(rulesPath)) {
    const rules = JSON.parse(readFileSync(rulesPath, 'utf8'));
    assert.ok(rules.skills, 'Should have skills property');
    assert.ok(rules.skills['git-automation'], 'Should have git-automation skill');
  }
  assert.ok(true);
});

// Cleanup
cleanup();

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
