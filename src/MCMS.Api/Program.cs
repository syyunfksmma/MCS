using System.IO;
using FluentValidation.AspNetCore;
using MCMS.Api.Hubs;
using MCMS.Api.Notifications;
using MCMS.Api.Streaming;
using MCMS.Infrastructure;
using MCMS.Infrastructure.Persistence;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MCMS API",
        Version = "v1",
        Description = "Manufacturing CAM Management System routing and file services"
    });

    var xmlDocuments = new[]
    {
        Path.Combine(AppContext.BaseDirectory, "MCMS.Api.xml"),
        Path.Combine(AppContext.BaseDirectory, "MCMS.Core.xml"),
        Path.Combine(AppContext.BaseDirectory, "MCMS.Infrastructure.xml")
    };

    foreach (var xmlPath in xmlDocuments)
    {
        if (File.Exists(xmlPath))
        {
            options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
        }
    }
});

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddMcmsInfrastructure(builder.Configuration);

builder.Services.AddSignalR();
builder.Services.AddSingleton<IRoutingEventStream, RoutingEventStream>();
builder.Services.AddSingleton<IRoutingEventPublisher, RoutingEventPublisher>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
}).AddJwtBearer();

builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = HttpLoggingFields.All;
    options.RequestBodyLogLimit = 4 * 1024;
    options.ResponseBodyLogLimit = 4 * 1024;
    options.MediaTypeOptions.AddText("application/json");
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<McmsDbContext>();
    db.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MCMS API v1");
    options.DocumentTitle = "MCMS API";
});

app.UseHttpLogging();
app.UseHttpsRedirection();
app.UseCors("Default");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<RoutingHub>("/hubs/routing");
app.MapHub<PresenceHub>("/hubs/presence");
app.MapHub<TreeHub>("/hubs/tree");

app.Run();
