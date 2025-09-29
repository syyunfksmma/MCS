# Large File Transfer Policy (Phase 4)

## 1. Scope
Applies to Esprit/NC/STL packages (>100 MB) exchanged between Next.js frontend, .NET API, and shared drive.

## 2. Upload Workflow
1. Next.js requests pre-signed URL from `/api/files/upload` with metadata (itemId, routingId, checksum).
2. API issues Azure Blob SAS valid 15 minutes, limited to target folder.
3. Client uploads via `fetch` streaming; progress surfaced via ExplorerRibbon.
4. Upon completion, API stores metadata in FileMapper and enqueues hash verification.

## 3. Download Workflow
- Uses Azure Blob Read SAS (5 minutes) exposed through `download.mcms.corp` CDN.
- Legacy Explorer receives direct shared drive path for fallback.

## 4. Size & Retry Limits
| File Type | Max Size | Retries | Notes |
| --- | --- | --- | --- |
| esprit (.esp) | 500 MB | 3 | Chunked upload, 10 MB parts |
| nc | 200 MB | 3 | Inline compression optional |
| stl/gdml | 1 GB | 2 | Requires browser streaming (ReadableStream) |

## 5. Hash Validation
- Compare-FileHash.ps1 executed post-upload.
- Hash stored in `meta.json` and `docs/sprint/meta_sla_history.csv` for SLA audit.

## 6. Retention
- Azure Blob hot tier: 30 days.
- Shared drive nightly cleanup retains last 5 versions per routing (cleanup-offline-logs.ps1 handles archival).

## 7. Security
- TLS 1.2 enforced, SAS tokens bound to IP range `10.0.0.0/16`.
- Blob container `mcms-routing` uses private endpoint; Only API managed identity has write.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial large file transfer policy documented |
