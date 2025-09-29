# Sprint 6 Activity Log ? Deployment & Operations
- 2025-09-27 Codex: MCMS.AppPool SpecificUser 롤백 시도(암호 미확보) → IIS 503 발생 확인 후 ApplicationPoolIdentity로 즉시 복귀, WAS 이벤트 점검 필요.
- 2025-09-27 Codex: FileStorageService JSON 큐 로깅 강화(pending depth/workerId/queue 경고) 및 _jsonWritesTotal 계측 추가.
- 2025-09-27 Codex: mcms.internal 루트 응답 확보용 index.html 배포(임시 리디렉션).
- 2025-09-27 Codex: run-smoke.ps1 InternalProd(https://mcms.internal, DisableWindowsAuth/SkipShareCopy, Timeout=5s) 실행 → Portal 200 / API 500.19 / Swagger 404, 로그: artifacts/offline/logs/smoke_20250927_090825.*.
- 2025-09-26 Codex: 로컬 Kestrel(`MCMS.Api.exe --urls http://localhost:5229`) chunk_upload 재측정, meta_generation_wait_ms p95=23.38 s / chunk_upload_complete_ms p95=14.17 s / iteration p95=23.65 s (SLA 초과). 결과 JSON: artifacts/perf/k6_chunk_20250926_1837.json.
- 2025-09-26 Codex: run-smoke.ps1 Lab(http://localhost:5229, DisableWindowsAuth/SkipShareCopy, Timeout=5s) 재실행 → Swagger 200 / Portal·Health 404. 로그: artifacts/offline/logs/smoke_20250926_183918.*.
- 2025-09-27 Codex: run-smoke.ps1 Lab(http://localhost:5229, DisableWindowsAuth/SkipShareCopy, Timeout=5s) 재재실행 → API Health 200 / Swagger 200 / Portal Root 404(Next.js 정적 자산 미배포). 로그: artifacts/offline/logs/smoke_20250927_085204.*.
- 2025-09-26 Codex: MCMS.AppPool을 일시적으로 ApplicationPoolIdentity로 유지, `MCMS\svc-mcms` 암호 재검증 후 `appcmd set apppool /processModel.identityType:SpecificUser` + `set.config`(password) 롤백 계획 수립 필요.
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
- 2025-09-27 Codex: 로컬 서버에서 appcmd.exe로 MCMS.AppPool 조회 시 항목 미존재(ExitCode 1) 확인, IIS 원격 호스트 접근권한 부재로 SpecificUser 복구 대기.
- 2025-09-27 Codex: ASP.NET Core Hosting Bundle 설치 전 단계로 run-smoke InternalProd 재실행 보류, 500.19 재현 상태 유지.
- 2025-09-27 Codex: C:/MCMS_Test/portal/index.html 임시 리디렉션 상태 유지 확인, Next.js 정식 산출물 미배포.
- 2025-09-27 Codex: FileStorageService 큐 로그 경로(C:/MCMS_Test/api/logs) 점검 결과 파일 미생성, meta_generation_wait_ms 병목 분석은 k6 JSON 기반으로 지속.
- 2025-09-27 Codex: k6_chunk_20250926_1837.json 재확인(p95 meta 23.38s / iteration 23.65s) → FileStorageService SLA 개선안 마련 위해 큐 대기시간 로깅 확보 필요.
- 2025-09-27 Codex: ASP.NET Core Hosting Bundle 설치 절차·필요성 초등학생용 설명 정리, IP 기반 서비스 구상안 문서화.
- 2025-09-27 Codex: PowerShell dotnet --info 결과(SDK 9.0.305 등) 확인, Hosting Bundle 미설치 추정.
- 2025-09-27 Codex: IIS 관리자에서 MCMS 사이트/AppPool 실행 상태 확인(스크린샷 기준).
- 2025-09-27 Codex: 'C:/Program Files/IIS/Asp.Net Core Module/V2' 폴더 존재, HKLM:...FxHubs 키 부재로 모듈 레지스트리 미생성 상태 기록.
- 2025-09-27 Codex: ipconfig로 서버 IPv4 10.204.2.28 확인, New-NetFirewallRule 'MCMS_HTTP' 포트 80 허용 규칙 생성.
- 2025-09-27 Codex: http://10.204.2.28/api/health 접근 시 IIS가 C:/inetpub/wwwroot로 매핑돼 404.0(0x80070002) 재현 확인.
- 2025-09-27 Codex: scripts/deploy/run-smoke.ps1 호출은 repo 루트에서 .\\scripts\\deploy\\run-smoke.ps1 형태로 실행 필요함을 안내.
- 2025-09-27 Codex: run-smoke.ps1 실행 중 System.Net.Http.HttpClientHandler 타입 미로운(Windows PowerShell) 오류 재현, System.Net.Http 어셈블리 로드 필요.
- 2025-09-27 Codex: run-smoke InternalProd(BaseUrl http://10.204.2.28) 재실행 → Kerberos Challenge 500, API Health 500, Swagger 404, Portal 200 결과 기록.
- 2025-09-27 Codex: smoke 로그 artifacts/offline/logs/smoke_20250927_101635.* 저장 확인, 네트워크 공유 복사 실패('경로를 찾지 못했습니다').
- 2025-09-27 Codex: run-smoke InternalProd 재시도(RunId 20250927_102216) 동일 실패 패턴(Kerberos/API 500, Swagger 404, Portal 200) → 로그 artifacts/offline/logs/smoke_20250927_102216.* 저장.
- 2025-09-27 Codex: Hosting Bundle 설치/재부팅 후 http://10.204.2.28/api/health 5초 요청 시 타임아웃 발생(서비스 미응답 추정).
- 2025-09-27 Codex: API 부팅 시 LocalDB(MSSQLLocalDB) 자동 인스턴스 생성 실패(0x89c50118) 예외 재현 → SQL 연결 문자열 (localdb) 확인.
- 2025-09-27 Codex: http://10.204.2.28/api/health 요청 시 IIS 500.30 (ASP.NET Core app failed to start) 페이지 확인.
- 2025-09-27 Codex: SQL Server 미사용 방침에 따라 LocalDB 대체용 연결 문자열 작업 보류, 대안 Task 정리 예정.
- 2025-09-27 Codex: SQL Server 미사용 방침에 따라 LiteDB 기반 저장소 전환 설계안 수립(연결 문자열 제거, McmsDbContext 대체, Program.cs 초기화 변경 등 Task 정의).
- 2025-09-27 Codex: SQL Server 대안으로 Access DB 전환 방침 확정, 전체 TaskList 체크 현황 수집(완료 80, 미완료 103).
- 2025-09-27 Codex: TaskList 통계 재확인 → 완료 82, 미완료 103으로 정정.
2025-09-29 Codex: Windows 통합 인증 계획을 폐기하고 이메일 수동 승인 기반 인증으로 전환, Phase0/Phase10 문서를 로컬 PC(Node.js) 기준으로 갱신.
