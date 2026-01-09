# Claude Code Modules

This directory contains modular configuration components that load based on project feature settings.

## Directory Structure

```
modules/
├── README.md                    # This file
├── core/
│   └── CLAUDE.core.md           # Minimal core (always loads)
├── director-pattern.md          # Sub-agent delegation patterns
├── parallel-models.md           # Alternative agent architectures
├── sdlc-workflow.md             # Phased development workflow
└── swarm/
    ├── architecture.md          # 40 Manager, 200+ IC architecture
    ├── swarm-director.md        # Director orchestration protocol
    └── ic-prompts.md            # Complete IC role prompts
```

## Module Loading Rules

Modules load based on `.claude/config/features.json`:

| Feature Flag | Modules Loaded |
|--------------|----------------|
| (always) | `core/CLAUDE.core.md` |
| `directorMode: true` | `director-pattern.md`, `parallel-models.md` |
| `swarmMode: true` | `swarm/*.md` |
| `structuredSdlc: true` | `sdlc-workflow.md` |

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

## Context Size Estimates

| Configuration | Modules Loaded | Approximate Lines |
|---------------|----------------|-------------------|
| Minimal (jailed, no features) | core only | ~100 |
| Standard (asuser, director) | core + director + parallel | ~280 |
| Full (swarm + sdlc) | all modules | ~2200 |

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
