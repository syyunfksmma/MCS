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

# Explorer UI Rework Implementation Plan (Wave20 S91~S95)

## S91 – 코드 정리 및 상태 구조화 (완료)

- `ExplorerShell.tsx`를 Prettier로 재정렬하고 `'use client';` 지시문을 최상단으로 배치
- Explorer 전역 상태를 `useExplorerLayout` 훅으로 분리하여 레이아웃·검색·마법사 상태를 통합
- Storybook 및 PR용 ESLint 점검 계획 수립

## S92 – 레이아웃 & Ribbon 적용 (완료)

- CSS Grid 기반 `ExplorerLayout` 컴포넌트를 추가하고 20/52/28 컬럼 배치 구성
- `ExplorerRibbon`을 Teamcenter X 스타일의 액션 그룹/메타 배지 디자인으로 재구성
- `styles/tokens.ts`·`globals.css`에 Teamcenter 톤의 토큰과 글로벌 변수를 추가

## S93 – TreePanel & Filter Rail 개선 (진행 예정)

- TreePanel에 상태 DOT, 확장/접기 컨트롤, ARIA 속성 및 상태 싱크 보강
- Sticky 검색 필터 레일과 Feature Flag 연동을 정비하여 탐색 시나리오 UX 향상
- Drag handle 및 키보드 상호작용 개선 + Storybook 예제 업데이트

## S94 – 검색 & Preview 패널 Teamcenter 스타일 적용

- 검색 결과 Hover/Focus 애니메이션 및 KPI 카드(서버/클라이언트 SLA) 정돈
- Preview 카드(Upload/Add-in)에 Teamcenter 카드 패턴 및 요약 KPI 배치
- 상단 메뉴바 요구사항을 반영해 DASHBOARD/MCS/SERVER/OPTION 노출 시안 작성

## S95 – 테스트 & 문서화

- `pnpm lint`, `pnpm test:unit -- --run`, 필요 시 `pnpm test:e2e` 수행 및 결과 보고 (명령 미정의로 실행 불가, 결과 보고)
- Storybook, 테스트 문서(`docs/testing/Explorer_UI_Rework.md`) 갱신
- QA 보고 및 Timeline/스프린트 Task List 업데이트

## 메뉴바 요구사항 체크리스트

- DASHBOARD: 금일 미할당·할당·완료 현황 요약 및 인원/설비 그래프, KPI(주간/연간/월간 프로그램·불량률) 정의
- MCS: ESPRIT EDGE API 키 생성/전달, 3D 모델 & CAM 파일 관리 흐름 설계
- SERVER: 기존 서버 폴더 구조 탐색, REV/이력/로그 관리, STL·SOLIDWORKS 뷰어 요구 정의
- OPTION: 폴더 구조 설정, 작업할당 관리, Access 데이터 소스·테이블 매핑, 서버 드라이브/사용자/ESPRIT EDGE 버전/트래픽 관리 요구 수립

> 단계 완료 시 Timeline에 기록하고, 잔여 불릿(작업) 수를 보고한다.

# Wave21 Server Control Launcher Plan (S96~S98)

## S96 – 요구사항 정리 및 와이어프레임
- Server Control Launcher 요구사항 문서(`docs/design/Server_Control_Launcher_Requirements.md`) 검토 및 승인
- 팝업 UI 와이어프레임 작성(프로세스 버튼, 상태 배너, 로그 패널)
- 초기 사용자 시나리오와 에러 흐름 정의

## S97 – 프로세스 제어 모듈 PoC
- API/Web 서버 3종을 스크립트로 기동/중단하는 프로토타입 구현
- 상태 폴링 및 헬스 체크(포트 응답, 로그 파싱) PoC
- PowerShell/Node 실행 권한 검토 및 위험 요소 보고

## S98 – UI 통합 및 배포 옵션
- 팝업 UI + 프로세스 제어 모듈 통합
- 기본 브라우저 자동 실행 및 사용자 지정 URL 저장 기능 구현
- 배포 형태(단일 EXE/Docker) 비교 문서화 및 테스트 플랜 수립