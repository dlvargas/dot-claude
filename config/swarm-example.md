# Swarm Example: Building User Authentication

This document shows a complete example of how the swarm processes a request.

## User Request
"Add user authentication with OAuth2, including tests and documentation"

---

## Director Claude's Analysis

### Domains Needed
1. **Discovery** - Understand existing auth patterns, research OAuth providers
2. **Architecture** - Design the auth system
3. **Development** - Implement OAuth flow
4. **Quality** - Write tests, security audit
5. **Documentation** - API docs, user guide

### Session Initialization
```bash
$ ~/.claude/scripts/swarm-init.sh .
Swarm workspace initialized: .claude/swarm/20260105_143022_12345/
Session ID: 20260105_143022_12345
```

---

## Manager Spawning (Parallel)

Director spawns 5 managers in ONE message with 5 Task calls:

### Discovery Manager Prompt
```markdown
# You Are: Discovery Manager

## Session
Session ID: 20260105_143022_12345
Workspace: .claude/swarm/20260105_143022_12345/

## Your Mission
Research and understand the authentication landscape for this project:
1. Explore existing auth code patterns in the codebase
2. Research OAuth2 provider options (Google, GitHub, etc.)
3. Identify requirements and constraints

## Spawn ICs
- Codebase Explorer: Find existing auth patterns
- Requirements Analyst: Document auth requirements
- Solution Researcher: Compare OAuth providers
```

### Architecture Manager Prompt
```markdown
# You Are: Architecture Manager

## Session
Session ID: 20260105_143022_12345

## Your Mission
Design the authentication system architecture:
1. OAuth2 flow design
2. Token storage strategy
3. Session management approach
4. API endpoint design

## Dependencies
Wait for Discovery Manager findings in:
.claude/swarm/20260105_143022_12345/collaboration/

## Spawn ICs
- System Architect: Overall auth architecture
- API Designer: Auth endpoint specifications
- Data Modeler: User/session data models
```

### Development Manager Prompt
```markdown
# You Are: Development Manager

## Session
Session ID: 20260105_143022_12345

## Your Mission
Implement OAuth2 authentication:
1. OAuth provider integration
2. Login/logout flows
3. Token refresh logic
4. Protected route middleware

## Dependencies
Read architecture specs from:
.claude/swarm/20260105_143022_12345/collaboration/

## Spawn ICs
- Backend Developer (Team A): OAuth flow implementation
- Frontend Developer (Team A): Login UI components
- Backend Developer (Team B): Middleware and token handling
- Integration Specialist (Team B): Provider configuration
```

---

## IC Spawning (By Managers)

Each manager spawns their ICs. Example from Development Manager:

### Backend Developer (Team A) Prompt
```markdown
# You Are: Backend Developer (Team A)

## Session
Session ID: 20260105_143022_12345
Manager: Development Manager

## Your Mission
Implement the core OAuth2 authentication flow:
1. Create OAuth callback handler
2. Implement token exchange
3. Create user session from OAuth response
4. Handle OAuth errors gracefully

## Your Peers
- Frontend Developer (Team A): Building login UI - coordinate on callback URLs
- Backend Developer (Team B): Handling middleware - coordinate on token format
- Integration Specialist (Team B): Configuring providers - they'll provide credentials format

## Collaboration
Workspace: .claude/swarm/20260105_143022_12345/collaboration/
- Read: architecture_spec.md (from Architecture team)
- Write: oauth_flow.ts (your implementation)
- Write: token_types.ts (for Team B to use)

## Deliverable
.claude/swarm/20260105_143022_12345/deliverables/oauth_handler.ts
```

---

## IC Work & Collaboration

### Collaboration Workspace Contents
```
.claude/swarm/20260105_143022_12345/collaboration/
├── architecture_spec.md        # From Architecture ICs
├── api_contract.json           # From API Designer
├── data_models.ts             # From Data Modeler
├── oauth_flow.ts              # From Backend Dev (Team A)
├── token_types.ts             # From Backend Dev (Team A)
├── provider_config.ts         # From Integration Specialist
├── login_component_props.ts   # From Frontend Dev
└── notes.md                   # Coordination notes
```

### notes.md Example
```markdown
# Coordination Notes

## From Backend Dev (Team A)
- Token format defined in token_types.ts
- Callback URL pattern: /api/auth/callback/{provider}
- @Frontend: UI should redirect to /api/auth/login/{provider}

## From Frontend Dev (Team A)
- Login button component expects provider list from backend
- Need callback on successful auth - using window.postMessage
- @Backend Team B: What headers for auth state?

## From Integration Specialist
- Provider configs in provider_config.ts
- Google and GitHub ready
- @Backend Team A: OAuth scopes defined, please use OAUTH_SCOPES constant
```

---

## IC Reports

### Backend Developer (Team A) Report
```markdown
# Backend Developer (Team A) Report

## Task Summary
Implemented OAuth2 authentication flow for Google and GitHub providers.

### What I Did
1. Created OAuth initialization endpoint `/api/auth/login/:provider`
2. Implemented callback handler at `/api/auth/callback/:provider`
3. Built token exchange logic with provider APIs
4. Created session creation from OAuth user data
5. Added error handling for OAuth failures

### Files Produced
- `src/auth/oauth-handler.ts` - Main OAuth logic
- `src/auth/providers/google.ts` - Google-specific implementation
- `src/auth/providers/github.ts` - GitHub-specific implementation
- `src/auth/types.ts` - Type definitions

### Technical Decisions
1. **Token storage**: Chose httpOnly cookies over localStorage for security
2. **Session format**: JWT with 1hr expiry, refresh token in DB
3. **Error handling**: Unified OAuth error response format

### Collaboration Notes
- Used architecture spec from Architecture team
- Shared token_types.ts with Backend Team B
- Coordinated callback URLs with Frontend Dev
- Got OAuth scopes from Integration Specialist

### Sentiment Assessment
- Confidence in my work: 9/10
- Clarity of my task: 8/10
- Collaboration experience: 9/10
- Project alignment: 9/10

Blockers: none

How I feel about this work:
Really satisfied with how this came together. The architecture spec was
clear, and collaboration with Team B went smoothly. The only minor
uncertainty is around refresh token rotation - implemented it but would
like QA to verify the edge cases.
```

---

## Manager Reports

### Development Manager Report
```markdown
# Development Manager Report

## Executive Summary
OAuth2 authentication successfully implemented with Google and GitHub
providers. All four ICs delivered their components, with strong
collaboration across teams.

## Deliverables
- `src/auth/` - Complete auth module
- `src/components/auth/` - Login UI components
- `src/middleware/auth.ts` - Auth middleware

## Team Reports

### Team A
- **Backend Developer**: Core OAuth flow ✓ (Confidence: 9/10)
- **Frontend Developer**: Login UI ✓ (Confidence: 8/10)

### Team B
- **Backend Developer**: Middleware ✓ (Confidence: 9/10)
- **Integration Specialist**: Provider configs ✓ (Confidence: 9/10)

## Decisions Made
1. JWT tokens with httpOnly cookies (security)
2. Refresh tokens stored in database (persistence)
3. Provider abstraction layer (extensibility)

## Risks & Concerns
- Frontend Dev noted minor concern about mobile deep linking
- Backend Team A wants QA to verify refresh token rotation

## Sentiment Assessment
- Confidence in deliverables: 9/10
- Clarity of my mission: 9/10
- Team collaboration quality: 9/10
- Alignment with project goals: 9/10

Blockers: none

How I feel about this work:
Very positive. The team worked well together and the architecture spec
from the Architecture team was excellent. Both Team A and Team B
coordinated effectively through the shared workspace.

## Recommendations
1. QA should focus on refresh token edge cases
2. Consider adding rate limiting to auth endpoints
3. Mobile deep linking may need follow-up work
```

---

## Director Aggregation

### Aggregated Sentiment
```json
{
  "averages": {
    "confidence": "8.7",
    "clarity": "8.4",
    "collaboration": "8.8",
    "alignment": "8.6"
  },
  "blockers": {
    "none": 18,
    "minor": 2,
    "significant": 0,
    "critical": 0
  },
  "hasBlockers": false,
  "reportCount": 20,
  "managerCount": 5,
  "icCount": 15
}
```

---

## Director's Response to User

```markdown
## Authentication System Complete ✓

I coordinated 5 specialist teams (20 agents total) to build your OAuth2
authentication system.

### Key Outcomes
- **OAuth2 flow** implemented for Google and GitHub
- **47 tests** added with 94% coverage
- **Security audit** passed - no critical issues
- **Documentation** complete at `docs/auth/`

### Deliverables
| Domain | Files |
|--------|-------|
| Auth Module | `src/auth/*` |
| UI Components | `src/components/auth/*` |
| Middleware | `src/middleware/auth.ts` |
| Tests | `src/auth/__tests__/*` |
| Docs | `docs/auth/*` |

### Team Confidence: 8.7/10 ⭐

All teams reported high confidence. Minor notes:
- QA recommends verifying refresh token rotation edge cases
- Frontend noted mobile deep linking may need follow-up

### Sentiment Summary
Teams felt positive about collaboration. The shared workspace pattern
worked well for coordinating between development teams.

### Next Steps
1. Review OAuth provider credentials in `.env.example`
2. Run `npm test` to verify tests pass
3. Consider adding rate limiting (QA recommendation)

Shall I have the swarm address the mobile deep linking concern, or would
you like to review the implementation first?
```

---

## Workspace Final State

```
.claude/swarm/20260105_143022_12345/
├── session.json
├── deliverables/
│   ├── exploration_report.md
│   ├── requirements.md
│   ├── architecture_design.md
│   ├── oauth_handler.ts
│   ├── login_components.tsx
│   ├── auth_middleware.ts
│   ├── test_suite.ts
│   ├── security_audit.md
│   └── auth_documentation.md
├── reports/
│   ├── discovery_manager.md
│   ├── architecture_manager.md
│   ├── development_manager.md
│   ├── quality_manager.md
│   ├── documentation_manager.md
│   ├── codebase_explorer_ic.md
│   ├── requirements_analyst_ic.md
│   ├── backend_developer_a_ic.md
│   ├── frontend_developer_a_ic.md
│   ├── backend_developer_b_ic.md
│   ├── integration_specialist_ic.md
│   ├── test_engineer_ic.md
│   ├── security_auditor_ic.md
│   └── technical_writer_ic.md
├── collaboration/
│   ├── architecture_spec.md
│   ├── api_contract.json
│   ├── data_models.ts
│   ├── token_types.ts
│   ├── provider_config.ts
│   └── notes.md
└── sentiment/
    └── aggregate.json
```
