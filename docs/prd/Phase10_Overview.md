# Phase 10 산출물 - Deployment & Operations 개요
> ~~이전 버전: Windows 인증/IIS 기반 구성~~

## 목표
- 로컬 PC(Node.js 20) 기반 배포/운영 절차 정립
- ~~이메일 인증(Magic Link) 운영/모니터링 체계 수립~~
- 이메일 가입 + 관리자 수동 승인 운영/모니터링 체계 수립
- 간단한 롤백 절차 및 로그 아카이브 구성

## 산출물
- `Phase10_DeploymentRunbook.md`
- `Phase10_RollbackStrategy.md`
- `Phase10_MonitoringPlan.md`

## 기간 (예상)
- Sprint 6: 2026-03-02 ~ 2026-03-20

## 성공 지표
- 배포 수동 단계 5단계 이하 유지
- 롤백 시간 10분 이내 (git revert + npm run start)
- 이메일 인증 실패율 1% 이하 / 알람 탐지 2분 이내

## 위험
- 로컬 SMTP 계정 잠금 시 인증 중단
- pm2/터미널 프로세스 종료 시 서비스 다운
- 로그 미수집으로 이슈 추적 어려움
