---
description: Pre-configured team compositions for parallel agent execution without full swarm
load_when: directorMode
---

# Lightweight Teams

Pre-configured team compositions that work with **Director mode only** - no swarm hierarchy required. These spawn parallel agents for common development scenarios.

## Requirements
- `directorMode: true` (that's it!)
- Works with any sandbox level

## Usage

```bash
/team fullstack    # Spawn parallel full-stack team
/team security     # Spawn security review team
/team migration    # Spawn migration team
```

Or configure in features.json:
```json
{
  "directorMode": true,
  "defaultTeam": "fullstack"
}
```

---

## Available Teams (15)

### 1. Full-Stack Team
**Agents**: Frontend, Backend, Database, API
**Best for**: Feature development across the stack

```javascript
// Spawns 4 parallel agents
Task({ subagent_type: "general-purpose", prompt: FRONTEND_PROMPT })
Task({ subagent_type: "general-purpose", prompt: BACKEND_PROMPT })
Task({ subagent_type: "general-purpose", prompt: DATABASE_PROMPT })
Task({ subagent_type: "general-purpose", prompt: API_PROMPT })
```

**Invocation**: `/team fullstack`

---

### 2. Security Review Team
**Agents**: AppSec Auditor, Dependency Scanner, Threat Modeler
**Best for**: Security assessments, vulnerability hunting

**Invocation**: `/team security`

---

### 3. Quality Team
**Agents**: Unit Tester, Integration Tester, E2E Tester, Coverage Analyzer
**Best for**: Comprehensive test coverage

**Invocation**: `/team quality`

---

### 4. Code Review Team
**Agents**: Style Reviewer, Logic Reviewer, Security Reviewer, Performance Reviewer
**Best for**: Thorough PR reviews

**Invocation**: `/team review`

---

### 5. Documentation Team
**Agents**: API Doc Writer, Tutorial Writer, README Generator, Changelog Writer
**Best for**: Comprehensive documentation

**Invocation**: `/team docs`

---

### 6. Refactoring Team
**Agents**: Code Smell Detector, Abstraction Designer, Test Updater, Migration Planner
**Best for**: Safe, systematic refactoring

**Invocation**: `/team refactor`

---

### 7. Performance Team
**Agents**: Profiler, Bottleneck Analyzer, Optimization Implementer, Benchmark Runner
**Best for**: Performance optimization

**Invocation**: `/team performance`

---

### 8. Migration Team
**Agents**: Compatibility Checker, Migration Script Writer, Rollback Planner, Validator
**Best for**: Framework/library upgrades

**Invocation**: `/team migration`

---

### 9. DevOps Team
**Agents**: CI/CD Builder, Dockerfile Writer, IaC Developer, Monitoring Setup
**Best for**: Infrastructure and deployment

**Invocation**: `/team devops`

---

### 10. API Design Team
**Agents**: Endpoint Designer, Schema Validator, Documentation Writer, SDK Generator
**Best for**: API development

**Invocation**: `/team api`

---

### 11. Frontend Team
**Agents**: Component Builder, State Manager, Style Architect, A11y Checker
**Best for**: Frontend-focused work

**Invocation**: `/team frontend`

---

### 12. Backend Team
**Agents**: Service Designer, Database Architect, Queue Designer, Cache Strategist
**Best for**: Backend-focused work

**Invocation**: `/team backend`

---

### 13. Data Team
**Agents**: Schema Designer, Query Optimizer, Migration Writer, Seed Generator
**Best for**: Database work

**Invocation**: `/team data`

---

### 14. Debugging Team
**Agents**: Log Analyzer, Stack Trace Parser, Reproduction Builder, Fix Implementer
**Best for**: Bug investigation

**Invocation**: `/team debug`

---

### 15. Planning Team
**Agents**: Requirements Analyst, Architecture Designer, Task Breakdown, Risk Assessor
**Best for**: Feature planning

**Invocation**: `/team plan`

---

## Team vs Swarm vs Consultant

| Feature | Consultant | Team | Swarm |
|---------|------------|------|-------|
| Hierarchy | None (single agent) | Flat (parallel peers) | Director → Manager → IC |
| Complexity | Simple question | Medium task | Large project |
| Agents | 1 | 3-5 | 10-200+ |
| Coordination | N/A | Direct sync | Reports flow up |
| Requirements | directorMode | directorMode | swarmMode |

### When to Use Each

**Consultant** (`/consult {role}`):
- Need expert advice on a specific topic
- Want a second opinion
- Quick specialized analysis

**Team** (`/team {type}`):
- Working on a specific feature or task
- Need parallel execution with coordination
- Want focused, coordinated output

**Swarm** (`/swarm`):
- Building a complete product/feature
- Need full development lifecycle
- Want hierarchical coordination with reports

---

## Custom Teams

Create custom teams in `.claude/config/teams.json`:

```json
{
  "myteam": {
    "name": "My Custom Team",
    "agents": [
      { "role": "Lead", "prompt": "You are the team lead..." },
      { "role": "Builder", "prompt": "You implement features..." },
      { "role": "Tester", "prompt": "You write tests..." }
    ],
    "coordination": "sync",
    "output": ".claude/teams/{session}/myteam/"
  }
}
```

Invoke: `/team myteam`

---

## Team Coordination Modes

### Sync Mode (default)
All agents run in parallel, results combined at end.

### Pipeline Mode
Agents run sequentially, each receives previous output.
```json
{ "coordination": "pipeline" }
```

### Handoff Mode
First agent completes, hands off to next with context.
```json
{ "coordination": "handoff" }
```
