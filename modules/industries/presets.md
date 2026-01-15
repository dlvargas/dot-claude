---
description: Industry-specific swarm configurations
load_when: industryPreset
---

# Industry Presets

## SaaS/B2B Software (15 Managers)

**Focus**: Multi-tenant platforms, subscription models, enterprise sales

```json
{
  "industryPreset": "saas",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "documentation", "security",
    "customer-success", "analytics", "platform"
  ]
}
```

**Key ICs Emphasized**:
- Multi-tenant Architecture IC
- SSO/SAML Integration IC
- Subscription Billing IC
- Customer Onboarding IC
- Feature Flag IC
- API Documentation IC

---

## Fintech (18 Managers)

**Focus**: Regulatory compliance, security, financial transactions

```json
{
  "industryPreset": "fintech",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "documentation", "security",
    "data", "analytics", "payments", "compliance",
    "observability", "infrastructure"
  ]
}
```

**Key ICs Emphasized**:
- PCI Compliance IC
- Fraud Detection IC
- Transaction Reconciliation IC
- SOX Compliance IC
- Encryption/Key Management IC
- Audit Trail IC
- Real-time Settlement IC

---

## E-commerce (16 Managers)

**Focus**: Conversion optimization, inventory, fulfillment

```json
{
  "industryPreset": "ecommerce",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "payments", "ecommerce",
    "growth", "analytics", "communications", "performance"
  ]
}
```

**Key ICs Emphasized**:
- Product Catalog IC
- Shopping Cart IC
- Checkout Flow IC
- Inventory Management IC
- Order Fulfillment IC
- Search/Recommendations IC
- A/B Testing IC

---

## Healthcare (17 Managers)

**Focus**: HIPAA compliance, data privacy, interoperability

```json
{
  "industryPreset": "healthcare",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "documentation", "security",
    "data", "compliance", "accessibility", "infrastructure",
    "communications"
  ]
}
```

**Key ICs Emphasized**:
- HIPAA Compliance IC
- PHI Data Protection IC
- HL7/FHIR Integration IC
- Audit Logging IC
- Consent Management IC
- Telehealth IC
- Medical Device Integration IC

---

## Enterprise Software (20 Managers)

**Focus**: Large-scale systems, integration, governance

```json
{
  "industryPreset": "enterprise",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "documentation", "security",
    "customer-success", "data", "analytics", "platform",
    "infrastructure", "observability", "workflow", "vendor"
  ]
}
```

**Key ICs Emphasized**:
- Enterprise Architecture IC
- SSO/LDAP Integration IC
- Workflow Engine IC
- Change Management IC
- SLA Monitoring IC
- Legacy Migration IC
- Multi-region Deployment IC

---

## Gaming (14 Managers)

**Focus**: Real-time performance, player engagement, monetization

```json
{
  "industryPreset": "gaming",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "mobile", "quality",
    "release", "performance", "analytics", "community",
    "growth", "infrastructure"
  ]
}
```

**Key ICs Emphasized**:
- Real-time Multiplayer IC
- Game State Sync IC
- Anti-Cheat IC
- Matchmaking IC
- In-Game Economy IC
- Leaderboard IC
- CDN/Asset Delivery IC

---

## AI/ML Product (12 Managers)

**Focus**: Model development, serving infrastructure, safety

```json
{
  "industryPreset": "aiml",
  "swarmDomains": [
    "discovery", "product", "architecture", "backend",
    "quality", "release", "documentation", "security",
    "research", "aiml", "data", "observability"
  ]
}
```

**Key ICs Emphasized**:
- ML Platform IC
- Model Training IC
- Model Serving IC
- MLOps IC
- AI Safety IC
- Prompt Engineering IC
- RAG Pipeline IC
- Fine-tuning IC

---

## Agency/Consultancy (12 Managers)

**Focus**: Multi-client projects, rapid prototyping, handoff

```json
{
  "industryPreset": "agency",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "quality", "release",
    "documentation", "content", "technical-writing", "training"
  ]
}
```

**Key ICs Emphasized**:
- Design System IC
- Component Library IC
- Client Handoff IC
- Style Guide IC
- CMS Integration IC
- Multi-brand Theming IC

---

## Startup (8 Managers)

**Focus**: Speed to market, iteration, resource efficiency

```json
{
  "industryPreset": "startup",
  "swarmDomains": [
    "discovery", "architecture", "design", "frontend",
    "backend", "quality", "release", "growth"
  ]
}
```

**Key ICs Emphasized**:
- MVP Architecture IC
- Rapid Prototyping IC
- User Feedback IC
- Growth Hacking IC
- Iteration IC

---

## Government/Public Sector (16 Managers)

**Focus**: Compliance, accessibility, security clearance

```json
{
  "industryPreset": "government",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "quality",
    "release", "documentation", "security", "compliance",
    "accessibility", "infrastructure", "audit", "vendor"
  ]
}
```

**Key ICs Emphasized**:
- FedRAMP Compliance IC
- Section 508 Accessibility IC
- NIST Framework IC
- Government Cloud IC
- Clearance Documentation IC
- Public Records IC
- Multi-language Support IC

---

## Media/Publishing (14 Managers)

**Focus**: Content delivery, monetization, engagement

```json
{
  "industryPreset": "media",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "quality", "release",
    "documentation", "content", "communications",
    "analytics", "growth", "i18n"
  ]
}
```

**Key ICs Emphasized**:
- CMS Architecture IC
- Media Processing IC
- Paywall IC
- Ad Integration IC
- Video Streaming IC
- Syndication IC

---

## IoT/Hardware (15 Managers)

**Focus**: Device management, firmware, connectivity

```json
{
  "industryPreset": "iot",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "mobile",
    "quality", "release", "security", "infrastructure",
    "observability", "data", "communications"
  ]
}
```

**Key ICs Emphasized**:
- Device Provisioning IC
- Firmware OTA IC
- MQTT/CoAP IC
- Edge Computing IC
- Device Twin IC
- Telemetry IC
- Battery Optimization IC

---

## Marketplace (16 Managers)

**Focus**: Two-sided platforms, trust/safety, payments

```json
{
  "industryPreset": "marketplace",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "release", "payments", "security",
    "growth", "communications", "support", "analytics"
  ]
}
```

**Key ICs Emphasized**:
- Trust & Safety IC
- Escrow/Payment Split IC
- Review System IC
- Search Ranking IC
- Seller Onboarding IC
- Dispute Resolution IC
- Commission Engine IC

---

## EdTech (14 Managers)

**Focus**: Learning management, engagement, assessment

```json
{
  "industryPreset": "edtech",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "mobile", "quality",
    "release", "documentation", "accessibility",
    "training", "analytics", "community"
  ]
}
```

**Key ICs Emphasized**:
- LMS Integration IC
- Course Builder IC
- Assessment Engine IC
- Progress Tracking IC
- Video Streaming IC
- Certification IC
- Gamification IC

---

## Automotive - OEM Supplier (16 Managers)

**Focus**: Supply chain, quality systems, EDI integration, tier coordination

```json
{
  "industryPreset": "auto-oem-supplier",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "integration", "operations", "quality",
    "release", "documentation", "compliance", "data",
    "infrastructure", "manufacturing", "supply-chain", "logistics"
  ]
}
```

**Key ICs Emphasized**:
- EDI Integration IC (ANSI X12, EDIFACT)
- IATF 16949 Quality IC
- PPAP Documentation IC
- Tier 1/2/3 Coordination IC
- JIT/Kanban Inventory IC
- Supplier Portal IC
- IMDS Material Compliance IC

---

## Automotive - OEM Reverse Engineering (14 Managers)

**Focus**: Protocol analysis, ECU mapping, firmware extraction, CAN/LIN diagnostics

```json
{
  "industryPreset": "auto-oem-reverse",
  "swarmDomains": [
    "discovery", "architecture", "backend", "security",
    "quality", "release", "documentation", "research",
    "embedded", "protocols", "data", "tooling",
    "compliance", "testing"
  ]
}
```

**Key ICs Emphasized**:
- CAN Bus Analysis IC
- ECU Firmware Extraction IC
- UDS Protocol IC (ISO 14229)
- OBD-II/EOBD IC
- J2534 Passthru IC
- Calibration Mapping IC
- Binary Analysis IC
- Hardware Security Module IC

---

## Automotive - OEM Manufacturer (18 Managers)

**Focus**: MES integration, plant floor systems, quality gates, production optimization

```json
{
  "industryPreset": "auto-oem-manufacturer",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "integration", "operations", "quality",
    "release", "documentation", "security", "compliance",
    "infrastructure", "manufacturing", "supply-chain", "data",
    "observability", "automation"
  ]
}
```

**Key ICs Emphasized**:
- MES Integration IC
- Plant Floor HMI IC
- Quality Gate IC
- Traceability IC (VIN tracking)
- Line Balancing IC
- Andon System IC
- SCADA Integration IC
- OEE Dashboard IC

---

## Automotive - OEM Engineering (16 Managers)

**Focus**: CAD/CAM/CAE, PLM integration, DFMEA, simulation

```json
{
  "industryPreset": "auto-oem-engineering",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "integration", "quality", "release",
    "documentation", "research", "data", "infrastructure",
    "simulation", "testing", "compliance", "collaboration"
  ]
}
```

**Key ICs Emphasized**:
- PLM Integration IC (Teamcenter, Windchill)
- CAD Data Exchange IC (STEP, JT, IGES)
- DFMEA/PFMEA IC
- Simulation Results IC
- BOM Management IC
- Change Management IC
- Engineering Release IC
- A-Surface Design IC

---

## Automotive - OEM R&D (15 Managers)

**Focus**: Advanced development, prototype systems, testing validation, IP protection

```json
{
  "industryPreset": "auto-oem-rd",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "quality", "documentation", "security",
    "research", "embedded", "testing", "simulation",
    "data", "infrastructure", "compliance"
  ]
}
```

**Key ICs Emphasized**:
- Prototype Build IC
- HIL/SIL Testing IC
- ADAS Development IC
- Battery/EV Systems IC
- Autonomous Vehicle IC
- Connected Car IC
- Patent Documentation IC
- Test Fleet Management IC

---

## Automotive - Dealer Sales (12 Managers)

**Focus**: DMS integration, CRM, F&I, inventory management

```json
{
  "industryPreset": "auto-dealer-sales",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "analytics", "communications", "growth"
  ]
}
```

**Key ICs Emphasized**:
- DMS Integration IC (CDK, Reynolds, Dealertrack)
- CRM Lead Management IC
- F&I Menu System IC
- Desking/Pencil IC
- Inventory Pricing IC
- OEM Incentive IC
- Credit Application IC
- Trade Appraisal IC

---

## Automotive - Dealer Service (14 Managers)

**Focus**: Service scheduling, warranty claims, parts ordering, technician dispatch

```json
{
  "industryPreset": "auto-dealer-service",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "documentation", "communications",
    "analytics", "scheduling", "inventory"
  ]
}
```

**Key ICs Emphasized**:
- Service Scheduling IC
- Warranty Claims IC
- Parts Ordering IC (OEM EPC)
- Technician Dispatch IC
- MPI Inspection IC
- Service History IC
- TSB/Recall IC
- Labor Time Guide IC

---

## Automotive - Aftermarket Reverse Engineering (13 Managers)

**Focus**: OBD protocols, ECU tuning, diagnostics development, scan tool creation

```json
{
  "industryPreset": "auto-aftermarket-reverse",
  "swarmDomains": [
    "discovery", "architecture", "backend", "security",
    "quality", "documentation", "research", "embedded",
    "protocols", "data", "tooling", "testing", "compliance"
  ]
}
```

**Key ICs Emphasized**:
- OBD-II PID Discovery IC
- CAN/LIN Reverse IC
- ECU Bench Flash IC
- Immobilizer Research IC
- Protocol Decoder IC
- Scan Tool Development IC
- Data Logger IC
- Checksum/Security Bypass IC

---

## Automotive - 3rd Party Servicing (12 Managers)

**Focus**: Multi-make diagnostics, repair information, parts sourcing, estimating

```json
{
  "industryPreset": "auto-3rdparty-service",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "documentation", "inventory", "scheduling"
  ]
}
```

**Key ICs Emphasized**:
- Multi-Make Diagnostics IC
- Repair Information IC (AllData, Mitchell)
- Parts Sourcing IC (aftermarket, OE, reman)
- Labor Estimating IC
- Customer Authorization IC
- Inspection Reporting IC
- Right to Repair IC
- ADAS Calibration IC

---

## Automotive - Collision Repair Body (13 Managers)

**Focus**: Estimating, photo AI, DRP management, paint matching, structural repair

```json
{
  "industryPreset": "auto-collision-body",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "documentation", "ai-ml", "communications",
    "compliance"
  ]
}
```

**Key ICs Emphasized**:
- Estimating IC (CCC, Mitchell, Audatex)
- Photo AI Damage IC
- DRP Portal IC
- Paint Code/Formula IC
- Structural Analysis IC
- Calibration Requirements IC
- Parts Procurement IC
- Supplement Management IC

---

## Automotive - Collision Repair Powertrain (12 Managers)

**Focus**: Mechanical damage assessment, drivetrain repair, hybrid/EV safety

```json
{
  "industryPreset": "auto-collision-powertrain",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "operations",
    "quality", "documentation", "compliance", "safety"
  ]
}
```

**Key ICs Emphasized**:
- Drivetrain Damage IC
- Frame/Subframe IC
- EV High-Voltage Safety IC
- Engine/Trans Assessment IC
- Alignment Specification IC
- Cooling System IC
- Exhaust/Emissions IC
- Hybrid Battery IC

---

## Automotive - Aftermarket Tuning (14 Managers)

**Focus**: ECU calibration, dyno testing, emissions compliance, performance parts

```json
{
  "industryPreset": "auto-aftermarket-tuning",
  "swarmDomains": [
    "discovery", "product", "architecture", "backend",
    "quality", "release", "documentation", "security",
    "embedded", "testing", "data", "compliance",
    "ecommerce", "community"
  ]
}
```

**Key ICs Emphasized**:
- ECU Calibration IC
- Dyno Data Analysis IC
- Boost/Timing Map IC
- Flex Fuel IC
- Ethanol Content IC
- Wideband AFR IC
- Data Logging IC
- Anti-Tamper IC

---

## Automotive - Aftermarket Product Design (15 Managers)

**Focus**: CAD design, FEA/CFD, fitment verification, manufacturing prep

```json
{
  "industryPreset": "auto-aftermarket-product",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "quality", "release", "documentation",
    "compliance", "manufacturing", "ecommerce", "data",
    "simulation", "testing", "supply-chain"
  ]
}
```

**Key ICs Emphasized**:
- CAD Design IC (SolidWorks, Fusion 360)
- FEA Analysis IC
- CFD Analysis IC
- Fitment Database IC
- 3D Scanning IC
- Prototyping IC
- Tooling Design IC
- Assembly Instructions IC

---

## Automotive - CARB Compliance (14 Managers)

**Focus**: Emissions certification, EO documentation, anti-tampering, testing protocols

```json
{
  "industryPreset": "auto-carb-compliance",
  "swarmDomains": [
    "discovery", "product", "architecture", "backend",
    "quality", "release", "documentation", "compliance",
    "testing", "data", "legal", "government",
    "research", "communications"
  ]
}
```

**Key ICs Emphasized**:
- Executive Order IC
- Emissions Testing IC
- OBD-II Compliance IC
- Catalyst Verification IC
- Anti-Tampering IC
- SEMA Action Network IC
- EPA Liaison IC
- State-by-State IC
- Warranty Documentation IC

---

## Automotive - Owner Servicing (10 Managers)

**Focus**: DIY guides, parts lookup, diagnostic assistance, community support

```json
{
  "industryPreset": "auto-owner-service",
  "swarmDomains": [
    "discovery", "product", "design", "frontend",
    "backend", "quality", "documentation", "community",
    "ecommerce", "communications"
  ]
}
```

**Key ICs Emphasized**:
- DIY Guide IC
- Parts Interchange IC
- Diagnostic Assistant IC
- Torque Spec IC
- Fluid Capacity IC
- Maintenance Schedule IC
- Tool Recommendation IC
- Community Forum IC
- Video Tutorial IC

---

## Automotive - EV Powertrain (18 Managers)

**Focus**: Electric vehicle drivetrain - reverse engineering, modification, parts, emulation

```json
{
  "industryPreset": "auto-ev-powertrain",
  "swarmDomains": [
    "discovery", "product", "architecture", "backend",
    "security", "quality", "release", "documentation",
    "research", "embedded", "testing", "data",
    "tooling", "manufacturing", "compliance", "simulation",
    "protocols", "safety"
  ]
}
```

**Key ICs Emphasized**:
- BMS Protocol IC
- Cell Chemistry IC
- Motor Control IC (FOC/DTC)
- Inverter RE IC
- EVSE Protocol IC (J1772, CCS, CHAdeMO)
- BMS Emulator IC
- Battery Cooling IC
- Cell Sourcing IC
- Power Upgrade IC
- Conversion IC (ICE-to-EV)

---

## Automotive - ADAS OEM (20 Managers)

**Focus**: OEM ADAS development - perception, control systems, safety, validation

```json
{
  "industryPreset": "auto-adas-oem",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "backend", "integration", "quality", "release",
    "documentation", "security", "research", "embedded",
    "testing", "simulation", "data", "compliance",
    "safety", "protocols", "ai-ml", "infrastructure"
  ]
}
```

**Key ICs Emphasized**:
- Sensor Fusion IC (Camera/Radar/Lidar)
- Object Classification IC
- Longitudinal Control IC (ACC, AEB)
- Lateral Control IC (Lane Keeping)
- Path Planning IC
- ISO 26262 IC (ASIL, FMEA)
- SOTIF IC (ISO 21448)
- CAN Architecture IC
- Automotive Ethernet IC (TSN)
- Detection Thresholds IC
- Scenario Generation IC (OpenSCENARIO)
- Track Testing IC (NCAP)

---

## Automotive - ADAS Aftermarket (14 Managers)

**Focus**: ADAS calibration, retrofit, repair integration, technician tools

```json
{
  "industryPreset": "auto-adas-aftermarket",
  "swarmDomains": [
    "discovery", "product", "architecture", "design",
    "frontend", "backend", "integration", "quality",
    "release", "documentation", "training", "tooling",
    "compliance", "communications"
  ]
}
```

**Key ICs Emphasized**:
- Static Calibration IC
- Dynamic Calibration IC
- Camera Calibration IC
- Radar Calibration IC
- Post-Collision IC
- OEM Procedures IC
- Target Systems IC
- Scan Tool IC (Autel, Launch, Bosch)
- Mobile Calibration IC
- I-CAR Certification IC
- Blind Spot Retrofit IC
- ADAS DTC IC

