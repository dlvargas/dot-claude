---
category: business_systems
load_when: start_project
---

# Business Systems Project Templates

---

## crm

### New Project
```yaml
type: crm
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Product, Architecture, Design, Frontend, Backend, Integration, Operations, QA, Documentation]
```

**Phase 1: Discovery**
- Sales process mapping
- Lead lifecycle definition
- Integration requirements (email, phone, calendar)
- Reporting needs

**Phase 2: Design**
- Contact/Account/Opportunity data model
- Pipeline visualization
- Activity tracking design
- Dashboard layouts

**Phase 3: Development**
- Contact management
- Lead scoring
- Opportunity pipeline
- Email integration
- Reporting engine

**Phase 4: Delivery**
- Data migration tools
- User training materials
- Integration testing
- Go-live support

**Modules:**
- Contacts & Accounts
- Leads & Opportunities
- Activities & Tasks
- Email Integration
- Reporting & Analytics
- Mobile App

**Deliverables:**
- CRM application
- API for integrations
- Data import tools
- User guides
- Admin documentation

### Change Request
```yaml
type: crm
variant: change_request
scope: [module_enhancement, integration_add, report_custom]
```

---

## erp

### New Project
```yaml
type: erp
variant: new
complexity: full
swarm_preset: full
managers: ALL_40_MANAGERS
compliance: [SOX, GAAP]
```

**Phase 1: Discovery**
- Business process audit
- Module selection
- Integration landscape
- Compliance requirements

**Phase 2: Design**
- Master data model
- Workflow engine design
- Approval hierarchies
- Multi-entity structure

**Phase 3: Development**
- Finance (GL, AP, AR)
- Inventory Management
- Procurement
- HR/Payroll
- Manufacturing (if applicable)

**Phase 4: Delivery**
- Data migration
- User acceptance testing
- Parallel run
- Cutover planning

**Core Modules:**
- General Ledger
- Accounts Payable
- Accounts Receivable
- Inventory Management
- Procurement
- Human Resources
- Payroll
- Manufacturing
- Project Accounting
- Fixed Assets

**Deliverables:**
- Full ERP application
- Integration APIs
- Migration tools
- Training curriculum
- Runbooks

---

## pos

### New Project
```yaml
type: pos
variant: new
complexity: standard
swarm_preset: standard
managers: [Discovery, Architecture, Design, Frontend, Backend, Integration, QA, Documentation]
compliance: [PCI_DSS]
```

**Phase 1: Discovery**
- Transaction types
- Payment methods
- Hardware requirements
- Offline capability needs

**Phase 2: Design**
- Transaction flow
- Payment integration
- Receipt generation
- Inventory sync

**Phase 3: Development**
- Transaction processing
- Payment gateway integration
- Receipt printing
- Inventory management
- End-of-day reconciliation

**Phase 4: Delivery**
- Hardware setup guides
- Staff training
- PCI compliance validation
- Go-live support

**Deliverables:**
- POS application
- Payment integrations
- Hardware drivers
- Training materials
- PCI documentation

---

## retail_ops

### New Project
```yaml
type: retail_ops
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Product, Architecture, Design, Frontend, Backend, Integration, Operations, QA, Documentation]
```

**Phase 1: Discovery**
- Store operations mapping
- Inventory management needs
- Pricing strategy
- Promotion requirements

**Phase 2: Design**
- Store hierarchy
- Inventory tracking
- Pricing engine
- Promotion rules

**Phase 3: Development**
- Store management
- Inventory control
- Price management
- Promotion engine
- Reporting

**Modules:**
- Store Operations
- Inventory Management
- Price & Promotion
- Vendor Management
- Analytics & Reporting
- Loss Prevention

---

## hotel_ops / hotel_res / hotel_billing

### New Project (Hotel Suite)
```yaml
type: hotel_suite
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Product, Architecture, Design, Frontend, Backend, Integration, Operations, QA, Documentation]
modules: [ops, res, billing]
```

**Phase 1: Discovery**
- Property management needs
- Channel management
- Rate strategy
- Guest experience requirements

**Phase 2: Design**
- Room inventory model
- Booking engine
- Guest profile
- Housekeeping workflow

**Phase 3: Development**

**hotel_ops:**
- Front desk operations
- Housekeeping management
- Maintenance tracking
- Guest services

**hotel_res:**
- Booking engine
- Channel manager integration
- Rate management
- Availability calendar

**hotel_billing:**
- Folio management
- Payment processing
- Night audit
- Revenue reporting

**Phase 4: Delivery**
- Staff training
- Channel connections
- Payment certification
- Go-live support

**Deliverables:**
- Property Management System
- Booking Engine
- Channel Manager Integration
- Payment Processing
- Reporting Suite

---

## cannabis_seed_to_sale

### New Project
```yaml
type: cannabis_seed_to_sale
variant: new
complexity: full
swarm_preset: full
managers: ALL_40_MANAGERS
compliance: [METRC, Leaf_Data, BioTrack, state_specific]
```

**Phase 1: Discovery**
- State/jurisdiction requirements
- License types
- Metrc/state API integration
- Chain of custody needs

**Phase 2: Design**
- Plant tracking model
- Batch/lot tracking
- Lab result integration
- Compliance reporting

**Phase 3: Development**
- Cultivation tracking
- Manufacturing/processing
- Inventory management
- Point of sale (if retail)
- Compliance reporting

**Phase 4: Delivery**
- State system integration
- Compliance validation
- Staff training
- License-specific configuration

**Modules:**
- Cultivation Tracking
- Manufacturing
- Inventory Management
- Retail POS
- Compliance Reporting
- Lab Integration
- Waste Tracking
- Transport Manifests

**Compliance Requirements:**
- Seed-to-sale traceability
- Plant tagging
- Batch tracking
- Lab COA integration
- State reporting APIs
- Audit trails

**Deliverables:**
- Full seed-to-sale platform
- State API integrations
- Compliance reports
- Training materials
- Audit documentation
