# Docker Compose Override 평가

## 목적
- Stage/Local 환경에서 Docker Compose override 파일 적용 필요성을 평가하고 변경 권고안을 제시한다.

## 현황
- 기본 파일: `docker/docker-compose.yml`
- Override 후보: `docker/docker-compose.override.yml` (미배포)
- 요구사항: ML 서비스 연동, Worker 확장, 로깅 옵션 분리

## 평가 결과
| 항목 | 필요 여부 | 비고 |
| --- | --- | --- |
| ML FastAPI 컨테이너 추가 | 필요 | Stage/PoC에서 사용, Prod는 추후 |
| Worker replica scaling | 필요 | `deploy.replicas=2` override 추천 |
| Logging driver 분리 | 권장 | 로컬은 json-file, Stage는 gelf |
| Volume 경로 차이 | 필요 | 로컬: `../artifacts`, Stage: `//fileserver01` |

## 권고안
1. `docker/docker-compose.override.yml` 생성, Stage와 Local 분기.
2. 환경 변수 파일 `.env.compose` 정의 (공유 안함).
3. CI에서 `docker compose config` 검증 단계 추가.

## 후속 조치
- 2025-09-30까지 override 파일 초안 작성 → Ops 검토.
- Stage 파이프라인에 Compose lint 작업 추가.
- 문서화: `docs/ops/DockerCompose_Runbook.md` 갱신 예정.
