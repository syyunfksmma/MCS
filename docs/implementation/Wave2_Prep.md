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

# Wave2 자산 전송 & SolidWorks 연동 준비

## 범위
- I2: Bundle 다운로드 + 체크섬 검증.
- I3: Version 테이블(Main 토글, Legacy 노출, 감사 타임라인).
- J1: SolidWorks 업로드/교체 UI.
- J2: Explorer 프로토콜 핸들러 & 권한 검사.
- K1: 공유 드라이브 루트/네이밍 Preset 적용.

## 사전 체크리스트
- [ ] SolidWorks 샘플 파일 3종 확보(STEP, SLDDRW, STL).
- [ ] Explorer Shell 프로토콜 테스트 환경 구성 (테스트 PC 레지스트리 스크립트).
- [ ] 공유 드라이브 경로 정책 문서 초안(`docs/ops/Routing_SharedDrive_Decisions.md`)과 정합성 검토.
- [ ] 번들 다운로드 API 응답 포맷 검증 (`zip + manifest.json`).

## 위험 요소
- 대용량 번들 다운로드 시 네트워크 중단 → Resume 전략 필요.
- SolidWorks 업로드 시 파일 잠금 문제 → 백그라운드 업로드 프로세스 권장.
- Explorer 프로토콜이 그룹 정책에 의해 차단될 가능성 → IT Ops와 협의 필요.

## 산출물 계획
- `docs/implementation/Wave2_AssetTransfer_Spec.md` (향후 상세 설계).
- `docs/testing/Wave2_Bundle_Scenarios.md` (테스트 케이스 수립 예정).
- `scripts/server-control/solidworks_mock.ps1` (Mock 업로드 스크립트, TBD).
