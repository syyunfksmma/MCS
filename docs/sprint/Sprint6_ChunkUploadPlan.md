# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
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
- 5MB 샘플 파일로 chunk_hash_poc.ps1 실행 → chunkIndex/elapsed 로그 확인 (2025-09-29 Codex, sample_5mb.bin 결과 기록)
- 동일 파일을 chunk_merge_poc.ps1로 병합 → hash 일치 여부 검증 (hash A17F8FBE...)
- meta_sla_history.csv에 측정값 추가 (2025-09-29 업데이트)
- Sprint6_Log 및 Timeline 기록 업데이트 (12:12:40 항목)

## 5. 후속 TODO
- Node 기반 ReadableStream PoC 코드 (workspace uploader) 작성 (scripts/performance/node/chunk_stream_poc.js)
- 병렬 머지 시 PM2 Worker 리소스 측정 계획 수립 (문서 섹션 6 갱신)
- F1/F2 자동화 파이프라인을 run-meta-sla.ps1와 연동 (자동화 플로우 정의)

*Draft by Codex — 2025-09-29 12:04 KST*

## 6. 결과 요약
- chunk_hash_poc.ps1 (5MB): 총 20 chunks, hash A17F8FBE..., elapsed 25.64ms.
- chunk_merge_poc.ps1: merged 20 chunks, hash 일치 확인, elapsed 40.79ms.
- meta_sla_history.csv 행 추가 (2025-09-29T12:12:55+09:00).
- run-meta-sla 파이프라인 연동: run-smoke-monitor → run-meta-sla.ps1 순차 실행 예정.

## 7. Node ReadableStream PoC
- `scripts/performance/node/chunk_stream_poc.js` 에 ReadableStream 기반 incremental hash 데모 추가.
- PM2 Worker 측정: `pm2 monit` + Windows Performance Counter 수집 계획 문서화.
- run-meta-sla 연동: `scripts/automation/run-smoke-ci.ps1` 완료 후 `run-meta-sla.ps1` 호출하도록 Task Scheduler 확장 예정.

