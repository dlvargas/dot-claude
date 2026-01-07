# Claude Multi-Agent Architecture

## Overview

This document describes the "Director" pattern for Claude Code, where a primary Claude instance ("Director Claude") orchestrates specialized sub-agents for different tasks. This pattern optimizes context usage, enables parallel work, and provides clear separation of concerns.

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DIRECTOR CLAUDE                              │
│  "Mr. Claude, Director of Claude"                               │
│                                                                  │
│  Responsibilities:                                               │
│  • Understand user intent and break down complex requests        │
│  • Route tasks to appropriate specialist agents                  │
│  • Aggregate results and present unified response                │
│  • Maintain conversation continuity and context                  │
│  • Make high-level architectural decisions                       │
│  • Handle user clarifications and questions                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   EXPLORER    │   │   ARCHITECT   │   │   EXECUTOR    │
│    AGENT      │   │    AGENT      │   │    AGENT      │
│               │   │               │   │               │
│ • Codebase    │   │ • Design      │   │ • Implement   │
│   exploration │   │   solutions   │   │   changes     │
│ • Find files  │   │ • Plan work   │   │ • Run tests   │
│ • Understand  │   │ • Review      │   │ • Debug       │
│   patterns    │   │   architecture│   │ • Refactor    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   REVIEWER    │   │   TESTER      │   │   DOC WRITER  │
│    AGENT      │   │    AGENT      │   │    AGENT      │
│               │   │               │   │               │
│ • Code review │   │ • Write tests │   │ • Documentation│
│ • Security    │   │ • Run tests   │   │ • Comments    │
│   audit       │   │ • Coverage    │   │ • README      │
│ • Best        │   │   analysis    │   │ • API docs    │
│   practices   │   │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Agent Definitions

### 1. Director Claude (Primary)
The user-facing agent that orchestrates all work.

**When to delegate vs. handle directly:**
- **Direct handling**: Simple questions, single-file changes, clarifications
- **Delegate to Explorer**: "Find all files that...", "How does X work?", "Where is Y defined?"
- **Delegate to Architect**: "Design a system for...", "Plan the implementation of..."
- **Delegate to Executor**: "Implement X", "Fix bug Y", "Refactor Z"
- **Delegate to Reviewer**: "Review this code", "Check for security issues"
- **Delegate to Tester**: "Write tests for...", "Run the test suite"
- **Delegate to DocWriter**: "Document this function", "Update the README"

**Parallel delegation**: When tasks are independent, spawn multiple agents simultaneously.

### 2. Explorer Agent
Specialized for codebase exploration and understanding.

```javascript
// Spawn with:
Task({
  subagent_type: "Explore",
  prompt: "Find all React components that handle user authentication...",
  description: "Find auth components"
})
```

### 3. Architect Agent
Designs solutions and creates implementation plans.

```javascript
// Spawn with:
Task({
  subagent_type: "Plan",
  prompt: "Design the implementation plan for adding OAuth2 support...",
  description: "Plan OAuth2 implementation"
})
```

### 4. Executor Agent
Implements changes, runs commands, debugs issues.

```javascript
// Spawn with:
Task({
  subagent_type: "general-purpose",
  prompt: "Implement the authentication middleware as described in the plan...",
  description: "Implement auth middleware"
})
```

### 5. Reviewer Agent
Reviews code for quality, security, and best practices.

```javascript
// Use the code-review skill or spawn:
Skill({ skill: "code-review" })
```

### 6. Tester Agent
Writes and runs tests, analyzes coverage.

```javascript
// Use the testing skill or spawn:
Skill({ skill: "testing" })
```

### 7. DocWriter Agent
Creates documentation and comments.

```javascript
// Spawn with:
Task({
  subagent_type: "general-purpose",
  prompt: "Write comprehensive documentation for the API module...",
  description: "Document API module"
})
```

## Context Management Strategy

### Problem
Claude has a context window that can fill up during complex tasks. When context compacts, information is lost.

### Solution: Hierarchical Context

1. **Director keeps high-level context**
   - User goals and preferences
   - Project architecture overview
   - Decisions made and rationale
   - Status of ongoing work

2. **Agents work with focused context**
   - Only receive relevant information for their task
   - Return concise summaries to Director
   - Don't need to know about other agents' work

3. **Persistent state**
   - Use `.claude/state/` for session persistence
   - TodoWrite for task tracking
   - Git commits for code state

### Context Preservation Protocol

Before compaction:
1. Save current task state to `.claude/state/session.json`
2. Commit any pending changes
3. Update TodoWrite with current status

After compaction:
1. SessionStart hook reloads state
2. Director reviews recent git history
3. Continues from saved state

## Routing Rules

### Automatic Routing (via CLAUDE.md instructions)

```markdown
## Task Routing

When receiving a request, analyze it and route appropriately:

### Route to Explorer (subagent_type: "Explore")
- Questions about codebase structure
- Finding file locations
- Understanding existing patterns
- "Where is...", "How does X work...", "Find all..."

### Route to Architect (subagent_type: "Plan")
- New feature design
- System architecture questions
- Implementation planning
- "Design...", "Plan...", "How should we structure..."

### Route to Executor (subagent_type: "general-purpose")
- Code implementation
- Bug fixes
- Running commands
- "Implement...", "Fix...", "Add...", "Update..."

### Handle Directly
- Clarification questions
- Simple edits (< 3 files)
- Conversation/explanation
- Git commits (use git-automation skill)
```

## Example Workflows

### Feature Implementation

```
User: "Add a user settings page with theme preferences"

Director:
1. Spawn Explorer: "Find existing settings/preferences patterns in codebase"
2. Spawn Architect: "Design user settings page with theme support"
3. Wait for results
4. Review plans with user
5. Spawn Executor: "Implement settings page per architecture plan"
6. Spawn Tester: "Write tests for settings functionality"
7. Spawn Reviewer: "Review the settings implementation"
8. Aggregate feedback
9. Spawn Executor (if fixes needed): "Address review feedback"
10. Create commit with git-automation skill
```

### Bug Investigation

```
User: "Users report login sometimes fails silently"

Director:
1. Spawn Explorer: "Find authentication and login handling code"
2. Analyze findings
3. Spawn Executor: "Add detailed logging to login flow"
4. Spawn Tester: "Create test cases for login edge cases"
5. Present findings to user
6. If fix identified, spawn Executor for implementation
```

### Code Refactoring

```
User: "Refactor the API client to use async/await instead of callbacks"

Director:
1. Spawn Explorer: "Find all API client usage and callback patterns"
2. Spawn Architect: "Plan migration from callbacks to async/await"
3. For each file group (parallel):
   - Spawn Executor: "Refactor [file] to async/await"
4. Spawn Tester: "Run full test suite"
5. Spawn Reviewer: "Review async/await migration"
6. Create atomic commits per logical change
```

## Configuration

Add to CLAUDE.md:

```markdown
## Agent Configuration

### Director Behavior
- Always explain what agents are being spawned and why
- Summarize agent results for the user
- Ask for confirmation before major changes
- Use parallel agents when tasks are independent

### Agent Limits
- Max concurrent agents: 5
- Prefer reusing agents over spawning new ones
- Kill idle agents after task completion

### Context Thresholds
- Spawn Explorer when > 50 files might be relevant
- Spawn Architect when > 5 files need changes
- Always spawn Tester after significant changes
```

## Benefits

1. **Context efficiency**: Each agent has focused context
2. **Parallelism**: Independent tasks run simultaneously
3. **Specialization**: Agents optimized for specific tasks
4. **Auditability**: Clear record of what each agent did
5. **Reliability**: Failures isolated to specific agents
6. **User clarity**: Director provides unified interface
