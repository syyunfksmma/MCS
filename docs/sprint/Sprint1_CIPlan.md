# Sprint 1 - CI Pipeline Draft

## 개요
- ~~PoC 단계에서는 GitHub Actions 기반으로 간단한 CI 파이프라인을 운용한다.~~
- ~~대상 브랜치: main, 1~~
- ~~수행 작업: 의존성 설치 → Lint → Prettier 체크 → Build 검증~~
- 현재는 내부 빌드 PC에서 설치 패키지를 수동/자동 스케줄러로 생성하고, 결과물을 공유 드라이브(\\MCMS_SHARE\\installers)에 업로드한다.

## 워크플로우 요약
- ~~GitHub Actions workflow (lint/build)~~
- 오프라인 빌드 절차
  1. PowerShell: 
pm install && npm run build (web/mcs-portal)
  2. msbuild TEST\CAM_API.csproj /t:Build /p:Configuration=Release /p:Platform=x64
  3. scripts\deploy\package-offline.ps1 -Version <x.y.z> 실행 후 설치 패키지 검증

## 향후 계획
- ~~Stage 배포 자동화 추가 (Phase 10 이후)~~
- ~~Playwright E2E 테스트 병행 (Sprint 1 후반)~~
- ~~npm audit / security 스캔 통합~~
- Windows 작업 스케줄러에 야간 빌드를 등록하고, Smoke 스크립트를 설치 패키지 완료 후 자동 실행하도록 개선.

---
2025-09-26 Codex: GitHub Actions 계획을 취소하고 내부망 설치형 빌드 절차로 전환.
