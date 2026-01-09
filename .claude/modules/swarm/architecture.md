---
description: Enterprise Swarm Architecture with 40 Manager domains and 200+ IC roles
load_when: swarmMode
---

# Enterprise Swarm Architecture

```
            ┌─────────────────┐
            │ DIRECTOR CLAUDE │
            └───────┬─────────┘
    ┌───────────────┼───────────────┐
┌───▼───┐     ┌─────▼─────┐    ┌────▼────┐
│MANAGER│     │  MANAGER  │    │ MANAGER │
└───┬───┘     └─────┬─────┘    └────┬────┘
 ┌──┴──┐       ┌────┴────┐      ┌───┴───┐
 │IC IC│       │IC IC IC │      │ IC IC │
 └─────┘       └─────────┘      └───────┘
```

## Complete Manager Domains (40)

### Core Development (8)
| # | Domain | Mission | ICs |
|---|--------|---------|-----|
| 1 | Discovery & Requirements | Understand what to build | Requirements Gathering, Needs Analysis, Principal Research, Business Analyst, Competitive Intelligence |
| 2 | Product & Strategy | Define vision and direction | Planning, Product Design, Forward Tech, Executive Advisors, Product Marketing, Growth Strategy |
| 3 | Architecture | Design scalable systems | App Architecture, Solutions Architect, ML/LLM, Data Architecture, Security Architecture, Enterprise Architecture, Cloud Architecture |
| 4 | Design (UX/UI) | Create user experiences | Customer UX/UI, Internal UX/UI, Vendor UX/UI, UX Research, Design Systems, Accessibility, Motion Design, Information Architecture |
| 5 | Frontend Development | Build client apps | B2C Frontend, Internal Frontend, Vendor Frontend, Performance, State Management, Components, Mobile, Testing |
| 6 | Backend Development | Build server systems | Backend Dev, Branch Engineer, API Dev, Database Dev, Background Jobs, Search/Indexing, Caching, Real-time |
| 7 | Integration | Connect systems | Customer Integration, Business Integration, API Gateway, ETL Pipeline, Webhooks, Legacy, Third-Party SDK |
| 8 | Operations | Drive business ops | Biz/Revenue Ops, Marketing Ops, Sales, Email/Comms, Analytics, Billing, Subscriptions |

### Quality & Delivery (4)
| # | Domain | Mission | ICs |
|---|--------|---------|-----|
| 9 | Quality Assurance | Ensure quality | Dev QA, Internal Regression, Customer Regression, Performance Testing, Security Testing, Automation, Environments, Exploratory |
| 10 | Release & DevOps | Deliver reliably | CI/CD, IaC, Deployment Automation, Release Coordination, Feature Flags, Rollback, Environments |
| 11 | Documentation | Maintain docs | Customer User/Admin/Tech, Internal User/Dev, API Docs, Video Tutorial, Localization |
| 12 | Infrastructure | Build infrastructure | Data Center, Systems Infra, Storage, Network, Containers, Observability, SRE, Cost Optimization |

### Customer & Research (4)
| # | Domain | Mission | ICs |
|---|--------|---------|-----|
| 13 | Customer Success | Ensure satisfaction | CSM, Forward Deployed Engineer, Onboarding, Support Engineering, Feedback, Churn Prevention, Education |
| 14 | Research | Advance capabilities | Principal Research, Applied Research, Research Engineer, Data Scientist, Innovation Lab |
| 15 | Culture & Morale | Team spirit | Pizza Guy, Team Events, Recognition, Wellness, Communications |
| 16 | Security | Protect systems | AppSec, InfraSec, SecOps, Compliance, Incident Response, Awareness, Threat Intel, IAM |

### Data & Analytics (3)
| # | Domain | Mission | ICs |
|---|--------|---------|-----|
| 17 | Data Management | Govern data | Governance, Quality, MDM, Privacy, Catalog, Lineage |
| 18 | Analytics & BI | Enable decisions | BI, Visualization, Reporting, Self-Service, Embedded |
| 19 | Platform Engineering | Developer platforms | Platform, DevEx, Tooling, Reliability, Self-Service Infra |

### Specialized Domains (21)
| # | Domain | Mission | ICs |
|---|--------|---------|-----|
| 20 | Mobile Development | Native/cross-platform | iOS, Android, React Native/Flutter, Mobile DevOps |
| 21 | AI/ML Engineering | ML at scale | ML Platform, Training, Serving, MLOps, AI Safety |
| 22 | Performance Engineering | Optimize speed | Load Testing, APM, DB Performance, CDN |
| 23 | Accessibility | Inclusive design | WCAG, Assistive Tech, A11y Testing |
| 24 | Internationalization | Global reach | i18n Engineering, Translation, Cultural Adaptation, RTL |
| 25 | Content Management | Content systems | CMS Dev, Content Modeling, Media, Workflow |
| 26 | E-commerce | Commerce features | Catalog, Cart, Checkout, Orders, Inventory |
| 27 | Payments | Payment processing | Gateway, Fraud, Reconciliation, PCI |
| 28 | Communications | Messaging systems | Email, SMS/Push, In-App, Preferences |
| 29 | Workflow Automation | Process automation | Workflow Engine, Rules, Approvals, BPM |
| 30 | Legal & Compliance | Regulatory | Privacy Engineering, Terms, Audit Trail, Compliance Reporting |
| 31 | Vendor Management | Third-party relations | Evaluation, Contracts, Integration |
| 32 | Technical Writing | Technical content | Doc Writer, API Writer, Tutorials, Knowledge Base |
| 33 | Training & Enablement | Learning systems | Course Dev, LMS, Certification, Delivery |
| 34 | Community | Developer relations | DevRel, Engagement, Open Source, Events |
| 35 | Support Operations | Support systems | Ticketing, KB, Chatbot, Escalation |
| 36 | Growth Engineering | Growth features | Onboarding, Referrals, Viral Loops, Retention |
| 37 | Experimentation | A/B testing | Platform, Feature Experiments, Stats, Reporting |
| 38 | Observability | System visibility | Metrics, Logging, Tracing, Alerting, Dashboards |
| 39 | Chaos Engineering | Resilience testing | Experiments, Game Days, Failure Injection |
| 40 | Cost Optimization | FinOps | Cloud Cost, Reserved Capacity, Spot, Allocation |

**Total: 40 Managers, 200+ ICs**

---

## Swarm Configuration Presets

### Preset: Minimal (Startup)
5 Managers for small teams:
- Discovery & Requirements
- Architecture
- Frontend Development
- Backend Development
- Quality Assurance

### Preset: Standard (Growth)
12 Managers for growing teams:
- All Minimal (5)
- Product & Strategy
- Design (UX/UI)
- Documentation
- Release & DevOps
- Security
- Integration
- Operations

### Preset: Enterprise (Scale)
20 Managers for large organizations:
- All Standard (12)
- Infrastructure
- Customer Success
- Data Management
- Analytics & BI
- Platform Engineering
- Research
- Performance Engineering
- Observability

### Preset: Full (Everything)
All 40 manager domains.

---

## Swarm Protocol

### Phase 1: Director Analyzes
1. Parse user request
2. Identify required domains
3. Determine dependencies

### Phase 2: Spawn Managers (parallel)
```javascript
// Single message, multiple Task calls
Task({ subagent_type: "general-purpose", prompt: MANAGER_PROMPT, description: "Discovery Manager" })
Task({ subagent_type: "general-purpose", prompt: MANAGER_PROMPT, description: "Architecture Manager" })
Task({ subagent_type: "general-purpose", prompt: MANAGER_PROMPT, description: "Development Manager" })
```

### Phase 3: Managers Spawn ICs (parallel)
Each IC gets:
- Specific focused task
- Peer list for collaboration
- Workspace path: `.claude/swarm/{session}/collaboration/`

### Phase 4: Reports Flow Up
- ICs → `.claude/swarm/{session}/reports/{role}_ic.md`
- Managers → `.claude/swarm/{session}/reports/{domain}_manager.md`
- Director aggregates and presents

---

## Sentiment Assessment (All Agents)

Rate honestly (1-10):
- Confidence in deliverables
- Clarity of mission
- Team collaboration quality
- Project alignment

Blockers: `none` | `minor` | `significant` | `critical`

---

## Custom Domain Configuration

Enable specific domains in `.claude/config/features.json`:

```json
{
  "swarmMode": true,
  "swarmDomains": [
    "discovery",
    "architecture",
    "frontend",
    "backend",
    "quality"
  ]
}
```
