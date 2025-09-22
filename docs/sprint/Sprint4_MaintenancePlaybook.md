# Sprint 4 Maintenance UX

## Configuration
- File: web/mcs-portal/src/config/maintenance.json.
- Fields:
  - ctive: boolean toggle for hard maintenance gate.
  - window.start / window.end: ISO timestamps for schedule.
  - message: free-form note displayed in banner/gate.
  - contact: ops contact email.

## Runtime Behaviour
- MaintenanceBanner renders a banner when maintenance is active or scheduled within 24 hours.
- MaintenanceGate blocks the app when ctive is true (respecting window) with a controlled override.
- Override persists via localStorage (mcs-maintenance-override).

## Ops Checklist (D3)
1. Update maintenance.json with upcoming window and message.
2. Merge/deploy configuration change.
3. During maintenance set ctive=true to switch portal into read-only gate.
4. After validation turn ctive=false, update window for next schedule.
5. Review eports/web-vitals.jsonl for regressions post-maintenance.
