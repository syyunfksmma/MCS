param(
    [string]$ConfigPath = "monitoring/alerts/mcms_core.yaml",
    [string]$AlertmanagerUrl = "",
    [string]$TestAlertName = "MCMSCodexSynthetic",
    [int]$HoldDurationSeconds = 60,
    [switch]$SkipSynthetic
)

function Resolve-Amtool {
    $cmd = Get-Command amtool -ErrorAction SilentlyContinue
    if ($null -ne $cmd) {
        return $cmd.Source
    }

    $fallback = Join-Path ${env:ProgramFiles} 'amtool\\amtool.exe'
    if (Test-Path $fallback) {
        return $fallback
    }

    throw 'amtool executable not found. Install Prometheus Alertmanager CLI tools.'
}

$amtoolPath = Resolve-Amtool

if (-not (Test-Path $ConfigPath)) {
    throw "Config file not found: $ConfigPath"
}

Write-Host "Validating alert configuration: $ConfigPath" -ForegroundColor Cyan
& $amtoolPath check-config $ConfigPath
if ($LASTEXITCODE -ne 0) {
    throw "amtool check-config failed with exit code $LASTEXITCODE"
}

if ([string]::IsNullOrWhiteSpace($AlertmanagerUrl) -or $SkipSynthetic.IsPresent) {
    Write-Host "Skipping synthetic alert simulation (no Alertmanager URL or SkipSynthetic flag set)." -ForegroundColor Yellow
    return
}

$labels = @(
    "alertname=$TestAlertName",
    "service=mcms-portal",
    "severity=testing",
    "channel=devops"
)
$annotations = @(
    'summary=Codex synthetic alert smoke test',
    "description=Automatically generated at $(Get-Date -Format o)"
)

Write-Host "Pushing synthetic alert $TestAlertName to $AlertmanagerUrl" -ForegroundColor Cyan
& $amtoolPath alert add --alertmanager.url $AlertmanagerUrl --expired --duration ${HoldDurationSeconds}s `
    --labels ($labels -join ',') `
    --annotations ($annotations -join ',')

if ($LASTEXITCODE -ne 0) {
    throw "amtool alert add failed with exit code $LASTEXITCODE"
}

Start-Sleep -Seconds 3

Write-Host "Querying Alertmanager for synthetic alert..." -ForegroundColor Cyan
& $amtoolPath alert query --alertmanager.url $AlertmanagerUrl --alertname $TestAlertName
if ($LASTEXITCODE -ne 0) {
    throw "amtool alert query failed with exit code $LASTEXITCODE"
}

Write-Host "Cleaning up synthetic alert $TestAlertName" -ForegroundColor Cyan
& $amtoolPath alert delete --alertmanager.url $AlertmanagerUrl --alertname $TestAlertName
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to delete synthetic alert (exit code $LASTEXITCODE). Manual cleanup may be required."
} else {
    Write-Host "Synthetic alert removed." -ForegroundColor Green
}
