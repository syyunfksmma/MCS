using System.Windows;

namespace MCMS.Client.Views;

public partial class MainWindow : Window
{
    private readonly ViewModels.MainWindowViewModel _viewModel;

    public MainWindow(ViewModels.MainWindowViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        DataContext = _viewModel;
        Loaded += OnLoadedAsync;
    }

    private async void OnLoadedAsync(object sender, RoutedEventArgs e)
    {
        Loaded -= OnLoadedAsync;
        await _viewModel.InitializeAsync();
    }
}