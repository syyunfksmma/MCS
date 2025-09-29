# Serilog Logging Pipeline — 2025-09-29

## Targets
- Structured JSON logs to `C:\MCMS\logs\app\*.log`.
- Enrich with correlation IDs and write to Loki via promtail.

## Configuration
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "MCMS.Api")
    .WriteTo.File(
        path: "C:/MCMS/logs/app/mcms-api-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 14,
        shared: true,
        formatProvider: CultureInfo.InvariantCulture)
    .WriteTo.Console()
    .CreateLogger();
```

## Integration Steps
1. Inject `ILogger<T>` into controllers and background services.
2. Add correlation middleware reading `X-Correlation-ID` and pushing to `LogContext`.
3. Configure promtail job `mcms-api` to ship JSON logs.

## Checklist
- [x] File output verified (14-day retention).
- [x] Correlation ID present in log entries.
- [x] Promtail pipeline updated (monitoring/promtail/config.mcms.yaml).

> 작성: 2025-09-29 Codex
