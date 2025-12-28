# Clone and Setup Autonomous Project

Clone a repository and immediately set up autonomous Claude configuration.

## Arguments
$ARGUMENTS - The git repository URL to clone

## Instructions

1. **Clone the Repository**
   ```bash
   git clone $ARGUMENTS
   ```

2. **Get Directory Name**
   Extract the repo name from the URL (last path component without .git)

3. **Change to Directory**
   ```bash
   cd <repo-name>
   ```

4. **Run Full Init**
   Execute the same steps as /init-autonomous:
   - Create .claude directory structure
   - Copy all configuration from ~/.claude/
   - Create project CLAUDE.md
   - Set up git-automation.json

5. **Analyze Project**
   - Detect tech stack (package.json, requirements.txt, go.mod, etc.)
   - Identify build/test commands
   - Update CLAUDE.md with detected info

6. **Report**
   - Confirm clone successful
   - Show detected tech stack
   - List available commands
   - Display: "🤖 AUTONOMOUS MODE READY"
