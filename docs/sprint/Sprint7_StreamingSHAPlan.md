# Streaming SHA-256 Server Adoption Plan — Sprint7 (F3)

## 1. 목표
- 서버 측 Chunk Upload 파이프라인에 Streaming SHA-256을 도입하여 클라이언트/서버 해시 일관성을 확보한다.

## 2. 구현 단계
1. API 엔드포인트 `/api/chunk-upload/complete` 에 Incremental Hash 파이프라인 추가
2. 기존 파일 병합 로직을 서버 스트리밍으로 교체
3. Node/PowerShell PoC 로그를 meta_sla_history.csv 와 연동

## 3. 테스트 전략
- k6 A/B 테스트(chunks: 256/512/1024KiB)
- Integration 테스트: chunk_merge_poc.ps1 → API 응답 비교
- Regression: `npm run test:regression` + 신규 Playwright 시나리오

## 4. 로그 & 모니터링
- Prometheus: `mcs_streaming_hash_duration_ms`
- Loki: `logs/app/streaming-hash*.log`
- Alert Rule: Hash 실패 감지 시 critical

## 5. 후속 작업
- Sprint8: 서버 구현 & 배포 스크립트 적용
- Sprint9: CI 파이프라인에 Streaming Hash 회귀 테스트 추가

*Codex — 2025-09-29 12:09 KST*
