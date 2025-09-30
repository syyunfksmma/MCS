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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Absolute Directives:
>
> - 각 단계는 승인 후에만 진행한다.
> - 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
> - 오류 발견 시 수정 전에 승인 재요청한다.
> - 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
> - 모든 단계 작업은 백그라운드 방식으로 수행한다.
> - 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
> - 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
> - 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
> - 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
> - 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
> - 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
> - local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
> - 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
> - 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
> - 모든 산출물 소스 코드는 향후 유지 보수, 기능 추가가 용이하도록 주석과 파일 구조를 가질 것.
>   Remaining Tasks: 0

# Sprint20 Explorer UI Rework Task List

## Sprint 목표

- Teamcenter X 스타일의 Explorer UI를 Wave20 S91~S95 단계로 완성한다.
- 상단 메뉴바(DASHBOARD/MCS/SERVER/OPTION) 요구사항을 정의하고 UI 반영 경로를 마련한다.
- Access 기반 데이터 전환과 ESPRIT EDGE 연계 기능을 위한 UI/문서 연계를 준비한다.

## 단계별 Task

- S90: Access DB 스키마 검증 및 `docs/ops/Access_TableMapping_Plan.md` 정리
- S91: `ExplorerShell` 코드 정리 및 `useExplorerLayout` 훅 도입
- S92: `ExplorerLayout` + Teamcenter Ribbon 적용, 토큰 정비
- S93: TreePanel 상태 DOT/ARIA, Sticky Filter Rail, Drag Handle 상호작용 개선
  - TreePanel 상태 표시/접기 로직 보강 및 아이콘 가이드 작성
  - Sticky Filter Rail + Feature Flag 동기화, Legacy fallback 분기 검증
  - Storybook Explorer 시나리오 업데이트 (키보드/스크린리더 경로 포함)
- S94: 검색/프리뷰 패널 Teamcenter 스타일링 및 KPI 카드 설계
  - SLA 요약 카드 + Hover/Focus 트랜지션 반영
  - Upload/Add-in 카드 Teamcenter 패턴 적용 및 요약 KPI 배치
  - 상단 메뉴바 디자인 초안에 DASHBOARD/MCS/SERVER/OPTION 요구 반영 (docs/design/Explorer_MenuBar_Requirements.md)
- S95: 테스트/문서화
  - `pnpm lint`, `pnpm test:unit -- --run`, 필요 시 `pnpm test:e2e` (스크립트 부재 → 실행 불가, 보고 완료)
  - `docs/testing/Explorer_UI_Rework.md` 및 Storybook/QA 보고 갱신

## 메뉴바 세부 요구 체크리스트

- DASHBOARD: 금일 미할당/할당/완료 현황, 인원·설비 작업현황 그래프, 주간/월간/연간 프로그램 KPI 및 불량률 수집
- MCS: ESPRIT EDGE API 키 생성·전달, 3D 모델/CAM 파일 관리, ESPRIT EDGE 기동 플로우 정의
- SERVER: 폴더 구조 트리/검색, 로그·REV·이력 관리, STL/SOLIDWORKS 뷰어 연계 요구
- OPTION: 폴더 구조 설정, 작업 할당/Access 데이터 소스 매핑, 서버 드라이브·사용자·ESPRIT EDGE 버전·트래픽 관리 항목 정의

## 로그/보고 규칙

- 각 단계 완료 시 `docs/logs/Timeline_2025-09-29.md`에 시간·담당·잔여 불릿(작업) 수 기록
- Task 완료 시 해당 불릿 끝에 `(완료 YYYY-MM-DD, 담당자)` 메모를 추가하고 오류 발생 시 보고 후 처리한다.