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

