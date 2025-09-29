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
# MCMS 공유 드라이브 구조 설계 (Offline Deployment)

## 1. 루트 규칙
- 기본 UNC 경로는 `\\MCMS_SHARE`이며, 하위 폴더는 영문 소문자/숫자로만 구성한다.
- 모든 하위 폴더에는 `README.md` 또는 `index.txt`를 배치해 사용 목적과 책임 팀을 명시한다.
- 변경 이력은 `logs\changes\YYYY\MM\changes-YYYYMMDD.md`에 append 방식으로 기록한다.

```
\\MCMS_SHARE
├─installers
├─logs
├─config
├─scripts
├─staging
└─backups
```

## 2. installers
- `installers/<version>/` 폴더에 오프라인 패키지와 메타데이터를 적재한다.
- `package-offline.ps1`은 완료 시 자동으로 ZIP/manifest/hash 파일을 이 위치에 복사한다.
- 표준 구성
  - `MCMS_Setup_<version>.zip` 또는 `.exe`
  - `manifest.json`, `SHA256SUMS.txt`
  - `smoke_<runId>.json`, `smoke_<runId>.csv`
  - `README.txt` (재배포시 참고)
- 이전 버전 보존 정책: 최소 3개 릴리스, 이후 보관 서버로 이동.

예시
```
installers
└─2025.09.26
   ├─MCMS_Setup_2025.09.26.zip
   ├─manifest.json
   ├─SHA256SUMS.txt
   ├─smoke_20250926_103500.json
   └─smoke_20250926_103500.csv
```

## 3. logs
### 3.1 smoke 로그
- `logs/smoke/<environment>/<YYYY>/<YYYYMMDD>/` 구조를 따른다.
- `run-smoke.ps1`이 JSON/CSV/LOG 파일을 이 위치로 업로드한다.
- 예: `logs/smoke/InternalProd/2025/20250926/smoke_20250926_103500.log`

### 3.2 deployment 로그
- `logs/deploy/<YYYY>/<YYYYMMDD>/` 하위에 `install.log`, `rollback.log`, `summary.md`를 보관한다.
- 추가적으로 Phase10 Runbook에서 요구하는 온콜 보고서 템플릿을 `summary.md`에 포함한다.

### 3.3 기타 로그
- `logs/monitoring/` : Windows 이벤트 내보내기(EVTX), 성능 카운터 CSV.
- `logs/changes/` : 공유 드라이브 구조 변경/승인 문서 저장.

## 4. config
- `config/server/<hostname>/` : Node.js 서버 환경 변수 백업(.env), pm2 설정, 로그 스냅샷.
- `config/spn/` : SPN 등록 스크립트(`Register-SPN.ps1`), 검증 결과(`klist.txt`).
- `config/permissions/` : AD 그룹 ↔ MCMS 역할 매핑 문서 (`RoleMapping.xlsx`), 보안 검증 체크리스트.
- `config/certs/` : 사내 CA 인증서(.pfx, .cer)와 암호화된 암호 파일. 접근 권한은 보안팀 전용.

## 5. scripts
- `scripts/deploy/` : 패키지 배포, Install-MCMS.ps1, 서비스 재시작 스크립트.
- `scripts/tests/` : smoke, 회귀 테스트, k6 스크립트.
- `scripts/scheduler/` : 예약 작업 XML/JSON 정의(`TaskScheduler-*.xml`).
- 모든 스크립트는 버전 번호(예: `run-smoke.ps1@2025.09.26`) 심볼릭 링크 또는 파일명에 주석을 남긴다.

## 6. staging
- 빌드 서버가 생성한 중간 산출물을 임시로 보관.
- `staging/runtime/<version>/` : dotnet publish 결과.
- `staging/web/<version>/` : Next.js 빌드 결과.
- 스테이징 영역은 7일 주기로 정리하며, installers로 승격된 버전만 유지.

## 7. backups
- `backups/<YYYY>/<MM>/<DD>/` : 설치 이전 서버 스냅샷, config 백업.
- 윈도우 서비스 및 레지스트리 내보내기를 포함(`services.reg`, `mcms-service.json`).
- 백업 보존 기간: 최근 5회 배포분.

## 8. 운영 절차 연계
- `package-offline.ps1` 실행 후 manifest/로그를 installers와 logs/smoke에 업로드.
- 배포 Runbook 완료 시 `logs/deploy/.../summary.md`에 체크리스트 완료 여부 기록.
- Phase0 보안 메모 업데이트 시, 관련 증적(`config/spn`, `config/permissions`) 경로를 메모에 링크.

## 9. 접근 제어 정책
- `installers`, `logs`는 Ops/보안팀 읽기, DevOps 쓰기 권한.
- `config/certs`는 보안팀 전용(ACL 분리).
- 모든 폴더는 상속 제거 후 그룹(`MCMS_Ops`, `MCMS_Dev`) 단위로 권한 부여.

---
2025-09-26 Codex: 오프라인 배포 및 Windows 통합 인증 운영을 위한 공유 드라이브 레이아웃 최초 정의.

## 6. Environment Mapping
| Environment | Root Path | Notes |
| --- | --- | --- |
| DEV | \\DEV-MCMS\share | Sandbox; read/write for MCMS-Dev group |
| STAGE | \\STAGE-MCMS\share | Mirrors production layout; write restricted to Ops |
| PROD | \\MCMS_SHARE | Production authoritative store; access logged via audit scripts |

- 각 환경은 `config/env/<env>-mapping.json`에 루트 경로와 권한 정보를 명시한다.
- Stage/Prod 전환 시 `register-package-offline.ps1`가 해당 매핑을 읽어 대상 경로에 복사한다.

