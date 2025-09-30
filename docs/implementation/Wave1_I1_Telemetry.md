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

# Wave1 I1 Telemetry & Logging 설계

## 이벤트 정의
| Event Name | Trigger | Properties |
|------------|---------|------------|
| routing.wave1.upload.start | 업로더 드래그/파일 선택 즉시 | fileCount, totalSize, userId |
| routing.wave1.upload.chunk | 각 청크 업로드 성공 시 | chunkIndex, chunkSize, elapsedMs |
| routing.wave1.upload.fail | 업로드 실패 시 | errorCode, retryCount, lastChunkIndex |
| routing.wave1.upload.complete | 모든 청크 업로드 완료 시 | totalChunks, totalDurationMs |

- Application Insights customEvents 사용, operationId = routingUploadId.
- 실패 이벤트 발생 시 severityLevel=3 이상으로 설정하여 Alert 대상에 포함.

## 로깅 파이프라인
- 프론트: TelemetryClient.trackEvent 활용, offline 모드에서는 큐에 저장 후 재전송.
- 백엔드: /api/routing/uploads/log 엔드포인트에서 Aggregation 수행 후 Serilog sink(Logstash)로 전송.
- Loki: monitoring/promtail/config.mcms.yaml에 routing_upload 파이프라인 추가.

## Alert/대시보드
- 실패율 5% 이상 시 Ops Pager 알림.
- 평균 업로드 시간 2분 초과 시 성능 경고.
- 대시보드 위젯: 업로드 성공율, 평균 청크 크기, 네트워크 오류 분포.

## TODO
- [ ] Telemetry helper (useRoutingUploadTelemetry.ts) 설계.
- [ ] Backend aggregation DTO 정의 (RoutingUploadLog).
- [ ] Loki 파이프라인 샘플 로그 작성.
- [ ] Alert 규칙 YAML 초안 (monitoring/alerts/mcms_routing_upload.yaml).
