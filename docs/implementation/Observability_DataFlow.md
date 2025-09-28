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
