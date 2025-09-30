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

# Access Migration Notes (S86)

## Provider Options 탐색
- **EntityFrameworkCore.Jet (ErikEJ / Community)**: ACE OLE DB 기반, `.UseJet(connectionString)` 확장 제공 (EF Core 6~8 지원).
- **Odbc / OleDb 직접 사용**: EF Core 공식 지원 미흡, 수동 SQL 작성 필요.
- **결론**: `.accdb` 파일을 EntityFrameworkCore.Jet 패키지로 연결하는 방법이 가장 빠른 구현 경로.

## 전제 조건
- 로컬 PC에 *Microsoft Access Database Engine 2016 Redistributable* 설치 필요 (ACE OLE DB Provider 16.0).
- 파일 경로: `C:\Users\syyun\Documents\GitHub\MCS\DB.accdb`
- Access에서 로그인/권한은 사전에 처리 (별도 암호가 없다면 connection string 단순화 가능).

## 향후 변경 항목
1. `src/MCMS.Api/MCMS.Api.csproj`에 `EntityFrameworkCore.Jet` 패키지 참조 추가.
2. `Program.cs` / DbContext 등록을 `UseJet`으로 교체.
3. `appsettings.json`의 연결 문자열을 ACE OLE DB 형식으로 수정.
4. SQL Server 전용 기능(IDENTITY 옵션, Sequence, JSON 기능 등) 사용 여부 점검.
5. Access가 지원하지 않는 데이터 타입/제약 조건은 매핑 조정 필요.

> 다음 단계(S87~S90)에서 실제 설정 변경 및 실행 테스트를 수행한다.
## 모델 호환성 검토 (S89)
- Jet Provider는 `nvarchar(max)`/`DateTime2`와 같은 SQL Server 전용 타입을 지원하지 않으므로, `AddinJob.ParametersJson` 등 `HasColumnType("nvarchar(max)")` 지정 컬럼은 Access 테이블과 매핑할 때 `LongText` 등으로 전환 필요.
- EF Core 자동 마이그레이션은 Jet에서 제한적 ⇒ `EnsureCreated()`는 빈 DB에서 테이블을 생성하지만 기존 SQL Server 스키마와 1:1 대응은 미보장.
- Guid/Identity: Access는 `GUID` 필드 지원, `Identity`는 `AUTOINCREMENT`로 매핑되므로 `Id` 속성은 유지 가능.
- 검색/인덱스: 복합 인덱스가 많아 Jet에서 성능 제약 가능. 테스트 필요.
- 결론: Jet으로 실행은 가능하지만, 데이터 타입/인덱스 정의를 Access 실제 테이블과 맞춰야 하며, 현재 `EnsureCreated()`가 Jet에서 성공하는지 S90에서 검증 예정.
