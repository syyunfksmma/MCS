# Selenium Edge 테스트 플랜

## 목적
- Edge 브라우저에서 핵심 라우팅 플로우(검색, 업로드, 다운로드, Drag&Drop)가 정상 동작하는지 검증한다.

## 환경
- 브라우저: Microsoft Edge 128.0 Stable
- 드라이버: msedgedriver 128.0
- 프레임워크: Selenium 4 + pytest
- 테스트 계정: `edge-tester@mcms` (MFA 예외)

## 시나리오
1. 로그인 및 대시보드 로드
2. 제품 검색 및 필터 적용
3. Routing Drag&Drop 재배치 → 상태 확인
4. 파일 업로드 (3DM) → 성공 알림 확인
5. 파일 다운로드 → 해시 검증
6. Feature flag 토글 접근 권한 확인

## 실행 방법
```
pip install -r tests/selenium/requirements.txt
pytest tests/selenium/edge --browser=edge --headless
```

## 결과 기록
- 성공/실패 로그: `logs/testing/selenium/edge_<date>.log`
- 스크린샷: `artifacts/testing/selenium/`
- 실패 시 비디오 캡처 옵션 활성화 (`--video`)

## 일정
- PoC 기간 동안 주 2회 (화/목) 야간 배치 실행.
- Prod 릴리즈 전 릴리즈 후보 빌드에 대해 필수 수행.

## 후속 조치
- CI 파이프라인 통합 검토 (Azure DevOps).
- Cross-browser Matrix 문서 업데이트.
