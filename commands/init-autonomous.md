# Initialize Autonomous Claude Project

Set up a new project with full autonomous Claude configuration.

## Instructions

1. **Create Directory Structure**
   ```bash
   mkdir -p .claude/hooks/ContextRecoveryHook .claude/hooks/SkillActivationHook .claude/skills .claude/rules .claude/commands .claude/backups
   ```

2. **Copy Global Configuration**
   ```bash
   cp ~/.claude/settings.json .claude/
   cp ~/.claude/hooks/ContextRecoveryHook/*.mjs .claude/hooks/ContextRecoveryHook/
   cp ~/.claude/hooks/SkillActivationHook/*.mjs .claude/hooks/SkillActivationHook/
   cp ~/.claude/hooks/auto-git-workflow.mjs .claude/hooks/
   cp ~/.claude/skills/skill-rules.json .claude/skills/
   cp -r ~/.claude/skills/git-automation .claude/skills/
   cp -r ~/.claude/skills/session-management .claude/skills/
   cp -r ~/.claude/skills/code-review .claude/skills/
   cp -r ~/.claude/skills/testing .claude/skills/
   cp ~/.claude/rules/*.md .claude/rules/
   cp ~/.claude/commands/*.md .claude/commands/
   ```

3. **Create git-automation.json**
   ```bash
   cat > .claude/git-automation.json << 'EOF'
   {
     "autoCommit": true,
     "autoPush": false,
     "autoPR": false,
     "commitPrefix": "",
     "branchPattern": "claude/{type}/{description}",
     "protectedBranches": ["main", "master", "production"]
   }
   EOF
   ```

4. **Create Project CLAUDE.md**
   Get the current directory name and create a CLAUDE.md with:
   - Project name from directory
   - Placeholder for tech stack
   - Placeholder for build/test commands
   - Current focus section
   - Reference to inherited global config

5. **Initialize Git if Needed**
   ```bash
   git init  # Only if not already a git repo
   ```

6. **Report Success**
   Display confirmation with available commands:
   - /commit, /pr, /ship, /review, /status, /autonomous
