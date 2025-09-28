# Phase 7 - 성능 및 신뢰성 계획

## 1. 주요 성능 지표
- Routing 목록 조회: 500건 이하 로딩 3초 이내.
- 파일 업로드 처리량: 동시 5건 처리 시 평균 10MB/s 이상 유지.
- Esprit 실행 큐 대기 시간: 2분 이내 시작.
- History 조회: CAM Rev 200개 기준 2초 이내.

## 2. 벤치마크 전략
- WebAPI 부하 테스트: k6 스크립트 작성(`k6/scripts/routing_list.js`).
- 파일 업로드 스트레스: PowerShell 병렬 업로드(`scripts/tests/Upload-Stress.ps1`).
- CMD 명령 처리: Worker 큐에 100개 명령 투입 후 처리 시간 측정.

## 3. 캐싱/튜닝 포인트
- DB: Routing/History 조회용 인덱스 (`ItemId+Rev`, `CamRev`, `ChangedAt`).
- API: Response Caching (Item/Rev 트리), ETag 사용.
- 클라이언트: 로컬 캐시 TTL 6시간, 변경 감지 시 무효화.
- Worker: MSMQ Prefetch 10건, Retry 3회.

## 4. UI 성능
- 백그라운드 Prefetch: `VirtualizingCollectionView`의 `LoadMoreItemsAsync` 호출 전에 인접 페이지(±1) 비동기 미리 불러오기, UI 스레드는 `Dispatcher.InvokeAsync`로 최소화.
- 캐시 무효화 Hook: API WebSocket/SignalR 이벤트 수신 시 `IncrementalLoadingCollection.RefreshAsync` 호출하여 트리/그리드 바인딩 갱신.
- KPI: Item/Rev 트리 스크롤 1000건 기준 120ms 이하 프레임 유지, Routing 그리드 페이지 전환 200건 로드 < 500ms, 가상화 Hit Ratio 90% 이상.

## 5. 대용량 파일 처리
- Chunked Upload (업로드 시 100MB 조각) 옵션 검토.
- 다운로드는 Range 지원, 실패 시 재시도 안내.
- 파일 I/O 모니터링: Windows Performance Counter (SMB Sessions, Disk Queue).

## 6. 장애 대응
- Esprit/ SolidWorks 장애 시 재시도 로직 + 관리자 알림 이메일.
- Worker 다운 시 자동 재시작(Windows Service Recovery), 큐 메시지 보존.
- DB 장애 대비: SQL Server Log Shipping + Failover 문서화.

## 7. 테스트 일정
| 주차 | 항목 |
| --- | --- |
| Week 3 | 초기 부하 테스트, 캐시 튜닝 |
| Week 4 | 파일 스트리밍/업로드 성능 검증 |
| Week 5 | End-to-End 워크플로우 스트레스 테스트 |

## 8. 모니터링 대시보드
- Grafana/Elastic: API 응답시간, 오류율.
- Windows Server PerfMon 템플릿: Disk IO, Network.
- CmdHost 로그: 처리 건수, 실패율 시각화.

## 9. 남은 과제
- k6 실행 환경(내부망) 마련.
- Grafana vs Kibana 대시보드 선택.
- 자동 알림(Email/SMS) 채널 확정.
