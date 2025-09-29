param(
    [string]$TargetPath = "artifacts/offline/logs",
    [int]$WarningGB = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $TargetPath)) {
    throw "Target path not found: $TargetPath"
}

$bytes = (Get-ChildItem -Path $TargetPath -Recurse -Force | Measure-Object -Property Length -Sum).Sum
$gb = [Math]::Round($bytes / 1GB, 2)
[pscustomobject]@{
    path = $TargetPath
    sizeGB = $gb
    warningThresholdGB = $WarningGB
    status = if ($gb -ge $WarningGB) { 'WARN' } else { 'OK' }
    timestamp = (Get-Date).ToString('o')
}
