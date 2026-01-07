#!/usr/bin/env node
/**
 * Aggregate swarm reports and sentiment data
 * Usage: swarm-report.mjs <session-path> [--json|--markdown]
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const sessionPath = process.argv[2];
const outputFormat = process.argv[3] || '--markdown';

if (!sessionPath || !existsSync(sessionPath)) {
  console.error('Usage: swarm-report.mjs <session-path> [--json|--markdown]');
  process.exit(1);
}

const reportsDir = join(sessionPath, 'reports');
const sentimentDir = join(sessionPath, 'sentiment');
const deliverablesDir = join(sessionPath, 'deliverables');

// Parse sentiment from report content
function extractSentiment(content) {
  const sentiment = {
    confidence: null,
    clarity: null,
    collaboration: null,
    blockers: 'unknown',
    alignment: null,
    feeling: null
  };

  // Extract numeric ratings
  const confidenceMatch = content.match(/confidence[^:]*:\s*(\d+)/i);
  const clarityMatch = content.match(/clarity[^:]*:\s*(\d+)/i);
  const collaborationMatch = content.match(/collaboration[^:]*:\s*(\d+)/i);
  const alignmentMatch = content.match(/alignment[^:]*:\s*(\d+)|on track[^:]*:\s*(\d+)/i);
  const blockersMatch = content.match(/blocked?\s*[?:]?\s*(none|minor|significant|critical)/i);
  const feelingMatch = content.match(/(?:how I feel|feeling)[^:]*:\s*([^\n]+)/i);

  if (confidenceMatch) sentiment.confidence = parseInt(confidenceMatch[1]);
  if (clarityMatch) sentiment.clarity = parseInt(clarityMatch[1]);
  if (collaborationMatch) sentiment.collaboration = parseInt(collaborationMatch[1]);
  if (alignmentMatch) sentiment.alignment = parseInt(alignmentMatch[1] || alignmentMatch[2]);
  if (blockersMatch) sentiment.blockers = blockersMatch[1].toLowerCase();
  if (feelingMatch) sentiment.feeling = feelingMatch[1].trim();

  return sentiment;
}

// Read all reports
function readReports() {
  const reports = [];

  if (!existsSync(reportsDir)) return reports;

  const files = readdirSync(reportsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = readFileSync(join(reportsDir, file), 'utf8');
    const isManager = file.includes('manager');
    const domain = file.replace(/_manager\.md|_ic\.md/, '');

    reports.push({
      file,
      domain,
      role: isManager ? 'manager' : 'ic',
      content,
      sentiment: extractSentiment(content)
    });
  }

  return reports;
}

// List deliverables
function listDeliverables() {
  if (!existsSync(deliverablesDir)) return [];
  return readdirSync(deliverablesDir);
}

// Aggregate sentiment
function aggregateSentiment(reports) {
  const metrics = {
    confidence: [],
    clarity: [],
    collaboration: [],
    alignment: []
  };

  const blockerCounts = { none: 0, minor: 0, significant: 0, critical: 0 };
  const feelings = [];

  for (const report of reports) {
    const s = report.sentiment;
    if (s.confidence) metrics.confidence.push(s.confidence);
    if (s.clarity) metrics.clarity.push(s.clarity);
    if (s.collaboration) metrics.collaboration.push(s.collaboration);
    if (s.alignment) metrics.alignment.push(s.alignment);
    if (s.blockers && blockerCounts[s.blockers] !== undefined) {
      blockerCounts[s.blockers]++;
    }
    if (s.feeling) feelings.push({ role: report.domain, feeling: s.feeling });
  }

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null;

  return {
    averages: {
      confidence: avg(metrics.confidence),
      clarity: avg(metrics.clarity),
      collaboration: avg(metrics.collaboration),
      alignment: avg(metrics.alignment)
    },
    blockers: blockerCounts,
    hasBlockers: blockerCounts.significant > 0 || blockerCounts.critical > 0,
    feelings,
    reportCount: reports.length,
    managerCount: reports.filter(r => r.role === 'manager').length,
    icCount: reports.filter(r => r.role === 'ic').length
  };
}

// Generate markdown report
function generateMarkdown(reports, sentiment, deliverables) {
  let md = `# Swarm Session Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;

  md += `## Overview\n\n`;
  md += `- **Reports collected:** ${sentiment.reportCount}\n`;
  md += `- **Managers:** ${sentiment.managerCount}\n`;
  md += `- **ICs:** ${sentiment.icCount}\n`;
  md += `- **Deliverables:** ${deliverables.length}\n\n`;

  md += `## Team Sentiment\n\n`;
  md += `| Metric | Score |\n|--------|-------|\n`;
  md += `| Confidence | ${sentiment.averages.confidence || 'N/A'}/10 |\n`;
  md += `| Clarity | ${sentiment.averages.clarity || 'N/A'}/10 |\n`;
  md += `| Collaboration | ${sentiment.averages.collaboration || 'N/A'}/10 |\n`;
  md += `| Alignment | ${sentiment.averages.alignment || 'N/A'}/10 |\n\n`;

  md += `### Blockers\n\n`;
  md += `- None: ${sentiment.blockers.none}\n`;
  md += `- Minor: ${sentiment.blockers.minor}\n`;
  md += `- Significant: ${sentiment.blockers.significant}\n`;
  md += `- Critical: ${sentiment.blockers.critical}\n\n`;

  if (sentiment.hasBlockers) {
    md += `⚠️ **Warning:** Significant or critical blockers reported!\n\n`;
  }

  md += `### Team Feelings\n\n`;
  for (const f of sentiment.feelings) {
    md += `- **${f.role}:** ${f.feeling}\n`;
  }
  md += `\n`;

  md += `## Deliverables\n\n`;
  for (const d of deliverables) {
    md += `- \`${d}\`\n`;
  }
  md += `\n`;

  md += `## Manager Reports\n\n`;
  const managers = reports.filter(r => r.role === 'manager');
  for (const m of managers) {
    md += `### ${m.domain} Manager\n\n`;
    md += `<details>\n<summary>Full Report</summary>\n\n`;
    md += m.content;
    md += `\n</details>\n\n`;
  }

  return md;
}

// Main
const reports = readReports();
const sentiment = aggregateSentiment(reports);
const deliverables = listDeliverables();

// Save sentiment data
writeFileSync(
  join(sentimentDir, 'aggregate.json'),
  JSON.stringify({ ...sentiment, timestamp: new Date().toISOString() }, null, 2)
);

if (outputFormat === '--json') {
  console.log(JSON.stringify({ reports: reports.map(r => ({ ...r, content: undefined })), sentiment, deliverables }, null, 2));
} else {
  console.log(generateMarkdown(reports, sentiment, deliverables));
}
