# Ship Command - Full Autonomous Workflow

Execute complete autonomous workflow: commit, push, PR, and prepare for merge.

## Instructions

1. **Verify State**
   ```bash
   git status
   git diff --stat
   ```

2. **Create Atomic Commits**
   - If multiple logical changes, create separate commits
   - Each commit should be self-contained

3. **Ensure Feature Branch**
   - If on main, create branch: `git checkout -b feature/<description>`

4. **Commit All Changes**
   ```bash
   git add -A
   git commit -m "<semantic message>"
   ```

5. **Push to Remote**
   ```bash
   git push -u origin HEAD
   ```

6. **Create Pull Request**
   ```bash
   gh pr create --title "<type>: <title>" --body "<comprehensive body>"
   ```

7. **Report Summary**
   - Branch name
   - Commit count
   - PR URL
   - Files changed

## Autonomy Level
This command operates with FULL autonomy. It will:
- Make decisions about commit grouping
- Generate semantic messages
- Create descriptive PRs
- Push without confirmation

Only stops if:
- On protected branch (main/master)
- Merge conflicts detected
- Authentication issues
