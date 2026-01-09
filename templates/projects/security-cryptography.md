---
category: security_cryptography
load_when: start_project
requires_authorization: true
---

# Security & Cryptography Project Templates

**AUTHORIZATION REQUIRED**: These templates require explicit authorization context (pentest engagement, CTF, security research, defensive use).

---

## penetration_test

### New Project
```yaml
type: penetration_test
variant: new
complexity: enterprise
swarm_preset: enterprise
managers: [Discovery, Security, Infrastructure, Documentation]
authorization_required: true
scope: [network, web_app, api, mobile, social_engineering]
```

**Phase 1: Reconnaissance**
- Scope definition and rules of engagement
- OSINT gathering
- Network mapping
- Technology fingerprinting

**Phase 2: Vulnerability Assessment**
- Automated scanning (Nessus, Burp, Nuclei)
- Manual testing
- Configuration review
- Credential analysis

**Phase 3: Exploitation**
- Proof of concept development
- Privilege escalation
- Lateral movement (if in scope)
- Data exfiltration simulation

**Phase 4: Reporting**
- Executive summary
- Technical findings (CVSS scored)
- Remediation recommendations
- Retest validation

**Deliverables:**
- `recon/` - Reconnaissance data
- `scans/` - Scan results
- `exploits/` - PoC code
- `report/` - Full pentest report
- `remediation/` - Fix guidance

### Change Request (Retest)
```yaml
type: penetration_test
variant: change_request
complexity: standard
scope: [previously_identified_vulns]
```

---

## back_door_injection

### New Project (DEFENSIVE/AUTHORIZED ONLY)
```yaml
type: back_door_injection
variant: new
complexity: enterprise
authorization_required: EXPLICIT
use_case: [red_team, security_research, CTF]
managers: [Security, Backend, QA]
```

**AUTHORIZATION CHECK**: This template is for authorized red team exercises, security research, or CTF challenges ONLY.

**Phase 1: Target Analysis**
- Codebase review
- Injection point identification
- Detection evasion requirements
- Persistence mechanisms

**Phase 2: Development**
- Payload development
- Obfuscation techniques
- Trigger mechanisms
- C2 communication design

**Phase 3: Testing**
- Detection testing (EDR, AV)
- Persistence validation
- Cleanup procedures
- Forensic artifacts

**Phase 4: Documentation**
- Injection methodology
- Detection signatures
- Removal procedures
- Blue team guidance

**Deliverables:**
- `payload/` - Backdoor code
- `detection/` - Detection rules (YARA, Sigma)
- `cleanup/` - Removal scripts
- `report/` - Full documentation

### Change Request
```yaml
type: back_door_injection
variant: change_request
complexity: standard
scope: [payload_update, evasion_improvement]
```

---

## back_door_finder

### New Project
```yaml
type: back_door_finder
variant: new
complexity: enterprise
swarm_preset: standard
managers: [Discovery, Security, Backend, QA]
use_case: [defensive, audit, forensics]
```

**Phase 1: Analysis Planning**
- Define search scope
- Establish baseline behavior
- Identify detection vectors
- Select analysis tools

**Phase 2: Static Analysis**
- Code pattern matching
- Suspicious function calls
- Hidden functionality detection
- Obfuscation detection

**Phase 3: Dynamic Analysis**
- Runtime behavior monitoring
- Network traffic analysis
- File system changes
- Memory analysis

**Phase 4: Reporting**
- Findings with evidence
- False positive analysis
- Remediation steps
- Prevention recommendations

**Deliverables:**
- `rules/` - Detection rules (YARA, Sigma)
- `tools/` - Analysis scripts
- `report/` - Findings report
- `playbook/` - Response procedures

---

## obfuscation_tool

### New Project
```yaml
type: obfuscation_tool
variant: new
complexity: standard
managers: [Architecture, Backend, QA]
use_case: [ip_protection, anti_tampering, research]
```

**Phase 1: Requirements**
- Target languages/platforms
- Obfuscation strength requirements
- Performance constraints
- Reversibility needs

**Phase 2: Design**
- Obfuscation techniques selection
- Transformation pipeline
- Key management (if applicable)
- Deobfuscation API

**Phase 3: Development**
- Code transformers
- Control flow obfuscation
- String encryption
- Anti-debugging measures

**Phase 4: Validation**
- Functional equivalence testing
- Performance benchmarks
- Decompiler resistance testing
- Documentation

**Deliverables:**
- `src/` - Obfuscation tool
- `tests/` - Validation suite
- `benchmarks/` - Performance data
- `docs/` - Usage guide

---

## secure_encrypt / secure_decrypt / secure_transport

### New Project
```yaml
type: secure_crypto
variant: new
complexity: enterprise
swarm_preset: standard
managers: [Discovery, Architecture, Security, Backend, QA, Documentation]
compliance: [FIPS_140_2, Common_Criteria]
```

**Phase 1: Cryptographic Requirements**
- Algorithm selection (AES-256-GCM, ChaCha20-Poly1305)
- Key management requirements
- Compliance requirements
- Performance targets

**Phase 2: Design**
- Key derivation strategy
- IV/nonce management
- Authentication approach
- Key rotation design

**Phase 3: Implementation**
- Cryptographic primitives
- Key management system
- Secure memory handling
- Side-channel mitigations

**Phase 4: Validation**
- Known-answer tests (KAT)
- Cryptographic audit
- Performance benchmarks
- Security review

**Deliverables:**
- `src/crypto/` - Crypto implementation
- `src/kms/` - Key management
- `tests/kat/` - Known-answer tests
- `audit/` - Security audit report
- `docs/` - Integration guide

---

## post_quantum_*

### New Project (All PQ Variants)
```yaml
type: post_quantum_crypto
variant: new
complexity: full
swarm_preset: enterprise
managers: [Discovery, Architecture, Security, Backend, Research, QA, Documentation]
algorithms: [ML-KEM, ML-DSA, SLH-DSA, BIKE, HQC]
```

**Phase 1: Algorithm Selection**
- NIST PQC finalist evaluation
- Hybrid approach design (classical + PQ)
- Performance benchmarking
- Key size analysis

**Phase 2: Architecture**
- Crypto agility design
- Hybrid key exchange
- Signature scheme integration
- Migration strategy

**Phase 3: Implementation**
- PQ algorithm integration (liboqs, pqcrypto)
- Hybrid TLS implementation
- Key encapsulation mechanisms
- Digital signature schemes

**Phase 4: Validation**
- NIST test vectors
- Interoperability testing
- Performance under load
- Side-channel analysis

**Deliverables:**
- `src/pq/` - Post-quantum implementations
- `src/hybrid/` - Hybrid protocols
- `tests/vectors/` - NIST test vectors
- `benchmarks/` - Performance data
- `migration/` - Migration guide

### Variants

**post_quantum_encrypt**: Focus on ML-KEM for key encapsulation
**post_quantum_decrypt**: Decryption and key recovery
**post_quantum_transport**: TLS 1.3 with PQ key exchange
**post_quantum_local_device**: HSM/TPM integration for PQ
**post_quantum_remote_device**: Remote attestation with PQ signatures
