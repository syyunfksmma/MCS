# Pipeline Health Check Script — 2025-09-29

## 위치
- `scripts/ci/Invoke-PipelineHealthCheck.ps1`

## 기능
- 최근 10개 파이프라인 실행 상태 조회 (GitHub API)
- 실패시 Slack/Ops 채널 알림 준비

## 사용법
```powershell
./scripts/ci/Invoke-PipelineHealthCheck.ps1 -Branch develop -Limit 10
```

## 출력
- `artifacts/ci/health/healthcheck_<timestamp>.json`
- 콘솔 요약: 성공/실패, 평균 실행 시간

> 작성: 2025-09-29 Codex
