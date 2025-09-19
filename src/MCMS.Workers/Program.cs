using MCMS.Infrastructure;
using MCMS.Workers;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddMcmsInfrastructure(builder.Configuration);

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
