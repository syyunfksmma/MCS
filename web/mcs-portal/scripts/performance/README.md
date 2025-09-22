# Performance Scripts

## Lighthouse
Run 
pm run perf:lighthouse to produce JSON reports under eports/lighthouse.

## k6 Workspace Smoke
Run k6 run scripts/performance/k6-workspace.js (requires [k6](https://k6.io/) CLI).
Override base URL with BASE_URL=https://staging.example.com k6 run ....

## Chaos Simulation (manual)
- Use 
pm run build && npm run start to launch the Next.js server.
- Restart the server while keeping clients connected to emulate process recycle.
- Pair with k6 smoke to validate reconnection handling.
