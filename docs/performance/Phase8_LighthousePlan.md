# Lighthouse & Web Vitals Improvement Plan

## 1. Baseline Targets
| Metric | Current | Target |
| --- | --- | --- |
| LCP | 2.8s | < 2.0s |
| FID (INP) | 110ms | < 100ms |
| CLS | 0.06 | < 0.05 |
| TTFB | 480ms | < 350ms |

## 2. Measurement Pipeline
- Command: `npm run perf:lighthouse:ci` executed per release candidate.
- Artifacts stored under `artifacts/performance/lighthouse/`.
- Web Vitals script sends data to `monitoring/telegraf/web-vitals.conf`.

## 3. Optimization Backlog
- Prefetch Explorer data via React Query + staleTime (done in Phase5).
- Implement image lazy loading on Explorer summary cards.
- Enable Next.js `experimental.optimizeCss` for shared tokens file.

## 4. Action Items
1. Build Playwright + Lighthouse hybrid test capturing filmstrip.
2. Compare blue/green slots before traffic swap.
3. Document regression threshold: fail pipeline if LCP delta > 15%.

## Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Lighthouse/Web Vitals 개선 계획 초안 |
