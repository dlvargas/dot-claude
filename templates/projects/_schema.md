# Project Template Schema

All project templates follow this structure for consistency.

## Template Structure

```yaml
type: {project_type}
variant: new | change_request
category: {category}
complexity: minimal | standard | enterprise | full
default_swarm_preset: minimal | standard | enterprise | full
phases: [discovery, design, development, delivery]
```

## Phase Definitions

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

## Variant: New Project
- Full discovery phase
- Complete architecture design
- Greenfield implementation
- Comprehensive documentation

## Variant: Change Request
- Impact analysis
- Regression assessment
- Targeted modifications
- Delta documentation

## Categories

1. **Software Development**
   - cli_tool, gui_tool, web_app, system_service, full_stack_product, enterprise_stack_product

2. **Security & Cryptography**
   - penetration_test, back_door_injection, back_door_finder, obfuscation_tool
   - secure_encrypt, secure_decrypt, secure_transport
   - post_quantum_* variants

3. **Business Systems**
   - crm, erp, pos, retail_ops
   - hotel_ops, hotel_res, hotel_billing
   - cannabis_seed_to_sale

4. **Infrastructure**
   - data_center, systems_audit

5. **Documentation & Process**
   - documentation, sdlc_* variants

6. **AI-Assisted**
   - human_hours_to_claude_hours, provide_prompts_for_need, do_it_for_me_claude

## Deliverables by Type

Each template specifies:
- Required artifacts
- Optional artifacts
- Sign-off gates
- Quality metrics
