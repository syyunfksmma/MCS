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
# Phase 2 - 솔루션 아키텍처 & 인프라 초안

## 1. 클라이언트 아키텍처 비교 (WPF vs React+Electron)
| 항목 | WPF (권장) | React+Electron |
| --- | --- | --- |
| 기술 적합성 | 기존 CAM Add-In과 동일 .NET 생태계, Esprit API 연계 용이 | 웹 기술 활용 가능, 크로스 플랫폼 (단, 지금은 Windows 한정) |
| 성능 | 네이티브 렌더링, 대용량 데이터 바인딩 강점 | 브라우저 런타임 오버헤드, 대용량 렌더링 시 튜닝 필요 |
| 배포 | ClickOnce/MSIX/Installer로 윈도우 내부망 배포 용이 | 자동 업데이트 가능하나 내부망에서 패키지 관리 추가 필요 |
| API 연동 | .NET HttpClient, Esprit/ SolidWorks Interop 직접 사용 | 네이티브 모듈 브릿지 필요, 유지보수 복잡 |
| 개발팀 역량 | CAM 도메인 팀의 C#/WPF 경험 존재 | 프론트엔드 전문 인력 추가 필요 |

**결론**: 초기 버전은 WPF 클라이언트 채택, 향후 웹 클라이언트는 모듈화된 API 기반으로 확장 검토.

## 2. 백엔드 토폴로지 및 기술 스택
- 서비스 구성 (모듈형 단일 솔루션)
  - `MCMS.Api` (.NET 8 WebAPI): 인증/권한, 라우팅, 파일 매퍼, 이력 API 제공.
  - `MCMS.Workers` (.NET 8 Worker Service): Esprit 실행 큐, 대용량 파일 복사, CMD 서비스 호출.
  - `MCMS.CmdHost` (.NET 6 Windows Service): 내부망 CMD 명령 처리(파일 배포, 서비스 재시작 등).
  - 추가: Python FastAPI 마이크로서비스(선택) — SolidWorks 파일 메타 추출/변환 작업 전용.
- 통신
  - API-Gateway 패턴은 초기 스코프에서는 불필요, WebAPI 직접 호출.
  - 내부 큐: ~~Azure Service Bus 대체로 RabbitMQ on-prem 또는 MSMQ 고려 (내부망, Windows 기반이면 MSMQ 간편).~~
  - 내부 큐: MSMQ 기반 메시징을 기본으로 하고, 필요 시 RabbitMQ를 사내 Windows 서버에 설치해 사용.

## 3. 데이터베이스 선택
| 기준 | SQL Server 2019 | PostgreSQL 14 |
| --- | --- | --- |
| 사내 표준 | O | △ (신규 도입 필요) |
| KBM 연계 | SQL Server 연동 용이 | 별도 커넥터 필요 |
| 라이선스 | 이미 보유 | 오픈소스 (비용↓) |
| 기능 | CDC, Temporal Table 활용 가능 | JSONB, 복합인덱스 유연 |

**결론**: 1차 릴리스는 SQL Server 2019 사용, 향후 PostgreSQL 호환 레이어 설계(ORM로 다중 DB 지원 준비).

## 4. 배포/환경 계획
| 환경 | 구성 | 목적 |
| --- | --- | --- |
| Dev | 로컬 개발 PC + 로컬 DB/파일 공유 (W:\ 테스트 매핑) | 기능 개발 |
| QA | 사내 테스트 서버 (Windows Server 2019, SQL Server QA), 파일 공유 샌드박스 | 통합 테스트 |
| Prod | Windows Server 2019 (IIS + Windows Service), SQL Server Prod, W:\ MCMS 실제 경로 | 운영 |

- ~~CI/CD: Azure DevOps 또는 Jenkins(사내 표준) 이용, 빌드 파이프라인에서 WebAPI/Worker/CmdHost 패키징.~~
- 패키징: 내부 빌드 PC에서 설치 패키지를 생성하고, Windows 파일 공유를 통해 서버에 전달.
- 배포: WebAPI는 IIS WebDeploy, Worker/CmdHost는 Windows Service Installer (PowerShell 스크립트) 사용.
- 클라이언트 배포: MSIX + 내부 파일 서버(\share\installers) 통해 배포, CMD 서비스가 설치/업데이트를 원격 실행.

## 5. 파일 저장 & 캐싱 구조
- 기본: W:\\\MCMS 경로 (SMB 공유).
- 캐싱: 클라이언트 측 로컬 캐시 `%AppData%\MCMS\cache` (최근 열람 파일 메타), 서버 측은 MemoryCache + Redis(on-prem) 옵션 검토.
- 대용량 스트리밍: ASP.NET Range 요청 지원, Worker에서 background copy.

## 6. 네트워크 CMD 서비스 설계 초안
- `MCMS.CmdHost`
  - 기능: 패키지 배포, 서비스 재시작, 파일 권한 동기화, 로그 수집.
  - 보안: 내부망 전용, AD Kerberos 인증, 명령 화이트리스트.
  - 인터페이스: REST `/cmd/execute` (POST, 명령 ID, 파라미터), 실행 결과 큐(MSMQ)로 반환.
  - 로깅: Windows Event Log + 중앙 Elastic Stack 연동 검토.

## 7. 인프라 구성도 요약
```
[WPF Client] --HTTPS--> [MCMS.Api (IIS)] --SQL--> [SQL Server]
      |                          |\
      |                          | \--SMB--> [W:\ File Share]
      |                          | \
      |                          -> [MCMS.Workers] --MSMQ--> [MCMS.CmdHost]
      |                                                    |--SMB/File Ops
      |                                                    |--Service Control
```

## 8. 백업 및 복구 전략
- DB: SQL Server Log Backup 15분 간격, 일별 전체 백업, 이중화는 고가용성 필요 시 AlwaysOn 검토.
- 파일: W:\ 공유 스냅샷 일 1회, 변경 추적 위해 File History 또는 VSS 활용.
- 구성/스크립트: Git 레포 + 사내 아티팩트 저장소 보관.

## 9. 오픈 이슈
- MSMQ vs RabbitMQ 최종 선택 (운영팀 협의 필요).
- CMD 서비스 로그 시각화 도구 결정 (Elastic vs 사내 Splunk).
- Python FastAPI 모듈 범위 확정(필수/선택).
---
2025-09-26 Codex: Updated architecture to remove Azure dependencies and align with internal Windows server deployment.

