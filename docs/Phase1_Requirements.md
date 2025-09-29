# Phase 1 - 상세 요구사항 및 데이터 모델링

## 1. 사용자 여정 상세화
| 여정 | 주요 사용자 | 선행 조건 | 핵심 단계 | 산출물/시스템 반응 |
| --- | --- | --- | --- | --- |
| 메인 창 조회 | 생산기술 엔지니어, 품질 담당 | MCMS 로그인 완료, 권한 부여 | 1) 품목 검색/필터 → 2) Rev 트리 확장 → 3) Routing 선택 → 4) SolidWorks 매칭 상태 확인 | 품목/Rev 기본 정보, Routing 요약, SolidWorks 링크 상태 표시 |
| Routing 생성/편집 | CAM 프로그래머 | 대상 품목/Rev 존재, 편집 권한 | 1) Routing 생성 클릭 → 2) 공정 순번/설비 입력 → 3) 파일 업로드(Esprit/NC/WP 등) → 4) Esprit 실행 트리거 → 5) 저장 및 승인 요청 | 신규/수정 Routing, 파일 버전 기록, 승인 워크플로우 알림 |
| Mapper 관리 | 데이터 관리자 | Routing 존재, 파일 경로 접근 가능 | 1) Routing 선택 → 2) 파일 매핑(실제 파일명, 경로) 입력 → 3) 자동 검증(파일 존재 여부) → 4) 저장 | FileMapper 엔트리 갱신, 누락/중복 검증 로그 |
| 이력 조회 | 품질 담당, 관리자 | 품목/Rev 또는 CAM Rev 선택 | 1) 이력 필터(기간, 사용자) 지정 → 2) 타임라인/리스트 확인 → 3) 상세 변경 내용 비교 → 4) 필요 시 승인 상태 확인 | 이력 타임라인, 변경 상세(필드 변화, 파일 체크섬) 표시 |
| 권한/승인 관리 | 관리자, 품질 책임 | 사용자 AD 그룹 연동 완료 | 1) 사용자/그룹 선택 → 2) 역할(View/Edit/Approve) 배정 → 3) 승인 플로우 정의 → 4) 기록 저장 | 권한 매트릭스 적용, 감사 로그 |

### 좌측 ERP View Table 구성
- 위치: 메인 창 좌측 패널 상단에 고정된 ERP View Table을 추가해 작업할당 관리 중 "다음 작성할 프로그램 대상" 품목을 리스트업한다.
- 표 컬럼: `Item_CD`, `착수상태`(착수/미착수/Null), `Res_CD`, `우선순위`, `최근 업데이트` 최소 필드를 제공하고, 추가 필드는 승인 후 확장한다.
- 데이터 기준: ERP View 테이블은 사내 ERP View에서 읽어온 작업할당 대기 데이터만을 노출하며, 착수 상태는 Null 포함 원본 값을 그대로 표시한다.
- 상호작용: 좌측 상단에 컬럼별 드롭다운 정렬(오름차순/내림차순)과 상태 필터를 제공하여 품목 탐색을 가속화한다.
- 연계: 테이블 행 선택 시 우측 상세 패널이 해당 Item/Rev 컨텍스트로 전환되고, SignalR을 통해 다중 사용자 선택 상태를 공유한다.

## 2. CRUD 규칙 및 검증 로직
### 2.1 Item
- Create: ItemID는 사내 ERP 번호 사용, Rev 최소 1개 필요, 생성 시 기본 상태 `Draft`.
- Read: 품목 리스트는 검색/필터(품목명, 공정타입) 지원, Rev 포함 계층 조회.
- Update: Rev 추가 시 이전 Rev `ValidTo` 자동 설정; 품목명 변경은 품질 승인 필요.
- Delete: 논리 삭제만 허용, 기존 Routing/History 있으면 삭제 불가.

### 2.2 Routing
- Create: 동일 Item/Rev 내 Seq 중복 금지, 설비/공정 설명 필수, 최소 1개 파일 매핑 필요.
- Read: 상태(초안/승인/폐기) 필터 제공, Esprit 실행 결과 상태(성공/실패) 표시.
- Update: 공정 수정 시 CAM Rev 자동 증가, 변경 내용 히스토리 기록.
- Delete: 승인 상태 Routing은 폐기 상태 처리, CAM Rev 보전.

### 2.3 FileMapper
- Create: RoutingID 외래키 필수, 파일 경로는 W:\ 구조 준수, 확장자 Validation(esp/nc/stl/mprj/gdml/json).
- Read: 최신 버전 우선, 이전 버전 조회 시 이력 링크 제공.
- Update: 파일 변경 시 체크섬 비교, 동일 파일이면 버전 증가 없음.
- Delete: Routing 폐기 시 함께 비활성화 처리(논리 삭제).

### 2.4 History
- Create: CRUD 이벤트마다 자동 생성, ChangedBy는 AD 계정, CAM Rev 기록.
- Read: 기간/사용자/Rev 필터, 변경 Diff(이전/이후 값) 제공.
- Update/Delete: 허용 안 함.

## 3. 권한 매트릭스 (예시)
| 역할 | 설명 | View | Edit | Approve |
| --- | --- | --- | --- | --- |
| Viewer | 생산 현장 참고용 | O | X | X |
| Editor | CAM 프로그래머 | O | O | X |
| Approver | 품질/공정 책임 | O | 제한적(코멘트) | O |
| Admin | 시스템 관리자 | O | O | O + 권한 관리 |

- 승인 흐름: Editor가 Routing 저장 → Approver 검토/승인 → 승인 시 상태 변경 및 배포 가능.
- 승인 거절 시 수정 요청 기록, History에 사유 남김.

## 4. 네트워크 폴더/메타데이터 스키마
```
W:\
└─ MCMS
   └─ {ItemID}
      └─ {Rev}
         ├─ Routings
         │  └─ {RoutingID}
         │     ├─ espritfile.esp
         │     ├─ ncfile.nc
         │     ├─ wpfile.stl
         │     ├─ meta.json (Routing 메타데이터)
         │     └─ ... (추가 파일)
         └─ MachinePackage
            ├─ Machine
            │  └─ {MachineID}
            │     └─ machine.mprj
            └─ Fixture
               └─ {FixtureID}
                  └─ fixture.gdml
```
- `meta.json` 필드(초안): RoutingID, ItemID, Rev, CAMRev, ValidFrom, ValidTo, 파일 목록(파일명, 체크섬, 업로더), SolidWorks 모델 참조.
- 파일명 규칙: `{RoutingID}_{파일타입}.{ext}` 권장, 변경 시 FileMapper에 기록.

## 5. API 계약 초안 (REST 기준)
| Endpoint | Method | 요청 필드 | 응답 | 권한 |
| --- | --- | --- | --- | --- |
| `/api/items` | GET | `filter`, `page`, `size` | Item 리스트 + Rev 요약 | Viewer 이상 |
| `/api/items` | POST | ItemID, Name, CreatedBy | 생성 Item | Editor 이상 + Approver 승인 대기 |
| `/api/items/{itemId}/revs` | POST | Rev, EffectiveDate | 신규 Rev, 이전 Rev 종료 | Editor |
| `/api/routings` | GET | `itemId`, `rev`, `status` | Routing 리스트 | Viewer 이상 |
| `/api/routings` | POST | ItemID, Rev, Seq, Machine, ProcessDesc, Files[] | 생성 Routing (Draft) | Editor |
| `/api/routings/{id}` | PUT | ProcessDesc, Files[], TriggerEsprit | 수정 Routing, CAMRev 증가 | Editor |
| `/api/routings/{id}/approve` | POST | Approve=true/false, Comment | 상태 업데이트, 이력 생성 | Approver |
| `/api/filemapper/{routingId}` | GET | - | 파일 매핑 정보 | Viewer 이상 |
| `/api/filemapper/{routingId}` | PUT | Files[] (경로, 타입) | 갱신된 매핑 | Editor |
| `/api/history` | GET | `itemId`, `rev`, `camRev`, `dateRange` | 이력 항목, 타임라인 | Viewer 이상 |
| `/api/permissions` | PUT | User/Group, Role | 권한 매핑 갱신 | Admin |
| `/api/solidworks/link` | POST | ItemID, SwFilePath | SolidWorks ↔ MCMS 링크 생성, 상태 반환 | Editor |
| `/api/esprit/execute` | POST | RoutingID, Parameters | 실행 상태(대기/성공/실패) | Editor |

- 공통 규칙: 모든 요청은 JWT + AD 인증 토큰 필요, 응답에 `traceId` 포함.
- 파일 업로드는 `/api/files/upload` (POST, multipart) 별도 설계 예정, CMD 서비스와 연동하여 내부망 전송.

## 6. 후속 검토 필요 사항
- SolidWorks/Esprit 버전별 API 차이 상세 분석.
- meta.json 스키마 확정 및 JSON 스키마 검증 도입 여부.
- CMD 서비스 명령 세트 정의(파일 배포, 서비스 재시작 등).

> 상기 내용은 Phase 1 산출물 초안이며, Product Owner 및 관련 워킹그룹 검토를 거쳐 확정합니다.
## 7. 2025-09-29 UX Requirement Workshop Summary
| Persona | Key Goals | Pain Points | Updated Journey Touchpoints |
| --- | --- | --- | --- |
| CAM Programmer | Release NC programs quickly with traceable approvals | Manual file copies, unclear SLA status | Added Routing Dashboard quick links + SLA badge in ExplorerShell |
| Quality Inspector | Verify routing changes with full context | Difficult diff review, missing auth trail | History timeline filters + inline compare modal |
| Production Supervisor | Monitor offline package readiness | No proactive alerts, siloed smoke logs | Notifications panel + smoke CI status in dashboard |

- Consolidated 18 backlog items into three journey maps; archived duplicate legacy Explorer requests.
- Captured journey diagrams in docs/design/Phase1_JourneyMap.v1.png (exported from Figma, referenced in Sprint5 docs).
- Added acceptance criteria to Sprint 5 explorer backlog: SLA badge visibility, package status, pending approvals.

### Revision History Update
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Added UX workshop summary and journey touchpoints for Phase 1 checkbox completion |
