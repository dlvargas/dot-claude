#!/usr/bin/env node
/**
 * Tests for Enterprise Swarm Architecture v2.0
 * Tests 15 Manager Domains and 35+ IC Roles
 */

import { strict as assert } from 'assert';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const CONFIG_PATH = join(HOME, '.claude', 'config', 'swarm-architecture.json');
const PROJECT_CONFIG_PATH = join(process.cwd(), 'config', 'swarm-architecture.json');

console.log('🧪 Testing Enterprise Swarm Architecture v2.0\n');

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
  // Try project config first, then home config
  const configPath = existsSync(PROJECT_CONFIG_PATH) ? PROJECT_CONFIG_PATH : CONFIG_PATH;
  config = JSON.parse(readFileSync(configPath, 'utf8'));
  console.log(`Loaded config from: ${configPath}\n`);
} catch (e) {
  console.error('Failed to load swarm-architecture.json:', e.message);
  process.exit(1);
}

// Expected manager domains
const expectedDomains = [
  'discovery_requirements',
  'product_strategy',
  'architecture',
  'design_ux_ui',
  'frontend_development',
  'backend_development',
  'integration',
  'operations',
  'quality_assurance',
  'release_devops',
  'documentation',
  'infrastructure',
  'customer_success',
  'research',
  'culture_morale'
];

// Expected IC count per domain
const expectedICCounts = {
  discovery_requirements: 3,
  product_strategy: 4,
  architecture: 3,
  design_ux_ui: 3,
  frontend_development: 3,
  backend_development: 2,
  integration: 2,
  operations: 4,
  quality_assurance: 3,
  release_devops: 2,
  documentation: 5,
  infrastructure: 3,
  customer_success: 2,
  research: 1,
  culture_morale: 1
};

// ==================== VERSION TESTS ====================
console.log('📋 Version Tests');

test('Config version is 2.0.0', () => {
  assert.equal(config.version, '2.0.0', `Expected version 2.0.0, got ${config.version}`);
});

test('Config name reflects enterprise scope', () => {
  assert.ok(config.name.includes('Enterprise'), 'Name should include Enterprise');
});

// ==================== HIERARCHY TESTS ====================
console.log('\n🏗️ Hierarchy Tests');

test('Has director hierarchy', () => {
  assert.ok(config.hierarchy.director, 'Missing director in hierarchy');
  assert.equal(config.hierarchy.director.role, 'Director Claude');
});

test('Director can spawn up to 15 managers', () => {
  assert.equal(config.hierarchy.director.maxChildren, 15, 'Director should support 15 managers');
});

test('Has manager hierarchy', () => {
  assert.ok(config.hierarchy.manager, 'Missing manager in hierarchy');
  assert.equal(config.hierarchy.manager.spawns, 'contributors');
});

test('Manager can spawn up to 6 ICs', () => {
  assert.equal(config.hierarchy.manager.maxChildren, 6, 'Manager should support 6 ICs');
});

test('Has contributor hierarchy', () => {
  assert.ok(config.hierarchy.contributor, 'Missing contributor in hierarchy');
  assert.equal(config.hierarchy.contributor.spawns, null);
});

// ==================== MANAGER DOMAIN TESTS ====================
console.log('\n📊 Manager Domain Count Tests');

test('Has exactly 15 manager domains', () => {
  const domains = config.managerDomains;
  const domainCount = Object.keys(domains).length;
  assert.equal(domainCount, 15, `Expected 15 domains, got ${domainCount}`);
});

test('All expected domains exist', () => {
  for (const domain of expectedDomains) {
    assert.ok(config.managerDomains[domain], `Missing domain: ${domain}`);
  }
});

// ==================== INDIVIDUAL DOMAIN TESTS ====================
console.log('\n🔍 Discovery & Requirements Domain Tests');

test('Discovery domain has correct structure', () => {
  const domain = config.managerDomains.discovery_requirements;
  assert.equal(domain.name, 'Discovery & Requirements');
  assert.ok(domain.emoji, 'Should have emoji');
  assert.ok(domain.mission, 'Should have mission');
  assert.ok(domain.focus, 'Should have focus');
  assert.ok(Array.isArray(domain.icRoles), 'Should have icRoles array');
});

test('Discovery has 3 IC roles', () => {
  const domain = config.managerDomains.discovery_requirements;
  assert.equal(domain.icRoles.length, expectedICCounts.discovery_requirements);
});

test('Discovery ICs have required fields', () => {
  const domain = config.managerDomains.discovery_requirements;
  for (const ic of domain.icRoles) {
    assert.ok(ic.id, `IC should have id`);
    assert.ok(ic.name, `IC should have name`);
    assert.ok(Array.isArray(ic.expertise), `IC should have expertise array`);
    assert.ok(Array.isArray(ic.outputs), `IC should have outputs array`);
  }
});

console.log('\n🎯 Product & Strategy Domain Tests');

test('Product strategy has 4 IC roles', () => {
  const domain = config.managerDomains.product_strategy;
  assert.equal(domain.icRoles.length, expectedICCounts.product_strategy);
});

test('Product strategy includes executive advisors', () => {
  const domain = config.managerDomains.product_strategy;
  const hasExecAdvisors = domain.icRoles.some(ic => ic.id === 'executive_advisors');
  assert.ok(hasExecAdvisors, 'Should have executive advisors IC');
});

console.log('\n🏗️ Architecture Domain Tests');

test('Architecture has 3 IC roles', () => {
  const domain = config.managerDomains.architecture;
  assert.equal(domain.icRoles.length, expectedICCounts.architecture);
});

test('Architecture includes ML/LLM IC', () => {
  const domain = config.managerDomains.architecture;
  const hasMLIC = domain.icRoles.some(ic => ic.id === 'ml_llm_implementation');
  assert.ok(hasMLIC, 'Should have ML/LLM implementation IC');
});

console.log('\n🎨 Design (UX/UI) Domain Tests');

test('Design has 3 IC roles for different audiences', () => {
  const domain = config.managerDomains.design_ux_ui;
  assert.equal(domain.icRoles.length, expectedICCounts.design_ux_ui);

  const icIds = domain.icRoles.map(ic => ic.id);
  assert.ok(icIds.includes('customer_ux_ui'), 'Should have customer UX/UI');
  assert.ok(icIds.includes('internal_ux_ui'), 'Should have internal UX/UI');
  assert.ok(icIds.includes('vendor_ux_ui'), 'Should have vendor UX/UI');
});

console.log('\n🖥️ Frontend Development Domain Tests');

test('Frontend has 3 IC roles for different audiences', () => {
  const domain = config.managerDomains.frontend_development;
  assert.equal(domain.icRoles.length, expectedICCounts.frontend_development);
});

console.log('\n⚙️ Backend Development Domain Tests');

test('Backend has 2 IC roles', () => {
  const domain = config.managerDomains.backend_development;
  assert.equal(domain.icRoles.length, expectedICCounts.backend_development);
});

test('Backend includes Branch Engineer', () => {
  const domain = config.managerDomains.backend_development;
  const hasBranchEngineer = domain.icRoles.some(ic => ic.id === 'branch_engineer');
  assert.ok(hasBranchEngineer, 'Should have branch engineer IC');
});

console.log('\n🔗 Integration Domain Tests');

test('Integration has 2 IC roles', () => {
  const domain = config.managerDomains.integration;
  assert.equal(domain.icRoles.length, expectedICCounts.integration);
});

console.log('\n📊 Operations Domain Tests');

test('Operations has 4 IC roles', () => {
  const domain = config.managerDomains.operations;
  assert.equal(domain.icRoles.length, expectedICCounts.operations);
});

test('Operations includes email communications', () => {
  const domain = config.managerDomains.operations;
  const hasEmail = domain.icRoles.some(ic => ic.id === 'customer_communications');
  assert.ok(hasEmail, 'Should have customer communications IC');
});

console.log('\n✅ Quality Assurance Domain Tests');

test('QA has 3 IC roles', () => {
  const domain = config.managerDomains.quality_assurance;
  assert.equal(domain.icRoles.length, expectedICCounts.quality_assurance);
});

test('QA has both internal and customer regression testing', () => {
  const domain = config.managerDomains.quality_assurance;
  const icIds = domain.icRoles.map(ic => ic.id);
  assert.ok(icIds.includes('internal_regression'), 'Should have internal regression');
  assert.ok(icIds.includes('customer_regression'), 'Should have customer regression');
});

console.log('\n🚀 Release & DevOps Domain Tests');

test('Release has 2 IC roles', () => {
  const domain = config.managerDomains.release_devops;
  assert.equal(domain.icRoles.length, expectedICCounts.release_devops);
});

console.log('\n📚 Documentation Domain Tests');

test('Documentation has 5 IC roles (most of any domain)', () => {
  const domain = config.managerDomains.documentation;
  assert.equal(domain.icRoles.length, expectedICCounts.documentation);
});

test('Documentation covers all audiences', () => {
  const domain = config.managerDomains.documentation;
  const icIds = domain.icRoles.map(ic => ic.id);
  assert.ok(icIds.includes('customer_user_docs'), 'Should have customer user docs');
  assert.ok(icIds.includes('customer_admin_docs'), 'Should have customer admin docs');
  assert.ok(icIds.includes('customer_tech_docs'), 'Should have customer tech docs');
  assert.ok(icIds.includes('internal_user_docs'), 'Should have internal user docs');
  assert.ok(icIds.includes('internal_dev_docs'), 'Should have internal dev docs');
});

console.log('\n🏢 Infrastructure Domain Tests');

test('Infrastructure has 3 IC roles', () => {
  const domain = config.managerDomains.infrastructure;
  assert.equal(domain.icRoles.length, expectedICCounts.infrastructure);
});

test('Infrastructure covers datacenter, cloud, and data storage', () => {
  const domain = config.managerDomains.infrastructure;
  const icIds = domain.icRoles.map(ic => ic.id);
  assert.ok(icIds.includes('datacenter_engineering'), 'Should have datacenter');
  assert.ok(icIds.includes('systems_infrastructure'), 'Should have systems infrastructure');
  assert.ok(icIds.includes('data_storage'), 'Should have data storage');
});

console.log('\n🤝 Customer Success Domain Tests');

test('Customer Success has 2 IC roles', () => {
  const domain = config.managerDomains.customer_success;
  assert.equal(domain.icRoles.length, expectedICCounts.customer_success);
});

test('Customer Success includes Forward Deployed Engineer', () => {
  const domain = config.managerDomains.customer_success;
  const hasFDE = domain.icRoles.some(ic => ic.id === 'forward_deployed_engineer');
  assert.ok(hasFDE, 'Should have forward deployed engineer IC');
});

console.log('\n🔬 Research Domain Tests');

test('Research has 1 IC role', () => {
  const domain = config.managerDomains.research;
  assert.equal(domain.icRoles.length, expectedICCounts.research);
});

console.log('\n🍕 Culture & Morale Domain Tests');

test('Culture & Morale has 1 IC role', () => {
  const domain = config.managerDomains.culture_morale;
  assert.equal(domain.icRoles.length, expectedICCounts.culture_morale);
});

test('Pizza Guy IC has special instructions', () => {
  const domain = config.managerDomains.culture_morale;
  const pizzaGuy = domain.icRoles.find(ic => ic.id === 'pizza_guy');
  assert.ok(pizzaGuy, 'Should have pizza guy IC');
  assert.ok(pizzaGuy.specialInstructions, 'Pizza guy should have special instructions');
  assert.ok(pizzaGuy.specialInstructions.length > 0, 'Should have multiple special instructions');
});

test('Pizza Guy remembers dietary restrictions', () => {
  const domain = config.managerDomains.culture_morale;
  const pizzaGuy = domain.icRoles.find(ic => ic.id === 'pizza_guy');
  const hasVeganInstruction = pizzaGuy.specialInstructions.some(
    i => i.toLowerCase().includes('vegetarian') || i.toLowerCase().includes('vegan')
  );
  assert.ok(hasVeganInstruction, 'Should remember vegetarian/vegan options');
});

// ==================== TOTAL IC COUNT ====================
console.log('\n📈 Total IC Count Tests');

test('Total IC count is 35+', () => {
  let totalICs = 0;
  for (const domain of Object.values(config.managerDomains)) {
    totalICs += domain.icRoles.length;
  }
  assert.ok(totalICs >= 35, `Expected 35+ ICs, got ${totalICs}`);
  console.log(`     Total ICs: ${totalICs}`);
});

test('IC counts match expected', () => {
  for (const [domainId, expectedCount] of Object.entries(expectedICCounts)) {
    const domain = config.managerDomains[domainId];
    assert.equal(
      domain.icRoles.length,
      expectedCount,
      `${domainId} should have ${expectedCount} ICs, got ${domain.icRoles.length}`
    );
  }
});

// ==================== REPORTING STRUCTURE TESTS ====================
console.log('\n📝 Reporting Structure Tests');

test('Has IC to Manager reporting', () => {
  assert.ok(config.reportingStructure.icToManager, 'Should have IC to Manager reporting');
  assert.ok(config.reportingStructure.icToManager.includes, 'Should have includes list');
});

test('Has Manager to Director reporting', () => {
  assert.ok(config.reportingStructure.managerToDirector, 'Should have Manager to Director reporting');
});

test('Has Director to User reporting', () => {
  assert.ok(config.reportingStructure.directorToUser, 'Should have Director to User reporting');
});

// ==================== SENTIMENT TRACKING TESTS ====================
console.log('\n💭 Sentiment Tracking Tests');

test('Has sentiment tracking dimensions', () => {
  assert.ok(config.sentimentTracking.dimensions, 'Should have dimensions');
  assert.ok(config.sentimentTracking.dimensions.length >= 5, 'Should have at least 5 dimensions');
});

test('Has confidence dimension', () => {
  const hasConfidence = config.sentimentTracking.dimensions.some(d => d.name === 'confidence');
  assert.ok(hasConfidence, 'Should have confidence dimension');
});

test('Has blockers dimension', () => {
  const hasBlockers = config.sentimentTracking.dimensions.some(d => d.name === 'blockers');
  assert.ok(hasBlockers, 'Should have blockers dimension');
});

test('Has aggregation rules', () => {
  assert.ok(config.sentimentTracking.aggregation, 'Should have aggregation rules');
  assert.ok(config.sentimentTracking.aggregation.managerLevel, 'Should have manager level aggregation');
  assert.ok(config.sentimentTracking.aggregation.directorLevel, 'Should have director level aggregation');
});

// ==================== COLLABORATION PROTOCOL TESTS ====================
console.log('\n🤝 Collaboration Protocol Tests');

test('Has collaboration workspace paths', () => {
  assert.ok(config.collaborationProtocol.workspace, 'Should have workspace config');
  assert.ok(config.collaborationProtocol.workspace.collaboration, 'Should have collaboration path');
});

test('Has IC guidelines', () => {
  assert.ok(config.collaborationProtocol.icGuidelines, 'Should have IC guidelines');
  assert.ok(config.collaborationProtocol.icGuidelines.length >= 3, 'Should have multiple guidelines');
});

test('Has conflict resolution rules', () => {
  assert.ok(config.collaborationProtocol.conflictResolution, 'Should have conflict resolution');
  assert.ok(config.collaborationProtocol.conflictResolution.icLevel, 'Should have IC level rules');
  assert.ok(config.collaborationProtocol.conflictResolution.managerLevel, 'Should have manager level rules');
  assert.ok(config.collaborationProtocol.conflictResolution.directorLevel, 'Should have director level rules');
});

// ==================== DEFAULT CONFIGURATION TESTS ====================
console.log('\n⚙️ Default Configuration Tests');

test('Default security level is asuser', () => {
  assert.equal(config.defaultConfiguration.securityLevel, 'asuser');
});

test('Has enabled by default domains', () => {
  assert.ok(config.defaultConfiguration.enabledByDefault, 'Should have enabled by default');
  assert.ok(config.defaultConfiguration.enabledByDefault.length >= 3, 'Should have at least 3 default domains');
});

test('Has optional domains list', () => {
  assert.ok(config.defaultConfiguration.optionalDomains, 'Should have optional domains');
});

// ==================== EMOJI TESTS ====================
console.log('\n🎨 Domain Emoji Tests');

test('All domains have unique emojis', () => {
  const emojis = new Set();
  for (const domain of Object.values(config.managerDomains)) {
    assert.ok(domain.emoji, `Domain ${domain.name} should have emoji`);
    assert.ok(!emojis.has(domain.emoji), `Emoji ${domain.emoji} should be unique`);
    emojis.add(domain.emoji);
  }
});

test('Culture & Morale has pizza emoji', () => {
  const domain = config.managerDomains.culture_morale;
  assert.equal(domain.emoji, '🍕', 'Culture & Morale should have pizza emoji');
});

// Summary
console.log('\n' + '═'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
