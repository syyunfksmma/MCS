# Release Notes Automation — 2025-09-29

## 스크립트
- 위치: `scripts/release/Generate-ReleaseNotes.ps1`
- 입력: `git log` 범위, Jira API 토큰(optional)
- 출력: `artifacts/release/ReleaseNotes_<tag>.md`

## 실행 예시
```powershell
./scripts/release/Generate-ReleaseNotes.ps1 -FromTag v1.12.0 -ToTag v1.13.0 -JiraProject MCMS
```

## 포맷
```
## 개선 사항
- FR-3 Workspace Drag & Drop UX 개선 (#123)

## 버그 수정
- FR-7 Feature flag 토글 오류 수정 (#130)
```

## 후속 작업
- 파이프라인에서 릴리즈 태그 시 자동 실행.
- 결과 파일을 PR description에 첨부.

> 작성: 2025-09-29 Codex
