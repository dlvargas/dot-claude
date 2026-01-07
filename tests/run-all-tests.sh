#!/bin/bash
#
# Run all dot-claude automation tests
#

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           dot-claude Automation Test Suite                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

TESTS_RUN=0
SUITES_PASSED=0
SUITES_FAILED=0

run_test() {
    local test_file="$1"
    local test_name="$2"

    echo "┌──────────────────────────────────────────────────────────────┐"
    echo "│ Running: $test_name"
    echo "└──────────────────────────────────────────────────────────────┘"

    if node "$test_file" 2>&1; then
        ((SUITES_PASSED++))
    else
        ((SUITES_FAILED++))
    fi
    ((TESTS_RUN++))
    echo ""
}

# Run each test suite
run_test "test-sandbox-manager.mjs" "Sandbox Manager Tests"
run_test "test-backup-manager.mjs" "Backup Manager Tests"
run_test "test-git-verifier.mjs" "Git Verifier Tests"
run_test "test-sandbox-interceptor.mjs" "Sandbox Interceptor Tests"
run_test "test-sanitizer.mjs" "Sanitizer Tests"
run_test "test-swarm.mjs" "Swarm Orchestration Tests"
run_test "test-logging.mjs" "Logging System Tests"
run_test "test-soft-delete.mjs" "Soft Delete Tests"
run_test "test-sandbox-levels.mjs" "Sandbox Levels Tests"
run_test "test-backup-restore.mjs" "Backup & Restore Tests"
run_test "test-regression-reversal.mjs" "Regression Reversal Tests"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Test Suite Complete                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
printf "║  Test suites: %d passed, %d failed (of %d total)              ║\n" "$SUITES_PASSED" "$SUITES_FAILED" "$TESTS_RUN"
echo "╚══════════════════════════════════════════════════════════════╝"

# Exit with error if any suite failed
if [ "$SUITES_FAILED" -gt 0 ]; then
    exit 1
fi
exit 0
