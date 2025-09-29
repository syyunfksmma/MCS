# Sprint 6 Chunk Upload Optimisation Plan (F1 & F2)

## 1. Streaming SHA-256 PoC (F1)
- 스크립트: `scripts/performance/chunk_hash_poc.ps1`
- 입력: 파일 경로, ChunkSize (기본 256KB)
- 기능: chunk별 SHA-256 TransformBlock을 수행하며 진행 상황 출력.
- 향후 통합: Workspace 업로더(ReadableStream)와 연동하여 클라이언트 측 incremental hash 계산.
- 검증: 샘플 파일 10MB 기준 chunk 개수, elapsedMs 기록 → meta_sla_history에 추가.

## 2. 병렬 Chunk 병합 프로토타입 (F2)
- 스크립트: `scripts/performance/chunk_merge_poc.ps1`
- 입력: chunk 폴더, 출력 파일, Hash 검증 옵션.
- 기능: 정렬된 chunk 파일을 병합하고 선택적으로 SHA-256 hash를 계산.
- 확장 계획: PowerShell 병렬 foreach 또는 Node worker_threads 로 대체 예정.

## 3. 통합 흐름
```
Uploader (ReadableStream) → chunk_hash_poc.ps1 (검증) → S3/Shared Drive 업로드 →
chunk_merge_poc.ps1 (병합) → run-meta-sla.ps1 / meta_sla_history.csv 갱신
```

## 4. 테스트 체크리스트
- [ ] 5MB 샘플 파일로 chunk_hash_poc.ps1 실행 → chunkIndex/elapsed 로그 확인
- [ ] 동일 파일을 chunk_merge_poc.ps1로 병합 → hash 일치 여부 검증
- [ ] meta_sla_history.csv에 측정값 추가
- [ ] Sprint6_Log 및 Timeline 기록 업데이트

## 5. 후속 TODO
- [ ] Node 기반 ReadableStream PoC 코드 (workspace uploader) 작성
- [ ] 병렬 머지 시 PM2 Worker 리소스 측정 계획 수립
- [ ] F1/F2 자동화 파이프라인을 run-meta-sla.ps1와 연동

*Draft by Codex — 2025-09-29 12:04 KST*
