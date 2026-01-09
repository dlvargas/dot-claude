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
