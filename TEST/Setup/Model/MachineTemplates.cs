using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace CAM_API.Setup.Model
{
    public class MachineTemplates
    {
        /// <summary>
        /// Class for generating a machine template map JSON file.
        /// Stores local file paths for MPRJ and GDML files.
        /// </summary>

        private static MachineTemplates _instance;
        public static MachineTemplates Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new MachineTemplates();
                }
                return _instance;
            }
        }

        public Dictionary<string, MachineTemplate> MachineMap { get; private set; } = new Dictionary<string, MachineTemplate>();
        private readonly string _filePath = @"C:\Users\Public\Documents\Hexagon\ESPRIT EDGE\Data\Extensions\FKSM API\MachineData.json";

        public class MachineTemplate
        {
            /// <summary>
            /// key : parameters name (ex: "txtMprjFile", "txtG54Chuck"…)
            /// value: by user
            /// </summary>
            public Dictionary<string, string> Parameters { get; } = new Dictionary<string, string>();
            public Dictionary<string, bool> CheckStates { get; } = new Dictionary<string, bool>();

            // string 전용
            public string this[string key, string defaultValue = ""]
                => Parameters.TryGetValue(key, out var s) ? s : defaultValue;

            // bool 전용
            public bool this[string key, bool defaultValue]
                => CheckStates.TryGetValue(key, out var b) ? b : defaultValue;
        }

        private MachineTemplates()
        {
            LoadMachineData();
        }

        public void SaveMachineData()
        {
            // Ensure directory exists
            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var json = JsonConvert.SerializeObject(MachineMap, Formatting.Indented);
            File.WriteAllText(_filePath, json);
        }

        public void LoadMachineData()
        {
            try
            {
                // Ensure directory exists
                var directory = Path.GetDirectoryName(_filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                if (!File.Exists(_filePath))
                {
                    File.WriteAllText(_filePath, "{}"); // 🔥 JSON 파일이 없으면 빈 객체 생성
                }

                string jsonData = File.ReadAllText(_filePath);
                Console.WriteLine($"Loaded JSON Data: {jsonData}"); // ✅ JSON 내용 확인

                MachineMap = JsonConvert.DeserializeObject<Dictionary<string, MachineTemplate>>(jsonData)
                              ?? new Dictionary<string, MachineTemplate>();

                Console.WriteLine($"MachineMap Count After Loading: {MachineMap.Count}"); // ✅ 데이터 개수 확인
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading machine data: {ex.Message}");
                MachineMap = new Dictionary<string, MachineTemplate>();
            }
        }

        public void InitializeMachineMap()
        {
            if (MachineMap == null)
            {
                MachineMap = new Dictionary<string, MachineTemplate>();
            }
        }
    }
}