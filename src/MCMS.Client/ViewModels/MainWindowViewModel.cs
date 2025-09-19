using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MCMS.Client.Services;

namespace MCMS.Client.ViewModels;

public partial class MainWindowViewModel : ObservableObject
{
    private readonly IItemDataService _itemDataService;
    private const int MaxConcurrentHistoryRequests = 5;

    [ObservableProperty]
    private string _title = "MCMS Dashboard";

    [ObservableProperty]
    private ItemSummary? _selectedItem;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    public ObservableCollection<ItemSummary> Items { get; } = new();

    public IAsyncRelayCommand RefreshCommand { get; }

    public MainWindowViewModel(IItemDataService itemDataService)
    {
        _itemDataService = itemDataService;
        RefreshCommand = new AsyncRelayCommand(LoadAsync);
    }

    public async Task InitializeAsync()
    {
        await LoadAsync();
    }

    private async Task LoadAsync()
    {
        if (IsLoading)
        {
            return;
        }

        IsLoading = true;
        ErrorMessage = null;

        try
        {
            var items = await _itemDataService.GetItemsAsync();
            Items.Clear();

            foreach (var item in items)
            {
                var latestRevision = item.Revisions
                    .OrderByDescending(r => r.ValidFrom ?? DateTimeOffset.MinValue)
                    .FirstOrDefault();

                var routings = new List<RoutingSummary>();

                if (latestRevision is not null)
                {
                    var orderedRoutings = latestRevision.Routings
                        .OrderByDescending(r => r.UpdatedAt)
                        .Select((routing, index) => (routing, index))
                        .ToList();

                    using var semaphore = new SemaphoreSlim(MaxConcurrentHistoryRequests);
                    var tasks = orderedRoutings.Select(async entry =>
                    {
                        await semaphore.WaitAsync();
                        try
                        {
                            var (addinStatus, addinMessage) = await ResolveAddinStatusAsync(entry.routing.Id);
                            var summary = new RoutingSummary(
                                entry.routing.RoutingCode,
                                entry.routing.Status.ToString(),
                                entry.routing.CamRevision,
                                entry.routing.UpdatedAt,
                                entry.routing.UpdatedBy,
                                addinStatus,
                                addinMessage);
                            return (entry.index, summary);
                        }
                        finally
                        {
                            semaphore.Release();
                        }
                    }).ToList();

                    var results = await Task.WhenAll(tasks);
                    foreach (var result in results.OrderBy(r => r.index).Select(r => r.summary))
                    {
                        routings.Add(result);
                    }
                }

                Items.Add(new ItemSummary(item.ItemCode, item.Name, latestRevision?.RevisionCode ?? "-", new ObservableCollection<RoutingSummary>(routings)));
            }

            SelectedItem = Items.FirstOrDefault();
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    private async Task<(string Status, string? Message)> ResolveAddinStatusAsync(Guid routingId)
    {
        try
        {
            var history = await _itemDataService.GetRoutingHistoryAsync(routingId);
            var addinEntry = history
                .OrderByDescending(h => h.CreatedAt)
                .FirstOrDefault(h => string.Equals(h.ChangeType, "AddinJobCompleted", StringComparison.OrdinalIgnoreCase)
                                  || string.Equals(h.ChangeType, "AddinJobFailed", StringComparison.OrdinalIgnoreCase));

            if (addinEntry is null)
            {
                return history.Any()
                    ? ("대기", null)
                    : ("미실행", null);
            }

            var status = string.Equals(addinEntry.ChangeType, "AddinJobCompleted", StringComparison.OrdinalIgnoreCase)
                ? "완료"
                : "실패";

            var message = string.IsNullOrWhiteSpace(addinEntry.Comment)
                ? addinEntry.CurrentValue
                : addinEntry.Comment;

            return (status, message);
        }
        catch (Exception ex)
        {
            return ("오류", ex.Message);
        }
    }

}

public record ItemSummary(string ItemCode, string Name, string LatestRevision, ObservableCollection<RoutingSummary> Routings);

public record RoutingSummary(string RoutingCode, string Status, string CamRevision, DateTimeOffset UpdatedAt, string? UpdatedBy, string AddinStatus, string? AddinMessage);



