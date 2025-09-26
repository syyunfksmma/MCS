# Sprint 6 Activity Log ? Deployment & Operations

- 2025-09-26 Codex: k6 chunk_upload.js meta_poll 계측 추가(meta_poll_elapsed_ms/meta_poll_request_ms/meta_poll_status_code, match/success rate).
- 2025-09-26 Codex: k6 실행(BASE_URL=http://localhost:5229) 실패 - connectex (target machine actively refused). IIS AppPool/포트 상태 점검 예정.

> 모든 작업 과정과 로그를 기록한다. 배포/롤백/모니터링 결과를 상세히 남긴다.

- 2025-09-26 Codex: Added script_bug flag to meta SLA export; 0 ms baseline tagged as script bug.

- 2025-09-26 Codex: Apply automation now emits Esprit ready event after Setup injection (Global\MCS.Esprit.Ready signalled).






- 2025-09-26 Codex: Verified VS2022 Pro installation and msbuild 17.14 build success for TEST/CAM_API.csproj.
- 2025-09-26 Codex: Resolved FileStorageService cache guard fixes; dotnet build src/MCMS.Api/MCMS.Api.csproj passed without warnings.
- 2025-09-26 Codex: Signal-McsEvent.ps1 auto-created Global\MCS.Apply.Completed and signalled/reset events for Apply/Ready.
- 2025-09-26 Codex: Signal-McsEvent.ps1 negative test confirmed missing Global\MCS.License.Blocked requires AutoCreate (error logged).




- 2025-09-26 Codex: GitHub push/Actions merge deferred; sandbox lacks credentials to authenticate origin v1.
- 2025-09-26 Codex: Esprit COM automation retest pending; lab environment required for Apply→Ready/License scenarios.
- 2025-09-26 Codex: CAM_API g.cs regeneration & Worker regression plan updates deferred; awaiting VS2022 host with access to CAM_API pipeline.
- 2025-09-26 Codex: Updated deployment/auth docs for internal Windows server install model and struck out GitHub Actions tasks.
- 2025-09-26 Codex: scripts/deploy/package-offline.ps1 작성 및 dry-run(-SkipBuild/-SkipWebBuild) 성공, 산출물 C:\Users\syyun\Documents\GitHub\MCS\artifacts\offline\MCMS_Setup_2025.09.26.zip 생성.
- 2025-09-26 Codex: run-smoke.ps1 환경 매핑/Negotiate 검증 추가, 아티팩트는 artifacts/offline/logs 및 \\MCMS_SHARE\logs\smoke\* 로 업로드.
- 2025-09-26 Codex: SharedDrive_Structure.md 초기 버전 커밋, installers/logs/config/scripts 폴더 표준화.
- 2025-09-26 Codex: IIS Windows Auth, SPN, 권한 매핑 테스트 결과를 Phase0_SecurityHostingMemo.md에 기록.
- 2025-09-26 Codex: Install-MCMS.ps1 실행 완료 후 IIS/443 포트 기동, mcms.internal DNS 미등록으로 Invoke-WebRequest 실패. 네트워크 정보(IP 10.204.2.28, DNS 192.168.1.6/172.20.21.6) 기록하고 hosts/DNS 등록 조치 예정.
- 2025-09-26 Codex: netsh http show sslcert ipport=0.0.0.0:443 결과 인증서 바인딩 미구성 확인 → IIS https 바인딩/SSL 재설정 필요.
- 2025-09-26 Codex: self-signed mcms.internal 인증서 생성 완료(Thumbprint 771B54E754A17529573D35B6F3AC20162E295E53). 변수에 실제 Thumbprint 미입력으로 SSL 바인딩 오류 발생 → 재시도 예정.
- 2025-09-26 Codex: SSL 바인딩 재생성 중 '이미 있음' 오류 및 Copy-Item 미지원 확인. 기존 SslBindings 항목 정리 및 Import-Certificate 경로로 전환 예정.
- 2025-09-26 Codex: healthz 503 발생 → MCMS.AppPool Stopped 확인, 재시작/에러 로그 조사 필요.
- 2025-09-26 Codex: MCMS/api 응용 프로그램 경로 확인(C: \MCMS_Test\api), AppPool 재시작 불가 및 healthz 503 지속 → AppPool 로그/이벤트 분석 필요.
- 2025-09-26 Codex: stdout 로그 경로(C:\MCMS_Test\api\logs) 생성되지 않음 → AppPool 계정 권한 부족 의심, ACL 부여 작업 필요.
- 2025-09-26 Codex: Windows 인증/HTTPS 검증은 추후 Sprint8 연계 작업으로 보류, 현재는 패키지 검증·API 503 원인 분석 및 로그 확보에 집중.

- 2025-09-26 Codex: Esprit 랩 슬롯 2025-09-29 10:00~12:00 KST (Lab-A) 예약 요청, Signal-McsEvent.ps1 최신본/Apply automation 스크립트 번들 전달 예정.
