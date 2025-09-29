# ML Routing CI Extension Plan (2025-09-29)

## 파이프라인 개요
- 워크플로우 파일: `.github/workflows/ml-routing-ci.yml`
- 단계: Install → Lint → Unit Test → Integration Mock Test → Build → Deploy Staging.

## 세부 단계
1. Install: `pnpm install`, `pip install -r requirements.txt`
2. Lint: `pnpm lint`, `ruff`/`mypy`
3. Test: Vitest + Pytest (coverage 업로드)
4. Build: Next.js + FastAPI Docker build
5. Deploy: Azure Web App staging, pm2 restart

## Gate
- 커버리지 <80% → 실패
- Artifact upload: model metadata, API spec

## 후속
- Pipeline Health 보고서를 `reports/wave18/ml_ci_summary.md`에 저장.
