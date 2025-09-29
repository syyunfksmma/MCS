# Shared Drive Structure Maintenance — Sprint8 Update

## 1. 디렉터리 구조
- `\\MCMS_SHARE\installers\<version>` — installer + hashes
- `\\MCMS_SHARE\logs\smoke\<env>` — run-smoke 결과
- `\\MCMS_SHARE\training` — 교육 자료 저장소

## 2. ACL 검토 주기
- 월 1회 `Export-PermissionDiff.ps1` 실행 → diff csv 확인
- 변경사항 발견 시 Ops 회의에서 승인 기록

## 3. 보존 정책
| 경로 | 보존 기간 | 처리 |
|------|-----------|------|
| installers | 최신 3버전 유지, 이후 아카이브 | Verify-InstallerPackage.ps1 로그 참고 |
| logs/smoke | 30일 | check-offline-logs.ps1로 용량 모니터링 |
| training | 영구 | 버전 라벨링

## 4. 운영 절차
1. 신규 버전 배포 시 folder 생성 → ACL 확인
2. `Verify-InstallerPackage.ps1` 실행 → 해시 및 복사
3. `Export-PermissionDiff.ps1` 로 권한 diff 저장

*Codex — 2025-09-29 12:11 KST*
