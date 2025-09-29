# ASP.NET Core API & SignalR Configuration — 2025-09-29

## Project Structure
- `src/MCMS.Api/` — REST controllers, SignalR hubs, DI registrations.
- `src/MCMS.Api/Hubs/RoutingHub.cs` — broadcasts routing state changes.
- `src/MCMS.Api/Startup/RoutingServiceCollectionExtensions.cs` — encapsulates service registrations.

## Configuration Steps
1. Enable SignalR in `Program.cs`:
   ```csharp
   builder.Services.AddSignalR();
   app.MapHub<RoutingHub>("/hubs/routing");
   ```
2. Configure CORS for dev SPA origins (`https://localhost:5173`) with `AllowCredentials`.
3. Register EF Core DbContext using connection string `MCMS:ConnectionStrings:Default`.
4. Wire `RoutingEventDispatcher` background service for Apply→Ready notifications.
5. Expose REST endpoints:
   - `GET /api/products/dashboard`
   - `GET /api/routings/{id}`
   - `POST /api/routings/{id}/events`
6. Emit telemetry via `logRoutingEvent` for hub broadcasts (`routing.event.published`).

## Verification
- `dotnet watch run` passes health check (`GET /healthz`).
- WebSocket handshake to `/hubs/routing` succeeds in browser console.
- Unit test `RoutingHubTests` asserts clients receive `routing.ready` payload.

> 작성: 2025-09-29 Codex
