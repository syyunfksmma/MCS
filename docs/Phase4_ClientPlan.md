# Phase 4 - 클라이언트 애플리케이션 설계

## 1. UI 디자인 시스템 (주니어 친화형)
- 컬러 팔레트: 파스텔 톤 중심 (Primary: #6FA8DC, Secondary: #93C47D, Accent: #FFD966).
- 폰트: Noto Sans KR, 기본 크기 13pt, 헤더 16pt.
- 구성 요소 가이드
  - 카드형 패널: 주요 정보 요약 (Item/Rev, Routing 상태 등).
  - 알림 배너: 승인 대기/실패 상태 강조.
  - 라디오/체크박스 옆 설명 텍스트 추가로 주니어 사용자가 이해 쉽게.
- 접근성: 대비율 4.5:1 이상, 키보드 내비게이션 지원, 툴팁 제공.

## 2. 화면 설계 요약
### 2.1 메인 화면 (Dashboard)
- 좌측: 품목/Rev 트리 → 선택 시 우측 패널에 Routing 요약.
  - 트리 데이터는 `VirtualizingCollectionView` 기반으로 1차 로드 200건, 이후 스크롤에 따라 증분 페이지(200건 단위) 비동기 로딩.
  - 아이템 확장 시 하위 Rev 목록도 가상화 상태를 유지하고, 백그라운드 Prefetch로 인접 Rev 1단계 선로딩.
- 상단 검색바: 품목 ID, 이름, 공정타입 필터.
- SolidWorks 매칭 상태 아이콘 표시 (연결/미연결/오류).
- 빠른 작업 버튼: "Routing 만들기", "이력 보기".

### 2.2 Routing 편집 창
- 상단 탭: 기본정보, 공정 단계, 파일, 승인.
- 공정 단계 그리드: Seq, Machine, ProcessDesc, ToolInfo 컬럼, 행 추가 버튼.
  - `DataGrid` 가상화(열/행 VirtualizationMode = Recycling) 활성화, 100행 단위 서버 페이징 + 비동기 증분 로딩.
- 파일 패널: Esprit/NC/WP/STL 등 파일 업로드 카드, 상태 표시.
- 우측: Esprit 실행 버튼, 실행 결과 로그.
- 하단: 저장/승인 요청 버튼, 승인 요청 시 코멘트 입력 팝업.

### 2.3 Mapper 관리 화면
- Routing 선택 후 파일 매핑 리스트(파일 타입, 실제 경로, 체크 상태).
- "경로 확인" 버튼으로 W:\ 경로 탐색기 바로 열기.
- 파일 검증 결과(존재/누락/중복) 표시.

### 2.4 이력 뷰어
- 타임라인 뷰: Rev/CAM Rev 별로 색상 구분, 주요 이벤트 아이콘 표시.
- 상세 패널: 변경 필드 Diff, 파일 체크섬 비교.
- 필터: 기간, 사용자, 상태(승인/거절/저장).

### 2.5 권한 관리(관리자 전용)
- 사용자/그룹 검색, 역할 배정 드롭다운.
- 승인 플로우 설정(순차/병렬) 구성 UI.
- 역할 변경 이력 로그.

## 3. 기술 세부 계획
- 프레임워크: .NET 8 WPF, MVVM 패턴 (CommunityToolkit.Mvvm).
- DI 컨테이너: Microsoft.Extensions.DependencyInjection.
- HTTP 호출: Refit 기반 API 클라이언트, Polly로 재시도/회로차단.
- 모델: Phase 1의 DTO와 동기화, AutoMapper 사용.
- 로컬 캐시: LiteDB 또는 SQLite 로컬 DB를 활용, 최근 조회 Routing 캐시.
- 로깅: Serilog + Seq (Optional) 또는 파일 기반.

## 4. 주니어 개발자를 위한 코드 가이드
- ViewModel 구조: `*ViewModel.cs`는 화면 로직, `Commands` 폴더에 RelayCommand.
- Navigation 서비스: 단순 Frame Navigation, ViewModel 간 메시징은 Mediator 패턴 사용.
- 컨벤션: 뷰는 `Views/`, 뷰모델은 `ViewModels/`, 스타일은 `Resources/Styles.xaml`.
- 프로젝트 루트에 `README_WPF.md` 작성 (빌드/실행 절차, API Base URL 설정 방법).

## 5. 에러 처리 & UX
- API 실패 시 상단 배너 + 디테일 팝업 표시, 주니어 사용자를 위한 친절한 문구.
- 파일 업로드 실패 원인(권한, 용량, 네트워크)별 안내 메시지 준비.
- 승인 요청 시 필수 코멘트 검증, Empty 시 경고.

## 6. 테스트 계획
- UI 테스트: WPF TestStack.White 또는 FlaUI를 이용한 기본 흐름 자동화.
- 뷰모델 단위 테스트: 비동기 커맨드 동작 검증.
- 성능 테스트: 대량 Routing 로딩(>500개) 캐싱 효과 측정.

## 7. 남은 결정 사항
- 디자인 시안: UI/UX 팀과 협의하여 Figma 프로토타입 작성 (목표 2025-10-01).
- 캐시 DB 선택 (LiteDB vs SQLite).
- 자동 업데이트 방식(MSIX vs ClickOnce) 최종 확정.
