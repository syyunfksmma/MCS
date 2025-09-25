using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using Esprit;
using ESPRIT.KBMAccess;
using ESPRIT.KBMDALComInterop;
using CAM_API.Common.DTO;
using CAM_API.Common.Helpers;
using CAM_API.KBM.UI.Views;


/// <summary>
/// Applies a KBM process directly, bypassing the process manager.
/// Only retrieves the first process from the KBM.
/// Needs further review for practical use cases.
/// </summary>



public class KBMProcessManager
{
    private readonly Esprit.Application _app;
    private readonly Esprit.Document Document;
    //private readonly ProcessManager _processManager;
    private readonly Manager _manager;


    public KBMProcessManager(Esprit.Application application)
    {
        _app = application ?? throw new ArgumentNullException(nameof(application));
        Document = _app.Document;
        _manager = new Manager();
    }

    public List<PartType> ScanPartType()
    {
        try
        {
            var partTypes = new ESPRIT.KBMAccess.PartTypes();
            partTypes.Fill();
            return partTypes.ToList();
        }
        catch (Exception ex)
        {
            LogError("PartType Manager", $"Error scanning part types: {ex.Message}");
            return new List<PartType>();
        }
    }

    private IEnumerable<Esprit.GraphicObject> GetValidFeatures()
    {
        return Document.GraphicsCollection
            .Cast<Esprit.GraphicObject>()
            .Where(obj => obj is Esprit.FeatureChain || obj is Esprit.HolesFeature || obj is Esprit.TurningFeatureChain);
    }

    public void ProcessAllFeatures()
    {
        try
        {
            var features = GetValidFeatures();
            if (!features.Any())
            {
                ShowError("No valid features found");
                return;
            }

            foreach (var feature in features)
                ApplyProcessToFeature(feature);

            var all = DuplicateToolOpsHelper.GatherAll(Document);
            var dupes = DuplicateToolOpsHelper.FindDuplicates(all);

            if (dupes.Count == 0)
            {
                // 2-1) 중복 없음: 성공 알림
                LogInfo("ProcessManager", "All processes applied. No duplicate tool numbers.");
                MessageBox.Show("적용 완료. 중복 공구 번호가 없습니다.",
                                "KBM Process", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            // 3) 중복 있음: 창 띄워서 선택 삭제
            var dlg = new DuplicateToolOpsWindow(dupes)
            {
                Owner = System.Windows.Application.Current?.MainWindow
            };
            var ok = dlg.ShowDialog() == true;
            if (ok)
            {
                var selected = dlg.SelectedItems;
                if (selected.Any())
                {
                    DuplicateToolOpsHelper.RemoveSelected(Document, selected);
                    LogInfo("ProcessManager", $"Removed {selected.Count} duplicated operations.");
                    MessageBox.Show($"{selected.Count}개 공정을 삭제했습니다.",
                                    "KBM Process", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }

        }
        catch (Exception ex)
        {
            LogError("Process Manager", $"Error applying process: {ex.Message}");
        }
    }

    private void ApplyProcessToFeature(object featureObj)
    {
        var processManager = new ESPRIT.KBMDALComInterop.ProcessManager();
        object espritApp = _app;
        var processes = processManager.GetProcesses(ref featureObj, ref espritApp);

        if (processes?.Length > 0)
        {
            processManager.ApplyProcessItem(processes[0], ref featureObj, ref espritApp);
            LogInfo("ProcessManager", $"Applied Process: {processes[0].Name}");
        }
    }

    private void ShowError(string message)
    {
        MessageBox.Show(message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
    }

    private void LogError(string source, string message)
    {
        _app.EventWindow.AddMessage(
            EspritConstants.espMessageType.espMessageTypeError, source, message);
    }

    private void LogInfo(string source, string message)
    {
        _app.EventWindow.AddMessage(
            EspritConstants.espMessageType.espMessageTypeInformation, source, message);
    }
}