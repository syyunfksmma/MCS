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
# Phase 6 산출물 - Add-in Control Panel 계획

## 1. 패널 구조
- 위치: Routing Workspace 우측 탭 또는 Drawer
- 섹션
  1. 현재 큐 상태 (최근 N건)
  2. 작업 상세 (선택된 Job)
  3. 실행/재시도/취소 버튼
  4. 로그 탭 (Worker/History 링크)

## 2. 기능 요건
- ESPRIT Add-in 큐 목록: `GET /api/addin/jobs?status=...`
- Job 재시도: `POST /api/addin/jobs/{jobId}/retry`
- Job 취소: `POST /api/addin/jobs/{jobId}/cancel`
- API 키 재발급: Admin 권한, `/api/addin/keys/renew`
- SignalR 이벤트 수신 → 큐/상태 실시간 업데이트

## 3. UX/피드백
- 작업 상태 배지 + 마지막 메시지 표시
- 재시도 시 Confirm Dialog, 실패 시 오류 코드 노출
- 오프라인 감지: Add-in 연결 끊김 배너
- Add-in 결과에 따른 알림/로그 패널 연동

## 4. 성능 고려
- Polling fallback: 10초 간격
- 큐 데이터 캐싱: React Query, staleTime 5초
- 페이징: 최근 20건만 표시, 더보기 버튼

## 5. TODO
- Retry/Cancel API 확정 (백엔드 협의)
- Add-in 로그 보존 기간 정책 확인
- Panel 레이아웃(Wide/Drawer) 최종 결정

