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

### 2.3 FileMapper & 파일 처리
- FileStorageProvider 인터페이스: `UploadAsync`, `DownloadStreamAsync`, `CheckExistsAsync`.
- 기본 구현은 SMB 경로 직접 접근, CMD 서비스로 백그라운드 복사 요청 가능.
- 메타데이터는 DB + `meta.json` 동기화 (Worker에서 주기적으로 검증).

### 2.4 History 로깅
- EF Core SaveChangesInterceptor 사용하여 변경 추적 자동 기록.
- 기록 내용: Entity, 필드, 이전/이후 값, ChangedBy, CAMRev, Timestamp.
- 이력 조회 API는 페이징 + 필터 제공.

### 2.5 SolidWorks/Esprit 연동
- SolidWorks: API 호출은 Worker에서 Python FastAPI 모듈을 통해 변환(스케줄 작업).
- Esprit: `EspritInvoker` 클래스 생성, CMD 서비스 통해 Add-In 실행 커맨드 전송.
- 실행 결과는 MSMQ 메시지 또는 DB 상태 필드로 반환.

### 2.6 테스트 전략
- Unit: Core 서비스 로직, 검증.
- Integration: InMemory DB + Temp SMB 경로 모킹.
- End-to-End: 최소한의 시나리오 (Routing 생성 → 파일 업로드 → 승인) 자동화.

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
