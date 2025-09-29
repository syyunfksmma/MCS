# Phase 10 PRD - Deployment & Operations
<<<<<<< Updated upstream
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 초점 영역
- 로컬 PC(Node.js) 배포 스크립트/Runbook 정리
- ~~Magic Link 이메일 인증 운영 플로우 확정~~
- 이메일 가입 + 관리자 수동 승인 운영 플로우 확정
- 모니터링·알람·로그 아카이브 체계 구축

## 산출물
- 명령형 Runbook + pm2/Scheduled Task 설정 가이드
- 롤백 절차 문서 및 체크리스트
- 모니터링/알람 대시보드 스냅샷 및 로그 경로 표

## 주요 위험
- 로컬 PC 오프라인 시 서비스 중단
- 이메일 발송 한도 초과 → 인증 실패
- 로그 미정리로 장애 시점 파악 지연
=======

## 초점 영역
- IIS Reverse Proxy + Node 서비스 배포 스크립트
- 롤백 전략(Blue/Green 또는 Canary)
- 모니터링(Grafana/Prometheus) 대시보드 업데이트

## 산출물
- 배포 Runbook
- 모니터링 대시보드 스냅샷

## 주요 위험
- Node 서비스 재기동 자동화 실패
>>>>>>> Stashed changes
