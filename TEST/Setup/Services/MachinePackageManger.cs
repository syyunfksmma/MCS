using System;
using System.Collections.Generic;
using System.Linq;
using Esprit;
using ESPRIT.ToolAssembly.DataExchange;
using CAM_API.Setup.Model;
using CAM_API.Common.Helpers;
using System.Windows;
using System.Linq.Expressions;

namespace CAM_API.Setup.Services
{
    public class MachinePackageManger
    {
        private readonly Esprit.Application _app;
        private readonly Esprit.Document Document;
        private FileFinder _FindFile;
        private MachineTemplates _MachineTemplates;

        public MachinePackageManger(Esprit.Application application)
        {
            _app = application;
            Document = _app.Document;
            _FindFile = new FileFinder(_app);
            _MachineTemplates = MachineTemplates.Instance;
        }

        public void CreateMachineSetup(MachineTemplates.MachineTemplate tpl)
        {
            string mprj = _FindFile.MFilePath(tpl["txtMprjFile", ""]);

            Document.InitialMachineSetup.BeginEdit(); //편집 모드 진입

            for (var i = Document.InitialMachineSetup.MachineItems.Count; i > 0; i--)
            {
                Document.InitialMachineSetup.MachineItems.Remove(i); // 기존 설비 삭제
            }

            try
            {
                Document.InitialMachineSetup.MachineFileName = mprj; // mprj 적용
            }
            catch (System.Runtime.InteropServices.COMException)
            {
                System.Windows.MessageBox.Show("Fail on changing machine setup. To run this tutorial create a new document and try again.");
                return;
            }

            string G54Chuck = _FindFile.FFilePath(tpl["txtG54Chuck", ""]);
            string G54Jaw = _FindFile.FFilePath(tpl["txtG54Jaw", ""]);
            string G54Rot = null;
            if (tpl["CheckG54Rot", false])
            { G54Rot = _FindFile.FFilePath(tpl["txtG54Rot", ""]); }
            double X1 = double.Parse(tpl["txtG54XTrans", "0"]);
            double Y1 = double.Parse(tpl["txtG54YTrans", "0"]);
            double Z1 = double.Parse(tpl["txtG54ZTrans", "0"]);
            double CP1 = double.Parse(tpl["txtG54JawPosition", "0"]);
            bool RD1 = tpl["CheckG54Jaw", false];

            AddAllFixture("G54", G54Rot, G54Chuck, G54Jaw, X1, Y1, Z1, CP1, RD1);

            if (tpl["CheckG55", false])
            {
                string G55Chuck = _FindFile.FFilePath(tpl["txtG55Chuck", ""]);
                string G55Jaw = _FindFile.FFilePath(tpl["txtG55Jaw", ""]);
                string G55Rot = null;
                if (tpl["CheckG55Rot", false])
                { G55Rot = _FindFile.FFilePath(tpl["txtG55Rot", ""]); }
                double X2 = double.Parse(tpl["txtG55XTrans", "0"]);
                double Y2 = double.Parse(tpl["txtG55YTrans", "0"]);
                double Z2 = double.Parse(tpl["txtG55ZTrans", "0"]);
                double CP2 = double.Parse(tpl["txtG55JawPosition", "0"]);
                bool RD2 = tpl["CheckG55Jaw", false];

                AddAllFixture("G55", G55Rot, G55Chuck, G55Jaw, X2, Y2, Z2, CP2, RD2);
            }

            Document.InitialMachineSetup.EndEdit();

            string name = tpl["cmbTool", ""];
            AddToolsfromKBM(name);
        }

        void AddAllFixture(string wc, string rotPath, string chuckPath, string jawPath, double x, double y, double z, double cp, bool RD)
        {
            try
            {
                var machineItems = Document.InitialMachineSetup;
                dynamic parent = machineItems;
                bool c = true;

                // 1) Add Rotary Table
                if (!string.IsNullOrEmpty(rotPath))
                {
                    parent = machineItems.MachineItems.AddRotaryTable(rotPath);
                    parent.XTranslation = x;
                    parent.YTranslation = y;
                    parent.ZTranslation = z;
                    c = false;
                }

                // 2) Add Chuck
                dynamic chuck = parent.MachineItems.AddFixtureWithKey(chuckPath, wc);

                if (c)
                {
                    chuck.XTranslation = x;
                    chuck.YTranslation = y;
                    chuck.ZTranslation = z;
                }

                // 3) Add Jaw
               var Jaw = chuck.MachineItems.AddJaws(jawPath, cp);


                // To avoid a COM exception, only set ReverseJawsDirection when RD is true
                if (RD) 
                    chuck.ReverseJawsDirection = RD;
            }
            catch (System.Runtime.InteropServices.COMException)
            {
                System.Windows.Forms.MessageBox.Show($"error", "error",
                         System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
            }
        }

        void AddToolsfromKBM(string name)
        {
            RemoveTools();

            if(name == "*** Empty Tool Group ***") return;

            var toolGroups = new ESPRIT.KBMDAL.Collections.CuttingTools.CuttingToolGroups();
            toolGroups.Fill();
            var group = toolGroups.FirstOrDefault(g => g.Name == name);
            if (group == null) return;

            // 2) 해당 그룹의 모든 툴 GUID 리스트 수집
            var KBMTools = new ESPRIT.KBMDAL.Collections.CuttingTools.CuttingTools();
            KBMTools.FillByGroupId(group.Id);
            List<Guid> allToolIds = KBMTools.GetToolDbIds().ToList();

            // 3) KBM → ESPRIT ToolAssemblies
            IEnumerable<KbmToolAssemblyData> assemblies = KBMTools.GetKbmToolAssembliesData(allToolIds);
            new KbmToolAssemblyConnection().AddKbmToolAssemblies(assemblies);
        }

        void RemoveTools()
        {
            var toolAssemblies = Document.ToolAssemblies;
            if (toolAssemblies == null) return;

            // 뒤에서부터 1-based 인덱스를 사용하여 제거
            for (int i = toolAssemblies.Count; i >= 1; i--)
            {
                try
                {
                    toolAssemblies.Remove(i);
                }
                catch (ArgumentException ex)
                {
                    // 인덱스가 유효하지 않은 경우 무시하거나 로깅
                    System.Diagnostics.Debug.WriteLine($"ToolAssemblies.Remove({i}) failed: {ex.Message}");
                }
                catch (System.Runtime.InteropServices.COMException ex)
                {
                    // COM 예외 처리 (필요에 따라 메시지 박스나 로깅)
                    MessageBox.Show($"툴 제거 중 오류: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
            }
        }
    }
}