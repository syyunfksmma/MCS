# Phase 7 산출물 - Admin Console 계획

## 1. UI 구조
- 메뉴: 사용자/역할, API 키 관리, Add-in 파라미터, 시스템 설정(Feature Flag/환경변수)
- 상단 검색/필터, 우측 상세 패널 (선택 항목 편집)
- Role 기반 접근: Admin 전용, 일부 Viewer(Read-only)

## 2. 사용자/역할 관리
- Grid: 사용자 리스트(이름, 부서, 역할, 최근 로그인)
- 액션: 역할 변경, 계정 비활성화, 비밀번호 초기화(SSO 예외 시)
- AD 그룹 동기화: `GET /api/admin/users/sync` (수동 트리거)
- 감사 로그: 변경 시 히스토리에 기록

## 3. API 키 & Add-in 파라미터
- 키 목록: KeyId, Owner, 만료일, 상태
- 재발급: `POST /api/addin/keys/renew`, 확인 모달 + 2FA(사내 요청)
- Add-in 파라미터: Scope(Item/Revision/Routing), 버전 관리, Diff 비교

## 4. 시스템 설정
- Feature Flags: 토글 UI + 설명, 변경 시 즉시 반영 (Toggle audit)
- 환경 변수(읽기전용): 서버 재시작 필요 항목은 경고 표시
- 외부 연동 설정(Teams Webhook, Email 서버) 편집

## 5. UX 고려
- 모든 변경 작업 Undo 불가 경고, 확인 단계 제공
- 필수 변경 사항(권한) → Toast + 알림 로그
- 키 재발급 시 사용중 Add-in 다시 로그인 안내

## 6. TODO
- AD 그룹 동기화 주기 확정 (자동/수동)
- 2FA 도입 여부 결정 (키 재발급)
- Feature Flag 접근 권한 세분화 (Admin/Operator)
