# RequiresResync Alert Verification (2025-10-01)

## 목표
- Routing 파일 저장소와 meta.json 불일치 시 `RoutingMetaDto.requiresResync` 플래그 및 `OperationsAlertService` 경보가 정상 동작하는지 검증한다.

## 사전 준비
- `appsettings.json` 또는 환경 변수에서 `FileStorage:EnableObjectStorageReplica` 값을 `true`로 설정하고 `ObjectStorageReplicaPath`를 사내 공유 경로로 지정한다.
- 테스트용 Routing을 최소 1건 생성하고 파일 업로드 흐름이 정상 동작하는지 확인한다.

## 검증 절차
1. **CAS 파일 삭제**  
   - 대상 Routing의 `meta.json`이 가리키는 파일 중 하나를 로컬 저장소 또는 복제 경로에서 수동 삭제한다.  
   - 30초 이내에 `requiresResync=true`, `missingFiles` 목록이 포함된 `GET /api/routings/{id}/files` 응답이 수신되는지 확인한다.
2. **경보 확인**  
   - Loki 혹은 중앙 로그에서 `RoutingStorage` 카테고리 경고가 기록됐는지 조회한다.  
   - Grafana 로그 탐색기 또는 Slack/Teams 연동 채널에서 동일 이벤트가 전달됐는지 캡처한다.
3. **프런트엔드 확인**  
   - Explorer UI에서 해당 Routing 세부 정보 요청 시 경고 배지(향후 To-do)가 표시되는지, 네트워크 응답에 `requiresResync` 값이 포함되는지 확인한다.
4. **정상화**  
   - 누락된 파일을 복구(재업로드 또는 복사)한 뒤 `GET /api/routings/{id}/files` 호출 값이 `requiresResync=false`로 돌아오는지 확인한다.  
   - 캐시 만료를 위해 1분 이상 대기하거나, 필요 시 재동기화 API(추후 구현 예정)를 호출한다.

## 로그 기록
- `docs/logs/Timeline_2025-09-29.md`에 테스트 시간, 담당자, 경보 수신 채널을 기록한다.
- 장애/경보 캡처 이미지는 `artifacts/monitoring/requires-resync/` 폴더에 보관한다.

## 후속 조치
- 경보 미수신 시 `OperationsAlertService` 구성을 검토하고 Slack/Teams Webhook, Loki 파이프라인 설정을 점검한다.
- `missingFiles` 목록이 빈 배열로 반환되는 경우 meta.json 생성 로직과 CAS 복제 여부를 확인한다.
