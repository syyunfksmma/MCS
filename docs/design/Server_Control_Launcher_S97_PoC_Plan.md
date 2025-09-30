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

# Server Control Launcher S97 PoC Plan (Updated 2025-09-30)

## 목표
- API 2개와 Web UI 1개의 프로세스를 `scripts/server-control/start_stop.ps1` 스크립트로 기동·중지·상태 확인한다.
- `scripts/server-control/mock-health-server.js`를 활용해 헬스 체크와 로그 스트리밍 흐름을 검증한다.

## 서비스 구성
| 서비스 | 유형 | 실행 커맨드 | 포트 | 헬스체크 |
|---|---|---|---|---|
| API-A | PowerShell 데모 서비스 | `pwsh.exe -File ./scripts/server-control/demo-service.ps1 -ServiceName API-A` | 7101 (논리) | `http://localhost:7800/health/apiA` |
| API-B | PowerShell 데모 서비스 | `pwsh.exe -File ./scripts/server-control/demo-service.ps1 -ServiceName API-B` | 7102 (논리) | `http://localhost:7800/health/apiB` |
| Web-UI | PowerShell 데모 서비스 | `pwsh.exe -File ./scripts/server-control/demo-service.ps1 -ServiceName Web-UI` | 7300 (논리) | `http://localhost:7800/health/web` |

구성 값은 `config/server-control.config.json`에 기록되며, 런처 스크립트가 로드 시 자동 파싱한다.

## PowerShell 스크립트 개요 (`scripts/server-control/start_stop.ps1`)
- `Initialize-LauncherConfig` : JSON 구성을 읽고 로그 디렉터리를 생성.
- `Start-LauncherService` / `Stop-LauncherService` : 단일 서비스 기동·종료.
- `Start-LauncherAll` / `Stop-LauncherAll` : 전체 서비스 일괄 제어.
- `Get-LauncherHealth` : 헬스 엔드포인트 호출 및 상태/코드 수집.
- 로그는 `logs/launcher.log`에 ISO8601 타임스탬프로 기록.

## Node 헬스 체크 스텁 (`scripts/server-control/mock-health-server.js`)
- Express 서버로 7800 포트에서 대기.
- `GET /health/:service` 호출 시 JSON 응답(`status`, `latencyMs`, `timestamp`).
- 쿼리 파라미터 `status`, `latencyMs`를 전달하면 런타임 상태를 재정의하여 실패 시나리오 재현 가능.

## 실행 시퀀스
1. `node scripts/server-control/mock-health-server.js` 실행으로 헬스 스텁 구동.
2. `pwsh ./scripts/server-control/start_stop.ps1 -ConfigPath config/server-control.config.json` 로 런처 로드.
3. `Start-LauncherAll` 호출해 세 서비스 기동 → `logs/launcher.log` 확인.
4. `Get-LauncherHealth` 로 헬스 결과 확인. 실패 시 `http://localhost:7800/health/apiB?status=ERROR` 호출 후 재확인.
5. `Stop-LauncherAll` 로 종료 및 로그 마무리.

## 검증 산출물
- 실행 로그: `logs/launcher.log`
- 인증 스냅샷: `artifacts/server-control/poc/` (필요 시 캡처 저장 위치)
- 문서 업데이트: Timeline / Sprint Task List
