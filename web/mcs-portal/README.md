# MCS Portal (Next.js)

이 프로젝트는 Manufacturing CAM Management System의 웹 포털 프런트엔드입니다. Next.js(App Router) + TypeScript + Ant Design을 사용합니다.

## 절대 조건
- 각 단계는 승인 후 진행
- 변경 사항은 반드시 문서로 기록
- Task 체크박스 갱신

## 개발 환경 준비
`ash
cd web/mcs-portal
npm install
npm run dev
`

## 주요 스크립트
- 
pm run dev : 개발 서버 (http://localhost:3000)
- 
pm run build : 프로덕션 빌드
- 
pm run start : 빌드 결과 실행
- 
pm run lint : ESLint 검사

## VS Code 추천 확장
- ESLint
- Prettier
- Tailwind CSS IntelliSense (선택)
- Ant Design Snippets (선택)

## 구조
`
src/
 ├─ app/
 │   ├─ layout.tsx        # 전역 레이아웃, 반응형 컨테이너
 │   ├─ page.tsx          # 대시보드 기본 페이지
 │   └─ globals.css       # 글로벌 스타일
 ├─ components/
 │   ├─ HeaderBar.tsx     # 상단 헤더
 │   ├─ MainLayout.tsx    # 공통 레이아웃 및 사이드바
 │   └─ TreePanel.tsx     # 품목/Revision/라우팅 트리
 └─ theme/
     └─ colors.ts         # 파스텔 톤 컬러 정의
`

## 앞으로의 작업
- API 연동 및 React Query 설정
- 인증/권한 흐름 구현
- 생산 관리자용 대시보드 추가

