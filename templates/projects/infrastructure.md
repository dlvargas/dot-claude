---
category: infrastructure
load_when: start_project
---

# Infrastructure Project Templates

---

## data_center

### New Project
```yaml
type: data_center
variant: new
complexity: full
swarm_preset: full
managers: [Discovery, Architecture, Infrastructure, Security, Documentation, Operations]
```

**Phase 1: Discovery**
- Capacity requirements
- Power and cooling needs
- Network architecture
- Compliance requirements (SOC2, ISO27001)

**Phase 2: Design**
- Physical layout
- Network topology
- Power distribution
- Cooling design
- Security controls

**Phase 3: Implementation**
- Hardware procurement
- Network installation
- Power/cooling systems
- Security systems
- Monitoring setup

**Phase 4: Validation**
- Burn-in testing
- Failover testing
- Security audit
- Documentation

**Components:**
- Compute (servers, racks)
- Storage (SAN, NAS, object)
- Network (switches, routers, firewalls)
- Power (UPS, PDU, generators)
- Cooling (CRAC, containment)
- Security (access control, cameras)
- Monitoring (DCIM)

**Deliverables:**
- Architecture diagrams
- Network diagrams
- Power diagrams
- Runbooks
- DR plan
- Security documentation

### Change Request
```yaml
type: data_center
variant: change_request
scope: [capacity_expansion, network_upgrade, security_enhancement]
```

---

## systems_audit

### New Project
```yaml
type: systems_audit
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Security, Infrastructure, Documentation]
audit_types: [security, compliance, performance, architecture]
```

**Phase 1: Scoping**
- Define audit scope
- Identify stakeholders
- Gather documentation
- Schedule access

**Phase 2: Assessment**

**Security Audit:**
- Vulnerability scanning
- Configuration review
- Access control review
- Penetration testing

**Compliance Audit:**
- Control mapping
- Evidence collection
- Gap analysis
- Remediation tracking

**Performance Audit:**
- Capacity analysis
- Bottleneck identification
- Optimization opportunities
- Cost analysis

**Architecture Audit:**
- Current state documentation
- Technical debt assessment
- Modernization opportunities
- Risk analysis

**Phase 3: Analysis**
- Finding consolidation
- Risk scoring
- Remediation prioritization
- ROI analysis

**Phase 4: Reporting**
- Executive summary
- Detailed findings
- Remediation roadmap
- Follow-up schedule

**Deliverables:**
- Audit report
- Finding database
- Remediation plan
- Executive presentation
- Evidence package

---

## documentation

### New Project
```yaml
type: documentation
variant: new
complexity: standard
swarm_preset: minimal
managers: [Discovery, Documentation]
doc_types: [technical, user, api, architecture]
```

**Phase 1: Discovery**
- Audience identification
- Existing documentation audit
- Gap analysis
- Content strategy

**Phase 2: Planning**
- Information architecture
- Template design
- Style guide
- Review process

**Phase 3: Creation**
- Technical writing
- Diagrams and visuals
- Code examples
- Tutorials

**Phase 4: Publishing**
- Doc site setup (GitBook, Docusaurus, etc.)
- Search optimization
- Versioning
- Feedback mechanism

**Documentation Types:**

**Technical:**
- Architecture docs
- API reference
- Database schema
- System diagrams

**User:**
- Getting started
- User guides
- FAQ
- Troubleshooting

**API:**
- Endpoint reference
- Authentication
- Examples
- SDKs

**Process:**
- Runbooks
- Playbooks
- SOPs
- Decision logs

**Deliverables:**
- Documentation site
- Source files (markdown)
- Diagrams (Mermaid, Draw.io)
- Style guide
- Contribution guide

### Change Request
```yaml
type: documentation
variant: change_request
scope: [update, new_section, migration]
```
