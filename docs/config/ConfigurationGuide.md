# Configuration Guide

| Component | File | Key Settings |
|-----------|------|--------------|
| MCMS.Api | src/MCMS.Api/appsettings.json | ConnectionStrings.McmsDatabase, FileStorage.RootPath |
| MCMS.Workers | src/MCMS.Workers/appsettings.json | Same as API (read-only) |
| MCMS.CmdHost | src/MCMS.CmdHost/appsettings.json | Same as API (for queue access) |
| MCMS.Client | src/MCMS.Client/appsettings.json | Api.BaseUrl, Api.CmdHostUrl |

> 모든 환경 파일은 배포 전 실제 서버 경로/URL로 교체하고, 필요 시 ppsettings.Production.json을 추가하세요.

## Sample appsettings.json (API)
`json
{
  "ConnectionStrings": {
    "McmsDatabase": "Server=(localdb)\\MSSQLLocalDB;Database=MCMS;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "FileStorage": {
    "RootPath": "W:\\MCMS"
  }
}
`

## Sample appsettings.json (Client)
`json
{
  "Api": {
    "BaseUrl": "https://localhost:5001",
    "CmdHostUrl": "https://localhost:6001"
  }
}
`

## Configuration Checklist
1. 데이터베이스 연결 문자열은 운영 SQL Server로 교체
2. FileStorage.RootPath는 실제 네트워크 공유 경로로 업데이트
3. Client의 API/CmdHost URL은 배포된 도메인으로 설정
4. 인증/권한 설정 시 User Secrets 또는 환경 변수로 민감 정보 관리
