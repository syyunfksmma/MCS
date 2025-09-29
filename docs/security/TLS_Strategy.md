# Internal CA TLS Strategy — 2025-09-29

## Goals
- Issue certificates for IIS (`mcms.corp`) and API (`mcms-api.corp`).
- Maintain renewal schedule and automation.

## Certificate Workflow
1. Request CSR via `New-SelfSignedCertificate -CertStoreLocation Cert:\LocalMachine\My -DnsName mcms.corp -KeyExportPolicy Exportable`.
2. Submit CSR to Corporate CA (`corp-issuing-01`) using `certreq`.
3. Import issued cert to IIS and bind to site `MCMS-Portal`.
4. Export `.pfx` for Kestrel service with password stored in Azure Key Vault.

## Renewal
- Certificates valid 12 months; schedule renewal automation job 30 days prior via `certreq -renew`.
- Track expiration in `docs/security/Certificate_Inventory.xlsx`.

## Checklist
- [x] CSR template documented.
- [x] Renewal reminder added to Ops calendar (2026-09-01).
- [x] Key storage policy defined (Key Vault + DPAPI fallback).

> 작성: 2025-09-29 Codex
