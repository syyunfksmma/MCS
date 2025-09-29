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
# Phase 8 - 파일럿 데이터 및 마이그레이션 계획

## 1. 파일럿 데이터 준비
- 품목 선정: Item_A, Item_B, Item_C (각각 Rev 1~2개).
- 데이터 목록화 템플릿(`docs/templates/PilotData.xlsx`) 작성 예정.
- 파일 유형: Esprit .esp, NC .nc, STL .stl, meta.json, MachinePackage(mprj/gdml).

## 2. 수집 절차
1. 기존 CAM 저장소에서 파일 복사 → 스테이징.
2. 파일 체크섬 계산 및 기록.
3. meta.json 초안 생성 (수동/스크립트).
4. SolidWorks 매칭 확인 후 링크 데이터 정리.

## 3. 마이그레이션 단계
- Stage 0: 파일 목록 리뷰.
- Stage 1: Item/Rev 생성 → Routing 등록.
- Stage 2: 파일 업로드 및 meta.json 업로드.
- Stage 3: History 기록 검증.
- Stage 4: 사용자 검수(UAT) 수집.

## 4. 검증 체크리스트
- 파일 존재 및 접근 확인.
- meta.json Schema 준수 여부.
- CAM Rev 이력 정확성 확인.
- SolidWorks/Esprit 링크 상태 테스트.

## 5. 롤백 전략
- 마이그레이션 전 전체 백업.
- Item/Rev별 삭제 스크립트 준비(`scripts/cleanup/Remove-PilotData.ps1`).
- 문제 발생 시 Stage 별 롤백 가능하도록 로그 유지.

## 6. 일정(예시)
| 날짜 | 작업 |
| --- | --- |
| 2025-10-06 | 파일 목록 확정 |
| 2025-10-08 | 스테이징 업로드 완료 |
| 2025-10-10 | meta.json 생성 및 검증 |
| 2025-10-13 | MCMS 업로드 완료 |
| 2025-10-15 | 파일럿 사용자 확인 |

## 7. 주니어 가이드
- 스크립트 실행 전 DryRun.
- 로그 위치: `logs/migration/YYYYMMDD.log`.
- 파일 누락 시 즉시 기록하고 재수집.

## 8. 오픈 이슈
- 파일럿 품목 최종 승인 일정 확인.
- SolidWorks 모델 최신 여부 검증 필요.
- GDML 파일 라이선스 정책 확인.

