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

### 4.1 품질 게이트 및 텔레메트리 연동
- 테스트 게이트: 빌드 후 자동으로 Unit/Integration/UI 테스트 결과를 Allure 리포트로 수집하고, Grafana OnCall에 실패 알림을 전송한다.
- 성능 게이트: Phase 9의 k6 + OpenTelemetry 성능 회귀 리포트를 파이프라인에서 호출하여 최신 기준선과 비교한다. P95 응답시간 10% 초과 또는 오류율 1% 초과 시 `release/perf-blocker` 태그를 생성하고 배포 단계를 중단한다.
- UAT 게이트: `UAT-Feedback` 프로젝트에서 Critical/High 미해결 티켓을 REST API로 조회해 존재할 경우 배포 작업을 실패 처리하고 담당자에게 Teams 웹훅 알림 발송.

### 4.2 자동 리포트 & 알림
- 배포 전: PowerShell 스크립트 `scripts/reports/Generate-ReleaseReadiness.ps1`을 실행해 테스트 통과율, 성능 지표, UAT 티켓 현황을 하나의 PDF로 생성 후 \\deploy\mcms\reports에 저장.
- 배포 후: OpenTelemetry Collector에서 수집한 초기 30분간의 오류율/응답시간을 nightly job이 비교해 5분 이내 알림(Teams + 이메일) 발송.
- 실패 시: Grafana OnCall 룰에 따라 운영 담당자 → 개발 리더 순으로 에스컬레이션한다.

### 4.3 롤백 트리거
- 텔레메트리 기반: 배포 후 15분 내 오류율이 기준선 대비 5%p 이상 상승하거나 CPU 사용률이 85% 지속 시 자동으로 `Invoke-Rollback.ps1` 실행.
- 사용자 피드백: `UAT-Feedback` 프로젝트에 생산 장애(Critical) 등록 시 파이프라인이 자동으로 `Rollback-Package` 단계를 오픈하고, 승인 후 즉시 이전 안정 버전을 배포.
- 수동 트리거: 운영 콘솔에서 `Rollback-Now` 명령을 실행하면 마지막 성공 배포 아티팩트를 재배포하고 관련 텔레메트리 이벤트를 Incident 티켓에 기록.

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

## 9. OpenTelemetry Collector & 백엔드 배포 가이드
- 토폴로지: 각 서버(Local Agent Collector) → 중앙 Collector(고가용성 2노드) → 백엔드(Elastic APM, Grafana Tempo/Loki 등).
- Collector 설치: Windows Service 모드, `otelcol-contrib` MSI + 공통 구성 템플릿 `configs/otel/collector.yaml` 배포.
- 입력 파이프라인: OTLP gRPC(4317), OTLP HTTP(4318), Windows PerfCounter Receiver(옵션) 활성화.
- 출력 파이프라인: Tempo/Jaeger(Traces), Prometheus Remote Write or Elastic Ingest(Metrics), Loki/Elastic(Log Exporter).
- 구성 관리: Ansible/PowerShell DSC로 Collector 버전 및 파이프라인 일관성 유지, 변경 시 GitOps PR 리뷰 필수.
- 보안: mTLS 인증서(사내 CA) 적용, 서비스 계정 `svc_mcms_otel` 최소 권한, 방화벽 포트 화이트리스트.
- 백엔드 운영: Elastic APM 사용 시 Index Lifecycle Policy 설정(핫 7일/웜 30일/콜드 90일), Grafana Tempo/Loki 사용 시 Object Storage(S3 compatible) 버킷 할당 및 Retention(Trace 14일, 로그 30일) 정의.

## 10. 이상 탐지 및 알림 플로우
- 기준: SLO 메트릭(`http.server.duration`, `queue.process.duration`, `command.execution.duration`, 오류율)을 기반으로 한 Adaptive Threshold(Alert rules in Grafana/Elastic ML jobs).
- 워크플로우:
  1. Collector → Backend로 메트릭 전송.
  2. Backend Alert Engine에서 이상 감지 시 Teams Webhook으로 1차 통보.
  3. 10분 내 미확인 시 OpsGenie/On-call SMS escalate.
  4. 알림 수신자는 Runbook(`docs/runbooks/observability.md`)에 따라 1차 진단 후 Jira Incident 생성.
- 로그 기반 이상탐지: Loki/Elastic Watcher로 `severity=error` 5분 내 10건 이상 감지 시 동일 플로우 적용.
- 주기적 검증: 월 1회 Chaos Test 후 Alert 라인 정상 작동 여부 확인, 결과는 운영 회의록에 기록.
