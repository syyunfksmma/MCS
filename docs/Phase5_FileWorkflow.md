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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Phase 5 - 파일 및 네트워크 워크플로우 설계

## 1. 자동 폴더 생성 스크립트 설계
- 목적: Item/Rev/Routing 생성 시 W:\MCMS 구조를 자동으로 만들고 수작업 오류를 줄임.
- 구현 접근
  - PowerShell 모듈 `Create-MCMSRoutingStructure` 작성.
  - 입력: `ItemId`, `Rev`, `RoutingId`, `MachineId`, `FixtureId` 목록.
  - 동작: 존재 여부 확인 후 `Routings`, `MachinePackage/Machine`, `MachinePackage/Fixture` 디렉터리 생성.
  - 로깅: PowerShell Transcript + JSON 로그 (`logs\mcms_folder_{date}.json`).
  - 권한: AD 그룹(예: `MCMSEditors`)만 실행, `Test-Path`로 기존 파일 손상 방지.

## 2. 파일 수집·검증 파이프라인
- 업로드 흐름
  1. 사용자가 WPF 클라이언트에서 파일 선택 → API 호출(`/api/files/upload`).
  2. 서버가 임시 스테이징 폴더(`\\server\mcms_staging`)에 저장, 체크섬(SHA256) 계산.
  3. Worker가 W:\ 대상 경로로 이동, meta.json 갱신.
- 검증 체크리스트
  - 확장자 화이트리스트(.esp, .nc, .stl, .mprj, .gdml, .json).
  - 파일 크기 제한: 기본 4GB, 초과 시 관리자 승인 필요.
  - 체크섬 중복 감지 → 기존 버전 재사용 안내.
  - SolidWorks 파일은 FastAPI 모듈로 메타 추출(.sldprt/.sldasm → json) 후 첨부.

### 2.1 SMB 복사 vs Object Storage 업로드 비교
| 항목 | SMB 공유(기존 W:\) | Object Storage(MinIO/S3 등) |
| --- | --- | --- |
| 프로토콜 | SMB 3.0, Windows 통합 인증 | HTTP(S) + S3 API, 서명 기반 인증 |
| 지연/처리량 | LAN 내 고속 전송, WAN 시 성능 저하 | 다중 파트 업로드/다운로드, CDN 연계 용이 |
| 잠금/동시성 | 파일 잠금 필요, 일부 애플리케이션 충돌 위험 | 오브젝트 단위 버저닝, 최종 쓰기 승리 모델 |
| 권한 모델 | NTFS ACL 및 AD 그룹 연동 | IAM 정책, 버킷/프리픽스 기반 세분화 |
| 모니터링 | FSRM, Windows 이벤트 로그 | S3 통계, MinIO Prometheus 지표 |
| 레거시 호환 | 기존 CAM/NC 툴은 로컬 드라이브 매핑 사용 | SDK/CLI/게이트웨이 필요, 일부 툴 미지원 |

- **선택 전략**
  - CAM/NC 장비가 SMB 경로에 의존한다면 1차 저장은 SMB를 유지하고, 비동기 백그라운드에서 Object Storage로 복제(Geo-Replication/Backup)하는 하이브리드 방식을 사용.
  - 신규 웹/서비스 워크플로우는 S3 호환 API를 1차 대상으로 하여 글로벌 접근성과 버저닝, 라이프사이클 관리 이점을 활용.

### 2.2 콘텐츠 주소 기반(CAS) 레이아웃 및 중복 제거
- **저장 구조**
  - `cas/<알고리즘>/<checksum-prefix>/<checksum>/payload` 형태로 저장 (예: `cas/sha256/ab/cd/abcdef.../payload`).
  - 메타데이터 파일(`metadata.json`)에 원래 파일명, MIME 타입, 업로드자, 생성 시각 기록.
  - `refs/<routingId>/<rev>/<logicalName>.json` 파일에서 CAS 오브젝트를 참조하여 다중 참조 지원.
- **중복 제거(Deduplication)**
  - 업로드 시 SHA256 계산 → 동일 해시 존재 시 물리 파일 재사용, 참조 카운트만 증가.
  - 부분 파일 업데이트는 청크 단위 해시(`chunkSize` 기본 16MB)로 세분화하여 변경된 청크만 신규 저장.
- **무결성 보증**
  - 저장 전후에 해시를 재검증하고, Object Storage에서는 ETag(S3 멀티파트 시 MD5 집합)와 비교.
  - 워커는 CAS 경로와 meta.json 간 불일치 감지 시 재동기화 플래그를 설정하여 운영팀에 경보.

## 3. meta.json 규격 (v1)
```
{
  "routingId": "GT310001",
  "itemId": "Item_A",
  "rev": "Rev01",
  "camRev": "1.2.0",
  "validFrom": "2025-09-01T00:00:00Z",
  "validTo": null,
  "files": [
    { "type": "esprit", "name": "GT310001_esp.esp", "checksum": "...", "uploadedBy": "user1", "uploadedAt": "2025-09-18T03:00:00Z" },
    { "type": "nc", "name": "GT310001_main.nc", "checksum": "..." }
  ],
  "solidworks": {
    "linked": true,
    "file": "\\\\server\\solidworks\\Item_A\\Rev01.sldasm",
    "meta": "GT310001_swmeta.json"
  },
  "historyId": "HIST-20250918-001"
}
```
- JSON Schema: `schemas/meta_v1.json` 작성, 업로드 시 서버 검증에 사용.
- CAM Rev 이력 연결 위해 History ID 필드 포함.

## 4. Machine Package & CMD 서비스 연계
- Machine/Fixture 폴더는 기본 템플릿(mprj/gdml) 복사.
- CMD 서비스 명령 `Deploy-MachinePackage` 구현: MachineId, FixtureId, 대상 경로 전달.
- 배포 로그: CMD 서비스 → MSMQ → Worker → Routing 상태 업데이트.

## 5. 성능·모니터링
- 파일 이동: Robocopy /Copy:DATS /R:3 /W:5 사용 권장 (권한/타임스탬프 유지).
- 대용량 다운로드: Range 요청 + Response Caching, ETag 제공.
- 모니터링: Windows FSRM 용량 경고, Filebeat로 로그 수집, Kibana 대시보드 제공.

## 6. 대용량/중단 복구 업로드 지원
- **지원 프로토콜**
  - `tus.io` (HTTP PATCH 기반): 웹 클라이언트 및 서비스 간 표준 재시작 업로드.
  - `S3 Multipart Upload`: MinIO/S3 업로드에 사용, 5MB~5GB 청크 구성.
  - gRPC 스트리밍: WPF → API 게이트웨이 구간에서 저지연 전송 및 양방향 상태 업데이트.
- **API 계약 업데이트**
  - `POST /api/files/uploads` → 업로드 세션 생성, 응답: `uploadId`, `uploadUrl`, `resumeToken`, `chunkSize`.
  - `PATCH /api/files/uploads/{uploadId}` (`tus`) 또는 `PUT` 사전 서명 URL (`S3 multipart`)을 통해 청크 전송.
  - `POST /api/files/uploads/{uploadId}/complete` 시 서버가 모든 파트 검증 후 CAS에 커밋.
  - 실패/중단 시 `GET /api/files/uploads/{uploadId}` 호출로 진행률, 남은 청크 조회 및 재시작 가능.
- **워커 재개 로직**
  - 업로드 세션 메타에 현재까지 완료된 파트 리스트, 각 파트 체크섬(MD5/SHA256)을 저장.
  - 워커는 큐 메시지에 포함된 `missingParts` 정보를 기반으로 미완료 파트를 재요청.
  - 재시작 시 이전 파트 검증 후 성공 파트는 CAS 레지스트리(`casIndex`)에 커밋, 실패 파트는 삭제 후 재전송 요청.
  - 업로드 완료 후 워커가 최종 SHA256을 계산해 세션 해시와 비교, 일치 시 레퍼런스를 활성화.

## 7. 주니어 개발 메모
- PowerShell 스크립트 위치: `scripts/folder/`, `README_FolderScripts.md`로 사용 예시 제공.
- 스테이징 폴더 접근 권한 없으면 IT 티켓 템플릿(`docs/templates/AccessRequest.md`) 활용 예정.
- 모든 자동 작업은 `-DryRun` 스위치 지원, 적용 전 콘솔에서 결과 확인.

## 8. 오픈 이슈
- meta.json Schema 버전 관리 방식(예: v1, v1.1) 결정.
- Robocopy와 PowerShell `Copy-Item` 성능 비교 테스트 필요.
- CMD 서비스 배포 권한 (로컬 SYSTEM vs 도메인 서비스 계정) 확정.
- CAS 저장소에 대한 백업 전략 (Object Storage Cross-Region Replication vs. 오프사이트 테이프) 비교.
- 업로드 세션 정리 정책(30일 미완료 세션 자동 정리 등) 확정.


## 구현 메모 (2025-10-01)
- FileStorageService에 Object Storage replica 옵션(`EnableObjectStorageReplica`, `ObjectStorageReplicaPath`)을 추가해 로컬 CAS 쓰기 후 즉시 복제하도록 구성했습니다.
- 멀티파트 청크 업로드 세션이 완료될 때 누락된 파트를 감지하면 `MissingChunksException`을 발생시키고, API는 409 응답에 `missingParts` 배열을 포함해 재시도를 지시합니다.
