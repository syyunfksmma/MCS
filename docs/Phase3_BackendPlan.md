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
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, ~~docs/Tasks_ML_Routing.md~~ (폐기 2025-09-30)  
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
# Phase 3 - 백엔드 구현 계획

## 1. 프로젝트 구조(초안)
```
src/
  MCMS.Api/                # ASP.NET Core WebAPI (권한, CRUD, 파일 메타)
  MCMS.Core/               # 도메인 모델, 서비스 인터페이스, DTO
  MCMS.Infrastructure/     # EF Core, SQL Server 구현, FileStorage 어댑터
  MCMS.Workers/            # 백그라운드 워커 (MSMQ 큐 소비)
  MCMS.CmdContracts/       # CMD 서비스 명령/응답 공유 라이브러리
  MCMS.Tests/              # 단위/통합 테스트 프로젝트
services/
  MCMS.CmdHost/            # Windows Service (명령 실행)
scripts/
  deploy/                  # 배포용 PowerShell 스크립트
```

## 2. 핵심 모듈별 구현 계획
### 2.1 인증/인가
- AD JWT 토큰 검증 미들웨어(`Microsoft.Identity.Web`) 사용.
- 역할 매핑 테이블: DB `UserRoles` (UserId, Role) + 캐시.
- 권한 속성(`[Authorize(Roles="Editor")]`)으로 엔드포인트 보호.

### 2.2 Item & Routing 서비스
- Entity 설계: `ItemEntity`, `RoutingEntity`, `RoutingFileEntity`, `CamRevisionEntity`.
- 서비스 메서드 예시
  - `CreateItemAsync(ItemDto dto)` → Rev 자동 생성.
  - `CreateRoutingAsync(CreateRoutingRequest request)` → CAM Rev 1.0 → History 기록.
  - `UpdateRoutingAsync(UpdateRoutingRequest request)` → CAM Rev 증가 로직 포함.
- 검증: FluentValidation 도입 (필수 필드, Seq 중복 등).
- 읽기 전용 쿼리는 `AsNoTracking()` 기본 적용, History/Item 상세는 Split Query(`AsSplitQuery`)로 N+1 감소.
- 반복 사용 조회는 `EF.CompileQuery`로 컴파일된 쿼리 캐시, 초기화 시 단위 테스트 포함.
- 대량 조회는 `await foreach` + `AsAsyncEnumerable()` 스트리밍 패턴으로 파일 메타, History 로그를 페이징 없이 순차 처리.

### 2.3 FileMapper & 파일 처리
- FileStorageProvider 인터페이스: `UploadAsync`, `DownloadStreamAsync`, `CheckExistsAsync`.
- 기본 구현은 SMB 경로 직접 접근, CMD 서비스로 백그라운드 복사 요청 가능.
- 메타데이터는 DB + `meta.json` 동기화 (Worker에서 주기적으로 검증).

### 2.4 History 로깅
- EF Core SaveChangesInterceptor 사용하여 변경 추적 자동 기록.
- 기록 내용: Entity, 필드, 이전/이후 값, ChangedBy, CAMRev, Timestamp.
- 이력 조회 API는 페이징 + 필터 제공.
- History Context는 `dotnet ef dbcontext optimize`로 컴파일 모델 빌드, 마이그레이션 이후 CI에서 재생성.
- 변경 감지 최소화를 위해 History Append 작업은 별도 `DbContext` 인스턴스에서 Batch Insert.

### 2.5 SolidWorks/Esprit 연동
- SolidWorks: API 호출은 Worker에서 Python FastAPI 모듈을 통해 변환(스케줄 작업).
- Esprit: `EspritInvoker` 클래스 생성, CMD 서비스 통해 Add-In 실행 커맨드 전송.
- 실행 결과는 MSMQ 메시지 또는 DB 상태 필드로 반환.

### 2.6 테스트 전략
- Unit: Core 서비스 로직, 검증.
- Integration: InMemory DB + Temp SMB 경로 모킹.
- End-to-End: 최소한의 시나리오 (Routing 생성 → 파일 업로드 → 승인) 자동화.
- EF Core 최적화 검증: 컴파일 쿼리 응답 시간, Split Query 실행계획 비교, 스트리밍 시 메모리 사용량 측정.

### 2.7 데이터 액세스 성능 수칙
- `ModelCacheKeyFactory` 커스터마이징 없이 컴파일된 모델 아티팩트 사용해 애플리케이션 시작 시간 단축.
- Transaction 범위를 최소화하고, 큐 처리 워커는 `ConfigureAwait(false)` + CancellationToken 연동.
- 대용량 응답 API는 `IAsyncEnumerable` 반환으로 서버 메모리 사용을 일정 수준 유지, `ResponseCompression`과 함께 활용.

## 3. 작업 세부 일정(초안)
| 주차 | 목표 |
| --- | --- |
| Week 1 | 솔루션 스캐폴딩, Core/Infrastructure 기본 구성, DB 마이그레이션 초안 |
| Week 2 | Item/Routing/File 서비스 구현, FluentValidation 도입 |
| Week 3 | History 로깅, Esprit/SolidWorks 연동 스텁, Worker 메시징 |
| Week 4 | 테스트 보강, CMD 서비스 계약 확정, 코드 리뷰 |

## 4. 주니어 개발자 참고 가이드
- 각 프로젝트에 `README.md` 작성, 빌드/실행 방법 명시.
- Swagger 문서 자동 생성 (`Swashbuckle`)으로 API 확인 가능.
- 공통 코드 규칙: `nullable enable`, Async/Await 기본, 주석은 시나리오 설명 위주.

## 5. 확인 필요 이슈
- AD SSO 토큰 연동 방식 (사내 보안팀 협의).
- Worker ↔ CMD 서비스 메시지 포맷(JSON vs ProtoBuf).
- 파일 업로드 용량 제한(기본 2GB 이상 필요) 조정.

