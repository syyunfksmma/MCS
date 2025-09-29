# Database Bootstrap Plan — 2025-09-29

## Objectives
- Provide repeatable script to initialize MCMS schema in SQL Server Express / LocalDB.
- Ensure `rowversion` columns exist for optimistic concurrency.

## Steps
1. Execute `dotnet ef database update --project src/MCMS.Api/MCMS.Api.csproj`.
2. Run seed script `scripts/db/Seed-PoC.ps1` which inserts sample Items/Revisions/Routings.
3. Verify `rowversion` column on tables `Items`, `Revisions`, `Routings` via `sp_help`. Sample query:
   ```sql
   SELECT name, system_type_name FROM sys.dm_exec_describe_first_result_set(N'SELECT * FROM dbo.Items', NULL, 0);
   ```
4. Create SQL login `mcms_app` (if using SQL Server Express) and grant `db_datareader/db_datawriter` roles.

## Outputs
- Database snapshot stored at `artifacts/db/mcms_poc.bak` (generated 2025-09-29 15:20 KST).
- Migration logs in `artifacts/db/mcms_migration_20250929.log`.

## Checklist
- [x] Migration applied without errors.
- [x] Seed data verified (minimum 3 items, 6 routings).
- [x] Backup exported for PoC testers.

> 작성: 2025-09-29 Codex
