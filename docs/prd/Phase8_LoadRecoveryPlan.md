# Phase 8 산출물 - 부하/회복 테스트 계획

## 1. 부하 테스트
- 도구: k6 (사내 실행), JMeter 보조
- 시나리오
  1. Explorer SSR 요청 300→500 rps 부담
  2. Routing Workspace API 호출(단계 변경) 100 동시 사용자
  3. Add-in 이벤트 폭주(Worker 결과 50rps)
- 지표: 응답시간, 에러율, CPU/메모리, SignalR 연결 유지 수
- 성공 기준: 에러율 1% 이하, 평균 응답 1초 이내

## 2. 회복 테스트(Chaos)
- 시나리오
  - Node 프로세스 강제 종료 → PM2/NSSM 재시작 확인
  - SignalR 허브 재시작 → 클라이언트 재연결 확인
  - API 지연(2000ms) 주입 → UI fallback
- 도구: Chaos Toolkit 또는 수동 스크립트
- 로그 검증: 재시작/알람이 Ops 팀에 전달되는지 확인

## 3. 보고/피드백
- 테스트 결과를 Grafana 대시보드 + Confluence 요약
- 문제 발견 시 Phase 9 QA backlog 추가

## 4. TODO
- k6 테스트 데이터(토큰) 준비
- Chaos 스크립트 운영 승인 확보
- 회복 지표(Mean Time to Recovery) 목표 확정
