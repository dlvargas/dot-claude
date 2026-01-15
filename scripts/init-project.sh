#!/bin/bash
# Interactive Claude Code project initialization
# Usage: init-project.sh [target-dir]

set -e

TARGET_DIR="${1:-.}"
SOURCE_DIR="$HOME/.claude"
CONFIG_FILE="$SOURCE_DIR/config/command-groups.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Check dependencies
check_deps() {
    local missing=()
    command -v jq &>/dev/null || missing+=("jq")
    command -v node &>/dev/null || missing+=("node")

    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${RED}Missing required tools: ${missing[*]}${NC}"
        echo "Install with: brew install ${missing[*]}"
        exit 1
    fi
}

# Read a yes/no response
confirm() {
    local prompt="$1"
    local default="${2:-n}"
    local response

    if [ "$default" = "y" ]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi

    read -r -p "$prompt" response
    response=${response:-$default}
    [[ "$response" =~ ^[Yy] ]]
}

# Display menu and get selection
select_menu() {
    local title="$1"
    shift
    local options=("$@")
    local selected=()
    local i

    echo -e "\n${BOLD}${CYAN}$title${NC}"
    echo "─────────────────────────────────────"

    for i in "${!options[@]}"; do
        echo "  $((i+1)). ${options[$i]}"
    done

    echo -e "\nEnter numbers separated by spaces (e.g., 1 3 5), or 'all'/'none':"
    read -r -p "> " selection

    if [ "$selection" = "all" ]; then
        for i in "${!options[@]}"; do
            selected+=($i)
        done
    elif [ "$selection" != "none" ]; then
        for num in $selection; do
            if [[ "$num" =~ ^[0-9]+$ ]] && [ "$num" -ge 1 ] && [ "$num" -le "${#options[@]}" ]; then
                selected+=($((num-1)))
            fi
        done
    fi

    echo "${selected[@]}"
}

# Show preset selection
select_preset() {
    echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}   Claude Code Project Initialization   ${NC}"
    echo -e "${BOLD}${BLUE}═══════════════════════════════════════${NC}"

    echo -e "\n${BOLD}Select a preset or customize:${NC}\n"

    local presets=($(jq -r '.presets | keys[]' "$CONFIG_FILE"))
    local i=1

    for preset in "${presets[@]}"; do
        local name=$(jq -r ".presets.$preset.name" "$CONFIG_FILE")
        local desc=$(jq -r ".presets.$preset.description" "$CONFIG_FILE")
        echo -e "  ${BOLD}$i.${NC} $name"
        echo -e "     ${CYAN}$desc${NC}"
        ((i++))
    done

    echo -e "  ${BOLD}$i.${NC} Custom (choose individual groups)"

    echo ""
    read -r -p "Select preset (1-$i): " choice

    if [ "$choice" = "$i" ]; then
        echo "custom"
    elif [ "$choice" -ge 1 ] && [ "$choice" -lt "$i" ]; then
        echo "${presets[$((choice-1))]}"
    else
        echo "developer"  # Default
    fi
}

# Select individual command groups
select_groups() {
    echo -e "\n${BOLD}${CYAN}Select Command Groups${NC}"
    echo "Groups marked with [*] are selected by default"
    echo ""

    local groups=($(jq -r '.groups | keys[]' "$CONFIG_FILE"))
    local selected_groups=()

    for group in "${groups[@]}"; do
        local name=$(jq -r ".groups.$group.name" "$CONFIG_FILE")
        local desc=$(jq -r ".groups.$group.description" "$CONFIG_FILE")
        local risk=$(jq -r ".groups.$group.risk" "$CONFIG_FILE")
        local default=$(jq -r ".groups.$group.default" "$CONFIG_FILE")
        local sensitive=$(jq -r ".groups.$group.sensitive // false" "$CONFIG_FILE")

        # Color based on risk
        local risk_color="$GREEN"
        [ "$risk" = "medium" ] && risk_color="$YELLOW"
        [ "$risk" = "high" ] && risk_color="$RED"
        [ "$risk" = "critical" ] && risk_color="${BOLD}${RED}"

        local default_marker=""
        [ "$default" = "true" ] && default_marker=" ${GREEN}[*]${NC}"

        local sensitive_marker=""
        [ "$sensitive" = "true" ] && sensitive_marker=" ${YELLOW}(sensitive)${NC}"

        echo -e "${BOLD}$group${NC}$default_marker$sensitive_marker"
        echo -e "  $desc"
        echo -e "  Risk: ${risk_color}$risk${NC}"
        echo -n "  Commands: "
        jq -r ".groups.$group.commands | join(\", \")" "$CONFIG_FILE" | fold -s -w 60 | sed '2,$s/^/            /'
        echo ""

        local include_default="n"
        [ "$default" = "true" ] && include_default="y"

        if confirm "  Include $name?" "$include_default"; then
            selected_groups+=("$group")
        fi
        echo ""
    done

    echo "${selected_groups[@]}"
}

# Select features
select_features() {
    echo -e "\n${BOLD}${CYAN}Select Features${NC}\n"

    local features=($(jq -r '.features | keys[]' "$CONFIG_FILE"))
    local selected_features=()

    for feature in "${features[@]}"; do
        local name=$(jq -r ".features.$feature.name" "$CONFIG_FILE")
        local desc=$(jq -r ".features.$feature.description" "$CONFIG_FILE")
        local default=$(jq -r ".features.$feature.default" "$CONFIG_FILE")

        local default_marker=""
        [ "$default" = "true" ] && default_marker=" ${GREEN}[*]${NC}"

        echo -e "${BOLD}$feature${NC}$default_marker"
        echo -e "  $desc"

        local include_default="n"
        [ "$default" = "true" ] && include_default="y"

        if confirm "  Enable?" "$include_default"; then
            selected_features+=("$feature")
        fi
        echo ""
    done

    echo "${selected_features[@]}"
}

# Generate settings.json
generate_settings() {
    local groups=($1)
    local features=($2)
    local output_file="$3"

    echo "Generating settings..."

    # Build permissions array
    local permissions=()

    # Always include base tools
    permissions+=("Write" "Edit" "MultiEdit" "Read" "Glob" "Grep")

    # Add commands from selected groups
    for group in "${groups[@]}"; do
        local commands=($(jq -r ".groups.$group.commands[]" "$CONFIG_FILE"))
        for cmd in "${commands[@]}"; do
            if [ "$cmd" = "pwd" ]; then
                permissions+=("Bash(pwd)")
            else
                permissions+=("Bash($cmd:*)")
            fi
        done
    done

    # Build hooks configuration
    local hooks_json="{}"

    for feature in "${features[@]}"; do
        local hook=$(jq -r ".features.$feature.hook // empty" "$CONFIG_FILE")
        local hooks_array=$(jq -r ".features.$feature.hooks // empty" "$CONFIG_FILE")

        if [ -n "$hook" ]; then
            # Determine hook type from path
            local hook_type=$(dirname "$hook" | sed 's/.*\///')
            [ "$hook_type" = "." ] && hook_type="Stop"

            # Add to hooks config
            hooks_json=$(echo "$hooks_json" | jq --arg type "$hook_type" --arg hook "$hook" '
                .[$type] //= [] |
                .[$type] += [{
                    "hooks": [{
                        "type": "command",
                        "command": "node ~/.claude/hooks/\($hook) 2>/dev/null || true"
                    }]
                }]
            ')
        fi
    done

    # Generate final settings
    local permissions_json=$(printf '%s\n' "${permissions[@]}" | jq -R . | jq -s .)

    jq -n \
        --argjson perms "$permissions_json" \
        --argjson hooks "$hooks_json" \
        '{
            permissions: {
                allow: $perms,
                deny: []
            },
            hooks: $hooks
        }' > "$output_file"

    echo -e "${GREEN}Settings generated: $output_file${NC}"
}

# Main flow
main() {
    check_deps

    echo -e "${BOLD}Initializing Claude Code for: ${CYAN}$TARGET_DIR${NC}"

    # Check requirements
    if [ -x "$SOURCE_DIR/scripts/check-requirements.sh" ]; then
        "$SOURCE_DIR/scripts/check-requirements.sh" || true
    fi

    # Select preset or custom
    local preset=$(select_preset)
    local selected_groups=""
    local selected_features=""

    if [ "$preset" = "custom" ]; then
        selected_groups=$(select_groups)
        selected_features=$(select_features)
    else
        # Get groups and features from preset
        local preset_groups=$(jq -r ".presets.$preset.groups | if . == [\"*\"] then (.groups | keys) else . end | .[]" "$CONFIG_FILE" 2>/dev/null || echo "")
        local preset_features=$(jq -r ".presets.$preset.features | if . == [\"*\"] then (.features | keys) else . end | .[]" "$CONFIG_FILE" 2>/dev/null || echo "")

        selected_groups="$preset_groups"
        selected_features="$preset_features"

        echo -e "\n${GREEN}Using preset: $(jq -r ".presets.$preset.name" "$CONFIG_FILE")${NC}"
    fi

    # Create directories
    mkdir -p "$TARGET_DIR/.claude/hooks/PreToolUse"
    mkdir -p "$TARGET_DIR/.claude/hooks/PostToolUse"
    mkdir -p "$TARGET_DIR/.claude/hooks/ContextRecoveryHook"
    mkdir -p "$TARGET_DIR/.claude/rules"
    mkdir -p "$TARGET_DIR/.claude/skills"
    mkdir -p "$TARGET_DIR/.claude/logs"

    # Generate settings
    generate_settings "$selected_groups" "$selected_features" "$TARGET_DIR/.claude/settings.json"

    # Copy hooks for selected features
    for feature in $selected_features; do
        local hook=$(jq -r ".features.$feature.hook // empty" "$CONFIG_FILE")
        if [ -n "$hook" ] && [ -f "$SOURCE_DIR/hooks/$hook" ]; then
            local hook_dir=$(dirname "$hook")
            mkdir -p "$TARGET_DIR/.claude/hooks/$hook_dir"
            cp "$SOURCE_DIR/hooks/$hook" "$TARGET_DIR/.claude/hooks/$hook"
        fi
    done

    # Copy rules
    cp "$SOURCE_DIR/rules/"*.md "$TARGET_DIR/.claude/rules/" 2>/dev/null || true

    # Initialize logging if selected
    if echo "$selected_features" | grep -q "command-logging"; then
        echo "Initializing command logging database..."
        node "$SOURCE_DIR/scripts/init-logging-db.mjs" "$TARGET_DIR/.claude/logs/commands.db" 2>/dev/null || true
    fi

    # Summary
    echo -e "\n${BOLD}${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}   Initialization Complete!             ${NC}"
    echo -e "${BOLD}${GREEN}═══════════════════════════════════════${NC}"

    echo -e "\n${BOLD}Selected Groups:${NC}"
    for group in $selected_groups; do
        echo -e "  ${GREEN}✓${NC} $group"
    done

    echo -e "\n${BOLD}Enabled Features:${NC}"
    for feature in $selected_features; do
        echo -e "  ${GREEN}✓${NC} $feature"
    done

    echo -e "\n${CYAN}Settings saved to: $TARGET_DIR/.claude/settings.json${NC}"
    echo -e "${CYAN}Run 'claude' in $TARGET_DIR to start${NC}"
}

main "$@"
