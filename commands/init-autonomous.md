# Initialize Autonomous Claude Project

Comprehensive project initialization with guided feature selection.

---

## Overview

This command configures a project with modular autonomous Claude capabilities. It guides users through:
1. Security level selection (10 levels)
2. Core autonomous features (8 features)
3. Scope system configuration (6 scopes)
4. Orchestration modes (4 modes)
5. Claude personalities (13 styles)
6. Project templates (35 types)
7. Swarm configuration (40 manager domains)
8. Quality enforcement options
9. Module installation

---

## Instructions

### Step 1: Create Project Structure

```bash
mkdir -p .claude/config .claude/logs .claude/backups .claude/diffs .claude/rules
```

### Step 2: Security Level Selection

Use AskUserQuestion:

**Header:** "Security"
**Question:** "What security level would you like for this project?"
**MultiSelect:** false
**Options:**

1. **👤 asuser (Recommended)** - Local user access with git requirement. Balanced security for most projects.
2. **🔒 jailed** - Maximum restriction. Project-only access. For untrusted code review.
3. **📦 sandbox** - Extended dev tools with aggressive backup. Safe experimentation.
4. **🎮 playground** - All safe system tools. No destructive operations allowed.

If user selects "Other", offer advanced levels:

**Header:** "Advanced Security"
**Question:** "Select an advanced security level:"
**Options:**

1. **👤🌐 asuserremote** - Local + remote access (SSH, UART). For infrastructure work.
2. **🔑 asroot** - Full local sudo access. For system administration tasks.
3. **🔑🌐 asrootremote** - Full local + remote sudo. Critical operations.
4. **🎸 BACKSTAGEPASS** - Near-full access with soft-delete protection. Power users.
5. **🎤 ALLACCESSPASS** - Unrestricted access. Complete trust.
6. **⚡ INSERTDIETYHERE** - Omnipotent. No restrictions whatsoever. FOR TRUE BELIEVERS.

### Step 3: Core Features Selection

Use AskUserQuestion:

**Header:** "Core Features"
**Question:** "Which core autonomous features would you like enabled?"
**MultiSelect:** true
**Options:**

1. **Auto Git Commits (Recommended)** - Commit after each logical unit of work. Atomic change tracking.
2. **Auto Backups (Recommended)** - Create backups before any file modification. Safety net for changes.
3. **Session Logging** - Activity logs in `.claude/logs/`. Audit trail and debugging.
4. **Diff Tracking** - Generate diffs for all changes in `.claude/diffs/`. Change documentation.

### Step 4: Developer Experience Features

Use AskUserQuestion:

**Header:** "Dev Experience"
**Question:** "Which developer experience features would you like?"
**MultiSelect:** true
**Options:**

1. **Auto Linting (Recommended)** - Automatically lint files after edits. Consistent code style.
2. **Path Sanitization** - Mask sensitive paths in output. Privacy protection.
3. **Smart Context** - Intelligent context loading based on task. Memory optimization.
4. **Interactive Mode** - Ask clarifying questions before major changes. Safer execution.

### Step 4.5: Scope System Configuration

Use AskUserQuestion:

**Header:** "Scope System"
**Question:** "Would you like to enable the dynamic scope system?"
**MultiSelect:** false
**Options:**

1. **Yes (Recommended)** - Enable `/scope` command with 6 operational modes and auto-detection.
2. **No** - Skip scope system, use default behavior.

If enabled, configure default scope:

**Header:** "Default Scope"
**Question:** "What should be the default scope for this project?"
**MultiSelect:** false
**Options:**

1. **🔧 Engineer (Recommended)** - Software development, building, coding, debugging.
2. **💼 Business** - Strategy, planning, growth, metrics.
3. **🎨 Creative** - Design, content creation, branding, UX.
4. **🎯 Consultant** - Industry-specific advice and best practices.
5. **⚙️ Operations** - Deployment, monitoring, incident response.
6. **👑 Director** - Multi-team orchestration, complex coordination.

**Scope Features:**
- Auto-detection from file types, branch names, keywords
- Industry variants for Consultant scope (healthcare, fintech, etc.)
- Hybrid combinations (e.g., `engineer+consultant:fintech`)
- Invoked via `/scope {type}` or `/scope {type}+{type}`

---

### Step 5: Orchestration Mode Selection

Use AskUserQuestion:

**Header:** "Orchestration"
**Question:** "Which orchestration modes would you like enabled?"
**MultiSelect:** true
**Options:**

1. **Director Mode (Recommended)** - Enable sub-agent delegation for complex tasks. Parallel execution.
2. **Swarm Mode** - Full enterprise multi-agent teams with 40 manager domains and 200+ IC roles.
3. **Structured SDLC** - Phased workflow (Discovery → Design → Development → Delivery) with sign-off gates.
4. **100% and 100%** - Require 100% code coverage AND 100% tests passing before PR creation.

### Step 6: Industry Selection (Optional)

Use AskUserQuestion:

**Header:** "Industry"
**Question:** "Would you like to use an industry-optimized configuration?"
**MultiSelect:** false
**Options:**

1. **None (Custom)** - Configure domains manually or use generic presets.
2. **SaaS/B2B** - Multi-tenant platforms, subscription models (15 managers).
3. **Fintech** - Regulatory compliance, payments, security (18 managers).
4. **E-commerce** - Conversion, inventory, fulfillment (16 managers).

If user selects "Other", offer more industries:

**Header:** "More Industries"
**Question:** "Select your industry:"
**Options:**

1. **Healthcare** - HIPAA, data privacy, interoperability (17 managers).
2. **Enterprise** - Large-scale systems, integration (20 managers).
3. **Gaming** - Real-time, performance, engagement (14 managers).
4. **AI/ML** - Model development, MLOps (12 managers).

Additional industries available: Agency, Startup, Government, Media, IoT, Marketplace, EdTech.

### Step 7: Swarm Configuration (If Swarm Mode Enabled and No Industry)

If user enabled Swarm Mode and didn't select an industry, ask:

**Header:** "Swarm Preset"
**Question:** "Which swarm configuration preset would you like?"
**MultiSelect:** false
**Options:**

1. **Minimal (5 Managers)** - Discovery, Architecture, Frontend, Backend, QA. Good for small teams.
2. **Standard (12 Managers)** - Minimal + Product, Design, Docs, DevOps, Security, Integration, Ops.
3. **Enterprise (20 Managers)** - Standard + Infrastructure, Customer Success, Data, Analytics, Platform, Research, Performance, Observability.
4. **Full (40 Managers)** - All 40 manager domains with 200+ IC roles. Maximum capability.

If user wants custom selection, offer domain picker:

**Header:** "Custom Domains"
**Question:** "Select specific manager domains to enable:"
**MultiSelect:** true
**Options (show in groups):**

**Core Development:**
1. Discovery & Requirements - Requirements, needs analysis, research
2. Product & Strategy - Planning, product design, forward tech, executive advisors
3. Architecture - App architecture, solutions, ML/LLM, data, security, enterprise, cloud
4. Design (UX/UI) - Customer, internal, vendor UX/UI, research, design systems, accessibility

**Development:**
5. Frontend Development - B2C, internal, vendor, performance, state management, components, mobile
6. Backend Development - Backend, branch engineering, API, database, jobs, search, caching, real-time
7. Integration - Customer, business integration, API gateway, ETL, webhooks, legacy, third-party
8. Operations - Biz/revenue ops, marketing, sales, email/comms, analytics, billing

**Quality & Delivery:**
9. Quality Assurance - Dev QA, internal/customer regression, performance, security testing, automation
10. Release & DevOps - CI/CD, IaC, deployment, release coordination, feature flags, rollback
11. Documentation - Customer user/admin/tech docs, internal user/dev docs, API docs, tutorials
12. Infrastructure - Data center, systems infra, storage, network, containers, observability, SRE

**Customer & Research:**
13. Customer Success - CSM, forward deployed engineer, onboarding, support, feedback, churn prevention
14. Research - Principal research, applied research, research engineering, data science, innovation lab
15. Culture & Morale - Pizza guy, team events, recognition, wellness, communications
16. Security - AppSec, InfraSec, SecOps, compliance, incident response, awareness, threat intel, IAM

**Data & Analytics:**
17. Data Management - Governance, quality, MDM, privacy, catalog, lineage
18. Analytics & BI - BI, visualization, reporting, self-service, embedded
19. Platform Engineering - Platform, DevEx, tooling, reliability, self-service infra

**Specialized:**
20. Mobile Development - iOS, Android, React Native/Flutter, mobile DevOps
21. AI/ML Engineering - ML platform, training, serving, MLOps, AI safety
22. Performance Engineering - Load testing, APM, DB performance, CDN
23. Accessibility - WCAG, assistive tech, a11y testing
24. Internationalization - i18n engineering, translation, cultural adaptation, RTL
25. Content Management - CMS dev, content modeling, media, workflow
26. E-commerce - Catalog, cart, checkout, orders, inventory
27. Payments - Gateway, fraud, reconciliation, PCI
28. Communications - Email, SMS/push, in-app, preferences
29. Workflow Automation - Workflow engine, rules, approvals, BPM
30. Legal & Compliance - Privacy engineering, terms, audit trail, compliance reporting
31. Vendor Management - Evaluation, contracts, integration
32. Technical Writing - Doc writer, API writer, tutorials, knowledge base
33. Training & Enablement - Course dev, LMS, certification, delivery
34. Community - DevRel, engagement, open source, events
35. Support Operations - Ticketing, KB, chatbot, escalation
36. Growth Engineering - Onboarding, referrals, viral loops, retention
37. Experimentation - Platform, feature experiments, stats, reporting
38. Observability - Metrics, logging, tracing, alerting, dashboards
39. Chaos Engineering - Experiments, game days, failure injection
40. Cost Optimization - Cloud cost, reserved capacity, spot, allocation

### Step 8: Lightweight Teams (Parallel Agents)

If Director Mode is enabled:

Use AskUserQuestion:

**Header:** "Teams"
**Question:** "Which lightweight team presets would you like available?"
**MultiSelect:** true
**Options:**

1. **Full-Stack Team (Recommended)** - Frontend, Backend, Database, API agents in parallel
2. **Quality Team** - Unit, Integration, E2E Testers + Coverage Analyzer
3. **Security Review Team** - AppSec Auditor, Dependency Scanner, Threat Modeler
4. **Code Review Team** - Style, Logic, Security, Performance Reviewers

Additional teams available: docs, refactor, performance, migration, devops, api, frontend, backend, data, debug, plan

Teams are invoked via `/team {type}` (e.g., `/team fullstack`, `/team security`)

**Note:** Teams require only `directorMode` - they work WITHOUT full swarm mode!

### Step 8.5: Specialized Claudes (Expert Consultants)

Use AskUserQuestion:

**Header:** "Consultants"
**Question:** "Enable specialized Claude consultant personas?"
**MultiSelect:** false
**Options:**

1. **Yes (Recommended)** - Enable `/consult {role}` for 36 expert consultants.
2. **No** - Skip specialized personas.

If enabled, consultants are available via `/consult {role}`:
- Technical: security, performance, database, devops, frontend, backend, cloud, data, ml, api, testing, integration
- Business: product, docs, ux-research, growth, compliance, finops, hiring, lead
- Domain: fintech, healthcare, gaming, iot, ecommerce, enterprise, startup, government
- Meta: reviewer, refactor, debug, migrate

**Note:** Consultants require only `directorMode` - they work WITHOUT full swarm mode!

### Step 8.6: Claude Personalities (Interaction Styles)

Use AskUserQuestion:

**Header:** "Personalities"
**Question:** "Enable Claude personality system for specialized interaction styles?"
**MultiSelect:** false
**Options:**

1. **Yes (Recommended)** - Enable `/persona {type}` for 13 unique interaction styles.
2. **No** - Skip personality system.

If enabled, personalities are available via `/persona {type}`:

| Personality | Emoji | Best For |
|-------------|-------|----------|
| mentor | 🎓 | Teaching, onboarding, understanding |
| devil | 😈 | Design reviews, risk assessment |
| rubber-duck | 🦆 | Debugging, thinking through problems |
| archaeologist | 🏛️ | Legacy code, modernization |
| security | 🔐 | Security reviews, threat modeling |
| performance | ⚡ | Optimization, profiling |
| pair-programmer | 👥 | Collaborative coding sessions |
| data | 📊 | ETL, data quality, pipelines |
| accessibility | ♿ | WCAG compliance, a11y audits |
| api-designer | 🔌 | REST/GraphQL design, OpenAPI |
| interviewer | 🎤 | Mock interviews, rubric design |
| chaos | 💥 | Resilience testing, failure modes |
| ai-ml | 🤖 | ML pipelines, MLOps |

**Key Distinction:** Personalities define *how* Claude interacts (style), while Consultants define *what* domain knowledge Claude has (expertise).

**Combinations:**
```bash
/scope engineer+persona:mentor          # Teaching while coding
/scope consultant:healthcare+persona:security  # Healthcare security expert
```

**Note:** Personalities require only `directorMode` - they work WITHOUT full swarm mode!

### Step 8.7: Project Templates

Use AskUserQuestion:

**Header:** "Templates"
**Question:** "Enable project templates for scaffolding new projects?"
**MultiSelect:** false
**Options:**

1. **Yes (Recommended)** - Enable `/start-project` with 35 project types.
2. **No** - Skip project templates.

If enabled, templates are available via `/start-project {type}`:

**Categories (35 types):**

| Category | Types | Count |
|----------|-------|-------|
| Software Development | cli_tool, gui_tool, web_app, system_service, full_stack, enterprise_stack | 6 |
| Security & Cryptography | pen_test, backdoor_finder, obfuscation, secure_encrypt/decrypt/transport, post_quantum_* | 12 |
| Business Systems | crm, erp, pos, retail_ops, hotel_ops/res/billing, cannabis_seed_to_sale | 8 |
| Infrastructure | data_center, systems_audit | 2 |
| SDLC Methodologies | waterfall, agile, xtreme, 10xdev, theaiway | 5 |
| Documentation | documentation | 1 |
| AI-Assisted | human_to_claude_hours, provide_prompts, do_it_for_me | 3 |

**Variants:** Each template has "new" and "change_request" variants.

**Phases:** Discovery → Design → Development → Delivery

**Note:** Templates auto-configure swarm presets based on complexity.

---

### Step 9: Parallel Model Selection (If Director Mode Enabled)

If user enabled Director Mode:

**Header:** "Parallel Models"
**Question:** "Which parallel agent models would you like available?"
**MultiSelect:** true
**Options:**

1. **Peer Review Pipeline** - Author → Reviewer → Approver for high-quality code
2. **Adversarial Testing** - Builder vs Breaker for security-critical code
3. **Parallel Specialists** - Frontend/Backend/DB/Docs in parallel for full-stack features
4. **Evolution/Iteration** - v1 → v2 → v3 for algorithm optimization
5. **Debate/Consensus** - Multiple approaches → Moderator synthesis for architecture decisions
6. **Red Team/Blue Team** - Defenders vs Attackers for security audits
7. **Assembly Line** - Parse → Transform → Validate → Test → Doc for batch processing

### Step 10: Apply Configuration

After gathering preferences, apply the configuration:

#### 10.1 Set Sandbox Level
```bash
echo "{selected_level}" > .claude/sandbox-level
```

#### 10.2 Create Features Config
```bash
cat > .claude/config/features.json << 'EOF'
{
  "sandboxLevel": "{selected_level}",
  "logging": {true|false},
  "autoBackups": {true|false},
  "autoGitCommits": {true|false},
  "diffTracking": {true|false},
  "autoLinting": {true|false},
  "pathSanitization": {true|false},
  "smartContext": {true|false},
  "interactiveMode": {true|false},
  "scopeSystem": {true|false},
  "defaultScope": "{engineer|business|creative|consultant|operations|director}",
  "autoDetectScope": {true|false},
  "directorMode": {true|false},
  "swarmMode": {true|false},
  "structuredSdlc": {true|false},
  "hundredAndHundred": {true|false},
  "specializedClaudes": {true|false},
  "claudePersonalities": {true|false},
  "projectTemplates": {true|false},
  "lightweightTeams": ["{list of enabled teams}"],
  "industryPreset": "{preset|null}",
  "swarmPreset": "{preset}",
  "swarmDomains": ["{list of enabled domains}"],
  "parallelModels": ["{list of enabled models}"]
}
EOF
```

#### 10.3 Copy Enabled Modules
Based on selections, copy appropriate modules to `.claude/rules/`:

| Feature | Source | Action |
|---------|--------|--------|
| Always | `~/.claude/modules/core/CLAUDE.core.md` | Copy as base |
| Always | `~/.claude/modules/bootstrap.md` | Copy to rules |
| scopeSystem | `~/.claude/modules/scope-system.md` | Copy to rules |
| directorMode | `~/.claude/modules/director-pattern.md` | Copy to rules |
| directorMode | `~/.claude/modules/parallel-models.md` | Copy to rules |
| directorMode | `~/.claude/modules/lightweight-teams.md` | Copy to rules |
| directorMode | `~/.claude/modules/specialized-claudes.md` | Copy to rules |
| claudePersonalities | `~/.claude/modules/claude-personalities.md` | Copy to rules |
| projectTemplates | `~/.claude/modules/project-templates.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/architecture.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/swarm-director.md` | Copy to rules |
| swarmMode | `~/.claude/modules/swarm/ic-prompts.md` | Copy to rules |
| structuredSdlc | `~/.claude/modules/sdlc-workflow.md` | Copy to rules |
| industryPreset | `~/.claude/modules/industries/presets.md` | Copy to rules |

### Step 11: Create Project CLAUDE.md

Generate a minimal project-specific CLAUDE.md:

```markdown
# {Project Name}

## Overview
{Brief description of the project}

## Tech Stack
{List of technologies used}

## Commands
```bash
# Build
{build_command}

# Test
{test_command}

# Lint
{lint_command}
```

## Configuration

**Security Level:** {selected_level} {emoji}
**Sandbox:** {description}

### Enabled Features
{For each enabled feature, list with checkbox:}
- ✅ Auto Git Commits
- ✅ Auto Backups
- ✅ Session Logging
- ✅ Diff Tracking
- ⬜ Swarm Mode (disabled)
{etc.}

### Swarm Configuration
{If swarm enabled:}
**Preset:** {preset_name}
**Managers:** {count}
**ICs:** {count}

{List enabled domains}

---

*Inherits from ~/.claude/modules/core/CLAUDE.core.md*
*Features configured in .claude/config/features.json*
```

### Step 12: Success Report

Present the completed configuration:

```
╔══════════════════════════════════════════════════════════════╗
║              PROJECT INITIALIZED SUCCESSFULLY                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Security Level: {level} {emoji}                             ║
║                                                              ║
║  Core Features:                                              ║
║    ✅ Auto Git Commits                                       ║
║    ✅ Auto Backups                                           ║
║    ✅ Session Logging                                        ║
║    ✅ Diff Tracking                                          ║
║    {etc.}                                                    ║
║                                                              ║
║  Scope System:                                               ║
║    {✅|⬜} Scope System (6 scopes)                            ║
║    Default: {scope} {emoji}                                  ║
║    Auto-detect: {✅|⬜}                                       ║
║                                                              ║
║  Orchestration:                                              ║
║    {✅|⬜} Director Mode                                      ║
║    {✅|⬜} Swarm Mode ({preset})                              ║
║    {✅|⬜} Structured SDLC                                    ║
║    {✅|⬜} 100% and 100%                                      ║
║    {✅|⬜} Specialized Claudes (36 consultants)               ║
║    {✅|⬜} Claude Personalities (13 styles)                   ║
║    {✅|⬜} Project Templates (35 types)                       ║
║                                                              ║
║  {If Industry selected:}                                     ║
║  Industry Configuration:                                     ║
║    Industry: {industry}                                      ║
║    Managers: {count}                                         ║
║    Key Focus: {focus areas}                                  ║
║                                                              ║
║  {If Swarm enabled without industry:}                        ║
║  Swarm Configuration:                                        ║
║    Preset: {preset}                                          ║
║    Managers: {count}                                         ║
║    ICs: {count}                                              ║
║                                                              ║
║  Files Created:                                              ║
║    .claude/config/features.json                              ║
║    .claude/sandbox-level                                     ║
║    .claude/rules/*.md                                        ║
║    CLAUDE.md                                                 ║
║                                                              ║
║  Available Commands:                                         ║
║    /commit  - Auto-commit current changes                    ║
║    /pr      - Create pull request                            ║
║    /ship    - Commit → Push → PR                             ║
║    /review  - Code review changes                            ║
║    /status  - Session status                                 ║
║    /sandbox - Change security level                          ║
║    {/scope {type} - Switch operational scope (scopeSystem)}  ║
║    {/persona {type} - Interaction style (personalities)}     ║
║    {/start-project {type} - Project scaffold (templates)}    ║
║    {/team {type} - Parallel team (directorMode)}             ║
║    {/consult {role} - Expert consultant (directorMode)}      ║
║    {/swarm  - Full hierarchy (swarmMode)}                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Complete Security Levels Reference

| Level | Emoji | Risk | Access | Git Required |
|-------|-------|------|--------|--------------|
| `jailed` | 🔒 | Minimal | Project only | No |
| `sandbox` | 📦 | Low | + Dev tools | No |
| `playground` | 🎮 | Low | All safe tools | No |
| `asuser` | 👤 | Moderate | Local user | Yes |
| `asuserremote` | 👤🌐 | Moderate-High | + SSH/UART | Yes |
| `asroot` | 🔑 | High | + sudo | Yes |
| `asrootremote` | 🔑🌐 | Critical | + remote sudo | Yes |
| `BACKSTAGEPASS` | 🎸 | Extreme | Near-full | Yes |
| `ALLACCESSPASS` | 🎤 | Maximum | Unrestricted | Yes |
| `INSERTDIETYHERE` | ⚡ | Divine | Omnipotent | Yes |

---

## Complete Feature Reference

### Core Features

| Feature | Default | Description |
|---------|---------|-------------|
| `logging` | ✅ On | Session activity logs in `.claude/logs/` |
| `autoBackups` | ✅ On | Backup files before modification |
| `autoGitCommits` | ✅ On | Commit after each logical unit of work |
| `diffTracking` | ✅ On | Generate diffs in `.claude/diffs/` |

### Developer Experience

| Feature | Default | Description |
|---------|---------|-------------|
| `autoLinting` | ✅ On | Automatic linting after file edits |
| `pathSanitization` | ✅ On | Mask sensitive paths in output |
| `smartContext` | ⬜ Off | Intelligent context loading |
| `interactiveMode` | ⬜ Off | Ask before major changes |

### Scope System

| Feature | Default | Description |
|---------|---------|-------------|
| `scopeSystem` | ✅ On | Enable dynamic scope switching |
| `defaultScope` | engineer | Default operational scope |
| `autoDetectScope` | ✅ On | Auto-detect from context |

### Orchestration

| Feature | Default | Description |
|---------|---------|-------------|
| `directorMode` | ✅ On | Enable sub-agent delegation |
| `swarmMode` | ⬜ Off | Enterprise multi-agent teams |
| `structuredSdlc` | ⬜ Off | Phased workflow with gates |
| `hundredAndHundred` | ⬜ Off | 100% coverage, 100% passing |
| `specializedClaudes` | ✅ On | 36 expert consultant personas |
| `claudePersonalities` | ✅ On | 13 interaction style personas |
| `projectTemplates` | ✅ On | 35 project scaffolding types |
| `industryPreset` | ⬜ null | Industry-specific configuration |

---

## Swarm Presets Reference

### Minimal (5 Managers)
- Discovery & Requirements
- Architecture
- Frontend Development
- Backend Development
- Quality Assurance

### Standard (12 Managers)
- All Minimal (5)
- Product & Strategy
- Design (UX/UI)
- Documentation
- Release & DevOps
- Security
- Integration
- Operations

### Enterprise (20 Managers)
- All Standard (12)
- Infrastructure
- Customer Success
- Data Management
- Analytics & BI
- Platform Engineering
- Research
- Performance Engineering
- Observability

### Full (40 Managers)
All 40 manager domains with 200+ IC roles.

---

## Parallel Models Reference

| Model | Best For |
|-------|----------|
| Peer Review Pipeline | High-quality code with multiple perspectives |
| Adversarial Testing | Security-critical code, edge cases |
| Parallel Specialists | Full-stack features, multiple domains |
| Evolution/Iteration | Complex algorithms, optimization |
| Debate/Consensus | Architecture decisions, design choices |
| Red Team/Blue Team | Security audits, pen testing |
| Assembly Line | Batch processing, migrations |

---

## Industry Presets Reference

| Industry | Managers | Key Focus Areas |
|----------|----------|-----------------|
| SaaS/B2B | 15 | Multi-tenant, subscriptions, SSO |
| Fintech | 18 | Compliance, payments, fraud |
| E-commerce | 16 | Catalog, checkout, inventory |
| Healthcare | 17 | HIPAA, PHI, interoperability |
| Enterprise | 20 | Integration, governance, scale |
| Gaming | 14 | Real-time, performance, engagement |
| AI/ML | 12 | MLOps, training, serving |
| Agency | 12 | Design systems, multi-brand |
| Startup | 8 | MVP, iteration, growth |
| Government | 16 | FedRAMP, accessibility, audit |
| Media | 14 | CMS, streaming, monetization |
| IoT | 15 | Device management, edge, protocols |
| Marketplace | 16 | Trust/safety, escrow, search |
| EdTech | 14 | LMS, assessment, engagement |

---

## Specialized Claudes Reference

| Category | Count | Examples |
|----------|-------|----------|
| Technical Specialists | 12 | security, performance, database, devops, cloud, ml |
| Business/Strategy | 8 | product, docs, growth, compliance, finops, lead |
| Domain Specialists | 12 | fintech, healthcare, gaming, iot, enterprise |
| Meta Specialists | 4 | reviewer, refactor, debug, migrate |

**Total: 36 expert consultant personas**

Invoke via: `/consult {role}` (e.g., `/consult security`, `/consult fintech`)

---

## Lightweight Teams Reference

| Team | Agents | Best For |
|------|--------|----------|
| fullstack | Frontend, Backend, Database, API | Feature development |
| security | AppSec, Scanner, Threat Modeler | Security reviews |
| quality | Unit, Integration, E2E, Coverage | Test coverage |
| review | Style, Logic, Security, Performance | PR reviews |
| docs | API, Tutorial, README, Changelog | Documentation |
| refactor | Smell Detector, Designer, Tester | Code improvement |
| performance | Profiler, Analyzer, Optimizer | Performance work |
| migration | Checker, Script Writer, Validator | Upgrades |
| devops | CI/CD, Docker, IaC, Monitoring | Infrastructure |
| api | Designer, Schema, Docs, SDK | API development |
| frontend | Component, State, Style, A11y | UI work |
| backend | Service, Database, Queue, Cache | Server work |
| data | Schema, Query, Migration, Seed | Database work |
| debug | Log Analyzer, Parser, Reproducer | Bug hunting |
| plan | Requirements, Architecture, Tasks | Planning |

**Total: 15 pre-configured teams**

Invoke via: `/team {type}` (e.g., `/team fullstack`, `/team security`)

**Note:** Teams work with `directorMode` only - no swarm required!

---

## Scope System Reference

| Scope | Emoji | Purpose | Trigger Keywords |
|-------|-------|---------|------------------|
| Engineer | 🔧 | Software development | build, code, implement, debug, refactor |
| Business | 💼 | Strategy & growth | strategy, roadmap, prioritize, metrics |
| Creative | 🎨 | Design & content | design, content, write, brand, UX |
| Consultant | 🎯 | Industry advice | advise, recommend, best practice |
| Operations | ⚙️ | Run systems | deploy, monitor, incident, scale |
| Director | 👑 | Orchestrate teams | orchestrate, coordinate, swarm, teams |

**Consultant Industry Variants:**
- `consultant:healthcare` - HIPAA, EHR/EMR, PHI
- `consultant:fintech` - PCI, payments, fraud
- `consultant:ecommerce` - Catalog, checkout, inventory
- `consultant:saas` - Multi-tenant, subscriptions, SSO
- `consultant:manufacturing` - MES, supply chain, IoT
- `consultant:cannabis` - Seed-to-sale, compliance
- `consultant:hospitality` - PMS, reservations, billing
- `consultant:realestate` - MLS, listings, transactions

**Hybrid Examples:**
```bash
/scope engineer+consultant:fintech    # FinTech developer
/scope business+creative              # Product launch
/scope director+consultant:healthcare # Healthcare transformation
```

Invoke via: `/scope {type}` or `/scope {type}+{variant}`

---

## Claude Personalities Reference

| Personality | Emoji | Purpose | When to Use |
|-------------|-------|---------|-------------|
| mentor | 🎓 | Teaching & growth | Learning, onboarding, understanding |
| devil | 😈 | Critical analysis | Design reviews, risk assessment |
| rubber-duck | 🦆 | Problem solving | Debugging, decision paralysis |
| archaeologist | 🏛️ | Legacy code | Modernization, joining projects |
| security | 🔐 | Security focus | Code review, threat modeling |
| performance | ⚡ | Optimization | Bottleneck analysis, profiling |
| pair-programmer | 👥 | Collaboration | Real-time coding, implementations |
| data | 📊 | Data engineering | ETL, pipelines, schema design |
| accessibility | ♿ | A11y audits | WCAG compliance, inclusive design |
| api-designer | 🔌 | Interface design | REST/GraphQL, OpenAPI |
| interviewer | 🎤 | Tech interviews | Mock interviews, rubric design |
| chaos | 💥 | Resilience | Failure injection, game days |
| ai-ml | 🤖 | Machine learning | ML pipelines, MLOps |

**Total: 13 unique interaction styles**

**Key Distinction:**
- **Personalities** = *How* Claude interacts (style)
- **Consultants** = *What* knowledge Claude has (domain)
- **Scopes** = *What* mode Claude operates in (capabilities)

Invoke via: `/persona {type}` (e.g., `/persona mentor`, `/persona security`)

---

## Project Templates Reference

| Category | Templates | Count |
|----------|-----------|-------|
| Software Development | cli_tool, gui_tool, web_app, system_service, full_stack_product, enterprise_stack_product | 6 |
| Security & Crypto | penetration_test, back_door_injection, back_door_finder, obfuscation_tool, secure_encrypt, secure_decrypt, secure_transport, post_quantum_encrypt/decrypt/transport/local_device/remote_device | 12 |
| Business Systems | crm, erp, pos, retail_ops, hotel_ops, hotel_res, hotel_billing, cannabis_seed_to_sale | 8 |
| Infrastructure | data_center, systems_audit | 2 |
| SDLC Methodologies | sdlc_waterfall, sdlc_agile, sdlc_xtreme, sdlc_10xdev, sdlc_theaiway | 5 |
| Documentation | documentation | 1 |
| AI-Assisted | human_hours_to_claude_hours, provide_prompts_for_need, do_it_for_me_claude | 3 |

**Total: 35 project types**

**Phases:**
1. Discovery - Requirements, scope, risk assessment
2. Design - Architecture, UI/UX, specifications
3. Development - Implementation, testing, code review
4. Delivery - QA, documentation, deployment

**Variants:**
- `new` - Full discovery, greenfield implementation
- `change_request` - Impact analysis, targeted modifications

Invoke via: `/start-project {type}` or `/start-project {type} --variant cr`
