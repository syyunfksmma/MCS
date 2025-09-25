# Internal Manual Deployment Checklist

## 1. 빌드
1. 최신 코드를 `git pull`로 가져온다.
2. Visual Studio에서 솔루션을 Release/Any CPU로 빌드하거나, 스크립트: `msbuild CAM.sln /p:Configuration=Release`.
3. 출력물(EXE/필요 DLL)을 `dist/` 혹은 공유 드라이브 업로드용 임시 폴더에 모은다.

## 2. 사전 점검
- 버전 표시(About 창 등)가 올바른지 확인.
- 수동 기능 테스트: 로그인, 주요 화면 이동, 파일 업로드 등 최소 5분 스모크 체크.
- 로그/에러가 발생하면 빌드를 중단하고 수정 후 재빌드한다.

## 3. 배포
1. 공유 드라이브 `\\<share>\MCS-Portal\releases`에 날짜/버전 폴더를 만든다. 예: `2025-09-23_v1.2.0`.
2. EXE와 필요한 부속 DLL/리소스 파일을 복사한다.
3. 환경설정 파일(.config/.env 등)이 있다면 배포 전 백업 `backup/<날짜>` 폴더에 복사 후 교체.
4. README 또는 릴리즈 노트를 `README.txt` 등으로 함께 배포한다.

## 4. 배포 후 확인
- 배포 폴더에서 직접 EXE를 실행해 정상 동작 확인.
- 이전 버전으로 롤백이 필요하면 백업한 폴더에서 파일을 되돌린다.

## 5. 기록
- Sprint 로그에 배포 일시, 버전, 주요 변경 사항, 테스트 결과를 남긴다.
- README 또는 문서에서 절차를 업데이트했다면 해당 문서 링크를 포함한다.
