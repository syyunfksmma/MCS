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
# Phase6 Workspace Advanced Flows (2025-09-29)

## 1. Download Bundle & Per-File Links
- API: `POST /api/routings/{id}/bundle` → zip 생성, 응답으로 signed URL 반환.
- 개별 파일: `GET /api/routings/{id}/files/{fileId}` signed URL + checksum 헤더.
- FE: `DownloadMenu.tsx`에서 bundle/단일 선택, 완료 후 토스트 출력.
- 검증: (2025-09-30 18:45, Codex) – openapi_mcs.yaml에 `/bundle` 엔드포인트 부재 확인. 백엔드 계약 확정 필요; FE는 checksum 미포함 응답 시 경고 토스트 처리 예정.
- 무결성: 다운로드 후 `sha256` 비교, 실패 시 재시도 버튼.

## 2. Version Table (Main Toggle & Audit)
- 테이블 컴포넌트 `components/workspace/RoutingVersionTable.tsx` 신설.
- Main toggle → `PATCH /api/routings/{id}/versions/{versionId}` with `isMain`.
- Legacy visibility 체크박스: soft-hide flag 저장.
- Audit timeline: `HistoryTab`와 동일한 `AuditEntry` 모델 재활용.
- 검증: (2025-09-30 18:47, Codex) – Version table UI 미구현, `/versions` 패치 계약 필요. Telemetry 필드(MarkMain) 문서화 완료.

## 3. Three-Pane Workspace Layout
- 레이아웃: 좌측 트리(20%), 중앙 상세(55%), 우측 프리뷰(25%).
- Teamcenter Ribbon: `RibbonHeader` 컴포넌트 상단 고정, FAB는 우측 하단.
- 반응형: 1280px 이하에서 프리뷰 탭으로 전환.

## 4. SolidWorks Upload/Replace UI
- 구성: 기존 업로드 영역 재사용, replace 버튼에 confirm 모달.
- 텔레메트리: `solidworks_replace_attempt/success/failure` 이벤트.
- Sync to PLM 버튼은 disabled + tooltip("PoC scope 제외").

- 검증: (2025-09-30 18:55, Codex) – SolidWorks UI 요구사항 재확인, replace confirm/telemetry 이벤트 목록 문서화. FE 구현 미착수.
## 5. Open-in-Explorer Protocol Handler
- Windows protocol `mcms-explorer://` 등록 가이드 문서화.
- FE: 버튼 클릭 시 `window.location.href = 'mcms-explorer://?path=...'`.
- 권한 체크: API `GET /api/users/me/permissions`에서 `canOpenExplorer` 확인.
- 실패 시 fallback으로 UNC 경로 복사 알림.

- 검증: (2025-09-30 18:57, Codex) – 프로토콜 핸들러 요구사항 확인(`mcms-explorer://`), 권한 체크 및 fallback 정책 유지. QA 가이드에 추가 예정.
## 테스트 & 후속
- Playwright: `routing-download.spec.ts`, `routing-protocol.spec.ts` 작성.
- Ops 문서: `docs/ops/OpenInExplorer_Setup.md` 초안 예정.
- 타임라인: Wave16 S26~S30 기록.

