#!/bin/bash
# Initialize a project with autonomous Claude configuration
# Usage: init-autonomous.sh [target-dir]

set -e

TARGET_DIR="${1:-.}"
SOURCE_DIR="$HOME/.claude"

echo "Initializing autonomous Claude configuration..."

# Create directory structure
mkdir -p "$TARGET_DIR/.claude/hooks/ContextRecoveryHook"
mkdir -p "$TARGET_DIR/.claude/hooks/SkillActivationHook"
mkdir -p "$TARGET_DIR/.claude/skills"
mkdir -p "$TARGET_DIR/.claude/rules"
mkdir -p "$TARGET_DIR/.claude/commands"
mkdir -p "$TARGET_DIR/.claude/backups"
mkdir -p "$TARGET_DIR/.claude/scripts"

# Copy settings
cp "$SOURCE_DIR/settings.json" "$TARGET_DIR/.claude/" 2>/dev/null || true

# Copy hooks
cp "$SOURCE_DIR/hooks/ContextRecoveryHook/"*.mjs "$TARGET_DIR/.claude/hooks/ContextRecoveryHook/" 2>/dev/null || true
cp "$SOURCE_DIR/hooks/SkillActivationHook/"*.mjs "$TARGET_DIR/.claude/hooks/SkillActivationHook/" 2>/dev/null || true
cp "$SOURCE_DIR/hooks/auto-git-workflow.mjs" "$TARGET_DIR/.claude/hooks/" 2>/dev/null || true

# Copy skills
cp "$SOURCE_DIR/skills/skill-rules.json" "$TARGET_DIR/.claude/skills/" 2>/dev/null || true
for skill in git-automation session-management code-review testing; do
    cp -r "$SOURCE_DIR/skills/$skill" "$TARGET_DIR/.claude/skills/" 2>/dev/null || true
done

# Copy rules and commands
cp "$SOURCE_DIR/rules/"*.md "$TARGET_DIR/.claude/rules/" 2>/dev/null || true
cp "$SOURCE_DIR/commands/"*.md "$TARGET_DIR/.claude/commands/" 2>/dev/null || true

# Create git automation config
cat > "$TARGET_DIR/.claude/git-automation.json" << 'EOF'
{
  "autoCommit": true,
  "autoPush": false,
  "autoPR": false,
  "commitPrefix": "",
  "branchPattern": "claude/{type}/{description}",
  "protectedBranches": ["main", "master", "production"]
}
EOF

# Initialize git if needed
if ! git -C "$TARGET_DIR" rev-parse --git-dir >/dev/null 2>&1; then
    git -C "$TARGET_DIR" init
    echo "Initialized new git repository"
fi

echo "Setup complete!"
echo ""
echo "Available commands: /commit, /pr, /ship, /review, /status, /autonomous"
echo ""
echo "Next: Create CLAUDE.md with your project details"
