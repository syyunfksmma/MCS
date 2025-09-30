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
# Sprint 6 Explorer UX Alignment (Draft)

## 1. 좌측 필터 레일 정보구조 (E1)
- **목표**: ExplorerShell에서 제품/그룹/상태 Select 필터, 검색 필터 초기화 버튼, 향후 추가될 날짜/작성자 필터 구조를 일관되게 정의한다.
- **현재 구현 검토** (2025-09-29 기준):
  - `ExplorerShell.tsx`에서 `productFilter`, `groupFilter`, `statusFilter` 상태 관리.
  - 필터 옵션은 검색 결과 항목에서 추출(Set → Select options) 방식.
- **계획**:
  1. 필터 옵션을 `useMemo`한 Map으로 유지해 대규모 결과 시 성능 문제 방지.
  2. URL 동기화 여부: Sprint6 동안은 내부 상태 유지, Sprint7에서 Query Param 반영 검토.
  3. 필터 가이드와 라벨 정의: 제품=Product Code, 그룹=Routing Group, 상태=Routing Status.
- **산출물**: ExplorerShell 주석 + 본 문서 업데이트, Sprint7에서 Storybook 문서화.

## 2. Ribbon 액션 그룹화 규칙 (E2)
- **목표**: Explorer Ribbon 상단 액션(열기, 다운로드, 업로드, Wizard, Add-in 상태)을 역할 기반 그룹으로 정리.
- **그룹 정의**:
  - 작업(Action) 그룹: 열기, Wizard 실행, Add-in 상태 보기.
  - 배포(Delivery) 그룹: 다운로드, Workspace Upload.
  - 관리(Admin) 그룹: Feature Toggle, Maintenance Gate.
- **규칙**:
  - 각 그룹 내 버튼은 사용 빈도 순 정렬.
  - 비활성 조건을 명시(예: 다운로드는 sharedDriveReady=false이면 disabled).
  - 토글형 액션은 FeatureGate 내부에 배치하여 UI 일관성 유지.
- **후속 작업**: Ribbon Layout 문서(Storybook/Figma) 업데이트, Shortcut 계획은 Sprint7 Task에 반영.

## 3. Hover Quick Menu 플로우 (E3)
- **대상**: 검색 결과 List.Item 및 TreePanel 노드.
- **상호작용 설계**:
  1. Hover 시 300ms 지연 후 Quick Menu 표시.
  2. 메뉴 항목: 열기, 세부정보(미구현), 다운로드(조건부), Pin(백로그).
  3. 키보드 대비: List 항목 focus 시 동일한 Quick Menu를 키보드로 노출.
- **검증 계획**:
  - Playwright: Hover → Quick Menu → 열기 버튼 클릭 → Explorer 상세 표시 확인.
  - Axe 접근성 검사에서 focusable 요소가 표시될 때 Tab 순서 유지 확인.
- **노트**: Quick Menu 컴포넌트 초안은 Sprint6 이후 구현 예정이며, 본 문서는 의도와 테스트 계획을 정의한다.

*Drafted by Codex — 2025-09-29 12:02 KST*

