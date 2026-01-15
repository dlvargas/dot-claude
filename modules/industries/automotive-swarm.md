---
description: Complete Manager and IC hierarchies for automotive industry verticals
load_when: industryPreset starts with "auto-"
---

# Automotive Swarm Architecture

Complete organizational structures for all 15 automotive industry presets.

---

## 1. OEM Supplier (`auto-oem-supplier`)

**Focus**: Supply chain integration, quality systems, tier coordination

### Managers (6)

| Manager | Responsibility |
|---------|----------------|
| Supply Chain Manager | EDI, logistics, inventory flow |
| Quality Systems Manager | IATF 16949, PPAP, audits |
| Integration Manager | OEM portal connections, data exchange |
| Production Planning Manager | JIT/Kanban, capacity planning |
| Engineering Liaison Manager | Design changes, specifications |
| Compliance Manager | IMDS, conflict minerals, regulations |

### ICs (24)

#### Supply Chain Manager ICs
| IC | Focus |
|----|-------|
| EDI Integration IC | ANSI X12, EDIFACT, AS2 connectivity |
| Logistics Coordinator IC | Shipping, ASN, carrier management |
| Inventory Optimization IC | Safety stock, reorder points, ABC analysis |
| Demand Planning IC | Forecasting, consumption analysis |

#### Quality Systems Manager ICs
| IC | Focus |
|----|-------|
| IATF 16949 IC | Quality management system compliance |
| PPAP Coordinator IC | Production part approval documentation |
| APQP IC | Advanced product quality planning |
| Audit Preparation IC | Customer audits, internal audits, gap analysis |

#### Integration Manager ICs
| IC | Focus |
|----|-------|
| Supplier Portal IC | Covisint, SupplyOn, Ariba integration |
| Data Exchange IC | CAD translation, BOM sync, spec sheets |
| Release Coordination IC | Engineering change notices, effectivity |
| Tier Communication IC | Sub-supplier coordination, cascading requirements |

#### Production Planning Manager ICs
| IC | Focus |
|----|-------|
| JIT Scheduling IC | Pull systems, milk runs, sequencing |
| Capacity Planning IC | Bottleneck analysis, load balancing |
| Kanban System IC | Card systems, e-Kanban, supermarkets |
| MRP Integration IC | Material requirements, shortage alerts |

#### Engineering Liaison Manager ICs
| IC | Focus |
|----|-------|
| Design Review IC | DFM/DFA analysis, feasibility studies |
| Specification Management IC | Drawings, tolerances, GD&T |
| Prototype Coordination IC | Sample builds, ISIR, first articles |
| Change Management IC | ECN processing, deviation requests |

#### Compliance Manager ICs
| IC | Focus |
|----|-------|
| IMDS IC | Material data sheets, substance reporting |
| Conflict Minerals IC | CMRT, due diligence, smelter verification |
| Environmental Compliance IC | REACH, RoHS, ELV directives |
| Trade Compliance IC | Export controls, country of origin |

---

## 2. OEM Reverse Engineering (`auto-oem-reverse`)

**Focus**: Protocol analysis, ECU mapping, firmware extraction

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Protocol Analysis Manager | CAN/LIN/FlexRay/Ethernet analysis |
| Firmware Manager | ECU extraction, binary analysis |
| Security Research Manager | Immobilizer, HSM, cryptographic systems |
| Tooling Manager | Hardware tools, J2534, adapters |
| Documentation Manager | Findings, mappings, knowledge base |

### ICs (20)

#### Protocol Analysis Manager ICs
| IC | Focus |
|----|-------|
| CAN Bus IC | Message decoding, DBC creation, arbitration IDs |
| LIN Bus IC | Schedule tables, diagnostic frames |
| FlexRay IC | Static/dynamic segments, cycle timing |
| Automotive Ethernet IC | DoIP, SOME/IP, AVB protocols |
| UDS Protocol IC | ISO 14229, service IDs, DIDs, routines |

#### Firmware Manager ICs
| IC | Focus |
|----|-------|
| ECU Extraction IC | BDM, JTAG, boot mode access |
| Binary Analysis IC | Disassembly, Ghidra/IDA, symbol recovery |
| Calibration Mapping IC | A2L files, XCP/CCP, measurement points |
| Flash Algorithm IC | Bootloader analysis, memory layouts |

#### Security Research Manager ICs
| IC | Focus |
|----|-------|
| Immobilizer IC | Transponder protocols, key learning |
| HSM Analysis IC | Secure boot, key storage, SHE/EVITA |
| Cryptographic IC | Seed-key algorithms, challenge-response |
| Anti-Tamper IC | Tuning protection, code signing verification |

#### Tooling Manager ICs
| IC | Focus |
|----|-------|
| J2534 Development IC | PassThru API, VCI integration |
| Hardware Interface IC | CAN adapters, oscilloscopes, logic analyzers |
| Bench Setup IC | ECU power supply, simulation loads |

#### Documentation Manager ICs
| IC | Focus |
|----|-------|
| Protocol Documentation IC | Message definitions, signal databases |
| Knowledge Base IC | Findings repository, searchable archive |
| Training Material IC | Procedures, best practices, tutorials |

---

## 3. OEM Manufacturer (`auto-oem-manufacturer`)

**Focus**: Plant floor systems, MES, production optimization

### Managers (7)

| Manager | Responsibility |
|---------|----------------|
| MES Manager | Manufacturing execution system integration |
| Plant Floor Manager | HMI, SCADA, line control |
| Quality Gate Manager | Inline inspection, traceability |
| Automation Manager | PLC, robotics, conveyors |
| Maintenance Manager | TPM, predictive maintenance, CMMS |
| Logistics Manager | AGV, material flow, sequencing |
| Performance Manager | OEE, analytics, continuous improvement |

### ICs (28)

#### MES Manager ICs
| IC | Focus |
|----|-------|
| Work Order IC | Production orders, routing, scheduling |
| Recipe Management IC | Process parameters, setpoints |
| Labor Tracking IC | Time and attendance, skill matrix |
| Genealogy IC | As-built records, component tracing |

#### Plant Floor Manager ICs
| IC | Focus |
|----|-------|
| HMI Development IC | Operator screens, alarm management |
| SCADA Integration IC | Data collection, historian, trending |
| Line Control IC | Station sequencing, interlock logic |
| Andon System IC | Call systems, escalation, response tracking |

#### Quality Gate Manager ICs
| IC | Focus |
|----|-------|
| Vision System IC | Camera inspection, defect detection |
| Measurement IC | CMM integration, SPC, tolerance tracking |
| Traceability IC | VIN tracking, barcode/RFID, serialization |
| Containment IC | Hold management, rework routing |

#### Automation Manager ICs
| IC | Focus |
|----|-------|
| PLC Programming IC | Ladder logic, structured text, safety PLC |
| Robot Programming IC | Path planning, collision avoidance |
| Conveyor Control IC | Speed control, accumulation, divert logic |
| Tooling Integration IC | Torque tools, dispensing, welding |

#### Maintenance Manager ICs
| IC | Focus |
|----|-------|
| CMMS IC | Work orders, PM schedules, parts inventory |
| Predictive IC | Vibration, thermal, current signature analysis |
| Spare Parts IC | Critical spares, min/max, vendor management |
| Downtime Analysis IC | Pareto, root cause, MTBF/MTTR |

#### Logistics Manager ICs
| IC | Focus |
|----|-------|
| AGV Control IC | Traffic management, battery, missions |
| Sequencing IC | JIS delivery, broadcast, build verification |
| Warehouse IC | Putaway, picking, cycle counting |
| Packaging IC | Returnable containers, dunnage, labeling |

#### Performance Manager ICs
| IC | Focus |
|----|-------|
| OEE Dashboard IC | Availability, performance, quality metrics |
| Analytics IC | Production reports, trend analysis |
| Kaizen IC | Improvement tracking, A3, 8D support |
| Benchmarking IC | Cross-plant comparison, best practice sharing |

---

## 4. OEM Engineering (`auto-oem-engineering`)

**Focus**: CAD/CAM/CAE, PLM integration, design processes

### Managers (6)

| Manager | Responsibility |
|---------|----------------|
| PLM Manager | Teamcenter/Windchill integration, workflows |
| CAD Manager | Design tools, data exchange, standards |
| Simulation Manager | FEA, CFD, durability analysis |
| BOM Manager | EBOM/MBOM, configuration management |
| Release Manager | Engineering releases, change control |
| Collaboration Manager | Supplier data exchange, design reviews |

### ICs (24)

#### PLM Manager ICs
| IC | Focus |
|----|-------|
| Teamcenter IC | Structure management, workflows, access |
| Windchill IC | Product structure, baselines, variants |
| Integration IC | ERP sync, MES handoff, CAD vault |
| Workflow Automation IC | Approval routing, notifications, escalation |

#### CAD Manager ICs
| IC | Focus |
|----|-------|
| CATIA IC | V5/3DEXPERIENCE, surfacing, kinematics |
| NX IC | Modeling, drafting, PMI |
| Data Exchange IC | STEP, JT, 3D PDF, native translation |
| Standards IC | Company standards, templates, check tools |

#### Simulation Manager ICs
| IC | Focus |
|----|-------|
| FEA IC | Structural analysis, modal, fatigue |
| CFD IC | Thermal, aerodynamics, HVAC |
| Durability IC | Road load data, fatigue life prediction |
| NVH IC | Noise, vibration, harshness simulation |

#### BOM Manager ICs
| IC | Focus |
|----|-------|
| EBOM IC | Engineering bill of materials, structure |
| MBOM IC | Manufacturing BOM, process routing |
| Configuration IC | Variants, options, effectivity |
| Part Numbering IC | Naming conventions, classification |

#### Release Manager ICs
| IC | Focus |
|----|-------|
| ECN Processing IC | Change notices, impact analysis |
| Release Coordination IC | Milestone gates, signoffs |
| Deviation IC | Temporary changes, expiration tracking |
| Obsolescence IC | End of life, replacement planning |

#### Collaboration Manager ICs
| IC | Focus |
|----|-------|
| Supplier Exchange IC | Secure data sharing, watermarking |
| Design Review IC | Review meetings, action tracking |
| Program Support IC | Milestone reporting, status updates |
| A-Surface IC | Class A surfacing, design intent |

---

## 5. OEM R&D (`auto-oem-rd`)

**Focus**: Advanced development, prototype systems, future technologies

### Managers (6)

| Manager | Responsibility |
|---------|----------------|
| Advanced Engineering Manager | Concept development, feasibility |
| ADAS/Autonomous Manager | Sensors, perception, planning |
| Electrification Manager | EV/hybrid, battery, power electronics |
| Connected Vehicle Manager | Telematics, V2X, OTA updates |
| Prototype Manager | Build coordination, test vehicles |
| IP Manager | Patents, trade secrets, competitive analysis |

### ICs (24)

#### Advanced Engineering Manager ICs
| IC | Focus |
|----|-------|
| Concept Development IC | Ideation, feasibility studies |
| Technology Scouting IC | Emerging tech, startup partnerships |
| Benchmarking IC | Competitive teardowns, analysis |
| Innovation IC | Patent generation, invention disclosure |

#### ADAS/Autonomous Manager ICs
| IC | Focus |
|----|-------|
| Sensor Fusion IC | Camera, radar, lidar integration |
| Perception IC | Object detection, classification, tracking |
| Planning IC | Path planning, decision making |
| Simulation IC | Virtual testing, scenario generation |
| Safety IC | SOTIF, ISO 21448, edge cases |

#### Electrification Manager ICs
| IC | Focus |
|----|-------|
| Battery Systems IC | Cell chemistry, BMS, thermal management |
| Power Electronics IC | Inverters, DC-DC, chargers |
| Electric Motor IC | Motor design, control algorithms |
| Charging IC | AC/DC charging, standards, infrastructure |
| Range Optimization IC | Energy management, efficiency |

#### Connected Vehicle Manager ICs
| IC | Focus |
|----|-------|
| Telematics IC | TCU, cellular, connectivity |
| V2X IC | Vehicle-to-everything, DSRC, C-V2X |
| OTA Updates IC | Software deployment, rollback, security |
| Data Services IC | Cloud integration, analytics, monetization |

#### Prototype Manager ICs
| IC | Focus |
|----|-------|
| Build Coordination IC | Prototype schedules, parts procurement |
| Test Vehicle IC | Instrumentation, data acquisition |
| Mule Build IC | Development vehicles, integration |
| Validation IC | DVP&R execution, issue tracking |

#### IP Manager ICs
| IC | Focus |
|----|-------|
| Patent IC | Application drafting, prosecution |
| Trade Secret IC | Documentation, access control |
| Freedom to Operate IC | Clearance searches, risk assessment |
| Competitive Intelligence IC | Patent landscape, competitor monitoring |

---

## 6. Dealer Sales (`auto-dealer-sales`)

**Focus**: DMS integration, CRM, F&I, inventory management

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| DMS Integration Manager | CDK, Reynolds, Dealertrack connectivity |
| CRM Manager | Lead management, follow-up, campaigns |
| F&I Manager | Finance products, menu systems, compliance |
| Inventory Manager | Pricing, aging, turn optimization |
| Digital Retail Manager | Online sales, e-commerce, digital retailing |

### ICs (20)

#### DMS Integration Manager ICs
| IC | Focus |
|----|-------|
| CDK Integration IC | Drive API, data sync, workflows |
| Reynolds Integration IC | ERA-IGNITE, docuPAD, web services |
| Dealertrack IC | DMS, credit, registration |
| Data Migration IC | Conversion, validation, cleanup |

#### CRM Manager ICs
| IC | Focus |
|----|-------|
| Lead Management IC | Distribution, scoring, routing |
| BDC Support IC | Scripts, templates, call tracking |
| Campaign IC | Email, SMS, direct mail automation |
| Customer Journey IC | Touchpoint tracking, attribution |

#### F&I Manager ICs
| IC | Focus |
|----|-------|
| Menu Presentation IC | Product presentation, compliance |
| Rate Markup IC | Buy rate, reserve calculation |
| Product Provider IC | Warranty, GAP, maintenance integration |
| Compliance IC | TILA, Red Flags, adverse action |

#### Inventory Manager ICs
| IC | Focus |
|----|-------|
| Pricing IC | Market pricing, margin analysis |
| Aging IC | Days supply, markdown strategy |
| Acquisition IC | Trade appraisal, auction, wholesale |
| Photo/Merchandising IC | Vehicle photos, descriptions, syndication |

#### Digital Retail Manager ICs
| IC | Focus |
|----|-------|
| Online Retailing IC | Digital deal flow, credit apps |
| Trade-In IC | Online appraisal, ICO integration |
| Payment Calculator IC | Lease vs finance, incentive stacking |
| Delivery Coordination IC | Remote delivery, paperwork |

---

## 7. Dealer Service (`auto-dealer-service`)

**Focus**: Service operations, warranty, parts, customer retention

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Service Operations Manager | Scheduling, dispatch, workflow |
| Warranty Manager | Claims, policy, OEM programs |
| Parts Manager | Ordering, inventory, wholesale |
| Customer Experience Manager | Communication, satisfaction, retention |
| Technical Manager | TSBs, recalls, diagnostic support |

### ICs (20)

#### Service Operations Manager ICs
| IC | Focus |
|----|-------|
| Appointment Scheduling IC | Online booking, capacity management |
| Advisor Workflow IC | Write-up, MPI, recommendations |
| Technician Dispatch IC | Skill matching, flat rate, efficiency |
| Shop Loading IC | Bay utilization, throughput optimization |

#### Warranty Manager ICs
| IC | Focus |
|----|-------|
| Claims Processing IC | Submission, documentation, correction |
| Policy Administration IC | Goodwill, customer pay conversion |
| Audit Preparation IC | Claim backup, chargeback defense |
| Program Tracking IC | CPO, maintenance plans, extended warranty |

#### Parts Manager ICs
| IC | Focus |
|----|-------|
| OEM Ordering IC | Stock orders, VOR, emergency |
| Inventory Optimization IC | DMS analysis, obsolescence, returns |
| Wholesale IC | Body shop, fleet, independent garage |
| Core/Returns IC | Warranty cores, DPS returns |

#### Customer Experience Manager ICs
| IC | Focus |
|----|-------|
| Communication IC | Status updates, ready notifications |
| Survey/CSI IC | Follow-up, issue resolution |
| Retention IC | Declined services, conquest, loyalty |
| Loaner/Shuttle IC | Alternative transportation coordination |

#### Technical Manager ICs
| IC | Focus |
|----|-------|
| TSB Management IC | Bulletin tracking, applicability |
| Recall Coordination IC | Campaign management, parts allocation |
| Diagnostic Support IC | Hotline, remote assist, iATN |
| Training IC | Technician certification, ASE, OEM |

---

## 8. Aftermarket Reverse Engineering (`auto-aftermarket-reverse`)

**Focus**: Scan tool development, diagnostic protocols, ECU research

### Managers (4)

| Manager | Responsibility |
|---------|----------------|
| Protocol Research Manager | OBD-II, enhanced diagnostics, OEM modes |
| ECU Research Manager | Firmware, calibration, security |
| Tool Development Manager | Scan tool software, hardware interfaces |
| Database Manager | Vehicle coverage, PID definitions |

### ICs (16)

#### Protocol Research Manager ICs
| IC | Focus |
|----|-------|
| OBD-II PID IC | Mode 01-0A, enhanced PIDs, freeze frames |
| Manufacturer Protocol IC | OEM-specific diagnostics, mode 22 |
| CAN Decoding IC | Broadcast messages, proprietary data |
| Protocol Documentation IC | Service manuals, wiring diagrams |

#### ECU Research Manager ICs
| IC | Focus |
|----|-------|
| Firmware Analysis IC | Binary extraction, code analysis |
| Calibration Research IC | Tables, maps, scaling factors |
| Security Bypass IC | Seed-key, immobilizer research |
| Bootloader IC | Flash programming, recovery |

#### Tool Development Manager ICs
| IC | Focus |
|----|-------|
| Scan Tool UI IC | User interface, workflow design |
| Communication Layer IC | J2534, ELM327, proprietary VCI |
| Diagnostic Routines IC | Bi-directional controls, relearn procedures |
| Update Mechanism IC | Database updates, feature delivery |

#### Database Manager ICs
| IC | Focus |
|----|-------|
| Vehicle Coverage IC | Year/make/model, VIN decoding |
| PID Database IC | Parameter definitions, units, scaling |
| DTC Database IC | Code definitions, troubleshooting |
| Procedure Database IC | Reset procedures, adaptations |

---

## 9. 3rd Party Servicing (`auto-3rdparty-service`)

**Focus**: Independent repair, multi-make diagnostics, parts sourcing

### Managers (4)

| Manager | Responsibility |
|---------|----------------|
| Diagnostics Manager | Multi-make scan tools, troubleshooting |
| Repair Information Manager | Service data, procedures, specifications |
| Parts Manager | Sourcing, interchange, pricing |
| Shop Management Manager | POS, invoicing, workflow |

### ICs (16)

#### Diagnostics Manager ICs
| IC | Focus |
|----|-------|
| Scan Tool IC | Autel, Launch, Snap-on integration |
| Scope/Meter IC | Oscilloscope, multimeter procedures |
| Module Programming IC | J2534, SPS, aftermarket reflash |
| ADAS Calibration IC | Target setup, scan tool procedures |

#### Repair Information Manager ICs
| IC | Focus |
|----|-------|
| AllData IC | OEM procedures, diagrams, TSBs |
| Mitchell IC | ProDemand, repair times, procedures |
| MOTOR IC | Labor times, maintenance schedules |
| iATN IC | Technician network, case studies |

#### Parts Manager ICs
| IC | Focus |
|----|-------|
| Parts Lookup IC | Electronic catalogs, VIN filtering |
| Interchange IC | Cross-reference, supersession |
| Sourcing IC | Dealer, aftermarket, salvage, reman |
| Pricing IC | Matrix pricing, margin management |

#### Shop Management Manager ICs
| IC | Focus |
|----|-------|
| Estimate IC | Labor, parts, customer authorization |
| Invoice IC | Payment processing, AR management |
| Workflow IC | Job tracking, technician assignment |
| Customer Communication IC | Approvals, status, pickup |

---

## 10. Collision Body (`auto-collision-body`)

**Focus**: Estimating, DRP, structural repair, refinish

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Estimating Manager | Damage analysis, supplements, negotiations |
| DRP Manager | Insurance programs, KPIs, compliance |
| Production Manager | Workflow, scheduling, cycle time |
| Structural Manager | Frame repair, welding, calibration |
| Refinish Manager | Paint, color matching, materials |

### ICs (20)

#### Estimating Manager ICs
| IC | Focus |
|----|-------|
| CCC IC | CCC ONE, Estimating, Total Loss |
| Mitchell IC | Estimating, WorkCenter |
| Audatex IC | Estimating, Qapter |
| Photo AI IC | AI damage detection, preliminary estimates |

#### DRP Manager ICs
| IC | Focus |
|----|-------|
| Insurance Portal IC | Assignment receipt, status updates |
| KPI Tracking IC | Cycle time, CSI, severity, supplements |
| Compliance IC | DRP requirements, audits |
| Supplement IC | Hidden damage, approval workflow |

#### Production Manager ICs
| IC | Focus |
|----|-------|
| Scheduling IC | Job scheduling, load balancing |
| Parts IC | Ordering, tracking, mirror matching |
| Workflow IC | Production board, status tracking |
| Quality Control IC | Inspection checkpoints, rework |

#### Structural Manager ICs
| IC | Focus |
|----|-------|
| Frame Measurement IC | Fixture, electronic measuring |
| Welding IC | Procedures, squeeze-type resistance, MIG |
| Calibration IC | ADAS requirements, positioning |
| Sectioning IC | OEM procedures, joining methods |

#### Refinish Manager ICs
| IC | Focus |
|----|-------|
| Color Matching IC | Spectrophotometer, variant selection |
| Paint Mixing IC | Formula retrieval, tinting |
| Materials IC | Clearcoat, primer, sealer management |
| Booth Management IC | Scheduling, maintenance, compliance |

---

## 11. Collision Powertrain (`auto-collision-powertrain`)

**Focus**: Mechanical damage, drivetrain, EV safety

### Managers (4)

| Manager | Responsibility |
|---------|----------------|
| Mechanical Assessment Manager | Engine, transmission, drivetrain damage |
| Suspension/Steering Manager | Alignment, components, geometry |
| EV Safety Manager | High-voltage systems, battery damage |
| Supplemental Systems Manager | Cooling, exhaust, fuel systems |

### ICs (16)

#### Mechanical Assessment Manager ICs
| IC | Focus |
|----|-------|
| Engine Damage IC | Internal damage assessment, replacement vs repair |
| Transmission IC | Automatic, manual, CVT, DCT evaluation |
| Drivetrain IC | Axles, differentials, transfer cases |
| Vibration Analysis IC | Post-repair validation, balance |

#### Suspension/Steering Manager ICs
| IC | Focus |
|----|-------|
| Alignment IC | Specifications, adjustability, correction |
| Suspension Components IC | Control arms, struts, knuckles |
| Steering IC | Rack, column, electronic steering |
| Wheel/Tire IC | Damage assessment, TPMS relearn |

#### EV Safety Manager ICs
| IC | Focus |
|----|-------|
| High-Voltage Safety IC | Lockout/tagout, PPE, procedures |
| Battery Assessment IC | Damage evaluation, thermal events |
| HV Component IC | Inverter, motor, charging system |
| Certification IC | EV repair training, OEM requirements |

#### Supplemental Systems Manager ICs
| IC | Focus |
|----|-------|
| Cooling System IC | Radiator, condenser, lines |
| Exhaust IC | Catalytic converter, emissions compliance |
| Fuel System IC | Tank, lines, EVAP system |
| HVAC IC | Compressor, lines, refrigerant |

---

## 12. Aftermarket Tuning (`auto-aftermarket-tuning`)

**Focus**: ECU calibration, performance modification, dyno testing

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Calibration Manager | ECU tuning, map development, testing |
| Dyno Manager | Testing, data analysis, validation |
| Hardware Manager | Intake, exhaust, turbo, fuel systems |
| Emissions Manager | CARB compliance, catalyst retention |
| Data Manager | Logging, analysis, customer files |

### ICs (20)

#### Calibration Manager ICs
| IC | Focus |
|----|-------|
| ECU Flashing IC | Read/write tools, bootloaders |
| Map Development IC | Timing, fuel, boost, VVT tables |
| Base Calibration IC | Starting points, safe tunes |
| Custom Tuning IC | Customer-specific calibrations |

#### Dyno Manager ICs
| IC | Focus |
|----|-------|
| Dyno Operation IC | Pull procedures, correction factors |
| Data Analysis IC | Power curves, AFR, knock detection |
| Comparison IC | Before/after, hardware validation |
| Customer Reporting IC | Dyno sheets, certificates |

#### Hardware Manager ICs
| IC | Focus |
|----|-------|
| Intake IC | Air filters, intakes, intercoolers |
| Exhaust IC | Headers, downpipes, cat-backs |
| Forced Induction IC | Turbo upgrades, superchargers |
| Fuel System IC | Injectors, pumps, flex fuel |

#### Emissions Manager ICs
| IC | Focus |
|----|-------|
| CARB Compliance IC | Executive orders, approved parts |
| Catalyst IC | High-flow cats, emissions compliance |
| OBD Monitor IC | Readiness, emissions testing |
| Documentation IC | Compliance paperwork, labels |

#### Data Manager ICs
| IC | Focus |
|----|-------|
| Data Logging IC | WBO2, EGT, boost, knock logging |
| Analysis IC | Log review, tuning recommendations |
| File Management IC | Customer database, revision control |
| Security IC | Anti-piracy, file encryption |

---

## 13. Aftermarket Product Design (`auto-aftermarket-product`)

**Focus**: Performance parts design, manufacturing, fitment

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Design Manager | CAD, product development, engineering |
| Analysis Manager | FEA, CFD, validation |
| Prototyping Manager | Rapid prototyping, testing |
| Manufacturing Manager | Production methods, tooling, sourcing |
| Fitment Manager | Vehicle compatibility, instructions |

### ICs (20)

#### Design Manager ICs
| IC | Focus |
|----|-------|
| CAD Design IC | SolidWorks, Fusion 360, modeling |
| 3D Scanning IC | Reverse engineering, reference geometry |
| GD&T IC | Tolerancing, stack-up analysis |
| Design Review IC | Engineering review, design validation |

#### Analysis Manager ICs
| IC | Focus |
|----|-------|
| FEA IC | Structural analysis, stress, fatigue |
| CFD IC | Airflow, thermal analysis |
| Durability IC | Life prediction, testing correlation |
| Weight Optimization IC | Topology optimization, lightweighting |

#### Prototyping Manager ICs
| IC | Focus |
|----|-------|
| 3D Printing IC | SLA, SLS, metal printing |
| CNC Prototyping IC | Machined prototypes, short runs |
| Test Fitting IC | Vehicle installation, interference |
| Validation Testing IC | Performance verification |

#### Manufacturing Manager ICs
| IC | Focus |
|----|-------|
| Process Selection IC | Casting, forging, stamping, machining |
| Tooling Design IC | Molds, dies, fixtures |
| Supplier Sourcing IC | Contract manufacturing, quality |
| Cost Analysis IC | BOM costing, margin analysis |

#### Fitment Manager ICs
| IC | Focus |
|----|-------|
| Application Database IC | Year/make/model compatibility |
| Installation IC | Instructions, hardware, torque specs |
| Tech Support IC | Customer installation support |
| Revision Control IC | Part number changes, supersession |

---

## 14. CARB Compliance (`auto-carb-compliance`)

**Focus**: Emissions certification, executive orders, regulatory compliance

### Managers (5)

| Manager | Responsibility |
|---------|----------------|
| Certification Manager | EO applications, testing coordination |
| Testing Manager | Emissions testing, OBD compliance |
| Documentation Manager | Technical documentation, labeling |
| Regulatory Affairs Manager | CARB liaison, rulemaking, advocacy |
| Quality Manager | Production compliance, audits |

### ICs (20)

#### Certification Manager ICs
| IC | Focus |
|----|-------|
| EO Application IC | Executive order preparation, submission |
| Test Planning IC | Test matrix, vehicle selection |
| Part Family IC | Grouping, worst-case selection |
| Renewal IC | Periodic review, revalidation |

#### Testing Manager ICs
| IC | Focus |
|----|-------|
| Emissions Testing IC | FTP, US06, SC03, cold start |
| Durability Testing IC | AMA, bench aging, catalyst |
| OBD Testing IC | Monitor demonstration, threshold |
| Lab Coordination IC | Test lab scheduling, witnessing |

#### Documentation Manager ICs
| IC | Focus |
|----|-------|
| Technical Report IC | Certification reports, test summaries |
| Label Design IC | EO labels, installation instructions |
| Parts List IC | Certified part numbers, applicability |
| Archive IC | Record retention, audit support |

#### Regulatory Affairs Manager ICs
| IC | Focus |
|----|-------|
| CARB Liaison IC | Agency communication, meetings |
| Rulemaking IC | Proposed regulations, comments |
| SEMA SAN IC | Industry advocacy, political action |
| EPA Liaison IC | Federal certification, harmonization |

#### Quality Manager ICs
| IC | Focus |
|----|-------|
| Production Audit IC | Manufacturing conformance |
| Supplier Quality IC | Component compliance verification |
| Field Compliance IC | In-use testing, recall support |
| Corrective Action IC | Non-conformance resolution |

---

## 15. Owner Servicing (`auto-owner-service`)

**Focus**: DIY support, parts lookup, community engagement

### Managers (4)

| Manager | Responsibility |
|---------|----------------|
| Content Manager | DIY guides, videos, procedures |
| Parts Manager | Lookup, interchange, sourcing |
| Community Manager | Forums, user contributions, moderation |
| Tool Manager | Recommendations, rentals, specifications |

### ICs (16)

#### Content Manager ICs
| IC | Focus |
|----|-------|
| DIY Guide IC | Step-by-step procedures, photos |
| Video Tutorial IC | How-to videos, production |
| Specification IC | Torque specs, fluid capacities, intervals |
| Troubleshooting IC | Symptom-based diagnosis guides |

#### Parts Manager ICs
| IC | Focus |
|----|-------|
| Parts Lookup IC | VIN-based, diagram-based lookup |
| Interchange IC | Cross-reference, compatibility |
| Sourcing IC | OEM, aftermarket, salvage options |
| Price Comparison IC | Multi-vendor pricing, reviews |

#### Community Manager ICs
| IC | Focus |
|----|-------|
| Forum IC | Discussion management, search |
| User Content IC | Community submissions, verification |
| Moderation IC | Quality control, spam prevention |
| Expert Network IC | Verified mechanic contributions |

#### Tool Manager ICs
| IC | Focus |
|----|-------|
| Tool Specification IC | Required tools by procedure |
| Rental IC | Loaner tool programs, locations |
| Purchase IC | Tool recommendations, reviews |
| Specialty IC | SST requirements, alternatives |

---

## 16. EV Powertrain (`auto-ev-powertrain`)

**Focus**: Electric vehicle drivetrain systems - reverse engineering, modification, parts, emulation

### Managers (7)

| Manager | Responsibility |
|---------|----------------|
| Battery Systems Manager | HV battery RE, BMS, cell-level work |
| Motor/Inverter Manager | Traction motors, power electronics, control |
| Charging Systems Manager | AC/DC charging, CCS/CHAdeMO, onboard chargers |
| Thermal Management Manager | Battery cooling, heat pumps, HVAC integration |
| Emulation Manager | BMS spoofing, system simulation, bench testing |
| Aftermarket Mods Manager | Power upgrades, battery swaps, conversions |
| Parts/Replacement Manager | Cell replacement, module repair, component sourcing |

### ICs (35)

#### Battery Systems Manager ICs
| IC | Focus |
|----|-------|
| BMS Protocol IC | CAN messages, state estimation, balancing |
| Cell Chemistry IC | NMC, LFP, solid-state, degradation analysis |
| Pack Architecture IC | Series/parallel config, contactors, fusing |
| Safety Systems IC | Isolation monitoring, thermal runaway, venting |
| Battery RE IC | Protocol decoding, firmware extraction, SOC/SOH |

#### Motor/Inverter Manager ICs
| IC | Focus |
|----|-------|
| Motor Control IC | FOC, DTC, torque mapping, efficiency |
| Inverter RE IC | Gate driver, IGBT/SiC, DC bus, firmware |
| Resolver/Encoder IC | Position sensing, calibration, fault detection |
| Regen Braking IC | Energy recovery, blending, pedal feel |
| Power Electronics IC | DC-DC converters, PDU, junction boxes |

#### Charging Systems Manager ICs
| IC | Focus |
|----|-------|
| EVSE Protocol IC | J1772, IEC 61851, pilot signal, proximity |
| DC Fast Charge IC | CCS Combo, CHAdeMO, NACS, communication |
| Onboard Charger IC | PFC, isolation, power levels, efficiency |
| V2G/V2H IC | Bidirectional charging, grid integration |
| Charging Network IC | Backend protocols, OCPP, roaming |

#### Thermal Management Manager ICs
| IC | Focus |
|----|-------|
| Battery Cooling IC | Liquid cooling, cold plates, glycol loops |
| Heat Pump IC | Refrigerant systems, COP optimization |
| Preconditioning IC | Cabin/battery prep, scheduled charging |
| Thermal Modeling IC | Simulation, heat rejection, ambient limits |

#### Emulation Manager ICs
| IC | Focus |
|----|-------|
| BMS Emulator IC | Spoofing battery signals for bench testing |
| Motor Emulator IC | Simulated load, dyno integration |
| Vehicle Emulator IC | CAN simulation, gateway bypass |
| HIL Integration IC | Hardware-in-loop, dSPACE, NI |
| Diagnostic Bypass IC | DTC suppression, readiness emulation |

#### Aftermarket Mods Manager ICs
| IC | Focus |
|----|-------|
| Power Upgrade IC | Motor swaps, inverter tuning, unlocks |
| Battery Upgrade IC | Capacity increases, chemistry swaps |
| Conversion IC | ICE-to-EV, donor vehicle integration |
| Range Extension IC | Auxiliary batteries, trailer range extenders |
| Performance Tuning IC | Torque curves, launch control, track modes |

#### Parts/Replacement Manager ICs
| IC | Focus |
|----|-------|
| Cell Sourcing IC | OEM cells, aftermarket, salvage grading |
| Module Repair IC | Cell replacement, spot welding, BMS reset |
| Motor Rebuild IC | Bearing replacement, winding repair |
| Component Testing IC | Capacity testing, impedance, IR measurement |

---

## 17. ADAS OEM (`auto-adas-oem`)

**Focus**: Advanced driver assistance - OEM development, control systems, functional safety

### Managers (8)

| Manager | Responsibility |
|---------|----------------|
| Perception Manager | Sensors, fusion, object detection |
| Control Systems Manager | Path planning, vehicle dynamics, actuation |
| Message Systems Manager | CAN/Ethernet architecture, latency, redundancy |
| Threshold Systems Manager | Sensor calibration, detection limits, triggers |
| Safety Manager | Functional safety, SOTIF, failure modes |
| Reverse Engineering Manager | Competitor analysis, protocol decoding |
| Simulation Manager | Virtual testing, scenario generation |
| Validation Manager | Track testing, real-world validation |

### ICs (40)

#### Perception Manager ICs
| IC | Focus |
|----|-------|
| Camera Systems IC | Mono/stereo, ISP, lens calibration |
| Radar Systems IC | Short/long range, 4D imaging, interference |
| Lidar Systems IC | Solid-state, mechanical, point cloud processing |
| Ultrasonic IC | Parking sensors, close-range detection |
| Sensor Fusion IC | Multi-modal fusion, Kalman filtering, tracking |
| Object Classification IC | Neural networks, edge cases, false positives |

#### Control Systems Manager ICs
| IC | Focus |
|----|-------|
| Longitudinal Control IC | ACC, AEB, speed control, jerk limiting |
| Lateral Control IC | Lane keeping, lane centering, steering torque |
| Path Planning IC | Trajectory generation, obstacle avoidance |
| Vehicle Dynamics IC | Tire models, stability, ESC integration |
| Actuator Control IC | EPS, brake-by-wire, throttle-by-wire |
| Supervisor IC | System arbitration, handoff, degradation |

#### Message Systems Manager ICs
| IC | Focus |
|----|-------|
| CAN Architecture IC | Bus topology, gateway, message routing |
| Automotive Ethernet IC | 100BASE-T1, TSN, bandwidth allocation |
| Message Timing IC | Latency requirements, jitter, determinism |
| Redundancy IC | Dual channels, failsafe, limp modes |
| Security IC | SecOC, authentication, intrusion detection |
| Diagnostics IC | UDS for ADAS, DTCs, freeze frames |

#### Threshold Systems Manager ICs
| IC | Focus |
|----|-------|
| Detection Thresholds IC | Range limits, confidence levels, hysteresis |
| Intervention Thresholds IC | TTC, warning vs braking, driver override |
| Environmental Limits IC | Weather, lighting, road surface conditions |
| Calibration Targets IC | Target specifications, fixture design |
| Sensor Degradation IC | Blockage detection, cleaning, fault handling |

#### Safety Manager ICs
| IC | Focus |
|----|-------|
| ISO 26262 IC | ASIL decomposition, safety goals, FMEA |
| SOTIF IC | ISO 21448, triggering conditions, edge cases |
| Failure Modes IC | FMEA, fault trees, safe states |
| Redundancy Design IC | Dual processing, watchdogs, voting |
| Safety Validation IC | Fault injection, coverage, certification |
| Cybersecurity IC | ISO 21434, threat analysis, penetration |

#### Reverse Engineering Manager ICs
| IC | Focus |
|----|-------|
| Competitor Teardown IC | Sensor analysis, PCB reverse, BOM estimation |
| Protocol Decoding IC | CAN/Ethernet message reverse engineering |
| Algorithm Analysis IC | Control strategy inference, tuning extraction |
| Benchmark IC | Performance comparison, feature analysis |

#### Simulation Manager ICs
| IC | Focus |
|----|-------|
| Scenario Generation IC | OpenSCENARIO, edge cases, accident recreation |
| Sensor Simulation IC | Physics-based rendering, radar/lidar models |
| SIL Testing IC | Software-in-loop, code coverage |
| VIL Testing IC | Vehicle-in-loop, injected scenarios |

#### Validation Manager ICs
| IC | Focus |
|----|-------|
| Track Testing IC | Proving grounds, NCAP protocols, targets |
| Real-World IC | Public road testing, fleet data, ODD validation |
| Data Collection IC | Instrumentation, logging, ground truth |
| Issue Tracking IC | Problem reports, root cause, countermeasures |

---

## 18. ADAS Aftermarket (`auto-adas-aftermarket`)

**Focus**: ADAS calibration, retrofit, repair, and aftermarket integration

### Managers (6)

| Manager | Responsibility |
|---------|----------------|
| Calibration Manager | Static/dynamic calibration, target systems |
| Retrofit Manager | Adding ADAS to non-equipped vehicles |
| Repair Integration Manager | Post-collision recalibration, OEM procedures |
| Diagnostic Manager | ADAS fault diagnosis, sensor health |
| Tool Development Manager | Calibration tools, scan tool integration |
| Training Manager | Technician certification, procedures |

### ICs (30)

#### Calibration Manager ICs
| IC | Focus |
|----|-------|
| Static Calibration IC | Target setup, fixture alignment, room requirements |
| Dynamic Calibration IC | Drive procedures, road requirements, conditions |
| Camera Calibration IC | Windshield replacement, aim verification |
| Radar Calibration IC | Bumper alignment, beam angle adjustment |
| Lidar Calibration IC | Mounting, scan pattern verification |
| Multi-Sensor IC | Cross-calibration, fusion alignment |

#### Retrofit Manager ICs
| IC | Focus |
|----|-------|
| Blind Spot IC | Aftermarket BSD systems, integration |
| Backup Camera IC | Display integration, guidelines, OEM-style |
| Collision Warning IC | Forward collision, pedestrian detection |
| Parking Assist IC | Ultrasonic sensors, display systems |
| Dash Cam Integration IC | ADAS-enabled cameras, data logging |

#### Repair Integration Manager ICs
| IC | Focus |
|----|-------|
| Post-Collision IC | When to calibrate, damage assessment |
| OEM Procedures IC | Manufacturer-specific requirements |
| Parts Verification IC | Correct sensors, brackets, wiring |
| Alignment Requirements IC | Suspension, steering angle prerequisites |
| Documentation IC | Calibration records, liability, certification |

#### Diagnostic Manager ICs
| IC | Focus |
|----|-------|
| ADAS DTC IC | Fault code interpretation, sensor faults |
| Sensor Health IC | Blockage, degradation, alignment faults |
| Communication IC | CAN/network faults, gateway issues |
| Intermittent IC | Weather-related, temperature, vibration |
| Root Cause IC | Systematic diagnosis, component isolation |

#### Tool Development Manager ICs
| IC | Focus |
|----|-------|
| Target Systems IC | OEM targets, universal systems, positioning |
| Scan Tool IC | Autel ADAS, Launch, Bosch, Hunter integration |
| Alignment Integration IC | Alignment rack, camera systems, data flow |
| Cloud Services IC | VIN lookup, procedure delivery, updates |
| Mobile Calibration IC | On-site calibration, van-based systems |

#### Training Manager ICs
| IC | Focus |
|----|-------|
| Certification IC | I-CAR, OEM training, competency verification |
| Procedure Training IC | Step-by-step calibration procedures |
| Safety Training IC | High-voltage awareness, sensor handling |
| Business Training IC | Pricing, liability, shop setup |
| Updates IC | New vehicle coverage, procedure changes |

---

## Summary

| Preset | Managers | ICs | Total Agents |
|--------|----------|-----|--------------|
| OEM Supplier | 6 | 24 | 30 |
| OEM Reverse Engineering | 5 | 20 | 25 |
| OEM Manufacturer | 7 | 28 | 35 |
| OEM Engineering | 6 | 24 | 30 |
| OEM R&D | 6 | 24 | 30 |
| Dealer Sales | 5 | 20 | 25 |
| Dealer Service | 5 | 20 | 25 |
| Aftermarket Reverse Eng | 4 | 16 | 20 |
| 3rd Party Service | 4 | 16 | 20 |
| Collision Body | 5 | 20 | 25 |
| Collision Powertrain | 4 | 16 | 20 |
| Aftermarket Tuning | 5 | 20 | 25 |
| Aftermarket Product | 5 | 20 | 25 |
| CARB Compliance | 5 | 20 | 25 |
| Owner Servicing | 4 | 16 | 20 |
| **EV Powertrain** | **7** | **35** | **42** |
| **ADAS OEM** | **8** | **40** | **48** |
| **ADAS Aftermarket** | **6** | **30** | **36** |
| **TOTAL** | **97** | **409** | **506** |

## Usage

```bash
# Initialize with automotive preset
/init-autonomous
# Select: auto-oem-supplier (or any auto-* preset)

# Or configure directly
echo '{"industryPreset": "auto-aftermarket-tuning"}' > .claude/config/features.json
```

When the swarm spawns, it will use the managers and ICs defined for that automotive vertical, ensuring domain-appropriate expertise for every task.
