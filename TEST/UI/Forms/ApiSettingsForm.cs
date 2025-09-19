using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Linq;
using System.Windows.Forms;
using CAM_API.Common;
using CAM_API.Common.Dtos;
using CAM_API.Services;

namespace CAM_API.UI.Forms;

internal sealed class ApiSettingsForm : Form
{
    private readonly AddinSettings _settings;
    private readonly McmsApiClient _apiClient;

    private readonly TextBox _baseUrlTextBox = new() { Dock = DockStyle.Fill };
    private readonly TextBox _apiKeyTextBox = new() { Dock = DockStyle.Fill };
    private readonly CheckBox _ignoreSslCheckBox = new() { Text = "개발용: SSL 인증서 무시", Dock = DockStyle.Fill };
    private readonly Button _renewButton = new() { Text = "새 키 발급" };
    private readonly Button _fetchButton = new() { Text = "현재 키 조회" };
    private readonly Button _saveButton = new() { Text = "저장", DialogResult = DialogResult.OK };
    private readonly Button _cancelButton = new() { Text = "취소", DialogResult = DialogResult.Cancel };

    public ApiSettingsForm(AddinSettings settings, McmsApiClient apiClient)
    {
        _settings = settings;
        _apiClient = apiClient;

        Text = "MCMS API 설정";
        FormBorderStyle = FormBorderStyle.FixedDialog;
        StartPosition = FormStartPosition.CenterParent;
        MinimizeBox = false;
        MaximizeBox = false;
        ClientSize = new Size(420, 220);

        InitializeLayout();
        BindEvents();
        LoadSettings();
    }

    private void InitializeLayout()
    {
        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 5,
            Padding = new Padding(12)
        };
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 35));
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 65));

        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 44));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 44));

        layout.Controls.Add(new Label { Text = "API Base URL", AutoSize = true, TextAlign = ContentAlignment.MiddleLeft }, 0, 0);
        layout.Controls.Add(_baseUrlTextBox, 1, 0);

        layout.Controls.Add(new Label { Text = "Add-in API Key", AutoSize = true, TextAlign = ContentAlignment.MiddleLeft }, 0, 1);
        layout.Controls.Add(_apiKeyTextBox, 1, 1);

        layout.Controls.Add(new Label { Text = string.Empty }, 0, 2);
        layout.Controls.Add(_ignoreSslCheckBox, 1, 2);

        var keyButtonPanel = new FlowLayoutPanel { FlowDirection = FlowDirection.LeftToRight, Dock = DockStyle.Fill, AutoSize = true };
        keyButtonPanel.Controls.Add(_fetchButton);
        keyButtonPanel.Controls.Add(_renewButton);
        layout.Controls.Add(new Label { Text = string.Empty }, 0, 3);
        layout.Controls.Add(keyButtonPanel, 1, 3);

        var buttonPanel = new FlowLayoutPanel { FlowDirection = FlowDirection.RightToLeft, Dock = DockStyle.Fill, AutoSize = true };
        buttonPanel.Controls.Add(_saveButton);
        buttonPanel.Controls.Add(_cancelButton);
        layout.Controls.Add(new Label { Text = string.Empty }, 0, 4);
        layout.Controls.Add(buttonPanel, 1, 4);

        Controls.Add(layout);
    }

    private void BindEvents()
    {
        _saveButton.Click += OnSaveClicked;
        _renewButton.Click += async (_, _) => await RenewKeyAsync();
        _fetchButton.Click += async (_, _) => await FetchCurrentKeyAsync();
    }

    private void LoadSettings()
    {
        _baseUrlTextBox.Text = _settings.BaseUrl;
        _apiKeyTextBox.Text = _settings.ApiKey;
        _ignoreSslCheckBox.Checked = _settings.IgnoreSslErrors;
    }

    private void OnSaveClicked(object? sender, EventArgs e)
    {
        _settings.BaseUrl = _baseUrlTextBox.Text.Trim();
        _settings.ApiKey = _apiKeyTextBox.Text.Trim();
        _settings.IgnoreSslErrors = _ignoreSslCheckBox.Checked;

        try
        {
            _settings.Save();
            _apiClient.UpdateSettings(_settings);
            DialogResult = DialogResult.OK;
            Close();
        }
        catch (Exception ex)
        {
            MessageBox.Show(this, ex.Message, "설정 저장 오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private async Task RenewKeyAsync()
    {
        try
        {
            UseWaitCursor = true;
            var request = new RenewAddinKeyRequest { RequestedBy = Environment.UserName, ValidDays = 30 };
            var key = await _apiClient.RenewKeyAsync(request);
            if (key != null)
            {
                _apiKeyTextBox.Text = key.Value;
                MessageBox.Show(this, $"새 키가 발급되었습니다. 만료일: {key.ExpiresAt:yyyy-MM-dd HH:mm}", "키 발급", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show(this, ex.Message, "키 발급 오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            UseWaitCursor = false;
        }
    }

    private async Task FetchCurrentKeyAsync()
    {
        try
        {
            UseWaitCursor = true;
            var key = await _apiClient.GetCurrentKeyAsync();
            if (key == null)
            {
                MessageBox.Show(this, "활성화된 키가 없습니다.", "키 조회", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            _apiKeyTextBox.Text = key.Value;
            MessageBox.Show(this, $"현재 키 만료일: {key.ExpiresAt:yyyy-MM-dd HH:mm}", "키 조회", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            MessageBox.Show(this, ex.Message, "키 조회 오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            UseWaitCursor = false;
        }
    }
}
