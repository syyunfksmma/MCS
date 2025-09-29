# Loki Retention Policy — 2025-09-29

## Configuration Overview
- Loki 2.9 deployed on Windows Server 2022 VM `MCMS-LOG01`.
- Retention configured via `table_manager.retention_period = 336h` (14 days).
- Compactor runs hourly to prune expired chunks.

## Verification Steps
1. Execute `loki-canary retention` script to confirm `chunk_table = mcms_logs_20250915` dropped after TTL.
2. Inspect `boltdb-shipper-active` directory; verify only 14 daily folders present.
3. `logcli labels env --since=336h` returns empty set, confirming retention window applied.

## Artifact
- Config stored at `monitoring/loki/config-mcms-retention.yaml` (see repository).
- Validation log appended to `artifacts/logs/retention/retention_check_20250929.txt`.

> 작성: 2025-09-29 Codex
