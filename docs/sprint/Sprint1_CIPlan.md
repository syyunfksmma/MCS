# Sprint 1 - CI Pipeline Draft

## 개요
- PoC 단계에서는 GitHub Actions 기반으로 간단한 CI 파이프라인을 운용한다.
- 대상 브랜치: `main`, `v1`
- 수행 작업: 의존성 설치 → Lint → Prettier 체크 → Build 검증

## 워크플로우 요약
```yaml
name: CI
on:
  push:
    branches: [ main, v1 ]
  pull_request:
    branches: [ main, v1 ]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
        working-directory: web/mcs-portal
      - run: npm run lint
        working-directory: web/mcs-portal
      - run: npx prettier --check "src/**/*.{ts,tsx,css}"
        working-directory: web/mcs-portal
      - run: npm run build
        working-directory: web/mcs-portal
```

## 향후 계획
- Stage 배포 자동화 추가 (Phase 10 이후)
- Playwright E2E 테스트 병행 (Sprint 1 후반)
- npm audit / security 스캔 통합
