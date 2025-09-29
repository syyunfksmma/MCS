# SQL Server Developer Load Harness Setup — 2025-09-29

## Purpose
Enable local k6 scenarios (`tests/k6/chunk_upload.js`) to exercise SQL Server procedures against Developer edition instance.

## Steps
1. Install SQL Server 2022 Developer + SQLCMD tools.
2. Restore `artifacts/db/mcms_poc.bak` to instance `localhost\MCMSDEV`.
3. Execute `scripts/db/seed-k6.sql` to populate routing sample data (50 records).
4. Update `.env.k6` with connection string `Server=localhost\MCMSDEV;Database=MCMS;Trusted_Connection=True;`.
5. Run `pnpm exec k6 run tests/k6/chunk_upload.js --env FILE_PATH=artifacts/sample/5mb.bin`.

## Verification
- k6 summary exports to `artifacts/perf/k6_sqlserver_20250929.json`.
- Prometheus metrics `chunk_upload_complete_ms` reflect new run.

> 작성: 2025-09-29 Codex
