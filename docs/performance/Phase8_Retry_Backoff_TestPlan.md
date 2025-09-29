# Phase8 Retry/Backoff Validation Plan (2025-09-29)

## 대상
- Shared-drive 파일 업로드/다운로드 API (`/api/routings/{id}/files/*`).
- Worker 큐 재시도 로직.

## 시나리오
1. 인위적 5xx 주입 (502, 503) → 백오프(1s, 2s, 4s) 확인.
2. 409 충돌 (파일 잠금) → 사용자 안내 + 재시도 2회 후 실패 경고.
3. 네트워크 단절 30초 → 큐 재연결 및 경고 알림.

## 도구
- Chaos script: `scripts/performance/simulate-shared-drive-errors.ps1`.
- Monitoring: Application Insights dependency telemetry, `logs/tests/retry_backoff_20250929.log`.

## 수용 기준
- 최대 재시도 3회, 60초 내 회복.
- 최종 실패 시 사용자 토스트 + 감사 로그 기록.

## 후속
- Wave17에서 테스트 실행 후 결과를 `reports/wave17/retry_backoff_results.md`에 기록 예정.
