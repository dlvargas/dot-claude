---
name: session-management
description: Orchestrates development sessions with task tracking, context preservation, and efficient sub-agent delegation.
allowed-tools: [TodoWrite, Read, Write, Bash, Task]
priority: critical
---

# Session Management Skill

## Purpose
Maintain productive, focused development sessions with clear task tracking, context preservation, and intelligent work delegation.

## Session Initialization

At session start:

1. **Check Recovery State**
   - Look for compaction markers
   - Re-read CLAUDE.md if recovering
   - Review last git commits for context

2. **Establish Current Focus**
   - Read any existing TODO items
   - Check git status for in-progress work
   - Identify immediate priorities

## Task Management Protocol

### Starting Work
```
1. Create TODO list with TodoWrite
2. Mark first item as in_progress
3. Begin implementation
4. Update status in real-time
```

### During Work
- Mark items complete IMMEDIATELY after finishing
- Add discovered sub-tasks to list
- Keep exactly ONE item in_progress
- Never batch status updates

### Complex Tasks
For multi-phase work:
```
Phase 1: Research/Planning
- Explore codebase
- Identify affected files
- Document approach

Phase 2: Implementation
- Core functionality first
- Tests alongside code
- Atomic commits per feature

Phase 3: Polish
- Error handling
- Edge cases
- Documentation
```

## Sub-Agent Delegation

### When to Delegate
- Independent, parallelizable work
- Specialized expertise needed
- Context isolation beneficial

### Delegation Patterns
```javascript
// Parallel: Independent tasks
Task("Explore: find all API endpoints", {type: "Explore"})
Task("Explore: analyze auth patterns", {type: "Explore"})

// Sequential: Dependent tasks
Plan first → then implement
```

### Agent Types
- `Explore`: Codebase discovery
- `Plan`: Architecture decisions
- `general-purpose`: Complex multi-step work

## Context Preservation

### Before Compaction
- Ensure critical state is in CLAUDE.md
- Commit any pending changes
- Update TODO list with current state

### Session Handoffs
- Document decisions made
- List remaining work
- Note any blockers

## Efficiency Rules

1. **Never re-explain** what CLAUDE.md already contains
2. **Batch tool calls** when independent
3. **Use sub-agents** for exploration to save main context
4. **Commit frequently** to preserve work
5. **Update TODOs** as single source of truth

## Quality Checkpoints

Before marking complete:
- [ ] Code compiles/runs
- [ ] Tests pass (if applicable)
- [ ] Changes committed
- [ ] No obvious issues
