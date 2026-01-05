#!/bin/bash
# Check that all required tools for Claude hooks are installed
# Usage: check-requirements.sh [--install]
#
# Exit codes:
#   0 - All requirements met
#   1 - Missing requirements (list printed to stderr)

set -e

INSTALL_MODE="${1:-}"
MISSING=()
WARNINGS=()

# Colors (if terminal supports them)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    NC=''
fi

check_command() {
    local cmd="$1"
    local required="$2"  # "required" or "optional"
    local install_cmd="$3"

    if command -v "$cmd" &>/dev/null; then
        echo -e "${GREEN}✓${NC} $cmd found: $(command -v "$cmd")"
        return 0
    else
        if [ "$required" = "required" ]; then
            echo -e "${RED}✗${NC} $cmd NOT FOUND (required)"
            MISSING+=("$cmd:$install_cmd")
        else
            echo -e "${YELLOW}!${NC} $cmd not found (optional)"
            WARNINGS+=("$cmd:$install_cmd")
        fi
        return 1
    fi
}

echo "Checking Claude Code hook requirements..."
echo ""

# Required tools
echo "=== Required Tools ==="
check_command "node" "required" "brew install node"
check_command "git" "required" "xcode-select --install"

echo ""

# Optional tools (enhance functionality)
echo "=== Optional Tools ==="
check_command "jq" "optional" "brew install jq" || true
check_command "gh" "optional" "brew install gh" || true

echo ""

# Check Node.js version if installed
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version)
    echo "Node.js version: $NODE_VERSION"

    # Check if version is at least v18 (for native fetch, etc.)
    MAJOR_VERSION=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${YELLOW}!${NC} Node.js $NODE_VERSION is older than v18. Some features may not work."
        WARNINGS+=("node-upgrade:brew upgrade node")
    fi
fi

echo ""

# Summary
if [ ${#MISSING[@]} -gt 0 ]; then
    echo -e "${RED}=== Missing Required Tools ===${NC}"
    for item in "${MISSING[@]}"; do
        cmd="${item%%:*}"
        install="${item##*:}"
        echo "  $cmd: Install with: $install"
    done
    echo ""
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo -e "${YELLOW}=== Warnings ===${NC}"
    for item in "${WARNINGS[@]}"; do
        cmd="${item%%:*}"
        install="${item##*:}"
        echo "  $cmd: $install"
    done
    echo ""
fi

# Auto-install mode
if [ "$INSTALL_MODE" = "--install" ] && [ ${#MISSING[@]} -gt 0 ]; then
    echo "Attempting to install missing required tools..."
    for item in "${MISSING[@]}"; do
        cmd="${item%%:*}"
        install="${item##*:}"
        echo "Installing $cmd..."
        eval "$install" || echo "Failed to install $cmd"
    done
fi

# Exit status
if [ ${#MISSING[@]} -gt 0 ]; then
    echo -e "${RED}Some required tools are missing. Hooks may not function correctly.${NC}"
    exit 1
else
    echo -e "${GREEN}All required tools are installed.${NC}"
    exit 0
fi
