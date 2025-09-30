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
