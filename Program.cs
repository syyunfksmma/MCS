using MCMS.CmdContracts.Commands;
using MCMS.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMcmsInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CmdPolicy", policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("CmdPolicy");

app.MapPost("/cmd/deploy/client", async ([FromBody] DeployClientCommand command, ICommandQueue queue, ILoggerFactory loggerFactory, CancellationToken cancellationToken) =>
{
    var logger = loggerFactory.CreateLogger("CmdHost");
    logger.LogInformation("Client 배포 명령 수신: Package={PackagePath}, Targets={Targets}", command.PackagePath, string.Join(",", command.TargetMachines));
    await queue.EnqueueAsync(command, cancellationToken);
    return Results.Accepted();
});

app.MapPost("/cmd/deploy/machine-package", async ([FromBody] DeployMachinePackageCommand command, ICommandQueue queue, ILoggerFactory loggerFactory, CancellationToken cancellationToken) =>
{
    var logger = loggerFactory.CreateLogger("CmdHost");
    logger.LogInformation("MachinePackage 배포 명령 수신: Machine={MachineId}, Fixture={FixtureId}", command.MachineId, command.FixtureId);
    await queue.EnqueueAsync(command, cancellationToken);
    return Results.Accepted();
});

app.MapPost("/cmd/sync/permissions", async ([FromBody] SyncPermissionsCommand command, ICommandQueue queue, ILoggerFactory loggerFactory, CancellationToken cancellationToken) =>
{
    var logger = loggerFactory.CreateLogger("CmdHost");
    logger.LogInformation("권한 동기화 명령 수신: Path={Path}, Group={Group}", command.TargetPath, command.GroupName);
    await queue.EnqueueAsync(command, cancellationToken);
    return Results.Accepted();
});

app.MapGet("/cmd/health", () => Results.Ok(new { status = "ok", timestamp = DateTimeOffset.UtcNow }));

app.Run();
