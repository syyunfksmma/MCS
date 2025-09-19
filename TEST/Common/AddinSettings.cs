using System;
using System.IO;
using Newtonsoft.Json;

namespace CAM_API.Common;

internal sealed class AddinSettings
{
    private const string SettingsFileName = "addin-settings.json";

    public string BaseUrl { get; set; } = "https://localhost:5001";
    public string ApiKey { get; set; } = string.Empty;
    public bool IgnoreSslErrors { get; set; } = true;

    [JsonIgnore]
    public static string SettingsDirectory => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "MCMS");

    [JsonIgnore]
    public static string SettingsPath => Path.Combine(SettingsDirectory, SettingsFileName);

    public static AddinSettings Load()
    {
        try
        {
            if (File.Exists(SettingsPath))
            {
                var json = File.ReadAllText(SettingsPath);
                var settings = JsonConvert.DeserializeObject<AddinSettings>(json);
                if (settings != null)
                {
                    return settings;
                }
            }
        }
        catch
        {
            // ignore & fall back to defaults
        }

        return new AddinSettings();
    }

    public void Save()
    {
        if (!Directory.Exists(SettingsDirectory))
        {
            Directory.CreateDirectory(SettingsDirectory);
        }

        var json = JsonConvert.SerializeObject(this, Formatting.Indented);
        File.WriteAllText(SettingsPath, json);
    }
}
