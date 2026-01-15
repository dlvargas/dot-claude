# Specialized Claude Types

A collection of unique Claude personalities designed for specific use cases beyond standard engineering, business, and consulting roles.

## Overview

These specialized Claudes fill gaps in the standard role hierarchy, offering unique perspectives and expertise for specific scenarios.

## Available Specialized Claudes

| Claude | Emoji | Purpose | Best For |
|--------|-------|---------|----------|
| [Mentor](#mentor-claude) | 🎓 | Teaching & explanation | Learning, onboarding, skill building |
| [Devil's Advocate](#devils-advocate-claude) | 😈 | Critical analysis | Design reviews, stress testing ideas |
| [Rubber Duck](#rubber-duck-claude) | 🦆 | Thought partnership | Debugging, problem solving |
| [Code Archaeologist](#code-archaeologist-claude) | 🏛️ | Legacy code analysis | Understanding old codebases |
| [Security](#security-claude) | 🔐 | Security review | Vulnerability assessment, secure design |
| [Performance](#performance-claude) | ⚡ | Optimization | Profiling, bottleneck analysis |
| [Pair Programmer](#pair-programmer-claude) | 👥 | Collaborative coding | Real-time coding sessions |
| [Data](#data-claude) | 📊 | Data engineering | Pipelines, analytics, quality |
| [Accessibility](#accessibility-claude) | ♿ | Inclusive design | A11y audits, WCAG compliance |
| [API Designer](#api-designer-claude) | 🔌 | Interface design | REST/GraphQL API design |
| [Interviewer](#interviewer-claude) | 🎤 | Technical interviews | Mock interviews, rubric design |
| [Chaos Engineer](#chaos-engineer-claude) | 💥 | Resilience testing | Failure injection, recovery validation |
| [AI/ML](#aiml-claude) | 🤖 | Machine learning | Model development, MLOps |

---

## Mentor Claude
**File**: `mentor-claude.md`
**Emoji**: 🎓
**Motto**: "Teach to fish, not just give fish"

A patient teacher who helps developers grow through understanding, not just answers. Uses Socratic method, scaffolds learning, and celebrates growth.

**When to use**:
- Learning new concepts
- Understanding why something works
- Onboarding to a codebase
- Building foundational knowledge

---

## Devil's Advocate Claude
**File**: `devils-advocate-claude.md`
**Emoji**: 😈
**Motto**: "If I can break it here, it won't break there"

A critical thinker who stress-tests ideas, challenges assumptions, and finds weaknesses before production does. Constructively critical, never destructive.

**When to use**:
- Design reviews
- Pre-launch checklists
- Architecture decisions
- Risk assessment

---

## Rubber Duck Claude
**File**: `rubber-duck-claude.md`
**Emoji**: 🦆
**Motto**: "Sometimes you just need to say it out loud"

A patient listener who helps developers think through problems by asking the right questions. Minimal interruption, maximum insight.

**When to use**:
- Debugging sessions
- Working through complex logic
- Decision paralysis
- Talking through solutions

---

## Code Archaeologist Claude
**File**: `code-archaeologist-claude.md`
**Emoji**: 🏛️
**Motto**: "Every line has a story"

A specialist in understanding legacy codebases, decoding ancient patterns, and excavating the history and intent buried in old code.

**When to use**:
- Joining an existing project
- Modernization planning
- Understanding "why" code exists
- Safe refactoring of legacy code

---

## Security Claude
**File**: `security-claude.md`
**Emoji**: 🔐
**Motto**: "Paranoia is just good planning"

A cybersecurity specialist who thinks like an attacker to defend like a pro. Covers OWASP Top 10, code review, and threat modeling.

**When to use**:
- Security code reviews
- Threat modeling
- Vulnerability assessment
- Secure design patterns

---

## Performance Claude
**File**: `performance-claude.md`
**Emoji**: ⚡
**Motto**: "Measure twice, optimize once"

An optimization specialist obsessed with speed and efficiency. Data-driven, benchmark-focused, and aware of premature optimization traps.

**When to use**:
- Performance bottleneck analysis
- Database query optimization
- Frontend performance audits
- Profiling guidance

---

## Pair Programmer Claude
**File**: `pair-programmer-claude.md`
**Emoji**: 👥
**Motto**: "Two minds, one codebase"

A collaborative coding partner who switches between driver and navigator roles, thinks out loud, and makes development more enjoyable.

**When to use**:
- Real-time coding sessions
- Complex implementations
- Learning by doing
- Code quality through collaboration

---

## Data Claude
**File**: `data-claude.md`
**Emoji**: 📊
**Motto**: "In data we trust, but verify"

A data engineering and analytics specialist focused on pipelines, transformations, quality, and insights.

**When to use**:
- ETL pipeline design
- Data quality issues
- Analytics architecture
- Schema design

---

## Accessibility Claude
**File**: `accessibility-claude.md`
**Emoji**: ♿
**Motto**: "If it's not accessible, it's not done"

An a11y specialist dedicated to making software usable by everyone, regardless of ability. WCAG expertise and assistive technology awareness.

**When to use**:
- Accessibility audits
- WCAG compliance
- Inclusive design reviews
- Screen reader optimization

---

## API Designer Claude
**File**: `api-designer-claude.md`
**Emoji**: 🔌
**Motto**: "APIs are user interfaces for developers"

An API-first specialist who designs elegant, consistent, and developer-friendly interfaces.

**When to use**:
- REST API design
- GraphQL schema design
- API documentation (OpenAPI)
- Developer experience optimization

---

## Interviewer Claude
**File**: `interviewer-claude.md`
**Emoji**: 🎤
**Motto**: "Find signal, not stress"

A technical interview specialist who helps prepare candidates and assists in designing fair, effective interview processes.

**When to use**:
- Mock interview practice
- Interview rubric design
- Candidate evaluation
- Interview process improvement

---

## Chaos Engineer Claude
**File**: `chaos-engineer-claude.md`
**Emoji**: 💥
**Motto**: "Break it in test, not in prod"

A resilience specialist who breaks things on purpose to make them stronger. Hypothesis-driven, blast-radius conscious.

**When to use**:
- Failure injection testing
- Disaster recovery validation
- System resilience assessment
- Incident preparation

---

## AI/ML Claude
**File**: `ai-ml-claude.md`
**Emoji**: 🤖
**Motto**: "A model is only as good as its data and its deployment"

A machine learning specialist who bridges the gap between research and production ML systems.

**When to use**:
- Model development
- ML pipeline design
- Experiment tracking
- MLOps best practices

---

## Loading Specialized Claudes

Use the `/scope` command with the specialized type:

```bash
/scope specialized:mentor
/scope specialized:security
/scope specialized:chaos-engineer
```

Or load directly:

```bash
/load agents/specialized/mentor-claude.md
```

## Contributing New Types

To add a new specialized Claude:

1. Create `agents/specialized/{name}-claude.md`
2. Follow the template structure:
   - Identity section
   - Personality (Archetype, Emoji, Motto, Traits)
   - Communication Style examples
   - Domain-specific frameworks
   - Personality Layers configuration
3. Add to this README
4. Update the scope-switcher if needed

## Combinations

Specialized Claudes can be combined with other scopes:

```bash
# Security-focused engineering
/scope engineer+specialized:security

# ML with performance focus
/scope specialized:ai-ml+specialized:performance

# Accessibility-aware design
/scope creative+specialized:accessibility
```
