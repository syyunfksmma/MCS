# Sprint 6-7 Explorer UX 확장안 (Teamcenter Alignment)
## 절대 지령
- 문서 수정은 기존 내용을 삭제하지 않고 문서 하단 "수정 이력"에 기록한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트
- Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강


## 1. 좌측 필터 레일 (Sprint6 E1)
- 목표: Teamcenter X 좌측 레일 패턴 반영, ExplorerShell 트리 상단에 필터 그룹 고정.
- 섹션 구성:
  1. 검색(확장): 텍스트 검색, SLA 배지 표시.
  2. 필터 그룹: Routing Status (Draft/Pending/Approved/Rejected), CAM Revision, Owner.
  3. Quick Actions: "최근 본 Routing", "SLA 초과만 보기" 토글.
- 와이어프레임 스케치 텍스트:
`
┌─Filter Rail─────────────┐
│ Search [__________][SLA badge]
│ Status: [Draft] [Pending] [Approved] [Rejected]
│ CAM Rev: [v1.0] [v1.1] [...] (checkbox)
│ Owner:  [me] [team] [vendor]
│ Toggle: ( ) Recent Only  (x) SLA>Target
└────────────────────────┘
`
- 구현 메모: Ant Design Layout + Affix, 상태는 React Query 캐시에 동기화 예정.

## 2. Ribbon 액션 그룹화 (Sprint6 E2)
- 목표: 상단 컨트롤 바를 Teamcenter Ribbon UX 스타일로 3그룹 구성.
- 그룹 정의:
  - Routing: New, Duplicate, Archive.
  - Approval: Request, Approve, Reject.
  - Add-in: Queue Job, Retry, Cancel.
- 하이파이 요소: Ant Space + Typography.Title; 각 그룹 아이콘은 @ant-design/icons.
- ExplorerShell 반영: Summary 카드 위에 RibbonBar 컴포넌트 삽입. 상태/권한 기반으로 버튼 enable/disable 처리.

## 3. Hover Quick Menu (Sprint6 E3 / Sprint7 E3 마무리)
- 목표: TreePanel 노드 Hover 시 Quick Menu (View Detail, Open Uploads, Approve) 노출.
- 인터랙션:
  1. Hover → 0.2s 지연 후 Quick Menu fade-in.
  2. Focus/Keyboard 접근 시 Enter로 메뉴 열기, 화살표로 선택.
  3. Add-in 상태 배지와 연동, SLA 초과 시 경고 아이콘 표시.
- 와이어 텍스트:
`
Item ▸ Revision ▸ Routing[RT1001]
  └─ Hover Bubble: [Detail] [Uploads] [Approve]
`
- 구현 메모: TreePanel 노드에 Dropdown + Menu; 접근성 위해 aria-haspopup="true" 지정.

## 4. 반영 일정
| Sprint | 항목 | 산출물 |
|--------|-------|---------|
| 6 (E1) | 필터 레일 정보 구조, ExplorerShell 배선 | FilterRail.tsx PoC, 문서 업데이트 |
| 6 (E2) | Ribbon 그룹 하이파이 | RibbonBar.tsx 스케치 + Storybook |
| 6 (E3) | Hover Quick Menu 인터랙션 정의 | TreePanel Hover UX 문서, Keyboard 접근성 체크 |
| 7 (E1) | 필터 레일 React 구현 + Storybook | ExplorerShell 통합, E2 QA |
| 7 (E2) | Ribbon 접근성 리뷰 + Add-in CTA | Storybook 테스트 케이스 |
| 7 (E3) | Hover Menu 회귀 테스트 | Playwright Hover 시나리오 |

- 로그 연계: 진행 내역은 Sprint6/7 Task List E 섹션과 Sprint 로그에 순차 기록.

## 5. GUI 참고 자료 (2025-09-25)
- 디자인 컬러·레이아웃은 다음 참조 이미지를 기반으로 조정: `docs/design/reference/gui_reference1.jpg` ~ `gui_reference4.jpg`.
- 공통 톤: 다크 네이비 배경과 라이트 블루 포커스, 버튼은 안트디자인 Primary 컬러(#1677ff)에 16px 라운드.
- 목록 카드 배치는 이미지 #2/#3을 기준으로 ExplorerShell Summary에 반영, Workspace Upload 패널은 이미지 #4의 투톤 패널을 적용.
- Sprint6 Storybook 컴포넌트는 동일 컬러 토큰(``--mcs-primary``, ``--mcs-surface-elevated``)으로 시작한다.

## 6. Storybook · Playwright 착수 로그
- Storybook 초기화: `web/mcs-portal`에서 `npx storybook@latest init --builder vite` 실행 계획, ExplorerShell Ribbon/Filter Rail 스토리 우선 생성.
- Playwright 회귀 준비: Hover Quick Menu 상호작용을 `tests/e2e/explorer/hover-menu.spec.ts`로 초안 작성, Sprint7에서 본격 구현.
- 접근성 검토 흐름: Storybook에서 `@storybook/addon-a11y` 활성화 → Contrast 측정 후 Sprint7 로그에 기록.
- 모든 산출물은 Sprint6/7 Task List E·F 항목과 Sprint 로그(E1~E3, F1~F3)에 연결한다.

## 수정 이력
- 2025-09-25 Codex: SLA 대응 지침 및 문서 변경 기록 규칙 추가, UX/Chunk 작업 세부 일정 반영.
- 2025-09-25 Codex: GUI 레퍼런스 이미지 경로 정리 및 Storybook/Playwright 착수 계획 추가.
