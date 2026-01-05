#!/usr/bin/env node
/**
 * Initialize the SQLite logging database for Claude Code command tracking
 */

import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { execSync } from 'child_process';

const dbPath = process.argv[2] || `${process.env.HOME}/.claude/logs/commands.db`;

// Ensure directory exists
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const schema = `
-- Command execution log
CREATE TABLE IF NOT EXISTS command_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    tool_use_id TEXT UNIQUE,

    -- Timing data
    time_inferred DATETIME,           -- When Claude decided to run the command
    time_submitted DATETIME,          -- When hook received the command
    time_started DATETIME,            -- When command actually started executing
    time_completed DATETIME,          -- When command finished
    time_response_received DATETIME,  -- When Claude got the result

    -- Duration calculations (stored for easy querying)
    duration_queue_ms INTEGER,        -- submitted - inferred
    duration_execution_ms INTEGER,    -- completed - started
    duration_total_ms INTEGER,        -- response_received - inferred

    -- Command details
    tool_name TEXT NOT NULL,
    command TEXT,
    command_hash TEXT,                -- For grouping similar commands
    working_directory TEXT,

    -- Size metrics (bytes)
    prompt_size_bytes INTEGER,
    command_size_bytes INTEGER,
    output_size_bytes INTEGER,
    response_size_bytes INTEGER,

    -- Result
    exit_code INTEGER,
    success BOOLEAN,
    error_message TEXT,
    output_preview TEXT,              -- First 500 chars of output

    -- Sanitization tracking
    was_sanitized BOOLEAN DEFAULT 0,
    sanitized_fields TEXT,            -- JSON array of field names that were sanitized

    -- Linking
    parent_id INTEGER,                -- For command chains
    next_id INTEGER,                  -- FK to next log entry

    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES command_log(id),
    FOREIGN KEY (next_id) REFERENCES command_log(id)
);

-- Session tracking
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    project_path TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,

    -- Aggregates
    total_commands INTEGER DEFAULT 0,
    total_prompt_bytes INTEGER DEFAULT 0,
    total_output_bytes INTEGER DEFAULT 0,
    total_duration_ms INTEGER DEFAULT 0,

    -- Configuration
    preset_used TEXT,
    groups_enabled TEXT,              -- JSON array
    features_enabled TEXT             -- JSON array
);

-- Sensitive data patterns (for sanitization reference)
CREATE TABLE IF NOT EXISTS sensitive_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_type TEXT NOT NULL,       -- ip, email, path, name, key, etc.
    pattern_regex TEXT NOT NULL,
    replacement_template TEXT,        -- e.g., "[IP_REDACTED]", "[EMAIL_{n}]"
    enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default sensitive patterns
INSERT OR IGNORE INTO sensitive_patterns (pattern_type, pattern_regex, replacement_template) VALUES
    ('ipv4', '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', '[IP_REDACTED]'),
    ('ipv6', '\\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b', '[IPV6_REDACTED]'),
    ('email', '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', '[EMAIL_REDACTED]'),
    ('mac_address', '\\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\\b', '[MAC_REDACTED]'),
    ('aws_key', 'AKIA[0-9A-Z]{16}', '[AWS_KEY_REDACTED]'),
    ('private_key', '-----BEGIN [A-Z ]+ PRIVATE KEY-----', '[PRIVATE_KEY_REDACTED]'),
    ('jwt', 'eyJ[A-Za-z0-9-_]+\\.eyJ[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/]*', '[JWT_REDACTED]'),
    ('password_field', '(?i)(password|passwd|pwd|secret|token|api_key|apikey)\\s*[=:]\\s*[^\\s]+', '[CREDENTIAL_REDACTED]'),
    ('home_path', '/Users/[^/\\s]+', '/Users/[USER]'),
    ('ssh_key', 'ssh-(?:rsa|ed25519|ecdsa)\\s+[A-Za-z0-9+/]+', '[SSH_KEY_REDACTED]');

-- Aggregated statistics view
CREATE VIEW IF NOT EXISTS command_stats AS
SELECT
    tool_name,
    COUNT(*) as total_calls,
    AVG(duration_execution_ms) as avg_execution_ms,
    MAX(duration_execution_ms) as max_execution_ms,
    SUM(output_size_bytes) as total_output_bytes,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failure_count
FROM command_log
GROUP BY tool_name;

-- Hourly activity view
CREATE VIEW IF NOT EXISTS hourly_activity AS
SELECT
    strftime('%Y-%m-%d %H:00', time_submitted) as hour,
    COUNT(*) as command_count,
    SUM(duration_execution_ms) as total_duration_ms,
    AVG(duration_execution_ms) as avg_duration_ms
FROM command_log
WHERE time_submitted IS NOT NULL
GROUP BY hour
ORDER BY hour DESC;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_session_id ON command_log(session_id);
CREATE INDEX IF NOT EXISTS idx_tool_name ON command_log(tool_name);
CREATE INDEX IF NOT EXISTS idx_time_submitted ON command_log(time_submitted);
CREATE INDEX IF NOT EXISTS idx_command_hash ON command_log(command_hash);
`;

try {
  // Execute schema using sqlite3 CLI
  execSync(`sqlite3 "${dbPath}" "${schema.replace(/"/g, '\\"')}"`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  console.log(`Database initialized: ${dbPath}`);
  console.log('Tables created: command_log, sessions, sensitive_patterns');
  console.log('Views created: command_stats, hourly_activity');
} catch (error) {
  console.error('Failed to initialize database:', error.message);
  process.exit(1);
}
