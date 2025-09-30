> PRD: docs/PRD_MCS.md  
> Sprint Task Lists: docs/sprint/Sprint6_Routing_TaskList.md, docs/sprint/Sprint7_Routing_TaskList.md  
> Remaining Tasks: 17

# Hover Menu Screenshot Checklist

| Asset | Description | Capture Steps | Status |
|-------|-------------|---------------|---------|
| `hover-menu-enabled.png` | Hover Quick Menu (search list) with SLA breach badge | Storybook → Explorer/Hover Menu → `PendingWithSla` story, enable feature flag, take 1280×720 capture | Pending (CLI 환경에서는 직접 캡처 불가) |
| `hover-menu-tree.png` | TreePanel hover menu (routing node) | Run web app with `feature.hover-quick-menu` enabled, hover routing in tree, capture overlay | Pending (수동 캡처 필요) |

## Capture Guidance
- 브라우저에서 Storybook을 실행해 위 시나리오를 캡처하고, 파일을 이 폴더 (`docs/design/reference/hover_menu/`)에 저장합니다.
- 파일명은 표에 기재된 이름을 사용하세요. 필요 시 추가 각도/해상도는 `_alt` suffix로 구분합니다.
- 캡처 후 `docs/sprint/Sprint6_Routing_Log.md`와 `docs/logs/Wave_TimeLog.md`에 시간/파일명을 기록해 공유하십시오.

## Notes
- CLI 환경에서는 실시간 GUI 캡처를 제공할 수 없습니다. 위 절차에 따라 별도 워크스테이션에서 수동 캡처를 진행해야 합니다.
- Hover Quick Menu는 `feature.hover-quick-menu` 토글로 활성화할 수 있습니다 (ExplorerShell 상단 카드 참고).
