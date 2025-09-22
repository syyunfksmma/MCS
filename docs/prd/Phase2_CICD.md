# Phase 2 산출물 - CI/CD 파이프라인 설계서

## 1. 파이프라인 개요
- **CI 트리거**: `main` 브랜치 PR, `release/*` 브랜치 push
- **CD 트리거**: 승인을 통과한 `release/*` 브랜치 → Stage/Prod 배포
- **도구**: Azure DevOps YAML Pipeline (GitHub Actions 대안으로 문서화)

## 2. 단계별 작업
| 단계 | 작업 | 상세 |
|---|---|---|
| Build | Install & Lint | `npm ci`, `npm run lint`, `npm run typecheck` |
| Test | Unit/E2E (옵션) | Jest + Playwright (핵심 시나리오) |
| Bundle | Next.js build | `npm run build`, `.next` 아티팩트 생성 |
| Package | 압축 & 버전 표기 | `zip next-portal-{version}.zip` |
| Publish | Artifactory 업로드 | Stage/Prod 구분 태그 |
| Deploy-Stage | 배포 스크립트 실행 | Web Server SSH/WinRM, 서비스 재시작 |
| Smoke Test | Health Check 확인 | `/healthz`, 주요 페이지 테스트 |
| Approval | Prod 배포 승인 | Product Owner + Infra Lead |
| Deploy-Prod | 동일 스크립트, Blue/Green 또는 직교체 | 기존 버전 보존 |

## 3. 파이프라인 YAML (요약)
```yaml
stages:
  - stage: Build
    jobs:
      - job: NextBuild
        steps:
          - task: NodeTool@0
            inputs: { versionSpec: '20.x' }
          - script: npm ci
          - script: npm run lint && npm run typecheck
          - script: npm run build
          - task: PublishBuildArtifacts@1
  - stage: DeployStage
    dependsOn: Build
    jobs:
      - deployment: StageDeploy
        environment: stage
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                - powershell: ./scripts/deploy-stage.ps1
  - stage: DeployProd
    condition: succeeded('DeployStage')
    jobs:
      - deployment: ProdDeploy
        environment: prod
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                - powershell: ./scripts/deploy-prod.ps1
```

## 4. 배포 스크립트 고려사항
- Pre-check: 현재 서비스 상태, 백업 경로 확보
- 서비스 중단 최소화: Stage → Prod 전환 시 Blue/Green 추천
- 롤백: 이전 아티팩트(버전) 경로 저장, 자동 롤백 스크립트 `rollback.ps1`

## 5. 보안/검증
- 비밀 값: Azure Key Vault/ADO Variable Group 이용
- 코드스캔: CI 단계에서 SAST/Dependency Check
- 배포 승인: Product Owner, IT Security, Infra Lead 순서로 Gate 설정

## 6. 관측성
- 배포 로그: Azure DevOps + ELK
- 알림: Teams Webhook (CI 실패, 배포 성공/실패)
- Metrics: 배포 시간, 실패율, 롤백 횟수 추적

## 7. TODO
- E2E 테스트 정확한 범위 확정 (Phase 5 이후 적용)
- Stage/Prod 환경 변수 및 Feature Flag 관리 방식 정의
- 배포 자동화 도중 Add-in 커뮤니케이션 영향도 검토
