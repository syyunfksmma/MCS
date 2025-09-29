# CI/CD Secret Inventory — 2025-09-29

| Secret | 위치 | 용도 | 회전 주기 |
| --- | --- | --- | --- |
| MCMS_GRAFANA_TOKEN | GitHub → Repo Secret | Grafana alert webhook | 90일 |
| MCMS_SMTP | GitHub → Env Secret | Magic Link 이메일 발송 | 180일 |
| MCMS_AZURE_SP | Azure DevOps Variable Group | 배포 스크립트 인증 | 180일 |
| MCMS_KEYVAULT_URI | Pipeline Variable | 인증서/비밀번호 조회 | 수시 |

## 관리 정책
- Rotations tracked in `docs/security/Secret_Rotation.md` (갱신 예정).
- Secret 사용 시 `AZURE_KEYVAULT_URI` 통해 참조 권장.

> 작성: 2025-09-29 Codex
