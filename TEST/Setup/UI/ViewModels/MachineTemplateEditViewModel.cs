using CAM_API.Common.Commands;
using CAM_API.Common.ViewModels;
using CAM_API.Setup.Model;
using ESPRIT.KBMDAL.Collections.CuttingTools;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Input;

namespace CAM_API.Setup.UI.ViewModels
{
    public class MachineTemplateEditViewModel : BaseViewModel
    {
        // ---------- 바인딩 속성들 ----------
        private string _templateName;
        public string TemplateName
        {
            get => _templateName;
            set { _templateName = value; OnPropertyChanged(); }
        }

        private string _mprjFile;
        public string MprjFile
        {
            get => _mprjFile;
            set { _mprjFile = value; OnPropertyChanged(); }
        }


        public ObservableCollection<string> ToolList { get; } = new ObservableCollection<string>();
        private string _selectedTool;
        public string SelectedTool
        {
            get => _selectedTool;
            set { _selectedTool = value; OnPropertyChanged(); }
        }

        public string G54Chuck { get => _g54Chuck; set { _g54Chuck = value; OnPropertyChanged(); } }
        public string G54Jaw { get => _g54Jaw; set { _g54Jaw = value; OnPropertyChanged(); } }
        public string G54Rot { get => _g54Rot; set { _g54Rot = value; OnPropertyChanged(); } }
        public string G54XTrans { get => _g54XTrans; set { _g54XTrans = value; OnPropertyChanged(); } }
        public string G54YTrans { get => _g54YTrans; set { _g54YTrans = value; OnPropertyChanged(); } }
        public string G54ZTrans { get => _g54ZTrans; set { _g54ZTrans = value; OnPropertyChanged(); } }
        public string G54JawPosition { get => _g54JawPosition; set { _g54JawPosition = value; OnPropertyChanged(); } }
        public bool UseG54Rot { get => _useG54Rot; set { _useG54Rot = value; OnPropertyChanged(); } }
        public bool UseG54JawReverse { get => _useG54JawReverse; set { _useG54JawReverse = value; OnPropertyChanged(); } }

        // G55
        public bool UseG55 { get => _useG55; set { _useG55 = value; OnPropertyChanged(); } }
        public string G55Chuck { get => _g55Chuck; set { _g55Chuck = value; OnPropertyChanged(); } }
        public string G55Jaw { get => _g55Jaw; set { _g55Jaw = value; OnPropertyChanged(); } }
        public string G55Rot { get => _g55Rot; set { _g55Rot = value; OnPropertyChanged(); } }
        public string G55XTrans { get => _g55XTrans; set { _g55XTrans = value; OnPropertyChanged(); } }
        public string G55YTrans { get => _g55YTrans; set { _g55YTrans = value; OnPropertyChanged(); } }
        public string G55ZTrans { get => _g55ZTrans; set { _g55ZTrans = value; OnPropertyChanged(); } }
        public string G55JawPosition { get => _g55JawPosition; set { _g55JawPosition = value; OnPropertyChanged(); } }
        public bool UseG55Rot { get => _useG55Rot; set { _useG55Rot = value; OnPropertyChanged(); } }
        public bool UseG55JawReverse { get => _useG55JawReverse; set { _useG55JawReverse = value; OnPropertyChanged(); } }

        // 내부 backing fields
        private string _g54Chuck, _g54Jaw, _g54Rot, _g54XTrans, _g54YTrans, _g54ZTrans, _g54JawPosition;
        private bool _useG54Rot, _useG54JawReverse;
        private bool _useG55;
        private string _g55Chuck, _g55Jaw, _g55Rot, _g55XTrans, _g55YTrans, _g55ZTrans, _g55JawPosition;
        private bool _useG55Rot, _useG55JawReverse;

        // ---------- 커맨드 ----------
        public ICommand SaveCommand { get; }
        public ICommand DeleteCommand { get; }
        public ICommand CancelCommand { get; }
        public ICommand SelectFileCommand { get; }

        // ---------- View와 연결용 이벤트 ----------
        public Action<string> RequestOpenFileDialog { get; set; }  // type: mprj, g54Chuck, g55Jaw 등
        public event Action RequestClose;

        // ---------- 기타 ----------
        private bool _isEditMode;
        private string _originKey; // 수정모드일 때 기존 키

        // ---------- 생성자 ----------
        public MachineTemplateEditViewModel()
        {
            // 명령 연결
            SaveCommand = new RelayCommand(OnSave);
            DeleteCommand = new RelayCommand(OnDelete);
            CancelCommand = new RelayCommand(OnCancel);
            SelectFileCommand = new RelayCommand<string>(OnSelectFile);

            // 도구목록 샘플(실제는 서비스/DB 등에서 가져올 것)
            LoadToolListinKBM();
            SelectedTool = ToolList.FirstOrDefault();

            TemplateName = "";
        }

        // ---------- Load existing template data method ----------
        public void LoadTemplateData(string editKey)
        {
            if (string.IsNullOrEmpty(editKey)) return;

            _isEditMode = true;
            _originKey = editKey;

            if (MachineTemplates.Instance.MachineMap.TryGetValue(editKey, out var tpl))
            {
                TemplateName = editKey;
                MprjFile = tpl.Parameters.TryGetValue("txtMprjFile", out var m) ? m : "";
                G54Chuck = tpl.Parameters.TryGetValue("txtG54Chuck", out var c) ? c : "";
                G54Jaw = tpl.Parameters.TryGetValue("txtG54Jaw", out var j) ? j : "";
                G54Rot = tpl.Parameters.TryGetValue("txtG54Rot", out var r) ? r : "";
                G54XTrans = tpl.Parameters.TryGetValue("txtG54XTrans", out var x) ? x : "";
                G54YTrans = tpl.Parameters.TryGetValue("txtG54YTrans", out var y) ? y : "";
                G54ZTrans = tpl.Parameters.TryGetValue("txtG54ZTrans", out var z) ? z : "";
                G54JawPosition = tpl.Parameters.TryGetValue("txtG54JawPosition", out var jp) ? jp : "";
                SelectedTool = tpl.Parameters.TryGetValue("cmbTool", out var tool) ? tool : ToolList.FirstOrDefault();

                UseG54Rot = tpl.CheckStates.TryGetValue("CheckG54Rot", out var b) && b;
                UseG54JawReverse = tpl.CheckStates.TryGetValue("CheckG54Jaw", out var b2) && b2;
                UseG55 = tpl.CheckStates.TryGetValue("CheckG55", out var b3) && b3;

                G55Chuck = tpl.Parameters.TryGetValue("txtG55Chuck", out var c2) ? c2 : "";
                G55Jaw = tpl.Parameters.TryGetValue("txtG55Jaw", out var j2) ? j2 : "";
                G55Rot = tpl.Parameters.TryGetValue("txtG55Rot", out var r2) ? r2 : "";
                G55XTrans = tpl.Parameters.TryGetValue("txtG55XTrans", out var x2) ? x2 : "";
                G55YTrans = tpl.Parameters.TryGetValue("txtG55YTrans", out var y2) ? y2 : "";
                G55ZTrans = tpl.Parameters.TryGetValue("txtG55ZTrans", out var z2) ? z2 : "";
                G55JawPosition = tpl.Parameters.TryGetValue("txtG55JawPosition", out var jp2) ? jp2 : "";

                UseG55Rot = tpl.CheckStates.TryGetValue("CheckG55Rot", out var b4) && b4;
                UseG55JawReverse = tpl.CheckStates.TryGetValue("CheckG55Jaw", out var b5) && b5;
            }
        }

        private void LoadToolListinKBM()
        {
            ToolList.Clear();

            var toolGroups = new CuttingToolGroups(); // KBM의 Tool 그룹
            toolGroups.Fill();

            foreach (CuttingToolGroup group in toolGroups)
            {
                ToolList.Add(group.Name); // 그룹명만 ObservableCollection에 추가
            }
            ToolList.Insert(0,"*** Empty Tool Group ***");
        }
        // ---------- 파일선택 커맨드 ----------
        private void OnSelectFile(string type)
        {
            RequestOpenFileDialog?.Invoke(type);
        }

        // ---------- Save/Delete/Cancel ----------
        private void OnSave()
        {
            if (string.IsNullOrWhiteSpace(TemplateName) || string.IsNullOrWhiteSpace(MprjFile))
            {
                MessageBox.Show("필수 항목을 입력하세요.", "Error");
                return;
            }

            // 데이터 직렬화 구조
            var tpl = new MachineTemplates.MachineTemplate();
            tpl.Parameters["txtMprjFile"] = MprjFile ?? "";
            tpl.Parameters["txtG54Chuck"] = G54Chuck ?? "";
            tpl.Parameters["txtG54Jaw"] = G54Jaw ?? "";
            tpl.Parameters["txtG54Rot"] = G54Rot ?? "";
            tpl.Parameters["txtG54XTrans"] = G54XTrans ?? "";
            tpl.Parameters["txtG54YTrans"] = G54YTrans ?? "";
            tpl.Parameters["txtG54ZTrans"] = G54ZTrans ?? "";
            tpl.Parameters["txtG54JawPosition"] = G54JawPosition ?? "";
            tpl.Parameters["cmbTool"] = SelectedTool ?? "";

            tpl.Parameters["txtG55Chuck"] = G55Chuck ?? "";
            tpl.Parameters["txtG55Jaw"] = G55Jaw ?? "";
            tpl.Parameters["txtG55Rot"] = G55Rot ?? "";
            tpl.Parameters["txtG55XTrans"] = G55XTrans ?? "";
            tpl.Parameters["txtG55YTrans"] = G55YTrans ?? "";
            tpl.Parameters["txtG55ZTrans"] = G55ZTrans ?? "";
            tpl.Parameters["txtG55JawPosition"] = G55JawPosition ?? "";

            tpl.CheckStates["CheckG54Rot"] = UseG54Rot;
            tpl.CheckStates["CheckG54Jaw"] = UseG54JawReverse;
            tpl.CheckStates["CheckG55"] = UseG55;
            tpl.CheckStates["CheckG55Rot"] = UseG55Rot;
            tpl.CheckStates["CheckG55Jaw"] = UseG55JawReverse;

            // 신규 or 수정
            if (_isEditMode && _originKey != TemplateName)
            {
                MachineTemplates.Instance.MachineMap.Remove(_originKey);
            }
            MachineTemplates.Instance.MachineMap[TemplateName] = tpl;
            MachineTemplates.Instance.SaveMachineData();

            RequestClose?.Invoke();
        }

        private void OnDelete()
        {
            if (!_isEditMode || string.IsNullOrWhiteSpace(TemplateName)) return;
            if (MessageBox.Show("정말 삭제할까요?", "확인", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
            {
                MachineTemplates.Instance.MachineMap.Remove(TemplateName);
                MachineTemplates.Instance.SaveMachineData();
                RequestClose?.Invoke();
            }
        }

        private void OnCancel() => RequestClose?.Invoke();
    }
}