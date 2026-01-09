# Parallel Claude Working Models

Alternative architectures beyond Director/Manager/IC swarm.

## Model 1: Peer Review Pipeline
```
Author → Reviewer → Approver → Merge
   ↑________↓
     Revise
```
**Use for**: High-quality code with multiple review perspectives

## Model 2: Adversarial Testing
```
Builder ←→ Breaker → Hardened Code
   ↓          ↓
 Build      Break
   ↓          ↓
  Fix  ←── Report
```
**Use for**: Security-critical code, edge case handling

## Model 3: Parallel Specialists
```
┌──────────┬──────────┬──────────┬──────────┐
│ Frontend │ Backend  │ Database │   Docs   │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┘
     └──────────┴──────────┴──────────┘
                    ↓
            Integration Claude
```
**Use for**: Full-stack features requiring multiple domains

## Model 4: Evolution/Iteration
```
v1.0 → v2.0 → v3.0
  ↓      ↓      ↓
Basic  Optimized  Hardened
```
**Use for**: Complex algorithms, optimization problems

## Model 5: Debate/Consensus
```
Claude A  Claude B  Claude C
    ↘        ↓        ↙
      Moderator Claude
            ↓
       Synthesis
```
**Use for**: Architecture decisions, design choices

## Model 6: Red Team/Blue Team
```
Blue Team ←→ Red Team
(Defenders)   (Attackers)
     ↓            ↓
 Hardened   Vulnerability
  System       Report
```
**Use for**: Security audits, pen testing prep

## Model 7: Assembly Line
```
Parse → Transform → Validate → Test → Doc
```
**Use for**: Batch processing, migrations, bulk operations

## Selection Guide

| Use Case | Model |
|----------|-------|
| New feature | Enterprise Swarm |
| Code quality | Peer Review |
| Security-critical | Adversarial/Red-Blue |
| Full-stack | Parallel Specialists |
| Algorithm optimization | Evolution |
| Architecture decisions | Debate/Consensus |
| Bulk migrations | Assembly Line |
