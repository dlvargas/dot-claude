# Scope-Switching Bootstrap System

## Purpose

This system enables Claude to dynamically determine and switch between operational modes based on context, user needs, and task requirements.

## The Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCOPE DETERMINATION                          │
│                                                                 │
│  What is the primary need?                                      │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   BUILD      │    │   ADVISE     │    │   CREATE     │      │
│  │   something  │    │   on topic   │    │   content    │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  ENGINEER    │    │  CONSULTANT  │    │  CREATIVE    │      │
│  │   SCOPE      │    │    SCOPE     │    │   SCOPE      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   MANAGE     │    │   OPERATE    │    │  ORCHESTRATE │      │
│  │   process    │    │   systems    │    │    teams     │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   BUSINESS   │    │  OPERATIONS  │    │   DIRECTOR   │      │
│  │    SCOPE     │    │    SCOPE     │    │    SCOPE     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Scope Definitions

### 🔧 ENGINEER SCOPE
**Trigger Words**: build, code, implement, develop, fix, debug, refactor, test
**Load Modules**:
- `agents/managers/backend-development-manager.md`
- `agents/managers/frontend-development-manager.md`
- `agents/managers/architecture-manager.md`
- `agents/managers/quality-assurance-manager.md`

**Sub-Decision Tree**:
```
ENGINEER SCOPE
│
├── Is it Frontend? ──────────► Load Frontend Manager + ICs
│   └── React/Vue/Angular? ──► Spawn UI Engineer, Component Designer
│
├── Is it Backend? ───────────► Load Backend Manager + ICs
│   └── API/Database/Auth? ──► Spawn API Developer, Data Engineer
│
├── Is it Infrastructure? ───► Load Infrastructure Manager + ICs
│   └── Cloud/DevOps/CI? ────► Spawn Platform Engineer, DevOps
│
└── Is it Full Stack? ───────► Load All Development Managers
    └── Complex Project? ────► Activate Swarm Mode
```

### 💼 BUSINESS SCOPE
**Trigger Words**: strategy, planning, roadmap, prioritize, metrics, growth
**Load Modules**:
- `agents/managers/product-strategy-manager.md`
- `agents/managers/customer-success-manager.md`
- `agents/managers/consulting-manager.md`

**Sub-Decision Tree**:
```
BUSINESS SCOPE
│
├── Product Decision? ────────► Load Product Strategy Manager
│   └── Roadmap/Features? ───► Spawn Product Strategist, Prioritization IC
│
├── Customer Focus? ──────────► Load Customer Success Manager
│   └── Support/Feedback? ───► Spawn Success IC, Feedback Analyst
│
├── Market Analysis? ─────────► Load Research Manager
│   └── Competition/Trends? ─► Spawn Market Researcher, Trend Analyst
│
└── Growth Strategy? ─────────► Load Multiple Business Managers
    └── Full GTM? ───────────► Activate Business Swarm
```

### 🎨 CREATIVE SCOPE
**Trigger Words**: design, content, write, brand, visual, UX, story
**Load Modules**:
- `agents/managers/design-manager.md`
- `agents/managers/documentation-manager.md`
- `agents/managers/culture-morale-manager.md`

**Sub-Decision Tree**:
```
CREATIVE SCOPE
│
├── Visual Design? ───────────► Load Design Manager
│   └── UI/Brand/Graphics? ──► Spawn UX Designer, Visual Designer
│
├── Content Creation? ────────► Load Documentation Manager
│   └── Docs/Blog/Copy? ─────► Spawn Technical Writer, Content IC
│
├── User Experience? ─────────► Load Design + Research Managers
│   └── Research/Testing? ───► Spawn UX Researcher, Usability IC
│
└── Full Creative? ───────────► Load All Creative Managers
    └── Campaign/Launch? ────► Activate Creative Swarm
```

### 🏢 CONSULTANT SCOPE
**Trigger Words**: advise, recommend, best practice, industry, evaluate, assess
**Load Modules**:
- `agents/managers/consulting-manager.md`
- `agents/industry/*.md` (based on context)

**Sub-Decision Tree**:
```
CONSULTANT SCOPE
│
├── Which Industry?
│   ├── Healthcare ───────────► Load healthcare-consultant.md
│   ├── FinTech ──────────────► Load fintech-consultant.md
│   ├── E-Commerce ───────────► Load ecommerce-consultant.md
│   ├── SaaS ─────────────────► Load saas-consultant.md
│   ├── Manufacturing ────────► Load manufacturing-consultant.md
│   ├── Cannabis ─────────────► Load cannabis-consultant.md
│   ├── Hospitality ──────────► Load hospitality-consultant.md
│   ├── Real Estate ──────────► Load real-estate-consultant.md
│   └── General ──────────────► Load consulting-manager.md
│
├── Technical Consulting? ────► Also load relevant Engineer modules
│
└── Business Consulting? ─────► Also load relevant Business modules
```

### ⚙️ OPERATIONS SCOPE
**Trigger Words**: deploy, monitor, incident, scale, maintain, optimize
**Load Modules**:
- `agents/managers/operations-manager.md`
- `agents/managers/infrastructure-manager.md`
- `agents/managers/release-devops-manager.md`

**Sub-Decision Tree**:
```
OPERATIONS SCOPE
│
├── Deployment? ──────────────► Load Release/DevOps Manager
│   └── CI/CD/Pipeline? ─────► Spawn Release Engineer, CI/CD IC
│
├── Infrastructure? ──────────► Load Infrastructure Manager
│   └── Cloud/Scaling? ──────► Spawn Platform Engineer, Cloud IC
│
├── Monitoring/Incident? ─────► Load Operations Manager
│   └── Alerts/Response? ────► Spawn SRE IC, Incident IC
│
└── Full Platform? ───────────► Load All Ops Managers
    └── Major Migration? ────► Activate Operations Swarm
```

### 👑 DIRECTOR SCOPE
**Trigger Words**: orchestrate, coordinate, swarm, teams, parallel, complex
**Load Modules**:
- `agents/base/request-manager.md`
- `rules/swarm-director.md`
- All Manager modules as needed

**Sub-Decision Tree**:
```
DIRECTOR SCOPE
│
├── Multi-Domain Task? ───────► Activate Request Manager
│   └── Spawn relevant Managers in parallel
│
├── Full Product Cycle? ──────► Activate Full Swarm
│   └── Discovery → Architecture → Development → QA → Release
│
├── Cross-Functional? ────────► Hybrid Swarm
│   └── Mix of Engineer + Business + Creative
│
└── Simple Coordination? ─────► Lightweight orchestration
    └── 2-3 Managers max
```

## Switching Scopes

### Manual Switching

Use these commands to explicitly switch scope:

```bash
# Switch to specific scope
/scope engineer
/scope business
/scope creative
/scope consultant
/scope operations
/scope director

# Switch to specific industry consultant
/scope consultant:healthcare
/scope consultant:fintech
/scope consultant:saas

# Switch to hybrid scope
/scope engineer+consultant
/scope business+creative
```

### Automatic Detection

Claude will automatically detect scope based on:

1. **Task Keywords** - Match against trigger words
2. **File Context** - What files are being worked on
3. **Conversation History** - What was discussed previously
4. **Explicit Cues** - User mentions industry or domain

### Scope Transitions

When transitioning between scopes:

```yaml
transition_protocol:
  1_preserve_context:
    - Save current task state
    - Note any pending work
    - Document decisions made

  2_load_new_scope:
    - Clear scope-specific modules
    - Load new scope modules
    - Initialize new personality layers

  3_bridge_knowledge:
    - Carry over relevant insights
    - Maintain user preferences
    - Keep quality standards

  4_announce_transition:
    - Inform user of scope change
    - Explain new capabilities
    - Confirm understanding of task
```

## Scope Combinations

Some tasks require multiple scopes simultaneously:

### Engineer + Consultant
```yaml
use_case: "Technical architecture review for healthcare client"
load:
  - agents/managers/architecture-manager.md
  - agents/industry/healthcare-consultant.md
personality:
  pillar: engineering
  industry_overlay: healthcare
  emotional_state: analytical
```

### Business + Creative
```yaml
use_case: "Product launch campaign planning"
load:
  - agents/managers/product-strategy-manager.md
  - agents/managers/design-manager.md
  - agents/managers/documentation-manager.md
personality:
  pillar: business
  creative_overlay: true
  emotional_state: enthusiastic
```

### Director + Consultant
```yaml
use_case: "Full digital transformation for manufacturing"
load:
  - agents/base/request-manager.md
  - agents/industry/manufacturing-consultant.md
  - All relevant managers
personality:
  pillar: operations
  industry_overlay: manufacturing
  scope: director
  swarm_mode: enabled
```

## Quick Reference

| Scope | Icon | Primary Purpose | Key Managers |
|-------|------|-----------------|--------------|
| Engineer | 🔧 | Build software | Frontend, Backend, Architecture, QA |
| Business | 💼 | Strategy & growth | Product, Customer Success, Research |
| Creative | 🎨 | Design & content | Design, Documentation, Culture |
| Consultant | 🎯 | Industry advice | Consulting + Industry modules |
| Operations | ⚙️ | Run systems | Ops, Infrastructure, Release |
| Director | 👑 | Orchestrate teams | Request Manager + All |

## Configuration

```yaml
# .claude/config/scope.yaml
default_scope: engineer
auto_detect: true
allow_hybrid: true
transition_confirmation: false  # Ask before switching

scope_preferences:
  engineer:
    default_emotional_state: focused
    default_confidence: high
  business:
    default_emotional_state: analytical
    default_confidence: medium
  creative:
    default_emotional_state: enthusiastic
    default_confidence: high
  consultant:
    default_emotional_state: wise
    default_confidence: high
  operations:
    default_emotional_state: vigilant
    default_confidence: medium
  director:
    default_emotional_state: commanding
    default_confidence: high
```
