# Start Project Command

Initialize a project using structured templates.

## Usage

```bash
/start_project                        # Interactive mode
/start_project [type]                 # New project of type
/start_project [type]:new             # Explicit new project
/start_project [type]:change          # Change request
```

## Quick Reference

### Software Development
```
/start_project cli_tool
/start_project gui_tool
/start_project web_app
/start_project system_service
/start_project full_stack_product
/start_project enterprise_stack_product
```

### Security & Cryptography
```
/start_project penetration_test
/start_project back_door_injection    # Requires authorization
/start_project back_door_finder
/start_project obfuscation_tool
/start_project secure_encrypt
/start_project secure_decrypt
/start_project secure_transport
/start_project post_quantum_encrypt
/start_project post_quantum_decrypt
/start_project post_quantum_transport
/start_project post_quantum_local_device
/start_project post_quantum_remote_device
```

### Business Systems
```
/start_project crm
/start_project erp
/start_project pos
/start_project retail_ops
/start_project hotel_ops
/start_project hotel_res
/start_project hotel_billing
/start_project cannabis_seed_to_sale
```

### Infrastructure
```
/start_project data_center
/start_project systems_audit
/start_project documentation
```

### SDLC Methodologies
```
/start_project sdlc_waterfall
/start_project sdlc_agile
/start_project sdlc_xtreme
/start_project sdlc_10xdev
/start_project sdlc_theaiway
```

### AI-Assisted
```
/start_project human_hours_to_claude_hours
/start_project provide_prompts_for_need
/start_project do_it_for_me_claude
```

## What Happens

1. **Template Loading** - Reads project template from `~/.claude/templates/projects/`
2. **Configuration** - Creates `.claude/config/` with project settings
3. **Swarm Setup** - Configures appropriate swarm preset
4. **CLAUDE.md** - Generates project-specific CLAUDE.md
5. **Phase Planning** - Creates initial phase plan and deliverables

## Project Variants

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

## Template Locations

Templates are stored in:
- `~/.claude/templates/projects/software-development.md`
- `~/.claude/templates/projects/security-cryptography.md`
- `~/.claude/templates/projects/business-systems.md`
- `~/.claude/templates/projects/infrastructure.md`
- `~/.claude/templates/projects/sdlc-methodologies.md`
- `~/.claude/templates/projects/ai-assisted.md`

## Examples

### Start a new web application
```
/start_project web_app

Starting new Web App project...
Loading template: software-development.md
Swarm preset: standard (8 managers)

Phase 1: Discovery
- User stories and personas
- Browser/device targets
- Performance budgets
- Security requirements

Ready to begin?
```

### ERP change request
```
/start_project erp:change

Starting ERP Change Request...

What module needs modification?
- Finance
- Inventory
- HR
- Other
```
