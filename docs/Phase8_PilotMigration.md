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
