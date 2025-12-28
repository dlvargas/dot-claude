#!/usr/bin/env node
/**
 * Auto Git Workflow Hook: Runs on Stop to handle automatic commits/PRs
 * Only activates if AUTO_GIT env var is set or configured in settings
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), '.claude', 'git-automation.json');

function loadConfig() {
  try {
    if (existsSync(CONFIG_PATH)) {
      return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (e) {}

  return {
    autoCommit: false,
    autoPush: false,
    autoPR: false,
    commitPrefix: "",
    branchPattern: "claude/{type}/{description}"
  };
}

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return null;
  }
}

function main() {
  const config = loadConfig();

  // Check if auto-git is enabled
  if (!config.autoCommit && !process.env.CLAUDE_AUTO_GIT) {
    return; // Silent exit - not enabled
  }

  // Check for uncommitted changes
  const status = exec('git status --porcelain');
  if (!status) {
    return; // No changes
  }

  // Get changed files summary
  const changedFiles = status.split('\n').filter(Boolean);
  const fileCount = changedFiles.length;

  if (fileCount === 0) return;

  // Generate commit message based on changes
  const diff = exec('git diff --staged --stat') || exec('git diff --stat');

  console.log(JSON.stringify({
    status: 'pending_commit',
    message: `${fileCount} file(s) modified. Ready for commit.`,
    hint: 'Use /commit to auto-commit or "commit these changes" to proceed.'
  }));
}

main();
