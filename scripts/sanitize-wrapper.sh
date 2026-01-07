#!/bin/bash
# Sanitization wrapper for sensitive commands
# Usage: sanitize-wrapper.sh <command> [args...]
#
# Runs a command and sanitizes the output before returning it.
# Used to protect sensitive data from being exposed to Claude.

set -o pipefail

SCRIPT_DIR="$(dirname "$0")"
SANITIZER="$HOME/.claude/scripts/sanitize-output.sh"

# Run the command and capture output
OUTPUT=$("$@" 2>&1)
EXIT_CODE=$?

# Sanitize if sanitizer exists
if [ -x "$SANITIZER" ]; then
    echo "$OUTPUT" | "$SANITIZER"
else
    # Inline basic sanitization
    echo "$OUTPUT" | sed \
        -e 's/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/[IP_REDACTED]/g' \
        -e "s|/Users/$USER|/Users/[USER]|g" \
        -e "s|/home/$USER|/home/[USER]|g" \
        -e 's/[A-Za-z0-9._%+-]\+@[A-Za-z0-9.-]\+\.[A-Za-z]\{2,\}/[EMAIL_REDACTED]/g' \
        -e 's/AKIA[0-9A-Z]\{16\}/[AWS_KEY_REDACTED]/g' \
        -e 's/\([Pp]assword\|[Ss]ecret\|[Tt]oken\|[Kk]ey\)[=:][^ ]*/\1=[REDACTED]/g'
fi

exit $EXIT_CODE
