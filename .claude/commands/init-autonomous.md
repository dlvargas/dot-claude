# Initialize Autonomous Claude Project

Set up a new project with full autonomous Claude configuration.

## Instructions

Run the initialization script (also initializes git if not already a repo):

```bash
~/.claude/scripts/init-autonomous.sh
```

Then create CLAUDE.md using the directory name (use placeholders, don't ask questions):

```markdown
# {directory-name}

## Project Overview
[Add project description]

## Tech Stack
[Add technologies used]

## Build/Test Commands
```bash
# Add build commands
# Add test commands
```

## Current Focus
- Project initialization complete
- Ready for autonomous development

---
*Inherits global autonomous configuration from ~/.claude/*
```

Report success with available commands: /commit, /pr, /ship, /review, /status, /autonomous
