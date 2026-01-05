#!/bin/bash
# Analyze Claude Code sessions to find optimization opportunities
# Usage: analyze-sessions.sh [--verbose]

VERBOSE="${1:-}"
PROJECTS_DIR="$HOME/.claude/projects"

echo "=== Claude Code Session Analysis ==="
echo ""

# Count total sessions
SESSION_COUNT=$(find "$PROJECTS_DIR" -name "*.jsonl" -type f 2>/dev/null | wc -l | tr -d ' ')
echo "Total sessions found: $SESSION_COUNT"
echo ""

# Tool usage summary
echo "=== Tool Usage (All Sessions) ==="
find "$PROJECTS_DIR" -name "*.jsonl" -exec cat {} \; 2>/dev/null | \
  jq -r 'select(.type == "assistant") | .message.content[]? | select(.type == "tool_use") | .name' 2>/dev/null | \
  sort | uniq -c | sort -rn | head -15
echo ""

# Bash command analysis
echo "=== Top Bash Commands ==="
find "$PROJECTS_DIR" -name "*.jsonl" -exec cat {} \; 2>/dev/null | \
  jq -r 'select(.type == "assistant") | .message.content[]? | select(.type == "tool_use" and .name == "Bash") | .input.command' 2>/dev/null | \
  grep -oE '^[a-zA-Z0-9_/-]+' | grep -v '^-$' | grep -v '^EOF$' | grep -v '^$' | \
  sort | uniq -c | sort -rn | head -30
echo ""

# Check current permissions
echo "=== Commands NOT in Allow List ==="
ALLOWED=$(cat ~/.claude/settings.json 2>/dev/null | jq -r '.permissions.allow[]' | grep "Bash(" | sed 's/Bash(//' | sed 's/:.*)//' | sort -u)

find "$PROJECTS_DIR" -name "*.jsonl" -exec cat {} \; 2>/dev/null | \
  jq -r 'select(.type == "assistant") | .message.content[]? | select(.type == "tool_use" and .name == "Bash") | .input.command' 2>/dev/null | \
  grep -oE '^[a-zA-Z0-9_/-]+' | grep -v '^-$' | grep -v '^EOF$' | grep -v '^$' | \
  sort | uniq -c | sort -rn | while read count cmd; do
    if ! echo "$ALLOWED" | grep -qx "$cmd"; then
      echo "$count $cmd (NOT ALLOWED)"
    fi
  done | head -20
echo ""

# File types modified
echo "=== File Types Modified ==="
find "$PROJECTS_DIR" -name "*.jsonl" -exec cat {} \; 2>/dev/null | \
  jq -r 'select(.type == "assistant") | .message.content[]? | select(.type == "tool_use" and (.name == "Write" or .name == "Edit")) | .input.file_path // .input.filePath' 2>/dev/null | \
  grep -oE '\.[a-zA-Z0-9]+$' | sort | uniq -c | sort -rn | head -15
echo ""

# Session duration stats (if verbose)
if [ "$VERBOSE" = "--verbose" ]; then
  echo "=== Session Sizes ==="
  find "$PROJECTS_DIR" -name "*.jsonl" -type f -exec wc -l {} + 2>/dev/null | sort -rn | head -20
  echo ""
fi

echo "=== Recommendations ==="
echo "1. Add frequently used commands to permissions.allow in settings.json"
echo "2. Commands with 'sudo' or 'ssh' should be reviewed before auto-allowing"
echo "3. Consider creating hooks for repetitive patterns"
echo ""
echo "Run with --verbose for more details"
