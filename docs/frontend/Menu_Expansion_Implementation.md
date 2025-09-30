# Menu Expansion Implementation Plan (2025-09-30)
- 작성: Codex
- 범위: Sprint 9 Flow M/C/O 항목 (Dashboard/MCS/Server/Option 메뉴, 3D/STL 뷰어, Esprit EDGE 연계).

## 1. 공통 레이아웃 개편 (Flow M1)
- Next.js src/app/layout.tsx에 GlobalTabs 컴포넌트 추가: Dashboard / MCS / Server / Option.
- 권한 매핑: Admin → 모든 탭, Engineer → Dashboard/MCS, Reviewer → Dashboard/Server.
- BreadCrumb: ExplorerShell에서 현재 탭과 연동해 상태 보존.
- 상태 공유: React Context NavigationContext로 현재 탭, 마지막 라우팅 ID 저장.

## 2. Dashboard 탭
- /dashboard 페이지 → Aggregation API 호출, KPI 카드 + 그래프(AntD Charts) 렌더링.
- 필터 패널: 날짜 범위, 설비/인원 토글.

## 3. MCS 탭 확장 (Flow C)
### 3.1 3D/STL 뷰어
- 컴포넌트 위치: src/components/mcs/ThreeViewer.tsx.
- 라이브러리: three.js + @react-three/fiber + drei OrbitControls.
- 데이터: /api/workspace/models/{productCode} → signed URL.
- 성능 보호: Suspense + lazy import, fallback canvas.

### 3.2 Esprit EDGE 연동
- API
  - POST /api/esprit/api-key : 키 생성.
  - POST /api/esprit/jobs : EDGE 프로세스 기동.
- UI
  - Modal EspritKeyModal에서 키 발급/복사.
  - EspritJobPanel에서 상태/로그 표시.
- 보안: API 키는 다운로드 단발성, UI에서 재노출 금지.

## 4. Server 탭 (Flow O1)
- 페이지: src/app/server/page.tsx.
- 섹션 구성
  - 파일 구조 브라우저(Tree + 상세 패널).
  - 로그 스트림: SignalR 또는 SSE → LogTailPanel.
  - REV 관리: 리스트 + 승인/거절 버튼.
- 검색: /api/server/search?q=....

## 5. Option 탭 (Flow O2/O3)
- 폼 그룹
  - 폴더 구조 설정: 공유 드라이브 경로, 권한 템플릿.
  - 작업 할당 매핑: 제품군 ↔ 엔지니어.
  - Access Data 소스: 연결 문자열, 테스트 버튼.
  - Esprit EDGE 버전 관리: 버전 목록, 다운로드 링크.
  - 트래픽 제한: 동시 작업 수 제한.
- Role 관리: 사용자 목록, 역할 변경, 감사 로그 다운로드.
- 저장 로직: PATCH /api/options (JSON Schema 검증).

## 6. 테스트 & QA
- Playwright: 탭 간 네비게이션, 뷰어 렌더, EDGE 키 발급 플로우.
- Vitest: Context/Reducer, Option 폼 validation.
- 성능: Lighthouse Dashboard 2초 이하.

## 7. TODO
- [ ] GlobalTabs + NavigationContext 생성.
- [ ] Dashboard 페이지 구성.
- [ ] ThreeViewer + Esprit UI 구현.
- [ ] Server/Option API 계약 최종화 및 프론트 통합.
- [ ] QA 시나리오 작성 및 Shakeout Log 업데이트.
