# MCMS Web Portal User & Operations Manual

## 1. Portal Overview
- Landing dashboard with SLA cards and smoke status.
- Explorer navigation (Item → Revision → Routing) explained with screenshots.

## 2. Daily Operations
- Smoke CI 확인: `docs/automation/run-smoke-ci.ps1` 스케줄 이벤트.
- Offline 패키지 검증: `Compare-FileHash.ps1` 단계별 안내.

## 3. Legacy Explorer 안내
- IE/Legacy는 미지원, Edge Chromium 사용 권장.
- Legacy 접근 시 배너 메시지 예시 포함.

## 4. Troubleshooting
- 네트워크 오류 → Offline 배너 확인 후 다시 시도.
- Add-in 실패 → Admin Control Panel에서 재시도.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial web/ops manual 업데이트 |
