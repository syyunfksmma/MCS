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

## 6. 주니어 개발 메모
- PowerShell 스크립트 위치: `scripts/folder/`, `README_FolderScripts.md`로 사용 예시 제공.
- 스테이징 폴더 접근 권한 없으면 IT 티켓 템플릿(`docs/templates/AccessRequest.md`) 활용 예정.
- 모든 자동 작업은 `-DryRun` 스위치 지원, 적용 전 콘솔에서 결과 확인.

## 7. 오픈 이슈
- meta.json Schema 버전 관리 방식(예: v1, v1.1) 결정.
- Robocopy와 PowerShell `Copy-Item` 성능 비교 테스트 필요.
- CMD 서비스 배포 권한 (로컬 SYSTEM vs 도메인 서비스 계정) 확정.
