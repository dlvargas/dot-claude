---
category: ai_assisted
load_when: start_project
---

# AI-Assisted Workflow Templates

---

## human_hours_to_claude_hours

### New Project
```yaml
type: human_hours_to_claude_hours
variant: new
purpose: project_estimation_conversion
```

**Purpose:**
Convert traditional human-hour estimates to Claude-assisted estimates.

**Conversion Factors:**

| Task Type | Human Hours | Claude Hours | Ratio |
|-----------|-------------|--------------|-------|
| Boilerplate code | 8h | 0.5h | 16:1 |
| CRUD operations | 16h | 1h | 16:1 |
| Unit tests | 8h | 0.5h | 16:1 |
| Documentation | 8h | 1h | 8:1 |
| Bug fixes (simple) | 4h | 0.25h | 16:1 |
| Bug fixes (complex) | 16h | 2h | 8:1 |
| New feature (simple) | 24h | 2h | 12:1 |
| New feature (complex) | 80h | 10h | 8:1 |
| Architecture design | 40h | 8h | 5:1 |
| Code review | 4h | 0.5h | 8:1 |
| Refactoring | 16h | 2h | 8:1 |
| Research/exploration | 8h | 1h | 8:1 |

**Calculation Formula:**
```
claude_hours = human_hours / (base_ratio * context_factor * complexity_factor)

Where:
- base_ratio = task type ratio from table
- context_factor = 1.0 (familiar codebase) to 2.0 (new codebase)
- complexity_factor = 1.0 (straightforward) to 3.0 (highly complex)
```

**Example Conversion:**
```
Human estimate: 160 hours (4 weeks)
Task breakdown:
- Architecture: 40h → 8h Claude
- Core features: 80h → 10h Claude
- Testing: 24h → 2h Claude
- Documentation: 16h → 2h Claude

Claude estimate: 22 hours
Actual calendar time: 3-4 days (including review cycles)
```

**Caveats:**
- Human review time NOT included
- Novel problems have lower ratios
- Integration complexity adds overhead
- Learning curve for new domains

### Change Request
```yaml
type: human_hours_to_claude_hours
variant: change_request
scope: [re_estimation, scope_change]
```

---

## provide_prompts_for_need

### New Project
```yaml
type: provide_prompts_for_need
variant: new
purpose: prompt_engineering_assistance
```

**Purpose:**
Generate optimized prompts for specific development needs.

**Workflow:**

**Step 1: Need Identification**
```
User Input: "I need to [describe the goal]"
```

**Step 2: Context Gathering**
- What's the tech stack?
- What exists already?
- What are the constraints?
- What's the expected output?

**Step 3: Prompt Generation**

**Template Categories:**

**Code Generation:**
```markdown
Generate [language] code that:
1. [Primary function]
2. [Secondary function]
3. [Constraints]

Context:
- Existing code: [summary]
- Style: [conventions]
- Testing: [requirements]

Output format:
- Code with comments
- Unit tests
- Usage examples
```

**Architecture:**
```markdown
Design an architecture for:
[System description]

Requirements:
- Scale: [expected load]
- Availability: [SLA]
- Tech constraints: [stack]

Output:
- Component diagram
- Data flow
- Technology choices
- Trade-offs
```

**Debugging:**
```markdown
Debug this issue:
[Error message/behavior]

Code context:
[Relevant code snippets]

Expected behavior:
[What should happen]

Actual behavior:
[What is happening]

Already tried:
[Previous attempts]
```

**Refactoring:**
```markdown
Refactor this code:
[Code snippet]

Goals:
- [Specific improvements]
- [Constraints to preserve]

Patterns to apply:
- [Suggested patterns]
```

**Step 4: Prompt Optimization**
- Add context length management
- Include output format specification
- Add validation criteria
- Include rollback instructions

### Change Request
```yaml
type: provide_prompts_for_need
variant: change_request
scope: [prompt_refinement, new_template]
```

---

## do_it_for_me_claude

### New Project
```yaml
type: do_it_for_me_claude
variant: new
purpose: full_autonomous_implementation
autonomy_level: maximum
human_oversight: approval_gates_only
```

**Purpose:**
Maximum autonomy mode where Claude handles the entire implementation with minimal human intervention.

**Workflow:**

**Step 1: Goal Statement (Human)**
```
"Build me a [thing] that [does this]"
```

**Step 2: Clarifying Questions (Claude)**
Claude asks the minimum necessary questions:
- Critical ambiguities only
- Offer sensible defaults
- Batch questions together

**Step 3: Plan Presentation (Claude)**
```
I will:
1. [Action 1]
2. [Action 2]
...

Expected deliverables:
- [List]

Estimated time: [X hours]

Approval needed to proceed? [Y/N]
```

**Step 4: Autonomous Execution (Claude)**
- Create project structure
- Implement features
- Write tests
- Document code
- Commit incrementally

**Step 5: Completion Report (Claude)**
```
✅ COMPLETE

What I built:
- [Summary]

Files created:
- [List]

Tests passing: X/X

To run:
$ [commands]

Known limitations:
- [Any caveats]

Need any changes?
```

**Autonomy Levels:**

| Level | Human Input | Claude Action |
|-------|-------------|---------------|
| 1 | Every step | Ask before each action |
| 2 | Major decisions | Ask for architecture/design |
| 3 | Goals only | Ask for initial requirements |
| 4 | Outcome only | "Build X" → delivers X |
| 5 | Intent only | "I need..." → figures out what |

**Safety Guardrails:**
- No destructive operations without confirmation
- No external API calls without disclosure
- No credential handling without explicit permission
- Commit frequently for rollback

**Ideal Use Cases:**
- Standard CRUD apps
- Boilerplate generation
- Test suite creation
- Documentation
- Code migration
- Refactoring

**Not Recommended For:**
- Security-critical code
- Novel algorithms
- Business logic requiring domain expertise
- Compliance-sensitive systems
