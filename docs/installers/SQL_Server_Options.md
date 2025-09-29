# SQL Server Deployment Options — 2025-09-29

| Option | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| SQL Express with Agent | Free, easy install | Agent limited, resource caps | Use for PoC only |
| SQL Standard (Always On) | HA support | License cost | Production target |
| Azure SQL Managed Instance | Managed updates | Network latency | Consider for future | 

## Configuration Checklist
- Enable `READ_COMMITTED_SNAPSHOT`.
- Configure backups to `\\MCMS_SHARE\backups` daily 02:00 KST.
- Store service account credentials in Key Vault.

> 작성: 2025-09-29 Codex
