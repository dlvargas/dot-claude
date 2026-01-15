---
category: software_development
load_when: start_project
---

# Software Development Project Templates

## cli_tool

### New Project
```yaml
type: cli_tool
variant: new
complexity: minimal
swarm_preset: minimal
managers: [Discovery, Architecture, Backend, QA, Documentation]
```

**Phase 1: Discovery**
- Define command structure and arguments
- Identify target platforms (Unix, Windows, cross-platform)
- Determine dependencies and packaging
- Define input/output formats

**Phase 2: Design**
- Command parser architecture
- Configuration file format
- Error handling strategy
- Help system design

**Phase 3: Development**
- Argument parsing implementation
- Core command logic
- Configuration loading
- Unit tests (100% coverage target)

**Phase 4: Delivery**
- Man page / --help documentation
- Installation scripts
- Package distribution (npm, pip, brew, cargo)
- Release notes

**Deliverables:**
- `src/` - Source code
- `tests/` - Test suite
- `README.md` - Usage documentation
- `CHANGELOG.md` - Version history
- Package manifests (package.json, setup.py, Cargo.toml)

### Change Request
```yaml
type: cli_tool
variant: change_request
complexity: minimal
swarm_preset: minimal
managers: [Discovery, Backend, QA]
```

**Phase 1: Impact Analysis**
- Identify affected commands
- Assess backward compatibility
- Determine migration path

**Phase 2: Implementation**
- Targeted code changes
- Updated tests
- Regression testing

**Phase 3: Delivery**
- Updated documentation
- Migration guide (if breaking)
- Patch release

---

## gui_tool

### New Project
```yaml
type: gui_tool
variant: new
complexity: standard
swarm_preset: standard
managers: [Discovery, Architecture, Design, Frontend, Backend, QA, Documentation]
```

**Phase 1: Discovery**
- User workflow analysis
- Platform selection (Electron, Qt, native)
- Accessibility requirements
- Performance targets

**Phase 2: Design**
- Wireframes and mockups
- Component architecture
- State management strategy
- Keyboard navigation

**Phase 3: Development**
- UI component library
- Business logic layer
- Data persistence
- Cross-platform testing

**Phase 4: Delivery**
- User guide with screenshots
- Installation packages per platform
- Auto-update mechanism
- Crash reporting integration

**Deliverables:**
- `src/ui/` - UI components
- `src/core/` - Business logic
- `assets/` - Icons, images
- `docs/` - User documentation
- Platform installers

### Change Request
```yaml
type: gui_tool
variant: change_request
complexity: standard
swarm_preset: minimal
managers: [Discovery, Design, Frontend, QA]
```

**Phase 1: Impact Analysis**
- UI regression assessment
- User flow impact
- Accessibility review

**Phase 2: Implementation**
- Targeted UI changes
- Visual regression tests
- A11y validation

---

## web_app

### New Project
```yaml
type: web_app
variant: new
complexity: standard
swarm_preset: standard
managers: [Discovery, Architecture, Design, Frontend, Backend, QA, DevOps, Documentation]
```

**Phase 1: Discovery**
- User stories and personas
- Browser/device targets
- Performance budgets (Core Web Vitals)
- Security requirements

**Phase 2: Design**
- Design system / component library
- API contracts
- Database schema
- Auth architecture

**Phase 3: Development**
- Frontend SPA/SSR implementation
- Backend API development
- Database migrations
- E2E test suite

**Phase 4: Delivery**
- CI/CD pipeline
- Staging environment
- Load testing results
- Launch checklist

**Deliverables:**
- `frontend/` - Client application
- `backend/` - API server
- `database/` - Migrations and seeds
- `infra/` - IaC (Terraform/Pulumi)
- `docs/` - API and user docs

### Change Request
```yaml
type: web_app
variant: change_request
complexity: standard
swarm_preset: minimal
managers: [Discovery, Frontend, Backend, QA]
```

**Phase 1: Impact Analysis**
- API versioning assessment
- Database migration plan
- Feature flag strategy

---

## system_service

### New Project
```yaml
type: system_service
variant: new
complexity: standard
swarm_preset: standard
managers: [Discovery, Architecture, Backend, Infrastructure, QA, DevOps, Documentation]
```

**Phase 1: Discovery**
- Service boundaries (DDD)
- Communication patterns (sync/async)
- Reliability requirements (SLA)
- Resource constraints

**Phase 2: Design**
- Service architecture
- Message schemas
- Health check design
- Graceful degradation

**Phase 3: Development**
- Core service logic
- gRPC/REST APIs
- Message handlers
- Observability (metrics, logs, traces)

**Phase 4: Delivery**
- Container images
- Kubernetes manifests
- Runbook documentation
- Chaos testing

**Deliverables:**
- `src/` - Service code
- `proto/` - gRPC definitions
- `k8s/` - Kubernetes manifests
- `docs/runbook.md` - Operations guide
- Dashboards (Grafana)

### Change Request
```yaml
type: system_service
variant: change_request
complexity: standard
swarm_preset: minimal
managers: [Discovery, Backend, QA, DevOps]
```

---

## full_stack_product

### New Project
```yaml
type: full_stack_product
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Product, Architecture, Design, Frontend, Backend, Infrastructure, QA, DevOps, Documentation, Security]
```

**Phase 1: Discovery**
- Market research
- Competitive analysis
- User research
- Technical feasibility

**Phase 2: Design**
- Product roadmap
- System architecture
- Design system
- Data architecture

**Phase 3: Development**
- MVP feature set
- Multi-environment setup
- Integration testing
- Performance optimization

**Phase 4: Delivery**
- Production deployment
- Monitoring and alerting
- User onboarding
- Support documentation

**Deliverables:**
- Complete application codebase
- Infrastructure as Code
- CI/CD pipelines
- Comprehensive documentation
- Analytics integration

### Change Request
```yaml
type: full_stack_product
variant: change_request
complexity: enterprise
swarm_preset: standard
managers: [Discovery, Product, Frontend, Backend, QA]
```

---

## enterprise_stack_product

### New Project
```yaml
type: enterprise_stack_product
variant: new
complexity: full
swarm_preset: full
managers: ALL_40_MANAGERS
```

**Phase 1: Discovery (Extended)**
- Enterprise requirements gathering
- Compliance assessment (SOC2, GDPR, HIPAA)
- Integration requirements
- Scalability planning

**Phase 2: Design (Extended)**
- Enterprise architecture
- Multi-tenancy design
- SSO/SAML integration
- Audit logging design

**Phase 3: Development (Extended)**
- Feature-flagged rollout
- White-label capability
- Enterprise admin panel
- Bulk operations

**Phase 4: Delivery (Extended)**
- Enterprise deployment options (on-prem, private cloud)
- SLA documentation
- Security audit
- Training materials

**Deliverables:**
- Full product codebase
- Enterprise deployment packages
- Compliance documentation
- Training curriculum
- Support playbooks

### Change Request
```yaml
type: enterprise_stack_product
variant: change_request
complexity: full
swarm_preset: enterprise
managers: [Discovery, Product, Architecture, Frontend, Backend, QA, Security, Documentation]
```
