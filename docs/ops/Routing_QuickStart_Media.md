# 절대 지령
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
# Routing Quick-start Media Plan

<!-- Embed Location: docs portal ▸ Media Library ▸ Routing Quick Start -->

## 1. Objective
Produce a 3–4 minute quick-start video (exported as MP4) and a 90-second GIF summarizing routing creation, version management, and approvals. Deliverables will be embedded on the docs portal and distributed via LMS.

## 2. Storyboard Outline
1. **Intro (0:00–0:20)** — Title card, narrator introduces routing workspace and highlights prerequisites.
2. **Create Routing (0:20–1:10)** — Demonstrate adding operations, applying templates, and saving. Capture cursor focus on validation toasts.
3. **Attach Files (1:10–1:45)** — Showcase drag-and-drop upload, checksum display, and mandatory file indicators.
4. **Version Management (1:45–2:30)** — Open version history, compare revisions, and mark a version as Ready.
5. **Approval Workflow (2:30–3:15)** — Submit for approval, show notification feed, and highlight approver comment thread.
6. **Wrap-up (3:15–3:30)** — Present resource links: user guide, support FAQ, admin handbook.

## 3. Narration Script (Draft)
- *“Welcome to MCMS Routing. In this quick tour we’ll create a routing, attach required CAM outputs, and manage approvals.”*
- *“Start in Explorer ▸ Routing. Select a product revision, then click **New Routing** to load the operation template.”*
- *“Uploads finish once the checksum turns green. Missing mandatory files trigger the Ready checklist below the attachments grid.”*
- *“Every save creates a version. Use **Compare** to review operation deltas and confirm timestamps before requesting approval.”*
- *“When you submit for approval, the approver receives a worklist notification and can respond in-line. Keep collaboration notes concise.”*
- *“That’s the tour. Visit the user guide or admin handbook for deeper workflows.”*

## 4. Capture & Editing Notes
- Recording tool: ScreenFlow 10 (fallback: OBS Studio 30.2).
- Resolution: 1920×1080 @ 60 FPS; export 12 Mbps H.264.
- Overlay annotations: highlight cursor path during approval submission.
- Caption file: generate WebVTT via Descript and upload to LMS.

## 5. Distribution Checklist
- ~~Publish MP4 and GIF to SharePoint media library folder `Routing/Training/2025`.~~ (2025-09-29 Codex, docs/phase11/Quickstart_Distribution_Log.md)
- ~~Update docs site front-matter to embed MP4 via `<video>` tag (autoplay disabled).~~ (2025-09-29 Codex, docs/training/MCMS_TrainingMaterials.md#5)
- ~~Add GIF to onboarding email template with 1 MB size target.~~ (2025-09-29 Codex, docs/training/Onboarding_Email_Template.md)
- ~~Log upload URLs in Sprint 11 logbook with reviewer sign-off.~~ (2025-09-29 Codex, docs/phase11/Quickstart_Distribution_Log.md)


