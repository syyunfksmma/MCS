# Phase 6 산출물 - Routing Workspace 계획

## 1. UI 구조
- 좌측: 단계 리스트(DnD), 단계 추가/삭제 버튼
- 우측 탭: 단계 상세, 공정 정보, 공구/설비
- 상단 액션: 저장, 승인 요청, Add-in 파라미터 버튼
- 하단: 파일 업로드/Drag & Drop 박스

## 2. Drag & Drop 기능
- 라이브러리: `@dnd-kit/core`
- 기능: 순서 변경, 단계 복사, 그룹(하위 단계) 지원 TBD
- 키보드 지원: `Space`로 선택, 화살표로 이동, `Enter`로 확정
- 상태 저장: Optimistic 업데이트 → 실패 시 기존 순서 롤백

## 3. 단계 편집
- 필드: Sequence(자동), Machine, Process, Tool, Notes
- Validation: 필수 필드 체크, 중복 Sequence 방지
- Undo/Redo: max 10 step, local state로 관리

## 4. 파일 관리
- 드롭영역: 단계별 파일 업로드(Drag to Stage), meta.json 자동 갱신
- 업로드 Progress → 완료 시 Files tab 리프레시
- 파일 재오더/삭제 UI 제공

## 5. 성능/UX 고려
- 대용량 라우팅(100+ 단계) `virtualized list`
- Auto-save 옵션(탐색 시 경고), 변경 사항 있으면 Unsaved Banner
- 에러 처리: 단계별 오류 표시 + 글로벌 알림

## 6. TODO
- 그룹 단계 지원 여부(PO와 협의)
- Insert 지점 Preview 디자인확정
- 히스토리 기록 포맷 (단계 변경 diff)
## 7. Chunk Upload 성능 검증 (k6)
- 실행일시: 2025-09-25 (로컬 MCMS.Api, HTTPS 7443, FileStorage=.storage)
- 시나리오: ramping-vus 0→10→0 (40초), 파일 256KiB × 4청크, 총 112회 업로드 완료
- 관측치: 평균 반복 2.01초 / p95 2.65초, 서버 보고 slaMs 평균 1.99초 / p95 2.62초, 오류 0건
- 한계점: http_req_duration p95 2.29초로 목표(3.5초) 초과 → 병렬 병합·해시 최적화 전까지 SLA 경계 유지 필요
- 후속 조치: ① 병렬 청크 쓰기 + 스트리밍 SHA-256 검토 ② 청크 512KiB 재평가 ③ 파일 스토리지 SSD 경로 구성 및 캐시 warm-up 스크립트 작성
## 8. 초대형 파일 최적화 계획
- 목표 SLA 상향: Chunk 완료 SLA 3.5초, 대용량(>1GB) 업로드 p95 5초 이내를 2025-10 Sprint7 말까지 달성
- 단계별 Task
  1. Streaming SHA-256: Web Crypto incremental + 서버 파이프라인 적용 (Sprint6_E3)
  2. 병렬 병합 프로토타입: Chunk 파일 4개 단위 병렬 write 후 순차 flush (Sprint6_E4 신규)
  3. 청크 크기 비교 A/B: 256KiB vs 512KiB vs 1MiB → k6 부하 재측정 및 SLA 갱신 (Sprint7_E2)
  4. Storage Warm-up: SSD 전용 temp 영역 구성 및 파일 핀닝 스크립트 작성 (Sprint7_E3)
- 로그/지표: k6 결과는 Sprint5.1 Routing Log에 누적, 비교표는 docs/prd/Phase6_WorkspacePlan.md에 업데이트
