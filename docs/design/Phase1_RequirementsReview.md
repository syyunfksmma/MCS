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
# Phase 1 - 요구 워크숍 및 PRD 리뷰 결과 (2025-09-19)

## 절대 조건 확인
- 각 단계는 승인 후에만 진행한다. ✅ (사용자 승인: 2025-09-19)
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다. ✅ (PRD_MCS.md 점검 완료)
- 오류 발견 시 수정 전에 승인 재요청한다. ✅ (추가 오류 없음)
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다. ✅ (직전 빌드/테스트 통과 확인)
- 모든 단계 작업은 백그라운드 방식으로 수행한다. ✅
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다. ✅
- Task list 불릿 항목을 하나씩 점검하며 문서를 업데이트 한다. ✅ 완료된 항목은 불릿 끝에 `(완료 YYYY-MM-DD, 담당자)`로 남긴다.

## 1. 워크숍 참석자 (가상)
| 역할 | 이름 | 주요 관심사 |
|---|---|---|
| 제품 책임자 | 김하나 | 승인 리드타임 단축, 온보딩 가이드 |
| 시니어 프로그래머 | 이도현 | Add-in 자동화, API 안정성 |
| 주니어 CAM 엔지니어 | 박지훈 | 트리 UI 사용성, 단계별 안내 |
| Add-in 운영자 | 최수진 | API 키 재발급, 팝업 자동입력 |
| IT 인프라 | 윤상민 | 동시 사용자 성능, 보안 정책 |

## 2. 요구 정리 요약
- **트리 UI**: 품목 → Revision → Routing → 파일 계층, 색상 배지로 상태 표시, Drag/Drop은 차기 과제로 보류.
- **라우팅 자동화**: 초기 릴리스는 수동 입력 + 추천 목록(ML/규칙 혼합). 추천 점수와 근거 필수.
- **Add-in 연동**: 팝업 기본값은 API 전달 값, 수정 시 “MCMS에 저장” 버튼. API 키 만료(24h) 시 재발급.
- **파일 관리**: W:\ 구조 유지, meta.json에 checksum/버전/업로더 기록. 업로드 시 자동 검증.
- **권한/승인**: Viewer/Editor/Approver/Admin 4단계. 승인 완료 시 Worker가 Add-in에 실행 메시지 전달.
- **성능 목표**: 트리 조회 1초 이내, Add-in 호출 500ms 이하, 동시 10명 기준.

## 3. 데이터 모델 확정 (초안)
`
Item (ItemId PK, ItemCode, Name, Description, CreatedBy, CreatedAt, IsDeleted)
ItemRevision (RevisionId PK, ItemId FK, RevisionCode, Status, ValidFrom, ValidTo, CreatedBy, CreatedAt, IsDeleted)
Routing (RoutingId PK, RevisionId FK, RoutingCode, Status, CamRevision, IsPrimary, CreatedBy, CreatedAt, UpdatedBy, UpdatedAt, IsDeleted)
RoutingStep (StepId PK, RoutingId FK, Sequence, Machine, ProcessDescription, ToolInfo, Notes, IsDeleted)
RoutingFile (FileId PK, RoutingId FK, FileType, FileName, RelativePath, FileSize, Checksum, IsPrimary, UploadedBy, UploadedAt, IsDeleted)
HistoryEntry (HistoryId PK, RoutingId FK, ChangeType, Field, PreviousValue, CurrentValue, Outcome, CreatedBy, CreatedAt, Comment)
ApiKey (KeyId PK, Owner, ValueHash, ExpiresAt, CreatedAt)
AddinParameter (ParamId PK, ScopeType, ScopeId, Name, Value, Version, UpdatedAt)
`
- 모든 엔터티에 감사 필드 도입, soft delete(IsDeleted) 기본 정책.
- meta.json은 RoutingFile + HistoryId 매핑, 체크섬 포함.

## 4. 주요 데이터 흐름
1. **품목 등록**: Web UI → MCMS API → DB 저장 → History 기록 → 트리 자동 업데이트
2. **라우팅 작성/추천**:
   - 사용자가 라우팅 초안 저장 → Worker 큐잉 → ML/규칙 엔진 추천 목록 생성 → UI에 표시
3. **승인 & Add-in**:
   - 시니어 검토 후 “승인 요청” → Approver 승인 → Worker가 Add-in 큐에 메시지 전송 → Add-in이 최신 파라미터/키를 API에서 받아 팝업 자동 입력 → ESPRIT 실행
4. **파일 관리**:
   - UI에서 파일 업로드 → API가 W:\ 경로 저장 및 checksum/meta.json 업데이트 → UI/History 갱신
5. **API 키 갱신**:
   - Admin이 포털에서 재발급 → Add-in에서 “값 새로고침” 눌러 최신 키 수신 → 만료 시 알림 배지

## 5. 오픈 이슈
- ML 추천 알고리즘: XGBoost vs AutoML 최종 결정
- 트리 Drag/Drop 기능의 1차 릴리스 포함 여부
- Add-in 오프라인 모드 오류 처리 정책
- 권한 UI 설계 (개인/그룹 동시 할당 가능성)

## 6. 다음 단계 요청
- docs/Tasks_MCS.md 설계 섹션 1번 체크
- 설계 2번(Next.js UI 와이어프레임) 진행 승인 요청 예정


