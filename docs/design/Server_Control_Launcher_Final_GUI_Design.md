# Server Control Launcher Final GUI Design Report

## Teamcenter X 스타일 적용 개요
- Explorer UI Rework에서 정립한 레이아웃(20/52/28 그리드)과 토큰 컬렉션을 재사용해 UI 일관성을 유지한다.
- Ribbon 컨트롤, 배지 색상, KPI 카드 패턴을 채택해 사용자가 Explorer와 동일한 경험을 얻도록 한다.

## 레이아웃 구성
1. **헤더 영역**: 시스템 이름, 환경 표시(Production/QA), `Start All`/`Stop All` 주요 버튼 배치
2. **서비스 카드 영역(중앙)**: API-A, API-B, Web UI 카드 3개를 가로 배열하고 상태 배지(녹색/회색/빨강)와 로그 링크를 제공
3. **활동 로그 패널(하단)**: 실시간 stdout/stderr 메시지를 타임라인 형태로 표기하며 필터(Info/Warning/Error) 제공
4. **설정 패널(우측)**: 기본 URL(`http://localhost:3000`)과 커스텀 엔드포인트 입력, PoC 스크립트 경로 지정, 권한 가이드 표시

## 핵심 인터랙션 흐름
- `Start All`: 3개 서비스 병렬 기동 → 토스트 알림 `L001` 성공 메시지 → 각 카드 상태 `Starting` → 정상 시 `Running`
- 개별 `Start/Stop`: 버튼 클릭 시 확인 모달 → 실행 결과 토스트 → 활동 로그 타임스탬프 기록
- 오류 복구: 헬스 체크 실패 시 에러 배지 및 `재기동` CTA 제공, 클릭 시 대상 서비스만 재기동
- 로그 패널: 실시간 스트리밍 + 검색 기능, 에러 발생 시 해당 서비스 카드에도 배지 표시

## 접근성/사용성 고려 사항
- 버튼/배지 대비비율 Teamcenter 가이드 준수(4.5:1 이상)
- 키보드 포커스 순서: 헤더 → 서비스 카드 → 로그 → 설정 패널 순
- 스크린리더 레이블: 상태 배지는 `서비스명 상태 (Running/Stopped/Error)` 형태로 읽기

## 산출물
- 와이어프레임: `artifacts/design/Server_Control_Launcher_Figma.png` (예정)
- UX 시나리오 문서: `docs/design/Server_Control_Launcher_Wave21_ExecutionChecklist.md` 내 시나리오 항목 참조
