using MCMS.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MCMS.Infrastructure.Persistence;

public class McmsDbContext(DbContextOptions<McmsDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemRevision> ItemRevisions => Set<ItemRevision>();
    public DbSet<Routing> Routings => Set<Routing>();
    public DbSet<RoutingStep> RoutingSteps => Set<RoutingStep>();
    public DbSet<RoutingFile> RoutingFiles => Set<RoutingFile>();
    public DbSet<HistoryEntry> HistoryEntries => Set<HistoryEntry>();
    public DbSet<SolidWorksLink> SolidWorksLinks => Set<SolidWorksLink>();
    public DbSet<MachinePackage> MachinePackages => Set<MachinePackage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Item>(builder =>
        {
            builder.HasIndex(x => x.ItemCode).IsUnique();
            builder.Property(x => x.ItemCode).HasMaxLength(64);
            builder.Property(x => x.Name).HasMaxLength(128);
        });

        modelBuilder.Entity<ItemRevision>(builder =>
        {
            builder.HasIndex(x => new { x.ItemId, x.RevisionCode }).IsUnique();
            builder.Property(x => x.RevisionCode).HasMaxLength(32);
        });

        modelBuilder.Entity<Routing>(builder =>
        {
            builder.HasIndex(x => new { x.ItemRevisionId, x.RoutingCode }).IsUnique();
            builder.Property(x => x.RoutingCode).HasMaxLength(64);
            builder.Property(x => x.CamRevision).HasMaxLength(32);
        });

        modelBuilder.Entity<RoutingStep>(builder =>
        {
            builder.HasIndex(x => new { x.RoutingId, x.Sequence }).IsUnique();
            builder.Property(x => x.Machine).HasMaxLength(64);
            builder.Property(x => x.ProcessDescription).HasMaxLength(512);
        });

        modelBuilder.Entity<RoutingFile>(builder =>
        {
            builder.Property(x => x.FileName).HasMaxLength(256);
            builder.Property(x => x.RelativePath).HasMaxLength(512);
            builder.Property(x => x.Checksum).HasMaxLength(128);
        });

        modelBuilder.Entity<HistoryEntry>(builder =>
        {
            builder.Property(x => x.ChangeType).HasMaxLength(64);
            builder.Property(x => x.Field).HasMaxLength(128);
        });

        modelBuilder.Entity<SolidWorksLink>(builder =>
        {
            builder.Property(x => x.ModelPath).HasMaxLength(512);
        });

        modelBuilder.Entity<MachinePackage>(builder =>
        {
            builder.Property(x => x.MachineId).HasMaxLength(64);
            builder.Property(x => x.FixtureId).HasMaxLength(64);
            builder.Property(x => x.MachineProjectPath).HasMaxLength(512);
            builder.Property(x => x.FixturePath).HasMaxLength(512);
        });
    }
}

