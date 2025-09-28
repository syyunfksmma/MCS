# Async Incremental Loading Guidance

## Recommended Libraries
- **CommunityToolkit.Mvvm**: Provides `ObservableObject`, `RelayCommand`, and `AsyncRelayCommand` for clean MVVM command handling.
- **DynamicData**: Supplies reactive data pipelines (`SourceCache`, `VirtualizedChanges`) enabling efficient diffing when incremental pages arrive.
- **Microsoft.Toolkit.Uwp.UI** (via `WindowsCommunityToolkit.Mvvm` desktop packages) or **CommunityToolkit.WinUI.Collections**: Use `IncrementalLoadingCollection`/`VirtualizingCollectionView` wrappers for virtualization-aware collections in WPF/WinUI hybrid scenarios.

## Binding Patterns
- Expose an `ICollectionView` that wraps a `ReadOnlyObservableCollection<T>` fed by `DynamicData` to keep UI virtualization intact while applying filters/sorts.
- Use `AsyncRelayCommand` for load-more triggers and guard with `IsLoading` flags to prevent concurrent fetches.
- Implement `IncrementalLoadingCollection<TViewModel>` with overrides for `HasMoreItems` and `LoadMoreItemsAsync`, delegating to a repository that supports server-side paging and cancellation tokens.
- Connect SignalR or gRPC streaming updates to `SourceCache.Edit` to merge invalidated rows and raise lightweight replace notifications without resetting the entire collection.

## Workflow Example
1. View binds `ItemsSource` of the virtualized tree/grid to the `ICollectionView`.
2. Scroll event triggers the built-in incremental loader, which executes an `AsyncRelayCommand` calling `LoadMoreItemsAsync`.
3. The repository fetches the next page asynchronously, updates the `SourceCache`, and DynamicData propagates only the delta to the bound view.
4. Cache invalidation hooks invoke `SourceCache.Refresh` for affected keys, keeping virtualization states (expanded nodes, selection) intact.
