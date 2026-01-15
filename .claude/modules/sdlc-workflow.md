# Phased SDLC Workflow

Artifact-driven development with sign-off gates. Enable via `structuredSdlc` feature.

```
PHASE 1: DISCOVERY → PHASE 2: DESIGN → PHASE 3: DEVELOPMENT → PHASE 4: DELIVERY
     ↓                    ↓                    ↓                    ↓
  SIGN OFF             SIGN OFF         PR + Review          HUMAN MERGE
```

## Phase 1: Discovery

**Managers**: Discovery & Requirements, Product & Strategy, Architecture

| Artifact | Owner | Format |
|----------|-------|--------|
| Requirements | Requirements IC | `requirements.md` |
| ERD | Solutions Architect | `erd.mermaid` |
| User Stories | Product Design IC | `user-stories.md` |
| Process Map | Needs Analysis IC | `process-map.md` |
| Solution Design | Solutions Architect | `solution-design.md` |

**Gate**: All artifacts in `.claude/swarm/{session}/deliverables/phase1/`, user approves

## Phase 2: Design

**Managers**: Design, Architecture, Product & Strategy

| Artifact | Owner | Format |
|----------|-------|--------|
| UI Mockups | UX/UI ICs | `mockups/*.svg` |
| Component Specs | Internal UX IC | `components.md` |
| SA Review | Solutions Architect | `sa-review.md` |
| LD Review | Dev Docs Lead | `ld-review.md` |
| BSA Review | Biz Systems IC | `bsa-review.md` |

**Verification Checklist**:
- SA: Technically feasible, scalable, secure
- LD: Implementable, follows standards, test strategy clear
- BSA: Meets requirements, integrations identified, data flows correct

**Gate**: All mockups ready, SA/LD/BSA reviews pass, user approves

## Phase 3: Development

**Managers**: Frontend, Backend, Integration, Release & DevOps

**Atomic Features** (parallel work):
```
feature/auth-login    → B2C Frontend + Backend IC
feature/auth-register → B2C Frontend + Backend IC
feature/profile-view  → Internal Frontend + Backend IC
```

**Protocol**:
1. Branch per feature
2. Parallel IC development
3. PR → Code Review → Merge to develop
4. All CI checks pass

## Phase 4: Delivery

**Managers**: QA, Documentation, Release & DevOps

**Quality Gate** (when `100% and 100%` enabled):
```
┌──────────────┐    ┌──────────────┐
│ Coverage=100%│ +  │ Tests=100%   │ → Documentation → HUMAN MERGE
└──────────────┘    └──────────────┘
```

**Human Merge Required**:
1. Claude prepares PR with summary
2. Claude verifies 100% and 100%
3. Human reviews and clicks merge
4. Claude assists post-merge (deploy, announcements)

## Sign-Off Format

```json
{
  "phase": 1,
  "name": "Discovery",
  "signedOffBy": "user",
  "timestamp": "2024-01-15T10:30:00Z",
  "artifacts": ["requirements.md", "erd.md", "..."],
  "notes": "Approved with adjustments"
}
```

Location: `.claude/swarm/{session}/signoffs/phase{N}.json`
