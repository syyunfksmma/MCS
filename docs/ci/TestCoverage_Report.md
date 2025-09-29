# Test Coverage Reporting — 2025-09-29

## 목적
- 프런트엔드(Vitest)와 백엔드(.NET) 커버리지 리포트를 자동 생성하여 파이프라인 아티팩트로 저장.

## 명령어
| 영역 | 명령 | 출력 |
| --- | --- | --- |
| Web | `pnpm test:unit -- --coverage` | `coverage/lcov-report` + `coverage/coverage-final.json` |
| API | `dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov` | `artifacts/coverage/api/lcov.info` |

## 파이프라인 스텝 (GitHub Actions)
```yaml
- name: Web coverage
  run: pnpm test:unit -- --coverage
- name: API coverage
  run: dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov
- name: Upload coverage
  uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: |
      coverage/
      artifacts/coverage/api/
```

## 후속
- Codex: 2025-10-01까지 coverage dashboard 초안 작성.

> 작성: 2025-09-29 Codex
