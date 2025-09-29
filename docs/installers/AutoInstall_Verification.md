# Stage3 Automated Installation Verification

## 개요
- **목표**: MSI/EXE 설치 자동화 스크립트와 사후 검증 절차를 Stage3 착수 전에 확정한다.
- **적용 대상**: MCMS Desktop (WPF) + 서비스 구성 요소, 의존 구성요소(VC++ 재배포 패키지, .NET 8 런타임).
- **검증 일자**: 2025-09-29
- **담당**: Codex (설치 자동화), Ops (감리)

## 테스트 환경
| 항목 | 값 |
| --- | --- |
| OS | Windows 11 23H2 (Build 22631.3880) |
| 계정 | Local admin + 표준 사용자 |
| 도구 | `install-mcms.ps1`, `msiexec`, `winget`, `Test-AutomationChecklist.ps1` |
| 로그 경로 | `logs/install/20250929/` |

## 시나리오
1. **무인 설치 (Silent)**
   - `install-mcms.ps1 -Mode Silent -ArtifactPath artifacts/MCMS-0.9.0.msi`
   - 설치 후 서비스(`MCMS.Api`, `MCMS.Worker`) 상태 확인.
2. **UI 설치 (Passive)**
   - `msiexec /i MCMS-0.9.0.msi /passive MCMSINSTALL=1`
   - UI 단계 스크린샷 자동 수집.
3. **자동 롤백 검증**
   - 설치 중 의도적 오류 주입(디스크 용량 부족 시뮬레이션) → 롤백 로그 확인.
4. **구성 검증 스크립트**
   - `Test-AutomationChecklist.ps1` 실행 → 레지스트리, 서비스, 파일 해시 검증.
5. **권한/재부팅 확인**
   - 표준 사용자 컨텍스트에서 실행 → 권한 상승 프롬프트 여부 확인.

## 체크리스트
- [x] 설치 스크립트 파라미터 표준화 (`-Mode`, `-ArtifactPath`, `-LogPath`).
- [x] 설치 로그 (`%ProgramData%\MCMS\logs\setup`) 자동 보관.
- [x] 해시 검증 (`SHA256SUMS.txt`) 자동 비교.
- [x] 서비스 상태 보고서를 `logs/install/20250929/service_status.json`에 저장.
- [x] 실패 시 `Remove-MCMS.ps1` 호출 후 깨끗한 상태 복구.

## 결과 요약
| 테스트 | 상태 | 로그 |
| --- | --- | --- |
| 무인 설치 | 통과 | logs/install/20250929/silent_install.log |
| UI 설치 | 통과 | logs/install/20250929/passive_install.log |
| 롤백 시나리오 | 통과 | logs/install/20250929/rollback_simulation.log |
| 구성 검증 스크립트 | 통과 | logs/install/20250929/config_validation.json |
| 권한 검증 | 통과 | logs/install/20250929/standard_user_prompt.log |

## 후속 조치
- 설치 스크립트와 체크리스트를 `scripts/install` 폴더에 버전 태그와 함께 커밋 예정.
- Stage3 Kick-off 전 Ops에 설치 리허설(표준 사용자 참여) 일정 공유.
- CI 파이프라인에 설치 스크립트 Lint + Pester 테스트 추가 검토.
