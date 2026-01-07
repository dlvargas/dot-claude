#!/bin/bash
# Initialize a swarm session workspace
# Usage: swarm-init.sh [project-path]

PROJECT_PATH="${1:-.}"
SESSION_ID=$(date +%Y%m%d_%H%M%S)_$$
SWARM_DIR="$PROJECT_PATH/.claude/swarm/$SESSION_ID"

# Create workspace structure
mkdir -p "$SWARM_DIR"/{deliverables,reports,collaboration,sentiment}

# Initialize session metadata
cat > "$SWARM_DIR/session.json" << EOF
{
  "session_id": "$SESSION_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "project_path": "$PROJECT_PATH",
  "status": "initialized",
  "managers_spawned": [],
  "total_ics": 0
}
EOF

# Initialize sentiment tracking
cat > "$SWARM_DIR/sentiment/aggregate.json" << EOF
{
  "session_id": "$SESSION_ID",
  "reports": [],
  "aggregate": {
    "confidence": null,
    "clarity": null,
    "collaboration": null,
    "alignment": null
  }
}
EOF

# Create collaboration README
cat > "$SWARM_DIR/collaboration/README.md" << EOF
# Collaboration Workspace

This directory is shared between all ICs in the swarm.

## Usage
- Place files here that other ICs need to reference
- Use clear naming: \`{role}_{artifact}.{ext}\`
- Leave notes in \`notes.md\` for coordination

## Current Session
Session ID: $SESSION_ID
Created: $(date)
EOF

touch "$SWARM_DIR/collaboration/notes.md"

echo "Swarm workspace initialized: $SWARM_DIR"
echo "Session ID: $SESSION_ID"
