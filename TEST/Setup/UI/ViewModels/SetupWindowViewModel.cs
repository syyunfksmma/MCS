using CAM_API.Common.Commands;
using CAM_API.Common.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Input;
using CAM_API.Common;
using CAM_API.Setup.Services;
using CAM_API.Setup.Model;
using Esprit;
using System.Collections.ObjectModel;

namespace CAM_API.Setup.UI.ViewModels
{
    public class SetupWindowViewModel : BaseViewModel
    {
        private readonly Esprit.Application _app;
        private readonly ImportCadService _importCadService;

        public SetupWindowViewModel()
        {
            _app = Main._espritApplication;
            _importCadService = new ImportCadService(_app);

            MachineTemplates = new ObservableCollection<KeyValuePair<string, MachineTemplates.MachineTemplate>>();
            PartTypes = new ObservableCollection<ESPRIT.KBMAccess.PartType>();

            ShowProgramInfoCommand = new RelayCommand(OnShowProgramInfo);
            EditTemplateCommand = new RelayCommand(OnEditTemplate);
            LoadPartFileCommand = new RelayCommand(OnLoadPartFile);
            LoadStockFileCommand = new RelayCommand(OnLoadStockFile);
            AlignSolidCommand = new RelayCommand(ExecuteAlignSolid);
            LoadMachineCommand = new RelayCommand(ExecuteLoadMachine);
            ImportCommand = new RelayCommand(ExecuteImport);
            CancelCommand = new RelayCommand(() => CloseWindow?.Invoke());

            // �⺻�� �ʱ�ȭ
            IsG54 = true;
            IsBarStock = true;
            FinishLG = 0;
            StockOD = 0;
            StockID = 0;
            StockLG = 0;

            LoadMachineTemplates();
            LoadPartTypes();
            LoadProgramName();
        }

        // ----------------------- Properties (Bindable) ------------------------
        public ObservableCollection<KeyValuePair<string, MachineTemplates.MachineTemplate>> MachineTemplates { get; set; }
        public ObservableCollection<ESPRIT.KBMAccess.PartType> PartTypes { get; }

        // ���� ���
        private string _partFilePath;
        public string PartFilePath
        {
            get => _partFilePath;
            set { _partFilePath = value; OnPropertyChanged(); }
        }

        private string _stockFilePath;
        public string StockFilePath
        {
            get => _stockFilePath;
            set { _stockFilePath = value; OnPropertyChanged(); }
        }

        private string _programName = "*** NEW ***";
        public string ProgramName
        {
            get => _programName;
            set { _programName = value; OnPropertyChanged(); }
        }

        // �޺��ڽ� ���� ��
        private KeyValuePair<string, MachineTemplates.MachineTemplate>? _selectedMachineTemplate;
        public KeyValuePair<string, MachineTemplates.MachineTemplate>? SelectedMachineTemplate
        {
            get => _selectedMachineTemplate;
            set
            {
                _selectedMachineTemplate = value;
                OnPropertyChanged();
                // G55 ��뿩��, ���� �� �߰� ó�� �ʿ�� �̰�
                if (value?.Value != null)
                {
                    IsG55Enabled = value.Value.Value["CheckG55", false];
                    OnPropertyChanged(nameof(IsG55Enabled));
                }
            }
        }

        private ESPRIT.KBMAccess.PartType _selectedPartType;
        public ESPRIT.KBMAccess.PartType SelectedPartType
        {
            get => _selectedPartType;
            set { _selectedPartType = value; OnPropertyChanged(); }
        }

        // WCS ���ε�
        private bool _isG54;
        public bool IsG54
        {
            get => _isG54;
            set
            {
                if (_isG54 != value)
                {
                    _isG54 = value;
                    if (value) IsG55 = false;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(SelectedWorkOffset));
                }
            }
        }
        private bool _isG55;
        public bool IsG55
        {
            get => _isG55;
            set
            {
                if (_isG55 != value)
                {
                    _isG55 = value;
                    if (value) IsG54 = false;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(SelectedWorkOffset));
                }
            }
        }
        private bool _isG55Enabled;
        public bool IsG55Enabled
        {
            get => _isG55Enabled;
            set { _isG55Enabled = value; OnPropertyChanged(); }
        }
        public string SelectedWorkOffset => IsG54 ? "G54" : "G55";

        // Stock Ÿ�� ���ε�
        private bool _isBarStock = true;
        public bool IsBarStock
        {
            get => _isBarStock;
            set
            {
                if (_isBarStock != value)
                {
                    _isBarStock = value;
                    if (value) IsFileStock = false;
                    OnPropertyChanged();
                }
            }
        }
        private bool _isFileStock;
        public bool IsFileStock
        {
            get => _isFileStock;
            set
            {
                if (_isFileStock != value)
                {
                    _isFileStock = value;
                    if (value) IsBarStock = false;
                    OnPropertyChanged();
                }
            }
        }

        // üũ�ڽ� ��
        private bool _usePreviousWCS;
        public bool UsePreviousWCS
        {
            get => _usePreviousWCS;
            set { _usePreviousWCS = value; OnPropertyChanged(); }
        }

        // ��ġ �Է� ����
        private double _stockOD;
        public double StockOD
        {
            get => _stockOD;
            set { _stockOD = value; OnPropertyChanged(); }
        }
        private double _stockID;
        public double StockID
        {
            get => _stockID;
            set { _stockID = value; OnPropertyChanged(); }
        }
        private double _stockLG;
        public double StockLG
        {
            get => _stockLG;
            set { _stockLG = value; OnPropertyChanged(); }
        }
        private double _finishLG;
        public double FinishLG
        {
            get => _finishLG;
            set { _finishLG = value; OnPropertyChanged(); }
        }

        // --------------------- Command ����� -----------------------------

        public ICommand ShowProgramInfoCommand { get; }
        public ICommand EditTemplateCommand { get; }
        public ICommand LoadPartFileCommand { get; }
        public ICommand LoadStockFileCommand { get; }
        public ICommand AlignSolidCommand { get; }
        public ICommand LoadMachineCommand { get; }
        public ICommand ImportCommand { get; }
        public ICommand CancelCommand { get; }

        // --------------------- View���� �̺�Ʈ wiring�� Action --------------------
        public Action<string> RequestOpenFileDialog { get; set; }   // ��Ʈ, ���� ������ ���� (ex: "Part", "Stock")
        public Action RequestShowProgramInfo { get; set; }
        public Action<string> RequestEditTemplate { get; set; }

        public event Action CloseWindow;

        // -------------------- �޼��� ������ -----------------------

        public void LoadMachineTemplates()
        {
            MachineTemplates.Clear();

            MachineTemplates.Add(new KeyValuePair<string, MachineTemplates.MachineTemplate>("*** NEW ***", null)); // �ű� Machine Template ������

            // Use the fully qualified class name to access the singleton Instance
            foreach (var kvp in CAM_API.Setup.Model.MachineTemplates.Instance.MachineMap)
            {
                MachineTemplates.Add(new KeyValuePair<string, CAM_API.Setup.Model.MachineTemplates.MachineTemplate>(kvp.Key, kvp.Value));
            }

            if (MachineTemplates.Count > 0)
                SelectedMachineTemplate = MachineTemplates[0];
            else
                SelectedMachineTemplate = null;
        }

        private void LoadPartTypes()
        {
            var processManager = new KBMProcessManager(_app);
            var types = processManager.ScanPartType();

            PartTypes.Clear();
            foreach (var pt in types)
                PartTypes.Add(pt);
            if (PartTypes.Count > 0)
                SelectedPartType = PartTypes[0];
        }

        private void LoadProgramName()
        {
            var name = _app?.Document?.ProgramSettings?.Name;
            if (!string.IsNullOrEmpty(name))
                ProgramName = name;
        }

        // Ŀ�ǵ� ����: ���α׷� ����(�˾�) ����
        private void OnShowProgramInfo()
        {
            RequestShowProgramInfo?.Invoke();
        }

        // Ŀ�ǵ� ����: ���ø� ���� �˾� ����
        private void OnEditTemplate()
        {
            if (SelectedMachineTemplate != null)
            {
                if (SelectedMachineTemplate.Value.Key == "*** NEW ***")
                    RequestEditTemplate?.Invoke(null); // �ű�
                else
                    RequestEditTemplate?.Invoke(SelectedMachineTemplate.Value.Key);
            }
        }

        // Ŀ�ǵ� ����: ��Ʈ ���� ���� (OpenFileDialog)
        private void OnLoadPartFile()
        {
            RequestOpenFileDialog?.Invoke("Part");
        }
        // Ŀ�ǵ� ����: ���� ���� ���� (OpenFileDialog)
        private void OnLoadStockFile()
        {
            RequestOpenFileDialog?.Invoke("Stock");
        }

        private void ExecuteAlignSolid()
        {
            try
            {
                _importCadService.AlignSolid(SelectedWorkOffset);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Align error: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void ExecuteLoadMachine()
        {
            var tpl = SelectedMachineTemplate?.Value;
            if (tpl == null)
            {
                MessageBox.Show("Please select a valid machine template.", "Error");
                return;
            }

            var manager = new MachinePackageManger(_app);
            manager.CreateMachineSetup(tpl);
        }

        private void ExecuteImport()
        {
            if (_app.Document.InitialMachineSetup.MachineItems.Count < 1)
            {
                MessageBox.Show("Please apply a machine template first.", "Error");
                return;
            }
            if (string.IsNullOrWhiteSpace(ProgramName) || ProgramName == "Program")
            {
                MessageBox.Show("Please enter the program info first.", "Error");
                return;
            }
            if (string.IsNullOrWhiteSpace(PartFilePath))
            {
                MessageBox.Show("No part file selected.", "Error");
                return;
            }

            try
            {
                string PartTypeID = SelectedPartType?.Id.ToString();
                string stockFilePath = StockFilePath;
                string partFilePath = PartFilePath;

                double SOD = 0, SID = 0, SLG = 0, FLG = FinishLG;
                if (!IsFileStock)
                {
                    SOD = StockOD;
                    SID = StockID;
                    SLG = StockLG;
                }

                _importCadService.ImportPartAndStock(stockFilePath, partFilePath, SelectedWorkOffset, SOD, SID, SLG, FLG, IsFileStock, PartTypeID, UsePreviousWCS);
                _importCadService.WorkpieceSetup(SelectedWorkOffset, FLG);

                //SaveDocument();

                MessageBox.Show("Model loaded successfully.", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (FormatException)
            {
                MessageBox.Show("Please enter valid numeric values.", "Error");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while importing:\n{ex.Message}", "Error");
            }
        }

        private void SaveDocument()
        {
            string Name = _app.Document?.ProgramSettings?.Name;
            if (string.IsNullOrWhiteSpace(Name))
                return;
            string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            string espPath = System.IO.Path.Combine(desktop, Name + ".esprit");
            _app.Document.SaveAs(espPath);
        }

        // ----------- �ܺο��� ���ϴ��̾�α� ����� �����ϴ� �޼��� --------------
        public void SetPartFile(string filePath)
        {
            PartFilePath = filePath;
        }
        public void SetStockFile(string filePath)
        {
            StockFilePath = filePath;
        }
        // ���α׷��� �����
        public void UpdateProgramName(string name)
        {
            ProgramName = name;
        }
    }
}