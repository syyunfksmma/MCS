# Sprint7 Notification & Performance Wireframe

## 참고 자료
- To Infinity and Beyond.pdf / To Infinity and Beyond.txt (지식 탐색 워크플로 참고)
- Siemens-SW-Active-Workspace-FS-26883-C10_SARATECH.pdf / 동일 txt (Active Workspace 상태 피드 참조)
- PROLIM_TC13x_Presentation_v02.pdf / txt (Performance Insights KPI 구성 사례)

## Notification Center 개요
- SLA 초과, 경고, 정보 메시지를 ExplorerShell 우측 패널에 단계별로 노출.
- 메타 생성 SLA 목표(≤ 1 초)와 meta_generation_wait_ms 트렌드를 한 화면에서 재확인할 수 있도록 상단 경고 카드 + 하단 상세 리스트 구조 채택.
- k6 재측정 결과가 들어오기 전까지는 "측정 대기" 상태 뱃지를 기본값으로 노출.

### 레이아웃 요약
| 영역 | 콘텐츠 | 데이터 소스 | 비고 |
|------|--------|-------------|------|
| 헤더 | Meta SLA Monitor 제목 + SLA 목표 배지 | 고정 (≤ 1s) | 목표치 변경 시 Badge 텍스트 업데이트 |
| 상태 카드 | 정상 / 주의 / 경고 3단계 색상 (녹/황/적) | meta_generation_wait_ms p95, p99 | SLA 초과 조건: p95 > 1000ms |
| 이벤트 리스트 | 최근 10건 SLA 이벤트 (Meta JSON write ..., Routing meta generation ...) | API: /api/audit/meta-events (신규) | 기존 로그 메시지 그대로 노출, 상세 클릭 시 HistoryTimeline로 이동 |
| 액션 영역 | 자세히 보기, k6 다시 측정 버튼 | tests/k6/chunk_upload.js 스크립트 실행 트리거 | 재측정 버튼은 API 호출 실패 시 경고 Toast |

### 이미지 참고
- ![Notification Center reference](../../extracted_images/To%20Infinity%20and%20Beyond/To%20Infinity%20and%20Beyond_p009_01.png)
- ![Alert badge reference](../../extracted_images/Siemens-SW-Active-Workspace-FS-26883-C10_SARATECH/Siemens-SW-Active-Workspace-FS-26883-C10_SARATECH_p005_01.jpeg)

## Performance Insights 패널
- Notification Center 하단 탭에서 Performance Insights로 전환.
- 핵심 KPI: meta_generation_wait_ms p50/p95/p99, chunk_upload_complete_ms p95, 최근 24시간 경향.
- PROLIM_TC13x_Presentation_v02 사례처럼 카드+라인 차트 혼합 구성.

### 데이터 위젯 구성
| 위젯 | 시각 요소 | 주입 데이터 | 메모 |
|------|-----------|-------------|------|
| Meta SLA Trend | Sparkline + 범례 | meta_generation_wait_ms (p50/p95/p99) | SLA 초과 시 라인 강조 (적색) |
| Chunk Upload Trend | kolmogorov chart (bar) | chunk_upload_complete_ms p95 | 10초 이하 목표 |
| 최근 측정 로그 | 표 형태 | tests/k6/chunk_upload.js 실행 요약 | "측정 대기" 시 회색 Placeholder |

### 이미지 참고
- ![Performance card reference](../../extracted_images/PROLIM_TC13x_Presentation_v02/PROLIM_TC13x_Presentation_v02_p006_01.png)
- ![Trend layout reference](../../extracted_images/PROLIM_TC13x_Presentation_v02/PROLIM_TC13x_Presentation_v02_p012_01.png)

## 상호작용 흐름
1. Notification Center에서 SLA 카드 클릭 → 해당 라우팅 ID의 HistoryTimeline으로 이동.
2. Performance Insights에서 k6 다시 측정 실행 → 백엔드 워크플로 (로컬 SQL Server 연결) 상태 확인 후 결과 로그를 Sprint6_Routing_Log.md에 append.
3. 재측정 완료 시 Notification Center 리스트 맨 위에 최신 SLA 이벤트 push.

## 데이터 매핑 초안
| UI 필드 | 로그/지표 | 노트 |
|---------|-----------|------|
| Status 카드 | meta_generation_wait_ms p95 | SLA 초과 여부 판단 |
| 이벤트 항목 | AuditLogService -> Meta JSON write ... | 새로운 메타 큐 작업 완료 시 기록 |
| 재측정 배지 | k6 실행 결과 (	ests/k6/chunk_upload.js) | 상태: 측정 대기/진행 중/완료 |

## TODO
- [ ] 로컬 SQL Server Developer 환경 셋업 후 k6 재측정 (meta_generation_wait_ms 최신 데이터 확보).
- [ ] /api/audit/meta-events 엔드포인트 정의 및 테스트 데이터 작성.
- [ ] Notification Center -> HistoryTimeline 링크 라우팅 정의.

## 업데이트 기록
- 2025-09-25 Codex: Notification/Performance wireframe 초안 작성, 참고 이미지 매핑 완료.
