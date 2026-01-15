---
description: Pre-configured project templates for /start-project command
load_when: projectTemplates
---

# Project Templates

35 project type templates across 7 categories, each available in "new" or "change_request" variants.

## Usage

```bash
/start-project                    # Interactive template selection
/start-project web_app            # Start a new web app
/start-project erp --variant cr   # ERP change request
```

---

## Template Categories

### 1. Software Development (6 types)

| Type | Description | Default Swarm |
|------|-------------|---------------|
| `cli_tool` | Command-line application | Minimal |
| `gui_tool` | Desktop GUI application | Minimal |
| `web_app` | Web application (SPA/SSR) | Standard |
| `system_service` | Background service/daemon | Standard |
| `full_stack_product` | Complete web product | Enterprise |
| `enterprise_stack_product` | Multi-service enterprise system | Full |

**Phases**: Discovery → Design → Development → Delivery

---

### 2. Security & Cryptography (12 types)

| Type | Description | Default Swarm |
|------|-------------|---------------|
| `penetration_test` | Security assessment project | Standard |
| `back_door_injection` | Security research (controlled) | Standard |
| `back_door_finder` | Vulnerability detection tool | Standard |
| `obfuscation_tool` | Code protection utility | Minimal |
| `secure_encrypt` | Encryption implementation | Standard |
| `secure_decrypt` | Decryption implementation | Standard |
| `secure_transport` | Secure communication layer | Standard |
| `post_quantum_encrypt` | Post-quantum encryption | Enterprise |
| `post_quantum_decrypt` | Post-quantum decryption | Enterprise |
| `post_quantum_transport` | Quantum-safe transport | Enterprise |
| `post_quantum_local_device` | Local device encryption | Enterprise |
| `post_quantum_remote_device` | Remote device security | Enterprise |

**Special Requirements**: Security clearance documentation, threat modeling

---

### 3. Business Systems (8 types)

| Type | Description | Default Swarm |
|------|-------------|---------------|
| `crm` | Customer Relationship Management | Enterprise |
| `erp` | Enterprise Resource Planning | Full |
| `pos` | Point of Sale system | Standard |
| `retail_ops` | Retail operations platform | Enterprise |
| `hotel_ops` | Hotel operations system | Enterprise |
| `hotel_res` | Hotel reservations system | Standard |
| `hotel_billing` | Hotel billing system | Standard |
| `cannabis_seed_to_sale` | Cannabis tracking/compliance | Enterprise |

**Special Requirements**: Industry compliance, regulatory awareness

---

### 4. Infrastructure (2 types)

| Type | Description | Default Swarm |
|------|-------------|---------------|
| `data_center` | Data center infrastructure | Full |
| `systems_audit` | System audit/assessment | Standard |

**Special Requirements**: Infrastructure diagrams, capacity planning

---

### 5. SDLC Methodologies (5 types)

| Type | Description | Approach |
|------|-------------|----------|
| `sdlc_waterfall` | Traditional waterfall project | Sequential phases, formal sign-offs |
| `sdlc_agile` | Agile/Scrum project | Sprints, iterative delivery |
| `sdlc_xtreme` | Extreme Programming project | Pair programming, TDD, continuous integration |
| `sdlc_10xdev` | High-velocity development | Rapid prototyping, MVP focus |
| `sdlc_theaiway` | AI-assisted development | Claude-driven, human review gates |

---

### 6. Documentation (1 type)

| Type | Description | Default Swarm |
|------|-------------|---------------|
| `documentation` | Documentation project | Minimal |

**Deliverables**: User docs, API docs, architecture docs, runbooks

---

### 7. AI-Assisted Workflows (3 types)

| Type | Description | Human Involvement |
|------|-------------|-------------------|
| `human_hours_to_claude_hours` | Convert human work to Claude work | Planning + Review |
| `provide_prompts_for_need` | Generate prompts for specific needs | Minimal |
| `do_it_for_me_claude` | Full autonomous execution | Sign-off gates only |

---

## Template Structure

Each template defines:

```yaml
type: {project_type}
variant: new | change_request
category: {category}
complexity: minimal | standard | enterprise | full
default_swarm_preset: minimal | standard | enterprise | full
phases: [discovery, design, development, delivery]
deliverables:
  required: [list of required outputs]
  optional: [list of optional outputs]
sign_off_gates: [list of approval points]
```

---

## Phases

### Discovery Phase
- Requirements gathering
- Stakeholder identification
- Scope definition
- Risk assessment

### Design Phase
- Architecture design
- UI/UX design (if applicable)
- Technical specifications
- Security review

### Development Phase
- Implementation
- Unit testing
- Integration testing
- Code review

### Delivery Phase
- QA validation
- Documentation
- Deployment
- Handoff

---

## Variants

### New Project
- Full discovery phase
- Complete architecture design
- Greenfield implementation
- Comprehensive documentation

### Change Request
- Impact analysis
- Regression assessment
- Targeted modifications
- Delta documentation

---

## Quick Start Examples

### Web Application
```bash
/start-project web_app
```
Creates:
- `.claude/project/requirements.md`
- `.claude/project/architecture.md`
- Initializes git with feature branch
- Sets swarm preset to Standard

### Enterprise ERP Change Request
```bash
/start-project erp --variant change_request
```
Creates:
- `.claude/project/impact-analysis.md`
- `.claude/project/regression-plan.md`
- Links to existing documentation
- Sets swarm preset to Enterprise

### AI-Assisted Full Project
```bash
/start-project do_it_for_me_claude
```
Creates:
- Full autonomous configuration
- Sign-off gate schedule
- Human review checkpoints
- Sets swarm to Full

---

## Integration with Swarm

Templates automatically configure swarm presets:

| Complexity | Swarm Preset | Managers | ICs |
|------------|--------------|----------|-----|
| Minimal | Minimal | 5 | ~25 |
| Standard | Standard | 12 | ~60 |
| Enterprise | Enterprise | 20 | ~100 |
| Full | Full | 40 | ~200 |

---

## Custom Templates

Add custom templates in `.claude/templates/custom/`:

```yaml
# .claude/templates/custom/my-template.yaml
name: My Custom Template
type: custom_template
category: custom
complexity: standard
default_swarm_preset: standard
phases:
  - discovery
  - development
  - delivery
deliverables:
  required:
    - requirements.md
    - implementation
    - tests
  optional:
    - documentation
```

Invoke: `/start-project my-template`
