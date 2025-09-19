using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MCMS.Client.Services;

namespace MCMS.Client.ViewModels;

public partial class MainWindowViewModel : ObservableObject
{
    private readonly IItemDataService _itemDataService;

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

                var routings = latestRevision?.Routings
                    .OrderByDescending(r => r.UpdatedAt)
                    .Select(r => new RoutingSummary(r.RoutingCode, r.Status.ToString(), r.CamRevision, r.UpdatedAt, r.UpdatedBy))
                    .ToList() ?? new List<RoutingSummary>();

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
}

public record ItemSummary(string ItemCode, string Name, string LatestRevision, ObservableCollection<RoutingSummary> Routings);

public record RoutingSummary(string RoutingCode, string Status, string CamRevision, DateTimeOffset UpdatedAt, string? UpdatedBy);



