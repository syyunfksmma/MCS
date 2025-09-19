using System.IO;
using FluentValidation.AspNetCore;
using MCMS.Infrastructure;
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
}).AddJwtBearer();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MCMS API v1");
    options.DocumentTitle = "MCMS API";
});

app.UseHttpsRedirection();
app.UseCors("Default");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
