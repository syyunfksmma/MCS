# Server Control Launcher S96 Scenario & Wireframe Notes

## 전체 기동 시나리오 (Scenario A)
1. 사용자가 런처를 실행하면 서비스 카드 3개(API-A, API-B, Web)가 `Stopped` 상태로 표시된다.
2. `Start All` 버튼 클릭 → 확인 모달에서 권한 안내 확인 → PowerShell 스크립트 호출.
3. 각 카드가 `Starting` → `Running`으로 전환되며, 헬스 체크 성공 시 녹색 배지로 변경.
4. 활동 로그 패널에 `Start All initiated` 이벤트와 서비스별 PID가 기록된다.

## 부분 재기동 시나리오 (Scenario B)
1. API-B가 헬스 체크 두 차례 실패하여 `Error` 배지로 전환되고 토스트 `L001`이 표시된다.
2. 사용자 `재기동` CTA 클릭 → API-B만 Stop/Start 순으로 실행.
3. 로그 패널에 `API-B restart` 이벤트 기록, 상태가 `Running`으로 복귀.

## 오류 복구 시나리오 (Scenario C)
1. Web UI 프로세스가 강제 종료되어 `Stopped` 상태로 내려간다.
2. 사용자 `Start` 클릭 → Elevation 요구 시 `L003` 모달 안내.
3. 실행 후에도 실패하면 `Error` 유지, 사용자가 `자세히 보기` 링크를 통해 로그 파일 열람.

## 와이어프레임 구성 요소 메모
- **Header Bar**: 시스템명, 환경 태그, Start/Stop All 버튼, Refresh 아이콘.
- **Service Card**: 상태 배지, 동작 버튼(Play/Pause/Restart), 실시간 Health latency 표시.
- **Activity Log**: 테이블 형태(시간, 서비스, 메시지, 레벨) + 필터 탭.
- **Settings Panel**: 기본 URL, 커스텀 URL, 스크립트 경로 입력, 권한 체크박스(관리자 권한 필요시 강조).

## Teamcenter X 재사용 자산 매핑
| GUI 요소 | Teamcenter 자산 | 적용 방식 |
|---|---|---|
| Primary Button | Explorer Ribbon Primary | Start/Stop All 버튼 컬러/간격 동일 적용 |
| Status Badge | Teamcenter Status Token | Running/Stopped/Error 색상 그대로 사용 |
| KPI 카드 | Explorer KPI Card | 서비스 카드 상단에 헬스 지표 표시 |
| Log Panel | Explorer Activity Feed | 시간/메시지 구조 및 아이콘 재사용 |
