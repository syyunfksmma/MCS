# ESPRIT Add-in Deployment Plan (2025-09-29)

## 패키징
- MSI 구성: Add-in + ML 플러그인 DLL + config.
- 버전 명명: `mcms-addin-ml-<date>.msi`.

## 설치 절차
1. 기존 Add-in 백업
2. MSI silent install `/quiet`
3. Registry 업데이트 (protocol handler 포함)
4. Smoke test (`scripts/addin/Run-Smoke.ps1`)

## 롤백
- `AddRemovePrograms` 에서 제거 또는 `msiexec /x`
- 백업 DLL 복원

## 배포 채널
- Internal SCCM + Shared Drive `installers/addin`
- 릴리즈 노트 `docs/installers/AddinReleaseNotes.md`

## 검증
- QA, Ops 서명 필요 (Sign-off matrix 포함)

