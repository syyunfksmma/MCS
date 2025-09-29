> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
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
# Observability Data Flow

## Overview
MCMS 서비스 계층에서 발생한 Telemetry(Trace/Metric/Log)가 Collector와 백엔드를 거쳐 대시보드, 경고 채널로 전달되는 흐름을 설명한다.

## Sequence
1. **애플리케이션 계층**
   - `MCMS.Api`는 OpenTelemetry SDK를 통해 HTTP 요청/응답 Span과 관련 메트릭을 생성한다.
   - `MCMS.Workers`는 큐 처리 Span과 외부 시스템 호출에 대한 하위 Span을 기록하고, 처리 시간/오류율 메트릭을 내보낸다.
   - `MCMS.CmdHost`는 명령 실행 단계별 Span과 구조적 로그(Trace/Span ID 포함)를 출력한다.
2. **로컬 Collector(Agent)**
   - 각 서버에 배치된 OpenTelemetry Collector가 OTLP 포트를 통해 Trace/Metric/Log를 수신한다.
   - 수신한 데이터는 Batch Processor를 거쳐 중앙 Collector로 전송된다.
3. **중앙 Collector**
   - 고가용성 Collector 노드가 데이터 유형별 Exporter(Tempo, Prometheus Remote Write, Loki/Elastic)를 호출한다.
   - 실패 시 Retry 큐에 적재하여 데이터 손실을 최소화한다.
4. **관측 백엔드**
   - **Grafana Tempo / Elastic APM**: Trace 저장 및 분석, Service Map 자동 구성.
   - **Prometheus / Elastic Metrics**: SLO 관련 메트릭을 집계, Alert Rule을 평가.
   - **Grafana Loki / Elastic Logs**: 구조 로그를 인덱싱하여 Trace와 상호 참조한다.
5. **대시보드 & 알림**
   - Grafana에서 Trace/Metrics/Logs를 단일 Observability 대시보드로 시각화한다.
   - Alert Rule이 위반되면 Teams Webhook → OpsGenie SMS 순으로 Escalation이 이루어진다.
   - Incident Runbook과 연계하여 조치 사항을 추적한다.

## Mermaid Diagram
```mermaid
graph TD
  subgraph Services
    API[MCMS.Api]
    Worker[MCMS.Workers]
    CmdHost[MCMS.CmdHost]
  end
  subgraph LocalAgent
    Agent[OTel Collector (Agent)]
  end
  subgraph Central
    CentralCollector[OTel Collector (Cluster)]
  end
  subgraph Backends
    Tempo[Tempo / Elastic APM]
    Metrics[Prometheus RW / Elastic Metrics]
    Logs[Loki / Elastic Logs]
  end
  subgraph Consumers
    Grafana[Grafana Dashboards]
    Alerts[Teams / OpsGenie Alerts]
  end

  API -->|OTLP| Agent
  Worker -->|OTLP| Agent
  CmdHost -->|OTLP| Agent
  Agent -->|Batch OTLP| CentralCollector
  CentralCollector -->|Traces| Tempo
  CentralCollector -->|Metrics| Metrics
  CentralCollector -->|Logs| Logs
  Tempo --> Grafana
  Metrics --> Grafana
  Logs --> Grafana
  Metrics --> Alerts
  Logs --> Alerts
```

