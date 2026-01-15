---
name: start-project
description: Initialize a new project using predefined templates
invocation: /start_project
args: "[type]:[variant]"
---

# Start Project Skill

Initialize projects using structured templates for consistent setup and delivery.

## Usage

```
/start_project                    # Interactive selection
/start_project cli_tool           # New CLI tool project
/start_project web_app:change     # Web app change request
/start_project crm:new            # New CRM project
```

## Instructions

### Step 1: Parse Arguments

If type is provided:
- Parse `type:variant` format
- Default variant is `new`

If no arguments:
- Present category selection

### Step 2: Category Selection (if needed)

Use AskUserQuestion:

**Header:** "Category"
**Question:** "What type of project are you starting?"
**Options:**
1. **Software Development** - CLI, GUI, web apps, services, products
2. **Security & Cryptography** - Pentests, crypto tools, secure systems
3. **Business Systems** - CRM, ERP, POS, hospitality, cannabis
4. **Infrastructure** - Data centers, audits, documentation
5. **SDLC Methodology** - Waterfall, Agile, XP, 10x, AI-way
6. **AI-Assisted** - Human-to-Claude hours, prompts, do-it-for-me

### Step 3: Type Selection

Based on category, present type options.

### Step 4: Variant Selection

**Header:** "Variant"
**Question:** "Is this a new project or a change request?"
**Options:**
1. **New Project** - Greenfield implementation from scratch
2. **Change Request** - Modification to existing project

### Step 5: Load Template

Read template from `~/.claude/templates/projects/{category}.md`
Extract the specific project type section.

### Step 6: Initialize Project

Based on template, execute:

1. Create project structure
2. Set up `.claude/` configuration
3. Configure swarm preset (if applicable)
4. Generate project CLAUDE.md
5. Create initial backlog/plan

### Step 7: Present Plan

Show the loaded template phases and deliverables.
Ask for approval to proceed with Phase 1.

## Project Types Reference

### Software Development
| Type | Description |
|------|-------------|
| cli_tool | Command-line application |
| gui_tool | Desktop GUI application |
| web_app | Web application (SPA/SSR) |
| system_service | Backend service/microservice |
| full_stack_product | Complete web product |
| enterprise_stack_product | Enterprise-grade product |

### Security & Cryptography
| Type | Description |
|------|-------------|
| penetration_test | Security assessment |
| back_door_injection | Red team payload (authorized) |
| back_door_finder | Defensive scanning |
| obfuscation_tool | Code protection |
| secure_encrypt | Encryption implementation |
| secure_decrypt | Decryption implementation |
| secure_transport | Secure communication |
| post_quantum_* | Post-quantum crypto variants |

### Business Systems
| Type | Description |
|------|-------------|
| crm | Customer relationship management |
| erp | Enterprise resource planning |
| pos | Point of sale |
| retail_ops | Retail operations |
| hotel_ops | Hotel operations |
| hotel_res | Hotel reservations |
| hotel_billing | Hotel billing |
| cannabis_seed_to_sale | Cannabis tracking |

### Infrastructure
| Type | Description |
|------|-------------|
| data_center | Data center build/upgrade |
| systems_audit | System assessment |
| documentation | Documentation project |

### SDLC Methodologies
| Type | Description |
|------|-------------|
| sdlc_waterfall | Traditional waterfall |
| sdlc_agile | Agile/Scrum |
| sdlc_xtreme | Extreme Programming |
| sdlc_10xdev | 10x developer methodology |
| sdlc_theaiway | AI-assisted development |

### AI-Assisted
| Type | Description |
|------|-------------|
| human_hours_to_claude_hours | Estimation conversion |
| provide_prompts_for_need | Prompt generation |
| do_it_for_me_claude | Full autonomous mode |

## Example Flows

### New CLI Tool
```
User: /start_project cli_tool

Claude:
## Starting New CLI Tool Project

Template loaded from: software-development.md

**Phases:**
1. Discovery - Define commands, platforms, dependencies
2. Design - Parser architecture, config format
3. Development - Implementation, testing
4. Delivery - Packaging, distribution

**Swarm Preset:** Minimal (5 managers)

**Managers:**
- Discovery
- Architecture
- Backend
- QA
- Documentation

Ready to begin Discovery phase?
```

### CRM Change Request
```
User: /start_project crm:change

Claude:
## Starting CRM Change Request

**Variant:** Change Request

**Impact Analysis Required:**
- Affected modules
- Data migration needs
- Regression scope

What is the change you need to make?
```
