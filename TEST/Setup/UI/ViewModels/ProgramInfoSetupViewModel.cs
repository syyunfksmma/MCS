using CAM_API.Common.Commands;
using CAM_API.Common.ViewModels;
using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using System.Windows;
using System.Windows.Input;
using CAM_API.Common; // RelayCommand
using Esprit;

namespace CAM_API.Setup.UI.ViewModels
{
    public class ProgramInfoSetupViewModel : BaseViewModel
    {
        // ----- 바인딩 프로퍼티 -----
        public string PartCode { get => _partCode; set { _partCode = value; OnPropertyChanged(); } }
        public string Rev { get => _rev; set { _rev = value; OnPropertyChanged(); } }
        public string Machine { get => _machine; set { _machine = value; OnPropertyChanged(); } }
        public string OpInfo { get => _opInfo; set { _opInfo = value; OnPropertyChanged(); } }
        public string JawInfo { get => _jawInfo; set { _jawInfo = value; OnPropertyChanged(); } }
        public string JawFixture { get => _jawFixture; set { _jawFixture = value; OnPropertyChanged(); } }
        public string Coordinate { get => _coordinate; set { _coordinate = value; OnPropertyChanged(); } }
        public string RunTime { get => _runTime; set { _runTime = value; OnPropertyChanged(); } }
        public string Date { get => _date; set { _date = value; OnPropertyChanged(); } }

        // ---- 내부 필드 ----
        private string _partCode, _rev, _machine, _opInfo, _jawInfo, _jawFixture, _coordinate, _runTime, _date;
        private readonly Esprit.Application _app;
        private readonly Document _doc;

        public event Action<string> ProgramInfoUpdated;
        public Action CloseWindowAction { get; set; }

        // ---- 명령 ----
        public ICommand ApplyCommand { get; }
        public ICommand CancelCommand { get; }

        public ProgramInfoSetupViewModel()
        {
            // DI가 아니면 Main._espritApplication 사용
            _app = Main._espritApplication;
            _doc = _app.Document;
            LoadCurrentInfoFromDocument();

            ApplyCommand = new RelayCommand(Apply);
            CancelCommand = new RelayCommand(() => CloseWindowAction?.Invoke());
        }

        private void LoadCurrentInfoFromDocument()
        {
            string comment = _doc?.ProgramSettings?.Comment;
            if (string.IsNullOrWhiteSpace(comment)) return;

            var lines = comment.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var line in lines)
            {
                var parts = line.Split(new[] { '/' }, 2);
                if (parts.Length != 2) continue;
                var key = parts[0].Trim();
                var value = parts[1].Trim();

                switch (key)
                {
                    case "PART CODE": PartCode = value; break;
                    case "REV.": Rev = value; break;
                    case "MACHINE": Machine = value; break;
                    case "OP. INFO.": OpInfo = value; break;
                    case "JAW INFO.": JawInfo = value; break;
                    case "JAW FIXTURE": JawFixture = value; break;
                    case "COORDINATE": Coordinate = value; break;
                    case "RUN TIME": RunTime = value; break;
                    case "DATE": Date = value; break;
                }
            }
        }

        private void Apply()
        {
            string partCode = string.IsNullOrWhiteSpace(PartCode) ? "-" : PartCode;
            string rev = string.IsNullOrWhiteSpace(Rev) ? "-" : Rev;
            string machine = string.IsNullOrWhiteSpace(Machine) ? "-" : Machine;
            string opInfo = string.IsNullOrWhiteSpace(OpInfo) ? "-" : OpInfo;
            string jawInfo = string.IsNullOrWhiteSpace(JawInfo) ? "-" : JawInfo;
            string jawFixture = string.IsNullOrWhiteSpace(JawFixture) ? "-" : JawFixture;
            string coordinate = string.IsNullOrWhiteSpace(Coordinate) ? "-" : Coordinate;
            string runTime = string.IsNullOrWhiteSpace(RunTime) ? "-" : RunTime;
            string date = string.IsNullOrWhiteSpace(Date) ? "-" : Date;

            string name = $"{partCode}-R{rev}-KBM-{machine}-{opInfo}";
            var sb = new StringBuilder();
            sb.AppendLine($"PART CODE  /{partCode}");
            sb.AppendLine($"REV.       /{rev}");
            sb.AppendLine($"MACHINE    /{machine}");
            sb.AppendLine($"OP. INFO.  /{opInfo}");
            sb.AppendLine($"JAW INFO.  /{jawInfo}");
            sb.AppendLine($"JAW FIXTURE/{jawFixture}");
            sb.AppendLine($"COORDINATE /{coordinate}");
            sb.AppendLine($"RUN TIME   /{runTime}");
            sb.AppendLine($"DATE       /{date}");

            _doc.ProgramSettings.Name = name;
            _doc.ProgramSettings.Comment = sb.ToString();

            // 부모 창에 이벤트 전달
            ProgramInfoUpdated?.Invoke(name);

            MessageBox.Show("Program Info Comment updated successfully!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            CloseWindowAction?.Invoke();
        }
    }
}