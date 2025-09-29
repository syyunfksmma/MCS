# CAM_API g.cs 빌드 체인 품질 기준

## 목적
- CAM_API 프로젝트의 자동 생성 코드(`g.cs`)가 CI 파이프라인에서 안정적으로 생성/검증되도록 빌드 체인을 정의한다.

## 파이프라인 단계
1. **Restore**
   - `dotnet restore CAM_API.sln`
2. **CodeGen**
   - T4 템플릿 실행 (`tools/Generate-CAM-G.cs.ps1`)
   - 산출물: `src/CAM_API/Generated/g.cs`
3. **Build**
   - `msbuild CAM_API.sln /t:Build /p:Configuration=Release`
4. **Static Analysis**
   - FxCop 분석, StyleCop 규칙 적용
5. **Tests**
   - `dotnet test CAM_API.Tests` (Worker 핸드셰이크 Mock 포함)
6. **Artifacts**
   - `CAM_API.dll`, `g.cs`, 빌드 로그 보관 (artifact retention 30일)

## 품질 게이트
- g.cs 생성 실패 시 즉시 실패.
- 빌드 경고 0건 유지.
- 테스트 커버리지 ≥ 75%.

## 로컬 가이드
```
pwsh.exe -File tools/Generate-CAM-G.cs.ps1
msbuild CAM_API.sln /p:Configuration=Debug
```

## 증적 위치
- `logs/build/cam_api_codegen_20250929.log`
- `artifacts/cam_api/generated/g.cs`

## 후속 조치
- T4 템플릿 변경 시 Code Review 필수.
- Worker 이벤트 시뮬레이터 통합 계획 (Wave16).
