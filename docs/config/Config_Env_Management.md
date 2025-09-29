# 환경 변수(.config/.env) 관리 정책

## 목표
- Stage/Prod 환경에서 사용되는 구성 파일(.config, .env)의 버전 관리, 배포, 보안 기준을 명확히 한다.

## 정책 요약
1. **저장 위치**
   - 비밀 값은 Azure Key Vault / GitHub Encrypted Secrets에 저장.
   - 로컬 개발용 `.env.local`은 개인 OneDrive(암호화) 보관.
2. **버전 관리**
   - 템플릿만 저장소에 커밋 (`.env.sample`, `appsettings.Template.json`).
   - 변경 시 `docs/config/ChangeLog.md`에 기록.
3. **배포 절차**
   - CI에서 `Retrieve-Secrets.ps1`로 Key Vault 값 주입.
   - Stage → Prod 승인은 Ops 2단계 승인 필요.
4. **검증**
   - `scripts/config/validate-env.ps1`로 필수 키 비교.
   - 누락 항목은 파이프라인 실패 처리.
5. **감사**
   - 분기 1회 Secret Rotation Checklist 실행.

## 책임
- Ops: Key Vault 관리, Rotation 일정 수립.
- Dev: 새 구성 항목 추가 시 PR 템플릿 체크리스트 업데이트.
- Security: 연 1회 비밀 스캔 (truffleHog).

## 후속 조치
- 2025-10-05까지 Secret Rotation 계획 공유.
- 템플릿 파일에 주석 추가 (FR-13 관련).
