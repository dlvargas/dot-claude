---
description: Initialization and bootstrap protocols for Claude sessions
load_when: always
---

# Bootstrap Protocol

Session initialization, context recovery, and state management for Claude Code.

## Session Startup Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION INITIALIZATION                        │
│                                                                 │
│  1. Load Core       2. Check State      3. Detect Scope         │
│     Modules            Files               Context              │
│       │                  │                   │                  │
│       ▼                  ▼                   ▼                  │
│  ┌─────────┐      ┌───────────┐      ┌─────────────┐           │
│  │ CLAUDE  │      │ features  │      │ Auto-detect │           │
│  │ .core   │      │ .json     │      │ or manual   │           │
│  └────┬────┘      └─────┬─────┘      └──────┬──────┘           │
│       │                 │                   │                   │
│       └─────────────────┴───────────────────┘                   │
│                         │                                       │
│                         ▼                                       │
│                  ┌─────────────┐                                │
│                  │   READY     │                                │
│                  └─────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Initialization Checklist

### 1. Environment Detection

Check for:
- [ ] Git repository status
- [ ] Branch name (not main/master for writes)
- [ ] Uncommitted changes
- [ ] `.claude/` directory existence
- [ ] `.claude/config/features.json`
- [ ] `.claude/sandbox-level`

### 2. Module Loading

Based on `features.json`:

```javascript
// Loading order
1. core/CLAUDE.core.md          // Always
2. scope-system.md              // If scopeSystem
3. director-pattern.md          // If directorMode
4. parallel-models.md           // If directorMode
5. lightweight-teams.md         // If directorMode
6. claude-personalities.md      // If directorMode
7. specialized-claudes.md       // If directorMode
8. swarm/*.md                   // If swarmMode
9. sdlc-workflow.md             // If structuredSdlc
10. industries/presets.md       // If industryPreset
11. project-templates.md        // If projectTemplates
```

### 3. State Recovery

Check for interrupted sessions:
- `.claude/sessions/*/state.json` - Incomplete sessions
- `.claude/swarm/*/manifest.json` - Incomplete swarms
- `TODO.md` or TodoWrite state - Pending tasks

### 4. Scope Detection

If `scopeSystem` enabled, auto-detect from:
- Current directory context
- Recent file types
- Git branch name patterns
- User's first message keywords

---

## Context Recovery Protocol

When resuming from context compaction:

### Pre-Compact (Hook)

```javascript
// Save state before compaction
{
  "session_id": "abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "current_scope": "engineer",
  "active_todos": [...],
  "pending_files": [...],
  "git_state": {
    "branch": "feature/auth",
    "uncommitted": true
  },
  "swarm_state": null,
  "recovery_notes": "Working on auth middleware"
}
```

### Post-Recovery

1. Read `.claude/sessions/latest/state.json`
2. Restore scope
3. Reload active todos
4. Check git status against saved state
5. Resume from recovery notes

---

## Scope Auto-Detection

### Trigger Word Analysis

```yaml
engineer_triggers:
  - build, code, implement, develop
  - fix, debug, refactor, test
  - component, api, database

business_triggers:
  - strategy, planning, roadmap
  - prioritize, metrics, growth
  - customer, market, revenue

creative_triggers:
  - design, content, write
  - brand, visual, UX
  - story, document, guide

consultant_triggers:
  - advise, recommend, best practice
  - industry, evaluate, assess
  - compliance, regulation

operations_triggers:
  - deploy, monitor, incident
  - scale, maintain, optimize
  - infrastructure, pipeline

director_triggers:
  - orchestrate, coordinate, swarm
  - teams, parallel, complex
  - multi-domain, cross-functional
```

### File Context Analysis

| File Pattern | Suggested Scope |
|--------------|-----------------|
| `*.tsx`, `*.vue`, `*.css` | engineer (frontend) |
| `*.py`, `*.go`, `*.rs` | engineer (backend) |
| `*.tf`, `*.yaml`, `Dockerfile` | operations |
| `*.md`, `*.mdx` | creative or documentation |
| `*.sql`, `*.prisma` | engineer (data) |

### Branch Name Patterns

| Branch Pattern | Suggested Scope |
|----------------|-----------------|
| `feature/*` | engineer |
| `fix/*`, `bugfix/*` | engineer |
| `docs/*` | creative |
| `infra/*`, `ops/*` | operations |
| `experiment/*` | business/research |

---

## Master Bootstrap

The master bootstrap coordinates all initialization:

```
MASTER BOOTSTRAP
│
├── 1. Check environment
│   ├── Git status
│   ├── Directory structure
│   └── Configuration files
│
├── 2. Load base modules
│   ├── Core rules
│   └── Feature modules
│
├── 3. Detect context
│   ├── Scope auto-detection
│   ├── Industry detection
│   └── Personality hints
│
├── 4. Recover state (if needed)
│   ├── Previous session state
│   ├── Pending todos
│   └── Git recovery
│
└── 5. Ready state
    ├── Announce capabilities
    ├── Show current scope
    └── Await user input
```

---

## Configuration

### features.json

```json
{
  "sandboxLevel": "asuser",
  "scopeSystem": true,
  "directorMode": true,
  "swarmMode": false,
  "projectTemplates": true,
  "autoDetectScope": true,
  "defaultScope": "engineer",
  "contextRecovery": true
}
```

### Session State Format

```json
{
  "session_id": "uuid",
  "started_at": "ISO8601",
  "scope": {
    "primary": "engineer",
    "variant": null,
    "hybrid": null,
    "personality": null
  },
  "modules_loaded": ["core", "director", "scope-system"],
  "git": {
    "branch": "feature/xyz",
    "ahead": 2,
    "behind": 0,
    "uncommitted": ["src/file.ts"]
  },
  "todos": [...],
  "recovery_checkpoint": "description of current work"
}
```

---

## Hooks Integration

Bootstrap integrates with Claude Code hooks:

| Hook | Bootstrap Action |
|------|------------------|
| `SessionStart` | Run full initialization |
| `PreCompact` | Save state for recovery |
| `PostCompact` | Restore from saved state |
| `PreToolUse` | Validate scope permissions |
| `PostToolUse` | Update session state |
