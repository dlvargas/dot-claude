# dot-claude

> The ultimate autonomous Claude Code configuration system with hierarchical multi-agent orchestration, 40+ manager domains, 200+ specialized ICs, and enterprise-grade security controls.

[![Tests](https://img.shields.io/badge/tests-43%2F43%20passing-brightgreen)](#testing)
[![Sandbox Levels](https://img.shields.io/badge/sandbox%20levels-10-blue)](#sandbox-security-levels)
[![Agents](https://img.shields.io/badge/agents-240%2B-purple)](#agent-architecture)

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features at a Glance](#features-at-a-glance)
- [Installation](#installation)
- [Commands Reference](#commands-reference)
- [Sandbox Security Levels](#sandbox-security-levels)
- [Agent Architecture](#agent-architecture)
  - [Scopes](#scopes-6)
  - [Personalities](#personalities-13)
  - [Consultants](#consultants-36)
  - [Lightweight Teams](#lightweight-teams-15)
  - [Parallel Models](#parallel-models-7)
  - [Full Swarm](#full-swarm-40-managers--200-ics)
- [Industry Presets](#industry-presets-14)
- [Project Templates](#project-templates-35)
- [SDLC Workflow](#sdlc-workflow)
- [Module System](#module-system)
- [Testing](#testing)
- [File Structure](#file-structure)
- [Configuration](#configuration)
- [License](#license)

---

## Overview

dot-claude transforms Claude Code into a fully autonomous development system capable of:

- **Self-directed development** with minimal human intervention
- **Hierarchical team orchestration** with managers and specialized ICs
- **Industry-specific configurations** for SaaS, Fintech, Healthcare, and more
- **Granular security controls** from maximum restriction to full access
- **Phased SDLC workflows** with artifact gates and sign-offs

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTONOMOUS CLAUDE SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│ ORCHESTRATION                                                   │
│ ├── Swarm Mode: 40 Managers + 200+ ICs                         │
│ ├── 15 Lightweight Teams (fullstack, security, quality...)     │
│ └── 7 Parallel Models (peer review, adversarial, debate...)    │
├─────────────────────────────────────────────────────────────────┤
│ SPECIALIZATION                                                  │
│ ├── 13 Personalities (/persona)                                │
│ ├── 36 Expert Consultants (/consult)                           │
│ ├── 32 Industry Presets (including 18 Automotive)              │
│ └── 6 Dynamic Scopes (/scope)                                  │
├─────────────────────────────────────────────────────────────────┤
│ PROJECT SETUP                                                   │
│ ├── 35 Project Templates (/start-project)                      │
│ └── 4-Phase SDLC with Gates                                    │
├─────────────────────────────────────────────────────────────────┤
│ SECURITY                                                        │
│ └── 10 Sandbox Levels (jailed → INSERTDIETYHERE)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/damienheiser/dot-claude.git
cd dot-claude

# Install globally
cp -r commands scripts skills rules modules ~/.claude/
cp CLAUDE.core.md ~/.claude/CLAUDE.md

# Initialize a project
cd your-project
/init-autonomous
```

---

## Features at a Glance

| Feature | Count | Command | Description |
|---------|-------|---------|-------------|
| Scopes | 6 | `/scope {type}` | Dynamic operational modes |
| Personalities | 13 | `/persona {type}` | Interaction styles (Devil's Advocate, Mentor...) |
| Consultants | 36 | `/consult {role}` | Expert domain consultants |
| Teams | 15 | `/team {type}` | Pre-configured parallel teams |
| Parallel Models | 7 | Config | Alternative agent architectures |
| Project Templates | 35 | `/start-project {type}` | Guided project scaffolding |
| Industry Presets | 32 | `/init-autonomous` | Vertical-specific configurations |
| Managers | 40 | `/swarm` | Hierarchical team managers |
| ICs | 200+ | `/swarm` | Specialized individual contributors |
| Sandbox Levels | 10 | `/sandbox {level}` | Security access controls |

---

## Installation

### Global Installation (Recommended)

```bash
# Backup existing config
cp -r ~/.claude ~/.claude.backup 2>/dev/null

# Install from source
git clone https://github.com/damienheiser/dot-claude.git
cd dot-claude

# Deploy to global config
cp -r commands scripts skills rules modules ~/.claude/
cp CLAUDE.core.md ~/.claude/CLAUDE.md
```

### Per-Project Installation

```bash
cd your-project
mkdir -p .claude

# Copy from global
cp -r ~/.claude/{commands,scripts,skills,rules,modules} .claude/

# Or use the init command
/init-autonomous
```

### Automated Install Script

```bash
./scripts/install.sh
```

---

## Commands Reference

### Core Commands

| Command | Description |
|---------|-------------|
| `/commit` | Auto-commit with semantic message |
| `/pr` | Create pull request with comprehensive description |
| `/ship` | Full workflow: commit → push → PR |
| `/review` | Code review on changes or PR |
| `/status` | Display session and project status |

### Autonomous Commands

| Command | Description |
|---------|-------------|
| `/autonomous` | Enable maximum autonomy mode |
| `/init-autonomous` | Set up project with full configuration |
| `/clone-setup` | Clone repo and initialize autonomous config |

### Agent Commands

| Command | Description |
|---------|-------------|
| `/scope {type}` | Switch operational scope |
| `/persona {type}` | Activate personality mode |
| `/consult {role}` | Get expert consultation |
| `/team {type}` | Spawn parallel team |
| `/swarm` | Full hierarchical swarm orchestration |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `/sandbox {level}` | Set security sandbox level |
| `/start-project {type}` | Initialize from project template |

---

## Sandbox Security Levels

10 security levels from maximum restriction to unlimited access:

| Level | Access | Sanitization | Git Required | Remote | Description |
|-------|--------|--------------|--------------|--------|-------------|
| `jailed` | Project only | Aggressive | No | No | Maximum restriction. Untrusted code. |
| `sandbox` | + Dev tools | Aggressive | No | No | Safe experimentation with backups. |
| `playground` | + All safe | Moderate | No | No | All safe tools, no destructive ops. |
| `asuser` | + Home | Moderate | Yes | No | **Default.** Balanced for development. |
| `asuserremote` | + SSH/UART | Light | Yes | Yes | Infrastructure and remote work. |
| `asroot` | + sudo | Light | Yes | No | System administration tasks. |
| `asrootremote` | + remote sudo | Light | Yes | Yes | Critical remote operations. |
| `BACKSTAGEPASS` | Near-full | Users only | Yes | Yes | Power users. Soft-delete protection. |
| `ALLACCESSPASS` | Unrestricted | Users only | Yes | Yes | Complete trust. Full access. |
| `INSERTDIETYHERE` | Omnipotent | None | No | Yes | No restrictions. FOR TRUE BELIEVERS. |

### Automatic Behaviors (All Levels)

- **Backup before modify** - Every file change is backed up
- **Diff tracking** - All changes generate diffs in `.claude/diffs/`
- **Session directory** - Backups in `.claude/sessions/{date}_{id}/`
- **Path sanitization** - Real paths hidden from Claude

### Always Blocked (Even at ALLACCESSPASS)

```bash
rm -rf /
rm -rf /*
dd if=/dev/zero of=/dev/sda
# Other system-critical disk wipes
```

### Changing Levels

```bash
# Via command
/sandbox asuser

# Via environment
export CLAUDE_SANDBOX_LEVEL=asroot

# Via file
echo "sandbox" > .claude/sandbox-level
```

---

## Agent Architecture

### Scopes (6)

Dynamic operational modes that define Claude's focus and approach:

| Scope | Focus | Best For |
|-------|-------|----------|
| `engineer` | Technical implementation | Coding, debugging, architecture |
| `business` | Strategy & process | Planning, analysis, documentation |
| `creative` | Innovation & design | UI/UX, copywriting, brainstorming |
| `consultant` | Expert guidance | Reviews, audits, recommendations |
| `operations` | DevOps & infrastructure | CI/CD, deployment, monitoring |
| `director` | Orchestration | Multi-team coordination |

**Hybrid Combinations:**
```bash
/scope engineer+consultant:fintech  # Technical consultant for fintech
/scope creative+business            # Creative business strategy
```

### Personalities (13)

Interaction styles that change *how* Claude communicates:

| Personality | Emoji | Purpose | Invocation |
|-------------|-------|---------|------------|
| Mentor | 🎓 | Teaching & growth | `/persona mentor` |
| Devil's Advocate | 😈 | Critical analysis, challenge assumptions | `/persona devil` |
| Rubber Duck | 🦆 | Problem solving through explanation | `/persona duck` |
| Code Archaeologist | 🏛️ | Legacy code understanding | `/persona archaeologist` |
| Security | 🔐 | Security-focused review | `/persona security` |
| Performance | ⚡ | Optimization focus | `/persona performance` |
| Pair Programmer | 👥 | Collaborative coding | `/persona pair` |
| Data | 📊 | Data engineering focus | `/persona data` |
| Accessibility | ♿ | A11y audits and implementation | `/persona a11y` |
| API Designer | 🔌 | Interface design | `/persona api` |
| Interviewer | 🎤 | Technical interview prep | `/persona interviewer` |
| Chaos Engineer | 💥 | Resilience testing | `/persona chaos` |
| AI/ML | 🤖 | Machine learning focus | `/persona ml` |

### Consultants (36)

Expert domain consultants for specialized advice:

#### Technical Specialists (12)
| Consultant | Expertise | Invocation |
|------------|-----------|------------|
| Security Architect | Threat modeling, OWASP, zero trust | `/consult security` |
| Performance Engineer | Load testing, optimization, caching | `/consult performance` |
| Database Architect | Schema design, query optimization | `/consult database` |
| DevOps/SRE | CI/CD, containers, observability | `/consult devops` |
| Frontend Architecture | Components, state, build systems | `/consult frontend` |
| Backend Architecture | APIs, services, event-driven | `/consult backend` |
| Mobile | iOS, Android, React Native, Flutter | `/consult mobile` |
| Cloud Architecture | AWS, GCP, Azure, multi-cloud | `/consult cloud` |
| Data Engineering | Pipelines, warehouses, lakes | `/consult data` |
| ML/AI | Models, training, MLOps | `/consult ml` |
| Blockchain | Smart contracts, DeFi, consensus | `/consult blockchain` |
| Embedded/IoT | Hardware, firmware, protocols | `/consult embedded` |

#### Business/Strategy Specialists (8)
| Consultant | Focus | Invocation |
|------------|-------|------------|
| Product Manager | Roadmaps, prioritization, metrics | `/consult product` |
| Technical Writer | Documentation, APIs, tutorials | `/consult docs` |
| Growth Engineer | A/B testing, funnels, analytics | `/consult growth` |
| Compliance | GDPR, HIPAA, SOC2, PCI | `/consult compliance` |
| Accessibility | WCAG, ARIA, screen readers | `/consult a11y` |
| Internationalization | i18n, l10n, RTL, Unicode | `/consult i18n` |
| Testing Strategy | TDD, coverage, E2E, mocking | `/consult testing` |
| API Design | REST, GraphQL, gRPC, versioning | `/consult api` |

#### Domain Specialists (12)
| Consultant | Industry | Invocation |
|------------|----------|------------|
| Fintech | Payments, banking, compliance | `/consult fintech` |
| Healthcare | HIPAA, HL7, FHIR, clinical | `/consult healthcare` |
| E-commerce | Catalogs, carts, fulfillment | `/consult ecommerce` |
| Gaming | Unity, Unreal, multiplayer | `/consult gaming` |
| Real Estate | MLS, property management | `/consult realestate` |
| Education | LMS, assessments, SCORM | `/consult edtech` |
| Media | Streaming, encoding, CDN | `/consult media` |
| Social | Feeds, graphs, moderation | `/consult social` |
| Enterprise | SSO, LDAP, audit, governance | `/consult enterprise` |
| Startup | MVP, scaling, fundraising | `/consult startup` |
| IoT | Edge, sensors, protocols | `/consult iot` |
| Legal Tech | Contracts, discovery, compliance | `/consult legaltech` |

#### Meta Specialists (4)
| Consultant | Purpose | Invocation |
|------------|---------|------------|
| Code Reviewer | Quality, patterns, best practices | `/consult reviewer` |
| Refactorer | Clean code, SOLID, patterns | `/consult refactor` |
| Debugger | Root cause, debugging strategies | `/consult debug` |
| Migrator | Upgrades, rewrites, transitions | `/consult migrate` |

### Lightweight Teams (15)

Pre-configured team compositions for parallel execution:

| Team | Agents | Best For | Invocation |
|------|--------|----------|------------|
| Full-Stack | Frontend, Backend, Database, API | Feature development | `/team fullstack` |
| Security | AppSec, Scanner, Threat Modeler | Security assessments | `/team security` |
| Quality | Unit, Integration, E2E, Coverage | Test coverage | `/team quality` |
| Code Review | Style, Logic, Security, Performance | PR reviews | `/team review` |
| Documentation | API Docs, Tutorials, README, Changelog | Comprehensive docs | `/team docs` |
| DevOps | CI/CD, Infrastructure, Monitoring | Pipeline setup | `/team devops` |
| Migration | Analyzer, Transformer, Validator | Code migrations | `/team migration` |
| Performance | Profiler, Optimizer, Load Tester | Performance tuning | `/team performance` |
| Refactor | Analyzer, Restructurer, Tester | Code improvements | `/team refactor` |
| API | Designer, Implementer, Documenter | API development | `/team api` |
| Data | Modeler, Pipeline, Warehouse | Data engineering | `/team data` |
| Mobile | iOS, Android, Shared | Cross-platform | `/team mobile` |
| Accessibility | Auditor, Fixer, Tester | A11y compliance | `/team a11y` |
| i18n | Extractor, Translator, Validator | Internationalization | `/team i18n` |
| Startup | MVP, Scale, Launch | Rapid development | `/team startup` |

### Parallel Models (7)

Alternative agent architectures beyond traditional swarm:

| Model | Structure | Use Case |
|-------|-----------|----------|
| Peer Review Pipeline | Author → Reviewer → Approver | High-quality code |
| Adversarial Testing | Builder ↔ Breaker | Security-critical code |
| Parallel Specialists | Multi-domain → Integration | Full-stack features |
| Evolution/Iteration | v1 → v2 → v3 | Algorithm optimization |
| Debate/Consensus | A + B + C → Moderator | Architecture decisions |
| Red Team/Blue Team | Defenders ↔ Attackers | Security audits |
| Assembly Line | Parse → Transform → Validate | Batch processing |

### Full Swarm (40 Managers + 200+ ICs)

Enterprise-scale hierarchical orchestration:

```
                    YOU (Director)
                         │
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
 Discovery           Architecture         Development
 Manager             Manager              Manager
    │                    │                    │
  ┌─┴─┐                ┌─┴─┐                ┌─┴─┐
  IC  IC               IC  IC               IC  IC
```

#### Manager Domains (40)

| Category | Managers |
|----------|----------|
| **Discovery** | Discovery & Requirements, Principal Research, Needs Analysis |
| **Strategy** | Product & Strategy, Executive Advisors, Forward-Looking Tech |
| **Architecture** | Architecture, Solutions Architect, Application Architecture, ML/LLM |
| **Design** | Design, Customer UX/UI, Internal UX/UI, Vendor UX/UI |
| **Development** | Frontend (B2C, Internal, Vendor), Backend, Branch Engineering |
| **Integration** | Integration, Business Systems, Customer Systems |
| **Infrastructure** | Infrastructure, Data Storage, Datacenter, Systems |
| **Quality** | QA, Customer Regression, Development QA, Internal Regression |
| **Release** | Release & DevOps, CI/CD, Branch Release |
| **Documentation** | Documentation (Customer Tech, Admin, User, Internal Dev/User) |
| **Operations** | Operations, Revenue, Communications, Marketing, Sales |
| **Consulting** | Consulting, Best Practices, Implementation, Strategy, Technology |
| **Customer Success** | Customer Success, CS Manager, Forward Deployed |
| **Culture** | Culture & Morale, Pizza Guy |
| **Research** | Research, Principal Research Dedicated |

---

## Industry Presets (29)

Pre-configured swarm domain selections for industry verticals:

### General Industries

| Industry | Managers | Key Focus Areas |
|----------|----------|-----------------|
| **SaaS/B2B** | 15 | Multi-tenant, SSO/SAML, subscriptions, feature flags |
| **Fintech** | 18 | PCI compliance, fraud detection, SOX, real-time settlement |
| **E-commerce** | 16 | Product catalogs, checkout, inventory, A/B testing |
| **Healthcare** | 17 | HIPAA, HL7/FHIR, patient portals, audit trails |
| **Gaming** | 14 | Real-time multiplayer, matchmaking, anti-cheat |
| **Education** | 14 | LMS, assessments, plagiarism detection, SCORM |
| **Media/Entertainment** | 15 | Streaming, CDN, DRM, recommendations |
| **IoT/Hardware** | 15 | Device management, firmware OTA, edge computing |
| **Marketplace** | 16 | Two-sided platforms, trust/safety, escrow |
| **Enterprise** | 20 | SSO/LDAP, workflow, multi-region, governance |
| **AI/ML Product** | 12 | MLOps, model serving, RAG, fine-tuning |
| **Agency** | 12 | Multi-client, rapid prototyping, handoff |
| **Startup** | 8 | MVP, iteration, growth hacking |
| **Government** | 16 | FedRAMP, Section 508, NIST, clearance |

### Automotive Industries (18)

| Industry | Preset Key | Managers | Key Focus Areas |
|----------|------------|----------|-----------------|
| **OEM Supplier** | `auto-oem-supplier` | 16 | EDI, IATF 16949, PPAP, tier coordination |
| **OEM Reverse Engineering** | `auto-oem-reverse` | 14 | CAN bus, ECU extraction, UDS, J2534 |
| **OEM Manufacturer** | `auto-oem-manufacturer` | 18 | MES, plant floor, quality gates, traceability |
| **OEM Engineering** | `auto-oem-engineering` | 16 | PLM, CAD exchange, DFMEA, BOM management |
| **OEM R&D** | `auto-oem-rd` | 15 | HIL/SIL, ADAS, EV/battery, autonomous |
| **Dealer Sales** | `auto-dealer-sales` | 12 | DMS, CRM, F&I, desking, credit apps |
| **Dealer Service** | `auto-dealer-service` | 14 | Scheduling, warranty, parts, TSB/recall |
| **Aftermarket Reverse Eng** | `auto-aftermarket-reverse` | 13 | OBD PIDs, ECU flash, scan tools |
| **3rd Party Service** | `auto-3rdparty-service` | 12 | Multi-make diag, AllData/Mitchell, ADAS cal |
| **Collision Body** | `auto-collision-body` | 13 | CCC/Mitchell, photo AI, DRP, paint codes |
| **Collision Powertrain** | `auto-collision-powertrain` | 12 | Drivetrain, frame, EV safety, alignment |
| **Aftermarket Tuning** | `auto-aftermarket-tuning` | 14 | ECU cal, dyno, boost maps, flex fuel |
| **Aftermarket Product** | `auto-aftermarket-product` | 15 | CAD, FEA/CFD, fitment DB, prototyping |
| **CARB Compliance** | `auto-carb-compliance` | 14 | Executive orders, emissions test, anti-tamper |
| **Owner Servicing** | `auto-owner-service` | 10 | DIY guides, parts lookup, torque specs |
| **EV Powertrain** | `auto-ev-powertrain` | 18 | BMS, motor control, emulation, ICE-to-EV |
| **ADAS OEM** | `auto-adas-oem` | 20 | Sensor fusion, ISO 26262, SOTIF, control systems |
| **ADAS Aftermarket** | `auto-adas-aftermarket` | 14 | Calibration, retrofit, collision repair |

**Automotive Swarm Totals**: 97 Managers, 409 ICs across all automotive verticals.
See [automotive-swarm.md](modules/industries/automotive-swarm.md) for complete hierarchies.

Configure via `/init-autonomous` or `features.json`:

```json
{
  "industryPreset": "fintech",
  "swarmMode": true
}
```

---

## Project Templates (35)

Guided project scaffolding across 7 categories:

### Software Development (6)
| Template | Description |
|----------|-------------|
| `cli_tool` | Command-line application |
| `gui_tool` | Desktop GUI application |
| `web_app` | Web application |
| `mobile_app` | Mobile application |
| `api_service` | API/Microservice |
| `library` | Reusable library/package |

### Security & Cryptography (12)
| Template | Description |
|----------|-------------|
| `pen_test` | Penetration testing project |
| `vuln_assessment` | Vulnerability assessment |
| `encryption` | Encryption implementation |
| `key_management` | Key management system |
| `post_quantum` | Post-quantum cryptography |
| `secure_protocol` | Secure protocol design |
| `auth_system` | Authentication system |
| `access_control` | Authorization/RBAC |
| `audit_logging` | Security audit logging |
| `incident_response` | IR planning/tooling |
| `compliance_audit` | Compliance assessment |
| `threat_model` | Threat modeling |

### Business Systems (8)
| Template | Description |
|----------|-------------|
| `crm` | Customer relationship management |
| `erp` | Enterprise resource planning |
| `pos` | Point of sale system |
| `inventory` | Inventory management |
| `hotel_pms` | Hotel property management |
| `cannabis_track` | Cannabis seed-to-sale tracking |
| `restaurant_pos` | Restaurant POS system |
| `salon_booking` | Salon/spa booking system |

### Infrastructure (2)
| Template | Description |
|----------|-------------|
| `data_center` | Data center infrastructure |
| `systems_audit` | Systems audit and hardening |

### SDLC Methodologies (5)
| Template | Description |
|----------|-------------|
| `waterfall` | Traditional waterfall SDLC |
| `agile` | Agile/Scrum methodology |
| `xtreme` | Extreme programming |
| `10xdev` | Rapid 10x development |
| `theaiway` | AI-assisted development |

### Documentation (1)
| Template | Description |
|----------|-------------|
| `documentation` | Documentation project |

### AI-Assisted (3)
| Template | Description |
|----------|-------------|
| `human_to_claude` | Human handoff to Claude |
| `prompts` | Prompt engineering project |
| `do_it_for_me` | Full autonomous development |

---

## SDLC Workflow

Artifact-driven development with sign-off gates:

```
PHASE 1: DISCOVERY → PHASE 2: DESIGN → PHASE 3: DEVELOPMENT → PHASE 4: DELIVERY
     ↓                    ↓                    ↓                    ↓
  SIGN OFF             SIGN OFF         PR + Review          HUMAN MERGE
```

### Phase 1: Discovery

**Managers**: Discovery & Requirements, Product & Strategy, Architecture

| Artifact | Owner | Format |
|----------|-------|--------|
| Requirements | Requirements IC | `requirements.md` |
| ERD | Solutions Architect | `erd.mermaid` |
| User Stories | Product Design IC | `user-stories.md` |
| Process Map | Needs Analysis IC | `process-map.md` |
| Solution Design | Solutions Architect | `solution-design.md` |

**Gate**: User approves all discovery artifacts

### Phase 2: Design

**Managers**: Design, Architecture, Product & Strategy

| Artifact | Owner | Format |
|----------|-------|--------|
| UI Mockups | UX/UI ICs | `mockups/*.svg` |
| Component Specs | Internal UX IC | `components.md` |
| SA Review | Solutions Architect | `sa-review.md` |
| LD Review | Dev Docs Lead | `ld-review.md` |
| BSA Review | Biz Systems IC | `bsa-review.md` |

**Gate**: SA/LD/BSA reviews pass, user approves mockups

### Phase 3: Development

**Managers**: Frontend, Backend, Integration, Release & DevOps

- Atomic feature branches
- Parallel IC development
- PR → Code Review → Merge
- All CI checks pass

### Phase 4: Delivery

**Managers**: QA, Documentation, Release & DevOps

**Quality Gate** (when enabled):
```
Coverage = 100% + Tests = 100% → Documentation → HUMAN MERGE
```

---

## Module System

Modules load based on `.claude/config/features.json`:

| Feature Flag | Modules Loaded |
|--------------|----------------|
| (always) | `core/CLAUDE.core.md`, `bootstrap.md` |
| `scopeSystem` | `scope-system.md` |
| `directorMode` | `director-pattern.md`, `parallel-models.md`, `lightweight-teams.md`, `claude-personalities.md`, `specialized-claudes.md` |
| `swarmMode` | `swarm/*.md` |
| `structuredSdlc` | `sdlc-workflow.md` |
| `projectTemplates` | `project-templates.md` |
| `industryPreset` | `industries/presets.md` |

### Context Size Estimates

| Configuration | Lines Loaded |
|---------------|--------------|
| Minimal | ~300 |
| With Scopes | ~550 |
| Director Mode | ~1,800 |
| With Templates | ~2,150 |
| Full Swarm | ~4,400 |
| Everything | ~4,700 |

---

## Testing

### Test Suite

| Test File | Coverage |
|-----------|----------|
| `test-swarm.mjs` | Swarm architecture and orchestration |
| `test-sandbox-levels.mjs` | All 10 security levels |
| `test-backup-manager.mjs` | Backup and restore functionality |
| `test-backup-restore.mjs` | Comprehensive backup scenarios |
| `test-git-verifier.mjs` | Git workflow verification |
| `test-hooks-*.mjs` | All hook event handlers |
| `test-init-protocol.mjs` | Initialization protocol |
| `test-claude-md.mjs` | CLAUDE.md parsing and loading |
| `test-logging.mjs` | Session logging |
| `test-regression-reversal.mjs` | Regression detection |
| `test-sandbox-interceptor.mjs` | Command interception |
| `test-sandbox-manager.mjs` | Sandbox state management |
| `test-sanitizer.mjs` | Path sanitization |
| `test-soft-delete.mjs` | Soft delete functionality |

### Running Tests

```bash
# Run all tests
./tests/run-all-tests.sh

# Run specific test suites
node tests/test-swarm.mjs          # 13 tests
node tests/test-sandbox-levels.mjs  # 30 tests

# Current status: 43/43 passing
```

---

## File Structure

```
dot-claude/
├── CLAUDE.md                    # Project instructions
├── CLAUDE.core.md               # Core rules (deploys to ~/.claude/CLAUDE.md)
├── README.md                    # This file
│
├── commands/                    # Slash commands
│   ├── autonomous.md            # /autonomous
│   ├── commit.md                # /commit
│   ├── pr.md                    # /pr
│   ├── ship.md                  # /ship
│   ├── review.md                # /review
│   ├── status.md                # /status
│   ├── init-autonomous.md       # /init-autonomous
│   ├── clone-setup.md           # /clone-setup
│   ├── sandbox.md               # /sandbox
│   ├── scope.md                 # /scope
│   ├── start-project.md         # /start-project
│   └── swarm.md                 # /swarm
│
├── modules/                     # Loadable configuration modules
│   ├── core/CLAUDE.core.md      # Minimal core (always loads)
│   ├── bootstrap.md             # Session initialization
│   ├── scope-system.md          # Dynamic scopes (6)
│   ├── director-pattern.md      # Sub-agent delegation
│   ├── parallel-models.md       # Alternative architectures (7)
│   ├── lightweight-teams.md     # Pre-configured teams (15)
│   ├── claude-personalities.md  # Interaction styles (13)
│   ├── specialized-claudes.md   # Expert consultants (36)
│   ├── project-templates.md     # Project scaffolding (35)
│   ├── sdlc-workflow.md         # Phased development
│   ├── industries/
│   │   └── presets.md           # Industry configurations (14)
│   └── swarm/
│       ├── architecture.md      # 40 managers, 200+ ICs
│       ├── swarm-director.md    # Director protocol
│       └── ic-prompts.md        # IC role templates
│
├── agents/                      # Agent definitions
│   ├── base/                    # Core agent components
│   ├── bootstrap/               # Session initialization agents
│   ├── managers/                # 16 manager definitions
│   ├── ics/                     # 18 IC domain directories
│   ├── industry/                # 8 industry consultants
│   └── specialized/             # 13 specialized personas
│
├── rules/                       # Always-loaded rules
│   ├── autonomous-mode.md       # Autonomous operation
│   ├── code-quality.md          # Quality standards
│   ├── git-workflow.md          # Git conventions
│   └── sandbox-levels.md        # Security levels
│
├── scripts/                     # Shell scripts
│   ├── init-autonomous.sh       # Project initialization
│   ├── install.sh               # Global installation
│   └── generate-ics.sh          # IC generation
│
├── skills/                      # Prompt-triggered skills
│   ├── skill-rules.json         # Activation rules
│   ├── git-automation/          # Git workflow
│   ├── session-management/      # Session handling
│   ├── code-review/             # Code review
│   ├── testing/                 # Test automation
│   └── start-project/           # Project scaffolding
│
├── templates/                   # Project templates
│   └── projects/
│       ├── _index.json          # Template registry
│       ├── software-development.md
│       ├── security-cryptography.md
│       ├── business-systems.md
│       ├── infrastructure.md
│       ├── sdlc-methodologies.md
│       └── ai-assisted.md
│
├── hooks/                       # Event hooks
│   └── ContextRecoveryHook/     # Context recovery system
│
└── tests/                       # Test suite
    ├── run-all-tests.sh
    └── test-*.mjs               # 20 test files
```

---

## Configuration

### features.json

```json
{
  "scopeSystem": true,
  "directorMode": true,
  "swarmMode": false,
  "structuredSdlc": false,
  "projectTemplates": true,
  "industryPreset": null,
  "defaultScope": "engineer",
  "defaultPersona": null,
  "defaultTeam": null,
  "sandboxLevel": "asuser"
}
```

### Enabling Features

```bash
# Via /init-autonomous (interactive)
/init-autonomous

# Via manual editing
echo '{"swarmMode": true}' > .claude/config/features.json

# Via environment
export CLAUDE_SANDBOX_LEVEL=asroot
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Contributing

Contributions welcome! Please read the contribution guidelines and submit PRs to the `main` branch.

---

## Acknowledgments

Built for the Claude Code ecosystem by the autonomous Claude development community.

---

*For more information, see the [modules README](modules/README.md) or run `/help` in Claude Code.*
