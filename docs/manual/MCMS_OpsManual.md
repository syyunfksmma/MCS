# MCMS Operations Manual — Sprint 7 Revision

## 1. 개요
- 대상: 운영/지원 팀
- 업데이트 일자: 2025-09-29 12:06 KST

## 2. 배포 절차
- package-offline.ps1 → notify-deploy.ps1 → run-smoke.ps1 순서
- Stage/Prod 환경 엔드포인트 요약 (`mcms-stage.internal`, `mcms.internal`)

## 3. 롤백 & DR
- Sprint6_DRPlaybook 섹션 참조
- 자동 알림(Webhook) 기록 확인 방법

## 4. 모니터링
- Grafana 대시보드 링크, Alert Rule 요약
- 로그 파이프라인(LogPipeline.md) 점검 포인트

## 5. 운영 체크리스트
- 배포 전/후 점검, Smoke 결과 기록, Ops 공지 발송 절차

## 6. 부록
- 관련 스크립트 목록: package-offline, run-smoke, notify-deploy, check-offline-logs

*Maintained by Codex*
