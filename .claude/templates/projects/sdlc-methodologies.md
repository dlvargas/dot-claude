---
category: sdlc_methodologies
load_when: start_project
---

# SDLC Methodology Templates

These templates define how projects are executed, not what is built.

---

## sdlc_waterfall

### New Project
```yaml
type: sdlc_waterfall
variant: new
methodology: waterfall
phases: sequential
sign_off: required_per_phase
```

**Phase 1: Requirements (100% complete before next)**
- Business requirements document
- Functional specifications
- Non-functional requirements
- Scope freeze and sign-off

**Phase 2: Design (100% complete before next)**
- System design document
- Database design
- Interface design
- Architecture review and sign-off

**Phase 3: Implementation**
- Code development
- Unit testing
- Code reviews
- Integration

**Phase 4: Testing**
- System testing
- UAT
- Performance testing
- Bug fixes

**Phase 5: Deployment**
- Production deployment
- Data migration
- Go-live
- Handoff

**Phase 6: Maintenance**
- Bug fixes
- Minor enhancements
- Support

**Gate Criteria:**
Each phase requires formal sign-off before proceeding.

**When to Use:**
- Fixed requirements
- Regulated industries
- Contract-based delivery
- Low tolerance for change

---

## sdlc_agile

### New Project
```yaml
type: sdlc_agile
variant: new
methodology: agile_scrum
sprint_length: 2_weeks
ceremonies: [planning, daily, review, retro]
```

**Sprint 0: Foundation**
- Product backlog creation
- Architecture spikes
- Environment setup
- Team onboarding

**Sprints 1-N: Iteration**
- Sprint planning
- Daily standups
- Development & testing
- Sprint review
- Retrospective

**Release Cycle:**
- Continuous integration
- Feature flags
- Rolling releases

**Artifacts:**
- Product backlog
- Sprint backlog
- Burndown charts
- Definition of Done

**When to Use:**
- Evolving requirements
- Customer collaboration
- Frequent delivery
- Adaptive planning

---

## sdlc_xtreme

### New Project
```yaml
type: sdlc_xtreme
variant: new
methodology: extreme_programming
practices: [pair_programming, tdd, continuous_integration, refactoring]
```

**Core Practices:**
- Pair Programming (always)
- Test-Driven Development (mandatory)
- Continuous Integration (every commit)
- Refactoring (continuous)
- Simple Design (YAGNI)
- Collective Code Ownership
- Coding Standards
- Sustainable Pace

**Planning Game:**
- User stories on cards
- Estimation poker
- Iteration planning
- Release planning

**Feedback Loops:**
- Unit tests (minutes)
- Pair programming (real-time)
- Integration (hours)
- Iteration (weeks)
- Release (months)

**When to Use:**
- High quality requirements
- Rapidly changing environment
- Small, co-located teams
- Technical excellence focus

---

## sdlc_10xdev

### New Project
```yaml
type: sdlc_10xdev
variant: new
methodology: 10x_developer
principles: [automation, leverage, focus, elimination]
```

**Philosophy:**
10x is not about working 10x harder. It's about:
- 10x leverage through automation
- 10x impact through focus
- 10x speed through elimination

**Phase 1: Ruthless Elimination**
- Cut 90% of planned features
- Focus on one thing that matters
- Remove all meetings possible
- Automate everything else

**Phase 2: Deep Work**
- 4-hour focused blocks
- Zero interruptions
- Single task focus
- Flow state optimization

**Phase 3: Leverage**
- AI-assisted development
- Code generation
- Automated testing
- Template reuse

**Phase 4: Ship**
- Minimum viable quality
- Fast iteration
- Customer feedback
- Data-driven decisions

**Principles:**
- YAGNI (You Aren't Gonna Need It)
- KISS (Keep It Simple, Stupid)
- Done > Perfect
- Ship fast, fix fast

**When to Use:**
- Startup velocity needed
- Solo developers
- Prototyping
- Time-boxed projects

---

## sdlc_theaiway

### New Project
```yaml
type: sdlc_theaiway
variant: new
methodology: ai_assisted
human_oversight: strategic_only
automation_level: maximum
```

**Philosophy:**
Humans define WHAT. AI figures out HOW.

**Phase 1: Vision (Human)**
- Define the goal in natural language
- Specify constraints and requirements
- Set quality bar
- Approve approach

**Phase 2: Planning (AI)**
- AI generates implementation plan
- AI identifies components
- AI estimates complexity
- Human reviews and approves

**Phase 3: Execution (AI + Human)**
- AI implements features
- AI writes tests
- AI reviews code
- Human spot-checks

**Phase 4: Validation (Human)**
- Human validates functionality
- Human approves quality
- Human authorizes release
- AI handles deployment

**Automation Layers:**
```
┌─────────────────────────────┐
│ Human: Vision & Approval    │
├─────────────────────────────┤
│ AI: Planning & Architecture │
├─────────────────────────────┤
│ AI: Implementation          │
├─────────────────────────────┤
│ AI: Testing & Documentation │
├─────────────────────────────┤
│ Human: Final Validation     │
└─────────────────────────────┘
```

**When to Use:**
- Commodity features
- Well-understood domains
- Speed is critical
- AI capabilities match needs
