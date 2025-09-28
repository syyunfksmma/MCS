# MCS Project Task List

## 절대지령
- 각 단계는 승인 후에만 착수한다.
- 단계 착수 전 Task 범위를 재확인하고 오류를 식별한다.
- 작업 중 변경 사항과 로그(스크린샷, 다이어그램 포함)를 모두 문서화한다.
- Task List와 체크박스를 유지하고 신규 생성된 작업에서도 절대 지령을 동일하게 준수한다.
- 오류 개선을 위해 신규 TASK가 발생하면 TASK LIST를 새로 작성하거나, 기존 LIST에 업데이트 한다.
- PoC 기준은 1인 기업 관점으로 계획한다.
- 모든 코드와 API 작성은 Codex가 수행한다.
- 모든 검증 성공, 실패 기록도 다 로그에 기록, 유지할 것. 완료 될 시 취소선을 통해 업데이트 한다.
- ~~src/MCMS.Infrastructure/FileStorage/FileStorageService.cs의 기존 구문 오류를 정리해 전체 솔루션이 빌드되도록 한 뒤, Apply→Ready 이벤트 루프를 실제 실행 환경에서 연동 테스트~~
- ~~Signal-McsEvent.ps1나 Worker 큐를 이용해 에지 케이스(타임아웃, 라이센스 경고 등)에 대한 이벤트 흐름을 리허설하고, 필요한 경우 실패 시 별도 이벤트/로그 경로를 보강~~
- ASP.NET Core 8 + SignalR + SQL Server + React 19(Vite) 기반 CAM 작업 웹서비스 구축 및 단계별 승인 절차 준수
- Windows 통합 인증(AD/Kerberos)과 내부 CA TLS 적용 여부를 모든 단계 전환 시 재검증

## 기본 운영 원칙
- 현재는 **혼자 + 내부망 + 수동 배포** 기준을 유지한다.
- 자동화 스크립트/도커 설정은 참고용 자료로 보관하고, 필요할 때만 사용한다.
- 문서와 체크리스트를 최신으로 유지해 수동 절차를 쉽게 재현할 수 있도록 한다.
- ~~Next.js 기반 SSR 배포 절차를 우선 검토한다.~~
- 중앙 집중형 IIS + Kestrel 배포와 WiX 기반 설치형 보조 채널을 병행 고려한다.

## 단계별 Task List

### 단계 1. PoC 환경 구축 및 로컬 기능 구현 (localhost)
- [ ] 개발환경 세팅 (Visual Studio 2022, Node LTS, 사내 NPM/NuGet 미러)
- [ ] DB 스키마 설계 (EF Core + SQL Server Express, rowversion 동시성)
- [ ] ASP.NET Core API 및 SignalR Hub 구현
- [ ] React 19 + Vite + Tailwind v4 + shadcn/ui 초기화 및 Save & Load/파일 트리 갱신 로직 구현
- [ ] 로컬 부하 테스트(k6) 및 Windows 통합 인증 연동 검증
- [ ] PoC 단계 회고 문서화 및 승인 요청

### 단계 2. 내부망 서버 배포 및 중앙 집중형 서비스화
- [ ] IIS + Kestrel 배포 환경 구성 및 방화벽 정책 정리
- [ ] 내부 CA TLS 적용 절차 수립 및 운영 SQL Server 마이그레이션 계획 수립
- [ ] 사내 IP/FQDN 서비스 오픈 체크리스트 작성
- [ ] 사용자 계정/권한 정책과 Serilog 로그/감사 설정 문서화

### 단계 3. 설치형(MSI/EXE) 보조 채널 구축 (필요 시)
- [ ] WiX Toolset 기반 MSI 패키징 시나리오 수립
- [ ] 로컬 SQL Server 옵션 및 동기화 전략 검증
- [ ] 자동 업데이트 또는 재배포 절차 문서화 및 테스트

### 단계 4. 유지보수 및 고도화
- [ ] Windows Event Log + Serilog 파일 로그 모니터링 대시보드 구성
- [ ] 사내 Git + 배포 스크립트 기반 CI/CD 절차 정의
- [ ] 사용 패턴·성능 지표 수집 → 성능 최적화 제안 정리
- [ ] 신규 요구사항 수용 시 단계별 승인 및 문서 업데이트 프로세스 확립

## 확인/체크리스트
- [ ] PoC/운영 전환 시 오류 0건 상태 재점검
- [ ] k6 부하 테스트 결과(P95 < 150ms) 기록
- [ ] 보안 점검(AD 인증, SQL Injection, XSS, CSRF) 결과 첨부
- [ ] 사용성 테스트 피드백 반영 내역 정리

## 참고
- ~~EXE 빌드 절차 요약서 작성 및 README 링크 연결~~
- ~~수동 테스트 체크리스트(기능/접근성)를 작성해 빌드 전 확인하도록 함~~

## 배포 & 운영 (수동)
- [ ] 공유 드라이브 릴리즈 폴더 구조 정의 (버전별/릴리즈노트 포함)
- [ ] 배포 시 사용되는 환경설정(.config/.env) 백업 및 복원 방법 정리

## 문서 & 자료 정리
- [x] Playwright/프록시 환경 설치 가이드 작성 (README, docs/playwright)
- [ ] 내부 수동 배포 절차 문서화 (`docs/ops/InternalManualDeployment.md`)

## 선택/추후 자동화 과제 (옵션)
- [ ] Selenium Edge 스모크 테스트 유지/보완 (필요 시 실행)
- [ ] Docker Compose 기반 환경이 필요해질 경우 헬스체크 및 override 템플릿 확장
