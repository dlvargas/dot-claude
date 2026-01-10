# Claude Code Modules

This directory contains modular configuration components that load based on project feature settings.

## Directory Structure

```
modules/
├── README.md                    # This file
├── core/
│   └── CLAUDE.core.md           # Minimal core (always loads)
├── bootstrap.md                 # Session initialization & recovery
├── scope-system.md              # Dynamic scope switching (6 scopes)
├── director-pattern.md          # Sub-agent delegation patterns
├── parallel-models.md           # Alternative agent architectures (7 models)
├── lightweight-teams.md         # Pre-configured parallel teams (15 teams)
├── claude-personalities.md      # Interaction style personas (13 types)
├── specialized-claudes.md       # Expert consultant personas (36 types)
├── project-templates.md         # Project scaffolding (35 templates)
├── sdlc-workflow.md             # Phased development workflow
├── industries/
│   ├── README.md                # Industry preset overview
│   ├── presets.md               # Industry configurations (32 presets)
│   └── automotive-swarm.md      # Automotive managers & ICs (97 managers, 409 ICs)
└── swarm/
    ├── architecture.md          # 40 Manager, 200+ IC architecture
    ├── swarm-director.md        # Director orchestration protocol
    └── ic-prompts.md            # Complete IC role prompts
```

## Module Loading Rules

Modules load based on `.claude/config/features.json`:

| Feature Flag | Modules Loaded |
|--------------|----------------|
| (always) | `core/CLAUDE.core.md`, `bootstrap.md` |
| `scopeSystem: true` | `scope-system.md` |
| `directorMode: true` | `director-pattern.md`, `parallel-models.md`, `lightweight-teams.md`, `claude-personalities.md`, `specialized-claudes.md` |
| `swarmMode: true` | `swarm/*.md` (adds to directorMode) |
| `structuredSdlc: true` | `sdlc-workflow.md` |
| `projectTemplates: true` | `project-templates.md` |
| `industryPreset: "{preset}"` | `industries/presets.md` (filtered) |

### Complete Feature Summary

| Feature | Count | Invocation |
|---------|-------|------------|
| Scopes | 6 | `/scope {type}` |
| Personalities | 13 | `/persona {type}` |
| Consultants | 36 | `/consult {role}` |
| Teams | 15 | `/team {type}` |
| Parallel Models | 7 | Spawn patterns |
| Project Templates | 35 | `/start-project {type}` |
| Industry Presets | 32 | Config or `/init-autonomous` |
| Managers | 40 | Swarm mode |
| ICs | 200+ | Swarm mode |

### Agent Mode Hierarchy

| Mode | Agents | Requirement | Invocation |
|------|--------|-------------|------------|
| Scope | N/A (personality) | scopeSystem | `/scope {type}` |
| Persona | N/A (interaction style) | directorMode | `/persona {type}` |
| Consultant | 1 expert | directorMode | `/consult {role}` |
| Team | 3-5 peers | directorMode | `/team {type}` |
| Swarm | 10-200+ hierarchy | swarmMode | `/swarm` |

## Module Descriptions

### Core Module
**Path:** `core/CLAUDE.core.md`
**Size:** ~100 lines
**Purpose:** Essential rules that apply to all projects regardless of feature selection.

Contains:
- File safety rules
- Security boundaries
- Quality standards
- Command reference
- Sandbox level quick reference

### Bootstrap
**Path:** `bootstrap.md`
**Size:** ~200 lines
**Purpose:** Session initialization, context recovery, and state management.

Contains:
- Session startup sequence
- Initialization checklist
- Context recovery protocol
- Scope auto-detection rules
- Master bootstrap coordination
- Hooks integration

### Scope System
**Path:** `scope-system.md`
**Size:** ~250 lines
**Purpose:** Dynamic scope switching for Claude personality and capabilities.

Contains:
- 6 primary scopes (Engineer, Business, Creative, Consultant, Operations, Director)
- Scope decision tree
- 8 industry variants for Consultant scope
- Hybrid scope combinations
- Auto-detection rules
- Scope transition protocol

### Director Pattern
**Path:** `director-pattern.md`
**Size:** ~100 lines
**Purpose:** Guidelines for delegating work to sub-agents.

Contains:
- When to delegate vs. handle directly
- Explorer, Architect, Executor agent types
- Parallel delegation patterns
- Communication style guidelines
- Context management

### Parallel Models
**Path:** `parallel-models.md`
**Size:** ~80 lines
**Purpose:** Alternative agent architectures beyond the swarm hierarchy.

Contains:
- Peer Review Pipeline
- Adversarial Testing
- Parallel Specialists
- Evolution/Iteration
- Debate/Consensus
- Red Team/Blue Team
- Assembly Line
- Model selection guide

### Lightweight Teams
**Path:** `lightweight-teams.md`
**Size:** ~300 lines
**Purpose:** Pre-configured team compositions for parallel agent execution.

Contains:
- 15 pre-configured teams (fullstack, security, quality, review, docs, etc.)
- Team coordination modes (sync, pipeline, handoff)
- Custom team configuration
- Comparison: Consultant vs Team vs Swarm
- Example spawn patterns

### Claude Personalities
**Path:** `claude-personalities.md`
**Size:** ~350 lines
**Purpose:** Specialized interaction styles for unique scenarios.

Contains:
- 13 unique personalities (Mentor, Devil's Advocate, Rubber Duck, etc.)
- Each with: Emoji, Motto, When to Use, Behavior
- Personality combinations
- Comparison: Personalities vs Consultants vs Scopes

Personalities:
| Name | Emoji | Purpose |
|------|-------|---------|
| Mentor | 🎓 | Teaching & growth |
| Devil's Advocate | 😈 | Critical analysis |
| Rubber Duck | 🦆 | Problem solving |
| Code Archaeologist | 🏛️ | Legacy code |
| Security | 🔐 | Security review |
| Performance | ⚡ | Optimization |
| Pair Programmer | 👥 | Collaboration |
| Data | 📊 | Data engineering |
| Accessibility | ♿ | A11y audits |
| API Designer | 🔌 | Interface design |
| Interviewer | 🎤 | Tech interviews |
| Chaos Engineer | 💥 | Resilience |
| AI/ML | 🤖 | Machine learning |

### Project Templates
**Path:** `project-templates.md`
**Size:** ~350 lines
**Purpose:** Pre-configured project scaffolding for `/start-project`.

Contains:
- 35 project types across 7 categories
- New project vs Change request variants
- Phase definitions (Discovery, Design, Development, Delivery)
- Swarm preset mappings
- Custom template creation

Categories:
- Software Development (6): cli_tool, gui_tool, web_app, etc.
- Security & Cryptography (12): pen_test, encryption, post_quantum, etc.
- Business Systems (8): CRM, ERP, POS, hotel, cannabis, etc.
- Infrastructure (2): data_center, systems_audit
- SDLC Methodologies (5): waterfall, agile, xtreme, 10xdev, theaiway
- Documentation (1): documentation
- AI-Assisted (3): human_to_claude, prompts, do_it_for_me

### SDLC Workflow
**Path:** `sdlc-workflow.md`
**Size:** ~90 lines
**Purpose:** Phased development lifecycle with sign-off gates.

Contains:
- Phase 1: Discovery
- Phase 2: Design
- Phase 3: Development
- Phase 4: Delivery
- Sign-off format
- Quality gates

### Swarm Architecture
**Path:** `swarm/architecture.md`
**Size:** ~180 lines
**Purpose:** Complete enterprise swarm configuration.

Contains:
- 40 Manager domains
- 200+ IC role definitions
- Swarm presets (Minimal, Standard, Enterprise, Full)
- Swarm protocol
- Sentiment assessment
- Custom domain configuration

### Swarm Director
**Path:** `swarm/swarm-director.md`
**Size:** ~260 lines
**Purpose:** Director-level orchestration for swarm operations.

Contains:
- Director identity and hierarchy
- Activation criteria
- Spawning protocol
- Manager spawn template
- IC spawn template
- Communication guidelines
- Error handling

### IC Prompts
**Path:** `swarm/ic-prompts.md`
**Size:** ~1400 lines
**Purpose:** Complete prompt templates for all IC roles.

Contains:
- Universal IC template
- Domain-specific prompts for 200+ roles
- Expertise areas
- Approach methodologies
- Expected outputs

### Specialized Claudes
**Path:** `specialized-claudes.md`
**Size:** ~500 lines
**Purpose:** Expert consultant personas invokable via `/consult`.

Contains:
- 12 Technical Specialists (security, performance, database, devops, etc.)
- 8 Business/Strategy Specialists (product, docs, growth, compliance, etc.)
- 12 Domain Specialists (fintech, healthcare, gaming, IoT, etc.)
- 4 Meta Specialists (reviewer, refactor, debug, migrate)
- Total: 36 specialized personas

### Industry Presets
**Path:** `industries/presets.md`
**Size:** ~800 lines
**Purpose:** Pre-configured swarm domain selections for industry verticals.

Contains:
- 32 Industry configurations total:
  - 14 General industries (SaaS, Fintech, E-commerce, Healthcare, Gaming, etc.)
  - 18 Automotive verticals (OEM, Dealer, Aftermarket, Collision, EV, ADAS)
- Optimized domain selections per industry
- Key ICs emphasized for each vertical
- JSON configuration examples

Automotive Presets:
- OEM: Supplier, Reverse Engineering, Manufacturer, Engineering, R&D
- Dealer: Sales, Service
- Aftermarket: Reverse Engineering, Tuning, Product Design
- Service: 3rd Party, Owner
- Collision: Body, Powertrain
- Compliance: CARB
- EV Powertrain: Battery, Motor, Charging, Emulation, Mods
- ADAS OEM: Perception, Control, Safety, Validation
- ADAS Aftermarket: Calibration, Retrofit, Repair, Training

See `automotive-swarm.md` for complete manager/IC hierarchies (97 managers, 409 ICs total).

## Context Size Estimates

| Configuration | Modules Loaded | Approximate Lines |
|---------------|----------------|-------------------|
| Minimal (no features) | core + bootstrap | ~300 |
| With Scopes | + scope-system | ~550 |
| Director Mode | + director + parallel + teams + personalities + consultants | ~1800 |
| With Templates | + project-templates | ~2150 |
| With Industry | + industries/presets | ~2950 |
| Full Swarm | + swarm/*.md | ~4800 |
| Everything | all modules | ~5100 |

## Usage

Modules are automatically loaded by Claude Code based on the features.json config. To manually check which modules are active:

```bash
cat .claude/config/features.json
ls .claude/rules/
```

To add a module to a project:
```bash
cp ~/.claude/modules/{module}.md .claude/rules/
```

To remove a module:
```bash
rm .claude/rules/{module}.md
```

## Creating Custom Modules

Custom modules should follow this structure:

```markdown
# Module Name

Brief description of the module's purpose.

## Section 1
Content...

## Section 2
Content...
```

Place custom modules in `.claude/rules/` for project-specific or `~/.claude/modules/` for global availability.
