# Phase 7 산출물 - Logging & Monitoring 계획

## 1. 감사 로그
- 대상 이벤트: 사용자/역할 변경, API 키 발급/폐기, Feature Flag 변경, Add-in 파라미터 수정
- 저장 위치: SQL `AuditLogs` 테이블 + Elasticsearch 인덱스
- UI: 필터(사용자, 날짜, 이벤트 타입), CSV Export, 상세 모달
- 보존 정책: 1년 기본, 필요 시 아카이브

## 2. 모니터링 뷰
- 메트릭: API 응답시간, Add-in 실패율, SignalR 연결 수, 큐 길이
- 대시보드: Grafana(사내), Admin Console에서 임베드 or 링크
- 경보: 이상치 감지 시 Teams 알림, OpsGenie 티켓 생성

## 3. 보안/접근
- 감사 로그 열람: Admin 전용, Export 시 이유 입력
- 모니터링 대시보드: Viewer Read-only, 설정 변경은 Admin/Infra
- 로그 마스킹: 개인정보/민감 정보 제거

## 4. TODO
- 감사 로그 Schema 확정 (TraceId, RequestId 포함)
- Grafana 권한 모델 사전 협의
- Alert Rule 템플릿 작성
