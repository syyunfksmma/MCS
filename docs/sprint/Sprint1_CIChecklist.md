# Sprint 1 - Lint/Format 체크 가이드

## 로컬 명령어
- 
pm run lint
- 
pm run format

## CI
- ~~GitHub Actions ci.yml에서 lint와 prettier --check 단계 실행.~~
- 내부 빌드 PC 스케줄 작업에 
pm run lint / 
px prettier --check를 포함하고 로그를 C:\MCMS\logs\lint.log에 저장한다.

## TODO
- ~~추가로 
pm run test:e2e를 CI에 통합 (Explorer 서버 기동 후).~~
- 설치 패키지 생성 전에 scripts\deploy\run-smoke.ps1 -Suite Lint를 호출해 로컬 Smoke 수준 검증을 자동화한다.

---
2025-09-26 Codex: CI 항목을 GitHub Actions에서 내부 빌드 스케줄러로 전환.
