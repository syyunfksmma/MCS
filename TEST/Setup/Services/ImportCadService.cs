using CAM_API.Common.Helpers;
using Esprit;
using EspritConstants;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Windows.Documents;
using System.Windows.Forms;

namespace CAM_API.Setup.Services
{
    /// <summary>
    /// Main entry point for the automation system.
    /// See UML folder for class operation flow.
    /// </summary>

    public class ImportCadService
    {
        private readonly Esprit.Application _app;
        private readonly Esprit.Document Document;
        private static readonly string[] SupportedExtensions = { ".par",".psm",".asm", ".sldprt", ".sldasm", ".stl", ".x_t", ".step", ".iges" };

        public ImportCadService(Esprit.Application app)
        {
            _app = app ?? throw new ArgumentNullException(nameof(app));
            Document = _app.Document;  // ✅ _app.Document 값으로 초기화
        }

        // ✅ 1. Remove existing PART
        private void ClearExistingParts(Esprit.Workpiece wp)
        {
            _app.Document.PartSetup.BeginEdit();
            while (wp.Parts.Count > 1)  // At least one Part must be maintained
            {
                wp.Parts.Remove(2);
            }
            _app.Document.PartSetup.EndEdit();
        }

        private void ClearExistingPart1(Esprit.Workpiece wp)
        {
            _app.Document.PartSetup.BeginEdit();
            while (wp.Parts.Count > 1)  // At least one Part must be maintained
            {
                wp.Parts.Remove(1);
            }
            _app.Document.PartSetup.EndEdit();
        }

        // ✅ 2. Remove existing STOCK
        private void ClearExistingStock(Esprit.Workpiece wp)
        {
            _app.Document.PartSetup.BeginEdit();
            while (wp.Stocks.Count > 0)
            {
                wp.Stocks.Remove(1);
            }
            _app.Document.PartSetup.EndEdit();
        }

        // ✅ 4. Add PART (based on user selected PART file)
        private void AddPartToWorkpiece(Esprit.Workpiece wp, string partFilePath, string workOffset, string PartTypeID)
        {
            if (!File.Exists(partFilePath))
            {
                MessageBox.Show("선택한 PART 파일이 존재하지 않습니다.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _app.Document.PartSetup.BeginEdit();
            _app.Document.Solids.Clear();

            // Load PART file
            var part = wp.Parts.Add();
            part.Name = Path.GetFileNameWithoutExtension(partFilePath);
            _app.Document.MergeFile2(partFilePath, false);

            var groupName = "Solid";
            var set = SelectionSetHelper.GetSelectionSet(Document, groupName);
            set.RemoveAll();

            if (Document.Solids.Count > 0)  // ✅ Run after checking the number of solids
            {
                Esprit.Solid solid = Document.Solids[1];
                solid.Grouped = false;
                set.Add(solid);
            }

            Esprit.ILine zAxis = Document.GetLine(Document.GetPoint(0, 0, 0), 0, 0, 1);
            if (workOffset == "G55") 
                set.Rotate(zAxis, - Math.PI / 2); // ✅ -90 degree rotation
           
            // Add target Solid
            foreach (Esprit.Solid solid in _app.Document.Solids)
                part.Geometry.Add(solid);
            
            part.PartType = PartTypeID;  // 직접 part 객체의 PartTypeName 프로퍼티에 값 대입
            string type = part.PartType; // 이제 PART TYPE 값은 사용자가 선택한 값으로 변경됨
            
            _app.Document.PartSetup.EndEdit();
            Document.SelectionSets.Remove(groupName);
        }

        // ✅ 5. BARSTOCK 
        private Esprit.IStock CreateBarStock(Esprit.Workpiece wp, double SOD, double SID, double SLG, double FLG)
        {
            _app.Document.PartSetup.BeginEdit();

            // 📌 Create Bar Stock based on user input
            var barStock = wp.Stocks.AddBarStock();
            barStock.Tolerance = 0.1;
            barStock.OutsideDiameter = SOD;
            barStock.InsideDiameter = SID;
            var alignment = new EspritConstants.STOCKALIGNMENT
            {
                AlignmentType = EspritConstants.espStockAlignmentType.espStockAlignmentTypePosition, // Align type
                Size = SLG,  // 사용자가 입력한 길이(SLG)를 설정
                Position = Convert.ToInt32(-FLG) // ✅ Z Position = Target length value for the process
            };
            barStock.set_LengthAlignment(alignment); // ✅ Set Stock Length

            _app.Document.PartSetup.EndEdit();

            return barStock;
        }

        // ✅ 6. FILESTOCK 생성 (사용자가 선택한 .STL 파일 기반)
        private Esprit.IStock CreateFileStock(Esprit.Workpiece wp, string stockFilePath, double FLG, string workOffset, bool usePreviousWCS)
        {
            if (!File.Exists(stockFilePath))
            {
                MessageBox.Show("STL 파일이 존재하지 않습니다.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return null;
            }

            _app.Document.PartSetup.BeginEdit();
            var fileStock = wp.Stocks.AddFileStock();
            fileStock.FileName = stockFilePath;

            if (!usePreviousWCS)
            {
                fileStock.ZTranslation = Convert.ToInt32(-FLG);

                if (workOffset == "G54")
                    fileStock.XRotation = 180;
                else
                    fileStock.YRotation = 180;
            }
            _app.Document.PartSetup.EndEdit();

            return fileStock;
        }

        // ✅ 7. PART & STOCK 추가하기 (사용자 입력 선택: BARSTOCK or FILESTOCK)
        public void ImportPartAndStock(string stockFilePath, string partFilePath, string workOffset, double SOD, double SID, double SLG, double FLG, bool isFileStock, string PartTypeID, bool usePreviousWCS)
        {
            var wp = Document.Workpieces[1];
            if (wp == null)
                return;
            
            // ✅ 기존 PART & STOCK 삭제 후 새로 추가
            ClearExistingParts(wp);
            ClearExistingStock(wp);

            // ✅ PART 추가 (PART 파일이 존재하는 경우에만)
            if (!string.IsNullOrEmpty(partFilePath))
                AddPartToWorkpiece(wp, partFilePath, workOffset, PartTypeID);
          
            // ✅ STOCK 추가 (STL 파일 또는 BAR STOCK)
            Esprit.IStock stock = null;
            if (isFileStock)
                stock = CreateFileStock(wp, stockFilePath, FLG, workOffset, usePreviousWCS);  // 사용자 STOCK 경로 입력이 없으면 BAR STOCK 생성
            else
                stock = CreateBarStock(wp, SOD, SID, SLG, FLG);  // STL 파일을 FILE STOCK으로 적용
            
            ClearExistingPart1(wp);
        }

        public void AlignSolid(string workOffset)
        {
            var groupName = "Solid";
            var set = SelectionSetHelper.GetSelectionSet(Document, groupName);

            set.RemoveAll();

            if (Document.Solids.Count > 0)  // ✅ 솔리드 개수 확인 후 실행
            {
                Esprit.Solid solid = Document.Solids[1];
                solid.Grouped = false;
                set.Add(solid);
            }
            else
            {
                System.Windows.Forms.MessageBox.Show("솔리드가 존재하지 않습니다.", "Error",
                    System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);
            }

            bool hasface = false;

            // ✅ 선택된 Face 추가
            if (Document.Group.Count > 0)
            {
                for (var i = 1; i <= Document.Group.Count; i++)
                {
                    set.Add(Document.Group[i]); // ✅ 선택된 Face 추가
                    if (Document.Group[i] is EspritSolids.SolidFace)
                    { hasface = true; }
                }
            }

            Esprit.ILine zAxis = Document.GetLine(Document.GetPoint(0, 0, 0), 0, 0, 1);

            foreach (var obj in set)
            {
                if (obj is EspritSolids.SolidFace face)
                {
                    // ✅ Face 기준 Z축 정렬
                    Document.Group.Add(face);
                    Document.AlignAlongAxis("Z");
                    Document.Group.Remove(face);
                }
            }

            if (hasface)
            {
                foreach (var obj in set)
                {
                    if (obj is Esprit.Solid solidBody)
                    {
                        // ✅ 선택한 Solid를 Z축 기준 회전
                        try
                        {
                            if (workOffset == "G54")
                            {
                                set.Rotate(zAxis, Math.PI); // ✅ 180도 회전
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Windows.Forms.MessageBox.Show("회전 중 오류 발생: " + ex.Message, "Error",
                                System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
                        }
                    }
                }
            }
        }

        public void WorkpieceSetup(string workOffset, double FLG)
        {
            var items = Document.InitialMachineSetup.MachineItems;
            int PrimaryNum = int.Parse(workOffset.Substring(1));
            MachineItem fixutre = FindMachineItemByKey(items, workOffset);

            Document.InitialMachineSetup.BeginEdit();
            //ClearWorkpiecesByPrimaryNumber(fixture, workOffset);
            var workpieceItem = fixutre.MachineItems.AddWorkpieceInstance();
            workpieceItem.WorkOffsets[1].WorkOffsetType = EspritConstants.espWorkOffsetType.espWorkOffsetTypeStandard;
            workpieceItem.WorkOffsets[1].PrimaryNumber = PrimaryNum;
            workpieceItem.ZTranslation = FLG;
            Document.InitialMachineSetup.EndEdit();
        }

        private MachineItem FindMachineItemByKey(MachineItems items, string targetKey)
        {
            foreach (MachineItem item in items)
            {
                if (item.Key == targetKey)
                {
                    return item;        // 찾았으면 즉시 반환
                }

                // 자식 노드들 중에서 찾아보고, 찾으면 그대로 반환
                var foundInChild = FindMachineItemByKey(item.MachineItems, targetKey);
                if (foundInChild != null)
                {
                    return foundInChild;
                }
            }
            return null;   // 끝까지 못 찾았으면 null
        }

        //private void ClearWorkpiecesByPrimaryNumber(MachineItem host, int primaryNumber)
        //{
        //    if (host == null) return;

        //    for (int i = host.MachineItems.Count; i >= 1; i--)
        //    {
        //        var mi = host.MachineItems[i];

        //        // WorkpieceInstance로 캐스팅 가능하면 오프셋 확인
        //        var inst = mi as WorkpieceInstance;
        //        if (inst != null)
        //        {
        //            // 일반적으로 WorkOffsets는 1-based
        //            var wo = inst.WorkOffsets[1];
        //            if (wo != null && wo.PrimaryNumber == primaryNumber)
        //                mi.Delete();
        //        }
        //        else if (mi.Type == espMachineItemType.espMachineItemTypeWorkpiece ||
        //                 mi.Type == espMachineItemType.espMachineItemTypeWorkpieceInstance)
        //        {
        //            // 타입만으로 구분해야 한다면 여기에서 추가 정책 적용
        //        }
        //    }
        //}

    }
}