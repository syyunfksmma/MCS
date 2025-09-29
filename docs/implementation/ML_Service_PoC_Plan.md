# ML Service PoC Plan (FastAPI) — 2025-09-29

## 개요
- 목적: FastAPI 기반 추천 서비스를 PoC로 구현하여 MCMS API와 연동 검증.

## 구성
- FastAPI 앱: `/recommend`, `/feedback`, `/healthz`.
- 모델 로딩: `mlflow.pyfunc.load_model`.
- 캐싱: Redis (TTL 10분) → Cold start 완화.

## 인프라
- 컨테이너 이미지: `ml-routing-service:0.1.0`.
- 배포: Azure App Service (Linux) / Staging 슬롯.
- CI: GitHub Actions → Docker build/push → deploy.

## 시험 절차
1. Unit 테스트(Pytest) → mock model.
2. Load test (k6) 30 RPS.
3. Security scan (pip-audit, bandit).

## 일정
- 09-30: 스켈레톤 구현.
- 10-02: 모델 연동.
- 10-04: API 통합 검증.
