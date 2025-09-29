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
# Phase 4 - W:\\ 공유 드라이브 구조 매핑 다이어그램 (2025-09-19)

## 절대 조건 확인
- 각 단계는 승인 후에만 진행한다. ✅
- 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 선제적으로 파악한다. ✅ (Phase1~3 문서 및 PRD 확인)
- 오류가 발견되면 수정 전에 승인 재요청한다. ✅ (현재 오류 없음)
- 이전 단계 오류가 없음을 확인한 뒤 다음 단계 승인을 요청한다. ✅ (빌드/테스트 성공 상태)
- 모든 단계 작업은 백그라운드로 수행한다. ✅
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 후 진행한다. ✅
- Task list 체크박스를 하나씩 업데이트하면서 문서를 업데이트 한다. ✅
- 모든 작업은 문서로 남긴다. ✅

## 1. W: 드라이브 디렉터리 구조
`
W:\\MCMS
 ├─ Item_A
 │   ├─ Rev01
 │   │   ├─ Routings
 │   │   │   ├─ GT310001
 │   │   │   │   ├─ espritfile.esp
 │   │   │   │   ├─ ncfile.nc
 │   │   │   │   ├─ wpfile.stl
 │   │   │   │   ├─ meta.json
 │   │   │   │   └─ GT310002 (하위 라우팅 폴더)
 │   │   ├─ MachinePackage
 │   │   │   ├─ Machine
 │   │   │   │   └─ GT3100
 │   │   │   │       └─ machine.mprj
 │   │   │   └─ Fixture
 │   │   │       └─ chuck
 │   │   │           └─ fixture.gdml
 │   │   └─ Logs
 │   │       └─ routing_actions.log
 │   └─ Rev02 (동일 구조)
 └─ Item_B ...
`

## 2. 메타데이터 매핑
| 경로 | meta.json 주요 필드 | 설명 |
|---|---|---|
| Routings/{RoutingId}/meta.json | RoutingId, ItemId, Revision, CAMRev, Files[], HistoryId | 라우팅 버전 관리, checksum, 업로더 정보 |
| MachinePackage/Machine/{MachineId}/machine.mprj | MachineId, LastUpdated | ESPRIT 머신 프로젝트 파일 |
| MachinePackage/Fixture/{FixtureId}/fixture.gdml | FixtureId, Version | 고정구 데이터 |
| Logs/routing_actions.log | Timestamp, User, Action | 승인/실행 로그 (옵션) |

## 3. 유지 관리 정책
- 폴더/파일 생성은 MCMS API를 통해 스크립트 자동화 (Phase 5 파일 워크플로우 참고)
- meta.json은 항상 최신 checksum/버전/히스토리 ID 동기화
- 불필요 파일은 Archive 폴더로 이동, 물리 삭제는 관리자가 승인 후 실행
- 권한: Item 폴더별 ACL(주니어 Read, Editor Write, Approver/Admin Full)

## 4. 도식화 안내
- 상세 다이어그램은 추후 draw.io(Figma)로 작성 → docs/design/figma_links.md에 링크 기록 예정


