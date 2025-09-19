# Implementation Phase 1 - Next.js 포털 초기화 및 트리 UI 스켈레톤 (2025-09-19)

## 절대 조건 확인
- 각 단계는 승인 후에만 진행한다. ✅
- 단계 착수 전 해당 단계 전체 범위를 리뷰하고 오류를 선제적으로 파악한다. ✅ (PRD, 설계 Phase1~4 문서 재검토)
- 오류가 발견되면 수정 전에 승인 재요청한다. ✅
- 이전 단계 오류가 없음을 확인한 뒤 다음 단계 승인을 요청한다. ✅ (최근 빌드/테스트 성공)
- 모든 단계 작업은 백그라운드로 수행한다. ✅
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 후 진행한다. ✅
- Task list 체크박스를 하나씩 업데이트하면서 문서를 업데이트 한다. ✅
- 모든 작업은 문서로 남긴다. ✅ (본 문서 작성)

## 작업 개요
- web/mcs-portal 디렉터리 생성 및 Next.js(App Router) 타입스크립트 구조 수동 구성
- 기본 패키지 구성(package.json), 
ext.config.js, 	sconfig.json 등 설정 파일 작성
- 테마/컬러 상수 정의(src/theme/colors.ts, globals.css)
- 트리/레이아웃/헤더 컴포넌트 스켈레톤 작성 (TreePanel.tsx, MainLayout.tsx, HeaderBar.tsx)
- React Query 및 Ant Design을 사용할 준비 (패키지 의존성 명시만, 실제 설치는 개발자가 npm 실행)
- README에 설치/개발 명령어 및 VS Code 확장/스크립트 안내 추가

## 파일/디렉터리 구조
`
web/mcs-portal/
 ├─ package.json
 ├─ next.config.js
 ├─ tsconfig.json
 ├─ next-env.d.ts
 ├─ README.md
 └─ src/
     ├─ app/
     │   ├─ layout.tsx
     │   ├─ page.tsx
     │   └─ globals.css
     ├─ components/
     │   ├─ HeaderBar.tsx
     │   ├─ MainLayout.tsx
     │   └─ TreePanel.tsx
     └─ theme/
         └─ colors.ts
`

## 다음 실행 지침
- 
pm install 실행 시 필요한 패키지 자동 설치 (README 참고)
- Ant Design 트리 컴포넌트 스타일 커스터마이징은 추후 구현 태스크에서 진행
- API 연동, 상태 관리(React Query) 초기 세팅은 Implementation Phase 2 이후 작업 예정

