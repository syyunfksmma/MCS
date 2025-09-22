# Phase 7 산출물 - Feature Flag & 환경변수 정책

## 1. Feature Flag 체계
- 도구: LaunchDarkly 대안 → 자체 YAML/DB 기반 토글 (사내망 제한)
- 구성: `flagName`, `description`, `enabled`, `targetGroups`
- 적용: Next.js 서버에서 flags.json 로드 → React Context 공급
- 배포: Git 저장소 관리 + Admin Console에서 토글(Hot reload)

## 2. 환경변수 관리
- Next.js `.env` (Server only), MCMS API appsettings 공유
- 민감 정보: Key Vault/Secret Manager → Deploy 스크립트로 주입
- 변경 절차: Jira Change Request → 승인 후 반영

## 3. 운영 프로세스
1. Feature 추가 시 Jira 티켓에 Flag 명세
2. 개발/테스트 → Stage 플래그 On → Prod On (PO 승인)
3. Flag 종료: 특정 버전 이후 제거, 코드/문서 정리

## 4. 감사/추적
- Flag 변경 이벤트 감사 로그 기록 (사용자, 이전/현재 값)
- 롤백: 이전 JSON/DB 상태 복원 스크립트

## 5. TODO
- 토글 UI Prototype → Phase 8에서 테스트
- Secret Rotation 주기 명시 (6개월)
- LaunchDarkly 등 외부 서비스 도입 가능성 검토
