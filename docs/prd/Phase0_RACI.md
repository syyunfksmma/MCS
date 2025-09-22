# Phase 0 산출물 - Stakeholder RACI & 승인 플로우

## 1. 핵심 이해관계자
| 역할 | 이름/조직 | 주요 관심 | 비고 |
|---|---|---|---|
| Executive Sponsor | 제조혁신실장 | 전환 ROI, 일정 | 최종 승인권자 |
| Product Owner | CAM 운영팀장 | 기능 범위, 사용자 만족도 | 데일리 의사결정 |
| IT Security Lead | 보안실 과장 | SSO, 정책 준수 | 보안 승인 |
| Infra/Network Lead | 인프라팀 | Node 호스팅, 네트워크 정책 | 배포 승인 |
| Add-in Owner | ESPRIT 담당 엔지니어 | Add-in 연동 영향 | 기능 검증 |

## 2. RACI 매트릭스
| 작업 | Product Owner | Exec Sponsor | IT Security | Infra Lead | Add-in Owner |
|---|---|---|---|---|---|
| Next.js 전환 승인 | A | R | C | C | C |
| SSO 정책 합의 | C | I | R | C | I |
| Node 호스팅 방식 결정 | C | I | C | R | I |
| Add-in 연동 영향 검토 | C | I | I | I | R |
| 일정/예산 확정 | R | A | C | C | I |

- **R**esponsible: 실행 주체, **A**ccountable: 최종 책임, **C**onsulted: 자문, **I**nformed: 통보

## 3. 승인 플로우
1. Product Owner가 Phase 0 산출물(Executive Deck, RACI, 정책 메모)을 취합
2. IT Security, Infra Lead가 각각 SSO/호스팅 정책 리뷰 후 코멘트
3. 모든 피드백 수렴 후 Executive Sponsor에게 최종 승인 요청
4. 승인 완료 시 Phase 1 킥오프 회의 일정 확정

## 4. 회의/커뮤니케이션 계획
- Steering 회의: 월 2회 (Exec Sponsor, Product Owner, IT/Infra Leads)
- 작업 그룹 회의: 주 1회 (Product Owner 주관)
- 기록: Confluence 페이지 + Teams 채널에서 공유

## 5. 준비해야 할 추가 자료
- SSO 아키텍처 다이어그램 (IT Security 요구)
- Node 서비스 재시작/모니터링 Runbook 초안 (Infra 요구)
- Add-in 영향 분석 메모 (Add-in Owner 요구)
