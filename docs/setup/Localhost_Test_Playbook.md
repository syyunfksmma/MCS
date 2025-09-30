# 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.

> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# Localhost Test Playbook (초보자용)

## 0. 필수 설치 및 사전 준비
1. **Node.js 20 LTS 설치** (https://nodejs.org)
2. **pnpm 활성화**
   - PowerShell에서 한 번 실행:
     ```powershell
     corepack enable
     corepack prepare pnpm@8 --activate
     ```
     > 만약 Corepack이 동작하지 않으면 `npm install -g pnpm`으로 설치 후 PowerShell을 다시 열어 주세요.
3. **.NET 8 SDK 설치** (https://dotnet.microsoft.com)
4. **SQL Server Express** 혹은 Docker 기반 SQL 컨테이너 준비
5. **저장소 가져오기**
   ```powershell
   git clone <repo-url>
   cd MCS
   ```
6. **환경 변수 템플릿 복사**
   ```powershell
   Copy-Item .env.example .env
   Copy-Item appsettings.Template.json appsettings.json
   ```
   > 필요한 비밀 값은 Ops가 제공하는 Key Vault에서 받아서 채워 넣습니다.

## 1. 의존성 설치
- 루트에서 한번에 실행:
  ```powershell
  pnpm install
  pnpm --filter mcs-portal install
  ```
  > pnpm 명령이 인식되지 않으면 PowerShell을 새로 열고 다시 `corepack enable`을 시도하거나 `npm install -g pnpm` 후 시도하세요.

## 2. 백엔드 준비
```powershell
cd src
dotnet restore
cd ..
```

## 3. 데이터베이스 시드(필요 시)
```powershell
pwsh ./scripts/setup/Bootstrap-Database.ps1 -Environment Local
```

## 4. API / Worker 실행
PowerShell 창 두 개를 열어 각각 실행합니다.
```powershell
# 창 1
cd src/MCMS.Api
dotnet run

# 창 2
cd src/MCMS.Worker
dotnet run
```

## 5. 프런트엔드 실행
```powershell
cd web/mcs-portal
pnpm dev
```
브라우저에서 http://localhost:3000 접속

## 6. 기본 점검 체크리스트
- 로그인/메인 대시보드 로딩 확인
- Explorer 검색, 제품/라우팅 목록 확인
- 파일 업로드 모달 열림 여부 확인
- 관리자 설정 페이지 접근 (admin 계정)
- 브라우저 콘솔/서버 로그 오류 없는지 확인

## 7. 자동화 테스트 (선택)
```powershell
pnpm lint
pnpm test:unit -- --run
pnpm test:e2e -- --headed
```

## 8. 종료 및 로그 정리
PowerShell 창에서 `Ctrl+C`로 서버를 종료하고, `logs/local` 폴더 결과를 `docs/logs`로 아카이브합니다.

## 문제 해결 FAQ
- **pnpm 명령이 인식되지 않음**: `corepack enable` → 새 PowerShell → `pnpm -v`로 확인. 실패 시 `npm install -g pnpm` 후 재시도.
- **포트 충돌**: `netstat -ano | findstr 3000` 으로 점유 프로세스 확인 후 종료
- **DB 연결 실패**: `appsettings.json` 연결 문자열 확인 및 SQL Server 실행 여부 체크
- **권한 오류**: PowerShell을 관리자 권한으로 실행

## 참고 문서
- `docs/setup/LocalDevEnvironment.md`
- `docs/ops/LocalDeployment_Email_Runbook.md`
- `docs/logs/Localhost_Test_Log_2025-09-29.md`

