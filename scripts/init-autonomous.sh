#!/bin/bash
# Initialize a project with modular autonomous Claude configuration
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
mkdir -p "$TARGET_DIR/.claude/config"
mkdir -p "$TARGET_DIR/.claude/logs"
mkdir -p "$TARGET_DIR/.claude/diffs"

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

# Copy core rules (always applied)
for rule in autonomous-mode.md code-quality.md git-workflow.md sandbox-levels.md; do
    cp "$SOURCE_DIR/rules/$rule" "$TARGET_DIR/.claude/rules/" 2>/dev/null || true
done

# Copy commands
cp "$SOURCE_DIR/commands/"*.md "$TARGET_DIR/.claude/commands/" 2>/dev/null || true

# Create default features config
cat > "$TARGET_DIR/.claude/config/features.json" << 'EOF'
{
  "logging": true,
  "autoLinting": true,
  "autoBackups": true,
  "autoGitCommits": true,
  "diffTracking": true,
  "pathSanitization": true,
  "directorMode": true,
  "swarmMode": false,
  "structuredSdlc": false,
  "hundredAndHundred": false
}
EOF

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

# Set default sandbox level
echo "asuser" > "$TARGET_DIR/.claude/sandbox-level"

# Initialize git if needed
if ! git -C "$TARGET_DIR" rev-parse --git-dir >/dev/null 2>&1; then
    git -C "$TARGET_DIR" init
    echo "Initialized new git repository"
fi

echo ""
echo "Base setup complete!"
echo ""
echo "Directories created:"
echo "  .claude/rules/      - Core rules (auto-loaded)"
echo "  .claude/config/     - Feature configuration"
echo "  .claude/skills/     - Available skills"
echo "  .claude/commands/   - Slash commands"
echo "  .claude/backups/    - File backups"
echo "  .claude/logs/       - Session logs"
echo "  .claude/diffs/      - Change diffs"
echo ""
echo "Next steps:"
echo "  1. Claude will prompt for security level and features"
echo "  2. Relevant modules will be copied to .claude/rules/"
echo "  3. Project CLAUDE.md will be generated"
echo ""
echo "Available modules in ~/.claude/modules/:"
ls -1 "$SOURCE_DIR/modules/" 2>/dev/null || echo "  (none found)"
echo ""
