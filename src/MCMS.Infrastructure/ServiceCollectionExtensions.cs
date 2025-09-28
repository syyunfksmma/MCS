using MCMS.Core.Abstractions;
using MCMS.Infrastructure.FileStorage;
using MCMS.Infrastructure.Integrations;
using MCMS.Infrastructure.Persistence;
using MCMS.Infrastructure.Queue;
using MCMS.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MCMS.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMcmsInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FileStorageOptions>(configuration.GetSection("FileStorage"));
        services.Configure<EspritAutomationOptions>(configuration.GetSection("EspritAutomation"));
        services.AddMemoryCache();

        services.AddDbContext<McmsDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("McmsDatabase")
                ?? throw new InvalidOperationException("McmsDatabase ?? ???? ?? ? ????.");
            options.UseSqlServer(connectionString);
        });

        services.AddScoped<IItemService, ItemService>();
        services.AddScoped<IRoutingService, RoutingService>();
        services.AddScoped<IRoutingApprovalService, RoutingApprovalService>();
        services.AddScoped<IRoutingFileService, RoutingFileService>();
        services.AddScoped<IRoutingChunkUploadService, RoutingChunkUploadService>();
        services.AddScoped<IRoutingSearchService, RoutingSearchService>();
        services.AddScoped<IHistoryService, HistoryService>();
        services.AddScoped<IAuditLogService, AuditLogService>();
        services.AddScoped<IAddinJobService, AddinJobService>();
        services.AddScoped<IAddinKeyService, AddinKeyService>();
        services.AddSingleton<IFileStorageService, FileStorageService>();
        services.AddSingleton<ICommandQueue, InMemoryCommandQueue>();
        services.AddSingleton<IEspritAutomationService, EspritAutomationService>();
        services.AddSingleton<ISolidWorksIntegrationService, SolidWorksIntegrationServiceStub>();

        return services;
    }
}
