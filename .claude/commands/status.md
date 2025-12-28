# Status Command

Display current session and project status.

## Instructions

Gather and display:

1. **Git Status**
   ```bash
   git status --short
   git log --oneline -3
   ```

2. **Active TODOs**
   - List any pending TODO items from the current session

3. **Modified Files**
   ```bash
   git diff --stat
   ```

4. **Branch Info**
   ```bash
   git branch --show-current
   git log --oneline origin/main..HEAD 2>/dev/null || echo "No upstream"
   ```

5. **Session Info**
   - Skills loaded
   - Hooks active
   - Autonomy level

## Output Format
```
📊 SESSION STATUS
━━━━━━━━━━━━━━━━
Branch: <branch>
Uncommitted: <count> files
Ahead of main: <count> commits

📝 PENDING TODOS
<list>

🔧 ACTIVE CONFIGURATION
- Autonomy: MAXIMUM
- Auto-commit: ENABLED
- Skills: git-automation, session-management
- Hooks: ContextRecovery, SkillActivation, AutoGit
```
