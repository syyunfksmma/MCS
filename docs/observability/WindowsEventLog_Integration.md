# Windows Event Log Integration — 2025-09-29

## Forwarding Strategy
- Use Serilog `WriteTo.EventLog` sink for critical events (Service failures, deployment outcomes).
- Event Source: `MCMS.Api` (created via `New-EventLog`).

## Implementation Snippet
```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.EventLog(
        source: "MCMS.Api",
        manageEventSource: true,
        restrictedToMinimumLevel: LogEventLevel.Error)
    .CreateLogger();
```

## Monitoring
- Event Viewer → Applications and Services Logs → MCMS.Api.
- Promtail tailing `C:\MCMS\logs\eventlog.json` exported via `wevtutil qe` scheduled task.

> 작성: 2025-09-29 Codex
