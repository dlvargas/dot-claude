#!/bin/bash
# Analyze Claude Code command logs from SQLite database
# Usage: analyze-logs.sh [database-path] [--report type]

DB_PATH="${1:-$HOME/.claude/logs/commands.db}"
REPORT_TYPE="${2:---summary}"

if [ ! -f "$DB_PATH" ]; then
    echo "Database not found: $DB_PATH"
    echo "Run init-logging-db.mjs first or enable command-logging feature"
    exit 1
fi

# Colors
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

summary_report() {
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}   Claude Code Command Log Analysis     ${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════${NC}"
    echo ""

    echo -e "${BOLD}Total Commands:${NC}"
    sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM command_log;"
    echo ""

    echo -e "${BOLD}Commands by Tool:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT tool_name, COUNT(*) as count,
               printf('%.2f', AVG(duration_execution_ms)) as avg_ms,
               printf('%.2f', SUM(output_size_bytes)/1024.0) as output_kb
        FROM command_log
        GROUP BY tool_name
        ORDER BY count DESC
        LIMIT 15;
    "
    echo ""

    echo -e "${BOLD}Success Rate:${NC}"
    sqlite3 "$DB_PATH" "
        SELECT
            printf('%.1f%%', 100.0 * SUM(CASE WHEN success THEN 1 ELSE 0 END) / COUNT(*)) as success_rate,
            SUM(CASE WHEN success THEN 1 ELSE 0 END) as successes,
            SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failures
        FROM command_log;
    "
    echo ""

    echo -e "${BOLD}Data Transfer:${NC}"
    sqlite3 "$DB_PATH" "
        SELECT
            printf('%.2f KB', SUM(prompt_size_bytes)/1024.0) as total_prompt,
            printf('%.2f KB', SUM(output_size_bytes)/1024.0) as total_output,
            printf('%.2f KB', SUM(response_size_bytes)/1024.0) as total_response
        FROM command_log;
    "
    echo ""

    echo -e "${BOLD}Average Timing:${NC}"
    sqlite3 "$DB_PATH" "
        SELECT
            printf('%.0f ms', AVG(duration_execution_ms)) as avg_execution,
            printf('%.0f ms', MAX(duration_execution_ms)) as max_execution,
            printf('%.0f ms', AVG(duration_total_ms)) as avg_total
        FROM command_log
        WHERE duration_execution_ms IS NOT NULL;
    "
}

timing_report() {
    echo -e "${BOLD}${CYAN}Timing Analysis${NC}"
    echo ""

    echo -e "${BOLD}Slowest Commands:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            tool_name,
            substr(command, 1, 50) as command_preview,
            duration_execution_ms as exec_ms,
            time_submitted
        FROM command_log
        WHERE duration_execution_ms IS NOT NULL
        ORDER BY duration_execution_ms DESC
        LIMIT 20;
    "
    echo ""

    echo -e "${BOLD}Commands by Hour:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT * FROM hourly_activity LIMIT 24;
    "
}

errors_report() {
    echo -e "${BOLD}${CYAN}Error Analysis${NC}"
    echo ""

    echo -e "${BOLD}Failed Commands:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            tool_name,
            substr(command, 1, 40) as command,
            exit_code,
            substr(error_message, 1, 60) as error
        FROM command_log
        WHERE success = 0
        ORDER BY time_submitted DESC
        LIMIT 30;
    "
    echo ""

    echo -e "${BOLD}Error Rate by Tool:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            tool_name,
            COUNT(*) as total,
            SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as errors,
            printf('%.1f%%', 100.0 * SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) / COUNT(*)) as error_rate
        FROM command_log
        GROUP BY tool_name
        HAVING errors > 0
        ORDER BY errors DESC;
    "
}

patterns_report() {
    echo -e "${BOLD}${CYAN}Command Patterns${NC}"
    echo ""

    echo -e "${BOLD}Most Common Command Patterns:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            command_hash,
            COUNT(*) as occurrences,
            tool_name,
            substr(MIN(command), 1, 60) as example
        FROM command_log
        GROUP BY command_hash
        ORDER BY occurrences DESC
        LIMIT 20;
    "
    echo ""

    echo -e "${BOLD}Bash Commands Distribution:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            CASE
                WHEN command LIKE 'git %' THEN 'git'
                WHEN command LIKE 'npm %' THEN 'npm'
                WHEN command LIKE 'node %' THEN 'node'
                WHEN command LIKE 'python%' THEN 'python'
                WHEN command LIKE 'ls %' OR command = 'ls' THEN 'ls'
                WHEN command LIKE 'cat %' THEN 'cat'
                WHEN command LIKE 'grep %' THEN 'grep'
                WHEN command LIKE 'find %' THEN 'find'
                ELSE 'other'
            END as cmd_type,
            COUNT(*) as count
        FROM command_log
        WHERE tool_name = 'Bash'
        GROUP BY cmd_type
        ORDER BY count DESC;
    "
}

sessions_report() {
    echo -e "${BOLD}${CYAN}Session Analysis${NC}"
    echo ""

    echo -e "${BOLD}Recent Sessions:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            session_id,
            COUNT(*) as commands,
            MIN(time_submitted) as started,
            MAX(time_completed) as ended,
            printf('%.2f KB', SUM(output_size_bytes)/1024.0) as data
        FROM command_log
        GROUP BY session_id
        ORDER BY started DESC
        LIMIT 10;
    "
}

sanitization_report() {
    echo -e "${BOLD}${CYAN}Sanitization Report${NC}"
    echo ""

    echo -e "${BOLD}Sanitized Commands:${NC}"
    sqlite3 -column -header "$DB_PATH" "
        SELECT
            COUNT(*) as total_sanitized,
            GROUP_CONCAT(DISTINCT sanitized_fields) as patterns_used
        FROM command_log
        WHERE was_sanitized = 1;
    "
}

export_csv() {
    OUTPUT_FILE="${3:-command_log_export.csv}"
    echo "Exporting to $OUTPUT_FILE..."
    sqlite3 -header -csv "$DB_PATH" "
        SELECT
            id, session_id, tool_name, command,
            time_submitted, time_completed,
            duration_execution_ms, duration_total_ms,
            prompt_size_bytes, output_size_bytes,
            exit_code, success, was_sanitized
        FROM command_log
        ORDER BY time_submitted;
    " > "$OUTPUT_FILE"
    echo "Exported $(wc -l < "$OUTPUT_FILE") rows to $OUTPUT_FILE"
}

case "$REPORT_TYPE" in
    --summary|-s)
        summary_report
        ;;
    --timing|-t)
        timing_report
        ;;
    --errors|-e)
        errors_report
        ;;
    --patterns|-p)
        patterns_report
        ;;
    --sessions)
        sessions_report
        ;;
    --sanitization)
        sanitization_report
        ;;
    --export)
        export_csv "$@"
        ;;
    --all|-a)
        summary_report
        echo -e "\n${BOLD}────────────────────────────────────────${NC}\n"
        timing_report
        echo -e "\n${BOLD}────────────────────────────────────────${NC}\n"
        errors_report
        echo -e "\n${BOLD}────────────────────────────────────────${NC}\n"
        patterns_report
        ;;
    *)
        echo "Usage: analyze-logs.sh [db-path] [report-type]"
        echo ""
        echo "Report types:"
        echo "  --summary, -s     Overall statistics (default)"
        echo "  --timing, -t      Timing analysis"
        echo "  --errors, -e      Error analysis"
        echo "  --patterns, -p    Command patterns"
        echo "  --sessions        Session breakdown"
        echo "  --sanitization    Sanitization statistics"
        echo "  --export [file]   Export to CSV"
        echo "  --all, -a         All reports"
        ;;
esac
