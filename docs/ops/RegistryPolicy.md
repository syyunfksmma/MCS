# 컨테이너 이미지 레지스트리 운영 정책

## 1. 태깅 규칙
- 기본 태그: `ghcr.io/<org>/<repo>/mcs-portal:${SHA}` (CI 기본)
- 환경별 태그 예시: `ghcr.io/<org>/<repo>/mcs-portal:staging`, `registry.internal/mcs-portal/web:prod-YYYYMMDD`

## 2. Push/Pull 절차
- GHCR: GitHub Actions에서 `docker/login-action@v3` + `GITHUB_TOKEN` 사용.
- 사내 레지스트리: `docker login registry.internal` 후 `docker tag` / `docker push` 수행.
- 로컬 검증: `docker run --rm <image> node --version`

## 3. 보관 정책
- 최신 30개 SHA 태그 유지, Staging/Prod 태그는 수동 관리.
- 90일 이상 미사용 SHA 태그는 주기적으로 정리.

## 4. 레지스트리 가용성
- 프라이빗 레지스트리는 `--restart unless-stopped` 및 `/var/lib/registry` 볼륨으로 실행.
- 백업: 레지스트리 볼륨을 주간 스냅샷.
