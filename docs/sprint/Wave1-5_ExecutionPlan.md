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

## Wave 1~5 실행 개요
- 대상 문서: Sprint6/7/8 Routing Task List 및 Sprint20 Explorer UI Rework Task List.
- 진행 원칙: 각 불릿 항목은 완료 시 본문 끝에 `(완료 YYYY-MM-DD, 담당자)` 메모를 추가하고 Sprint 로그/Timeline에 동기화한다.
- 의존성: Sprint6 → Sprint7 → Sprint8 → Sprint20 순으로 누적 기능이 열리므로 Wave 순서를 유지한다.
- 품질 게이트: 각 Wave 종료 시 Docs 로그 업데이트, 테스트 계획 재확인, 배포 전 내역 리뷰.

## Wave 1 – Routing Workspace 초안 정렬 (D+0 ~ D+2)
- Sprint6_Routing_TaskList.md#L60: G1 Drag-and-drop 정렬 UX 및 /routing-groups/order API 연동.
- Sprint6_Routing_TaskList.md#L65: G2 Inline Edit + Soft Delete 구현 및 롤백 로직 정비.
- Sprint6_Routing_TaskList.md#L71: H1 Routing 생성 마법사(공유 드라이브 체크 포함) UI/서비스 결선.
- Sprint6_Routing_TaskList.md#L75: H2 Routing 상세 모달(Overview/File Assets/History 탭) 기본 플로우 구축.
- Sprint6_Routing_TaskList.md#L82: I1 Drag/Drop 업로더(청크 업로드, 진행률) PoC 완성 및 Telemetry 기록.

## Wave 2 – 자산 전송 및 SolidWorks 연동 (D+2 ~ D+4)
- Sprint6_Routing_TaskList.md#L85: I2 다운로드 번들·체크섬 검증 및 에러 가드레일 처리.
- Sprint6_Routing_TaskList.md#L88: I3 버전 테이블(Main 토글/Legacy 노출/감사 타임라인) 상태 관리.
- Sprint6_Routing_TaskList.md#L93: J1 SolidWorks 업로드/교체 UI와 Telemetry Stub 마감.
- Sprint6_Routing_TaskList.md#L97: J2 Explorer 프로토콜 핸들러 권한 검사 및 Deep Link 테스트.
- Sprint7_Routing_TaskList.md#L60: K1 공유 드라이브 루트/네이밍 Preset 정책 확정 및 적용 스크립트.

## Wave 3 – 운영 정책 및 플래그 거버넌스 (D+4 ~ D+6)
- Sprint7_Routing_TaskList.md#L63: K2 재시도/타임아웃 UI 구성과 백엔드 한계 값 보완.
- Sprint7_Routing_TaskList.md#L68: L1 Feature Flag 생성/비활성화 API (eature.search-routing, eature.solidworks-upload).
- Sprint7_Routing_TaskList.md#L71: L2 Flag 감사 로그·One-click Toggle UX 마감.
- Sprint7_Routing_TaskList.md#L76: M1 공유 드라이브 Callback Health 모니터링 및 경고 시나리오.
- Sprint7_Routing_TaskList.md#L79: M2 Admin Role Gate 및 인증 실패 UX 점검.
- Sprint8_Routing_TaskList.md#L60: N1 Routing/Version 캐싱 레이어 성능 리팩토링.

## Wave 4 – 성능/신뢰성 Hardening (D+6 ~ D+8)
- Sprint8_Routing_TaskList.md#L63: N2 단일 뷰 UX 개선(캐시 Warm-up, Pagination).
- Sprint8_Routing_TaskList.md#L68: O1 React Query Cache Metrics (Application Insights 커스텀 이벤트).
- Sprint8_Routing_TaskList.md#L71: O2 Alert Threshold 조정 및 자동 알람 루틴.
- Sprint8_Routing_TaskList.md#L76: P1 Routing Detail 모달 Skeleton + Lazy Loading 배치.
- Sprint8_Routing_TaskList.md#L79: P2 검색/라우팅 UX Core Web Vitals(CLS/FID) 튜닝.

## Wave 5 – 예외 대응 및 Explorer UI 확장 (D+8 ~ D+10)
- Sprint8_Routing_TaskList.md#L84: Q1 오류 코드(5xx/409) 자동 복구 및 재시도 정책.
- Sprint8_Routing_TaskList.md#L87: Q2 예외 핸들링 가이드(사용자 메시지/서버 재시도 매트릭스).
- Sprint20_Explorer_UI_Rework_TaskList.md#L65: Dashboards(계약/공정/모듈 KPI) 위젯 설계 및 데이터 매핑.
- Sprint20_Explorer_UI_Rework_TaskList.md#L66: MCS 섹션 – ESPRIT EDGE API Key/3D CAD 연동 정비.
- Sprint20_Explorer_UI_Rework_TaskList.md#L67: Server 섹션 – 로그, 리비전, STL/SOLIDWORKS 뷰어 실행 정책.
- Sprint20_Explorer_UI_Rework_TaskList.md#L68: Option 섹션 – Access 권한, 보고서 노출, ESPRIT EDGE 설정 대시보드화.

## Wave 종료 체크리스트
- 각 Wave 완료 즉시 관련 문서 불릿 끝에 완료 메모 추가, docs/sprint/Sprint*_Log.md와 Timeline 갱신.
- QA: 기능별 테스트 문서(Sprint6_FlowG_H_Regressions.md 등)에서 성공/실패 로그 업데이트.
- 배포 준비: Wave 5 종료 후 통합 리그레션 및 Explorer UI 데모 녹화.
