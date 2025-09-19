# Phase 10 - 배포 및 운영 계획

## 1. 클라이언트 배포 전략
- 패키징: MSIX 기본, 미지원 환경을 위해 PowerShell 설치 스크립트 병행.
- 업데이트: 내부 파일 서버 `\\deploy\mcms\client`에 최신 버전 저장, CmdHost 명령 `Update-Client`로 원격 배포.
- 사전 체크: .NET 8 Desktop Runtime, VC++ 재배포 가능 패키지 확인.

## 2. 서버 배포
- WebAPI: IIS WebDeploy 패키지(`.zip`), PowerShell 스크립트 `Deploy-WebApi.ps1`로 설치.
- Worker & CmdHost: Windows Service 설치 스크립트(`Install-Service.ps1`).
- 환경 변수: `MCMS_DB_CONN`, `MCMS_FILE_ROOT`, `CMD_QUEUE` 등 문서화.

## 3. 내부망 CMD 서비스 운영
- 서비스 계정: `svc_mcms_cmd` (도메인), 최소 권한 부여.
- 명령 목록: `Deploy-Client`, `Deploy-MachinePackage`, `Restart-Service`, `Sync-Permissions` 등.
- 접근 제어: 명령 실행 시 요청자 AD 그룹 체크, 감사 로그 작성.
- 모니터링: Windows Event Log + 중앙 로그 수집.

## 4. CI/CD 파이프라인
- 빌드: Azure DevOps (대안: Jenkins).
  - 단계: 빌드 → 테스트 → 패키징 → 아티팩트 업로드.
- 배포 승인: QA → UAT → 생산 순, 수동 승인 스텝 포함.

## 5. 운영 절차
- 설치 가이드: `docs/InstallGuide.md` 예정, 스크린샷 포함.
- 장애 대응: 1차 운영팀, 2차 개발팀, 3차 공급사 연락.
- 변경 관리: Change Request 템플릿 사용.

## 6. 모니터링 & 알림
- API/Worker: Grafana 대시보드, 오류율 및 응답시간 알림.
- CmdHost: 실패 명령 이메일 알림, 재시도 정책.
- 파일 서버: 용량 경고 및 권한 변경 기록.

## 7. 교육 및 문서
- 운영 매뉴얼: 서비스 재시작, 로그 확인 방법.
- 사용자 매뉴얼: 설치, 로그인, 주요 기능.
- 주니어용 FAQ: 자주 묻는 배포/업데이트 질문 정리.

## 8. 오픈 이슈
- MSIX 배포 시 방화벽 예외 등록 프로세스.
- CmdHost 명령 승인 워크플로우 세부 정의.
- Azure DevOps vs Jenkins 최종 선정.
