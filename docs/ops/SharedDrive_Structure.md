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
