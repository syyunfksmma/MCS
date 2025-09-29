> PRD: docs/PRD_MCS.md  
> Task Lists: docs/MCMS_TaskList.md, docs/Tasks_MCS.md, docs/Tasks_ML_Routing.md  
> Remaining Tasks: 0

## 절대 지령
- 각 단계는 승인 후에만 진행한다.
- 단계 착수 전 이번 단계 전체 범위를 리뷰하고 오류를 식별한다.
- 오류 발견 시 수정 전에 승인 재요청한다.
- 이전 단계 오류가 없음을 재확인한 뒤 다음 단계 승인을 요청한다.
- 모든 단계 작업은 백그라운드 방식으로 수행한다.
- 문서/웹뷰어 점검이 필요한 경우 반드시 승인 확인 후 진행한다.
- 다음 단계 착수 전에 이전 단계 전반을 재점검하여 미해결 오류가 없는지 확인한다.
- 만약 오류나 사용자의 지시로 task나 절대지령이 수정될시 취소선으로 기존 지시나 이력을 보존하고, 아래에 추가한다.
- 모든 웹은 codex가 테스트 실시 후 이상 없을시 보고한다.
- 1인 개발자와 codex가 같이 협업하며, 모든 산출물은 codex가 작업한다. 중간 중간 성능 향상이나 기능 향상을 위해 제안하는 것을 목표로한다.
- 이 서비스는 사내 내부망으로 운영될 예정이며, 외부 서버나 클라우드 사용은 절대 금한다.
- local 호스트 서버를 통해 PoC를 1인 개발자와 같이 진행하며, 테스트 완료시 1인 개발자 PC를 서버로하여 사내망에 릴리즈한다.
- 코딩과 IT기술을 전혀 모르는 인원도 쉽게 PoC가 가능하도록 Docker나 기타 exe 형태로 배포할 방법을 검토하며 개발 진행한다.
- 모든 스프린트 태스크는 전용 스프린트 Task List를 참조하고, docs/sprint 명세에 따른 영어 로그북 + 설명적 코드 주석을 남김.
# MCMS Next.js Transition Executive Summary Deck

## 1. Program Background
- Legacy MCMS Explorer UI couples WinForms front-end with CAM add-ins, increasing change lead time and causing audit gaps.
- Production support relies on manual package transfers and inconsistent offline procedures.
- Stakeholders approved a web-first migration (Next.js + .NET) to align with manufacturing digital twin roadmap.

## 2. Scope Snapshot (Sprint 0 Baseline)
| Domain | In Scope | Out of Scope (For Now) |
| --- | --- | --- |
| Explorer UX | Item/Revision/Routing browsing, history timeline, search filters, quick actions | CAD authoring; full 3D preview beyond lightweight STL |
| Workflow | Approve/Reject with comments, SLA tracking, routing rollbacks | ERP work-order sync automation |
| File Delivery | Offline package generation, checksum verification, shared drive mirroring | Legacy FTP mirrors |
| Monitoring | Smoke CI, auth monitoring, Grafana dashboards | SAP integration KPIs |

## 3. Expected Outcomes (12-week horizon)
1. Cut CAM program release lead time by **30%** via automated packaging and approvals.
2. Reduce routing version mismatch incidents to **zero** through hash validation and runbook controls.
3. Provide on-call visibility with unified smoke/auth dashboards, decreasing recovery time to **<15 minutes**.

## 4. Decision & Dependency Highlights
- Exec Sponsor (Manufacturing GM) endorses phased rollout; SteerCo cadence: monthly.
- Requires IT security sign-off on SSO, TLS, and Node hosting policies.
- Needs cross-team agreement on shared drive taxonomy (resolved in Sprint 8 deliverables).

## 5. Milestone Roadmap Overview
| Wave | Focus | Target Completion |
| --- | --- | --- |
| Wave 1 | Phase 0-2 governance, architecture baselines | 2025-10-03 |
| Wave 2 | Explorer + Workflow MVP (Sprints 5-7) | 2025-10-31 |
| Wave 3 | QA/UAT (Sprints 8-9) | 2025-11-21 |
| Wave 4 | Deployment & Training (Sprints 10-12) | 2025-12-19 |

## 6. Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial executive summary deck drafted for Phase 0 checkbox completion |

