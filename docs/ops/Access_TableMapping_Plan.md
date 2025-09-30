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

# Access Table Mapping 준비 가이드 (S90)

## 1. Access DB 확인 절차
1. 파일 탐색기에서 `C:\Users\syyun\Documents\GitHub\MCS\DB.accdb` 더블 클릭
2. Access가 열리면 상단의 **테이블** 목록을 확인 (왼쪽 탐색 창). 필요한 테이블이 없는 경우 새로 생성
3. 보안 경고가 뜨면 “콘텐츠 사용”을 눌러 편집 가능 상태 유지

## 2. 주요 테이블 요구 사항 (기존 SQL Server 기준)
| 도메인 | 필수 컬럼 | 타입(Access) | 비고 |
| --- | --- | --- | --- |
| Items | Id (AutoNumber), ItemCode(Text64), Name(Text128), CreatedAt(Date/Time) | AutoNumber, Short Text, Short Text, Date/Time | ItemCode는 고유, 중복 금지 |
| ItemRevisions | Id, ItemId(Number), RevisionCode(Text32), CreatedAt | ItemId는 Items.Id 참조 |
| Routings | Id, ItemRevisionId(Number), RoutingCode(Text64), Status(Text32), CamRevision(Text32), CreatedAt | Status는 Lookup(예: Approved 등) |
| RoutingSteps | Id, RoutingId(Number), Sequence(Number), Machine(Text64), ProcessDescription(Memo), DurationMins(Number) | Sequence + RoutingId 조합 유일 |
| RoutingFiles | Id, RoutingId(Number), FileName(Text256), RelativePath(Text512), Checksum(Text128) | 파일 해시 저장 |
| HistoryEntries | Id, ItemId(Number), ChangeType(Text64), Field(Text128), OldValue(Memo), NewValue(Memo), ChangedAt(Date/Time) | |
| AuditLogEntries | Id, Category(Text64), Action(Text64), Summary(Text256), Details(Memo), MetadataJson(Memo), EventAt(Date/Time) | HistoryEntryId(Number, Null 허용) |
| AddinJobs | Id, Status(Text32), ParametersJson(Memo), ResultStatus(Text64), CreatedAt(Date/Time) | 큐 처리용 |
| AddinKeys | Id, Value(Text256), ExpiresAt(Date/Time) | 만료 인덱스 필요 |

> Access에서는 Memo=Long Text, AutoNumber=자동 증가. 텍스트 길이는 “필드 크기”에서 지정.

## 3. 필드 설정 팁
- **기본 키**: 각 테이블에 AutoNumber를 기본 키로 설정
- **인덱스**: `ItemCode`, `RevisionCode`, `RoutingCode` 등은 “인덱스 있음(예)”로 설정해 조회 성능 확보
- **관계**: Access의 “데이터베이스 도구 → 관계” 메뉴에서 FK 관계를 매핑 (예: ItemRevisions.ItemId → Items.Id)
- **타임스탬프**: Date/Time 필드는 Access 기본(초 단위). 밀리초가 필요하면 `Date/Time Extended` 사용

## 4. 초기 데이터 입력 (선택)
- 샘플 Item/Routing 데이터를 소량 입력하면 API 실행 시 Null 레퍼런스를 방지할 수 있음
- 각 테이블에 최소 1건씩 레코드를 생성 후 저장

## 5. 테스트 준비 체크리스트
- [ ] 모든 테이블이 생성 완료
- [ ] 기본 키/인덱스/관계 설정 완료
- [ ] `Items`, `ItemRevisions`, `Routings` 등 핵심 테이블에 샘플 데이터 입력
- [ ] Access 파일 저장 후 닫기 (API가 파일 잠금을 방지)

이후 단계 S91~S95에서 UI 리디자인 구현을 진행합니다.
