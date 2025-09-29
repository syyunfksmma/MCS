# 공유 드라이브 보존 정책 (MCMS)

## 목적
- W:\ 공유 드라이브 데이터의 보존 주기, 책임, 감사 절차를 정의한다.

## 범위
- Routing 파일, 로그, 설치 패키지, 교육 자료.

## 보존 정책
| 폴더 | 보존 기간 | 책임 부서 | 비고 |
| --- | --- | --- | --- |
| `\Routing\<Item>` | 최신 5개 Revision + 12개월 | CAM | 장기 보관분은 Archive 서버 이동 |
| `\logs\smoke\<env>` | 6개월 | Ops | 6개월 경과 후 압축 → `\archive` |
| `\installers` | 영구 | Ops | 버전별 SHA256 유지 |
| `\training` | 24개월 | Training | 구버전은 PDF 변환 후 보관 |
| `\handoff\evidence` | 18개월 | Ops | 감사 대상, 삭제 전 승인 필요 |

## 거버넌스
- 월 1회 자동 정리 스크립트 `scripts/operations/cleanup-shared-drive.ps1` 실행.
- 삭제 로그 `logs/retention/cleanup_<date>.log` 저장.
- 삭제 전 책임 부서 승인 필수 (Ops Ticket).

## 감사
- 분기 1회 내부 감사팀 확인.
- 무결성 검증: `checksum-manifest.json` 비교.

## 향후 작업
- 2025-10-10까지 Archive 서버 용량 확충 계획 수립.
- Retention 정책을 사용자 가이드(`docs/manual/SharedDrive_Structure.md`)에 연동.
