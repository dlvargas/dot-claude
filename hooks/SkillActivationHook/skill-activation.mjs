#!/usr/bin/env node
/**
 * Skill Activation Hook: Analyzes user prompts and suggests relevant skills
 * Runs on UserPromptSubmit to inject skill recommendations
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SKILL_RULES_PATH = join(process.cwd(), '.claude', 'skills', 'skill-rules.json');

function loadSkillRules() {
  try {
    if (existsSync(SKILL_RULES_PATH)) {
      return JSON.parse(readFileSync(SKILL_RULES_PATH, 'utf8'));
    }
  } catch (e) {
    // Return default rules if file doesn't exist
  }

  return {
    skills: {
      "git-automation": {
        enforcement: "suggest",
        priority: "critical",
        promptTriggers: {
          keywords: ["commit", "push", "pr", "pull request", "merge", "branch", "git"],
          intentPatterns: ["(create|make|open).*?(commit|pr|pull request)"]
        }
      },
      "session-management": {
        enforcement: "suggest",
        priority: "high",
        promptTriggers: {
          keywords: ["feature", "implement", "build", "refactor", "create"],
          intentPatterns: ["(implement|build|create).*?(feature|component|system)"]
        }
      },
      "code-review": {
        enforcement: "suggest",
        priority: "medium",
        promptTriggers: {
          keywords: ["review", "check", "audit", "security", "quality"],
          intentPatterns: ["(review|check|audit).*?(code|changes|implementation)"]
        }
      },
      "testing": {
        enforcement: "suggest",
        priority: "high",
        promptTriggers: {
          keywords: ["test", "spec", "coverage", "unit test", "e2e"],
          intentPatterns: ["(write|add|create).*?test"]
        }
      }
    }
  };
}

function matchSkills(prompt, rules) {
  const matches = [];
  const lowerPrompt = prompt.toLowerCase();

  for (const [skillName, config] of Object.entries(rules.skills)) {
    let matched = false;

    // Check keywords
    for (const keyword of config.promptTriggers.keywords) {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        matched = true;
        break;
      }
    }

    // Check regex patterns if not already matched
    if (!matched && config.promptTriggers.intentPatterns) {
      for (const pattern of config.promptTriggers.intentPatterns) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(prompt)) {
            matched = true;
            break;
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
    }

    if (matched) {
      matches.push({
        name: skillName,
        priority: config.priority,
        enforcement: config.enforcement
      });
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  matches.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return matches;
}

function main() {
  try {
    // Get user prompt from environment
    const prompt = process.env.CLAUDE_USER_PROMPT || '';

    if (!prompt) {
      console.log(JSON.stringify({ status: 'ok' }));
      return;
    }

    const rules = loadSkillRules();
    const matchedSkills = matchSkills(prompt, rules);

    if (matchedSkills.length > 0) {
      const skillList = matchedSkills.map(s => `- **${s.name}** (${s.priority})`).join('\n');

      const output = {
        additionalContext: `
## SKILL ACTIVATION DETECTED

Based on your request, consider activating these skills:
${skillList}

Check .claude/skills/ for skill instructions if needed.
`
      };

      console.log(JSON.stringify(output));
    } else {
      console.log(JSON.stringify({ status: 'ok' }));
    }

  } catch (error) {
    console.log(JSON.stringify({ status: 'ok' }));
  }
}

main();
