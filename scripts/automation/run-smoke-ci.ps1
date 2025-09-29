param(
    [string]$Environment = 'InternalProd',
    [int]$DaysToKeep = 7
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script = 'scripts/deploy/run-smoke.ps1'
if (-not (Test-Path $script)) {
    throw "run-smoke.ps1 not found at $script"
}

$arguments = @('-Environment', $Environment, '-SkipShareCopy')
$arguments += @('-OutputDir', 'artifacts/offline/logs/ci')

& $script @arguments

# Trim logs older than retention
$logRoot = 'artifacts/offline/logs/ci'
if (Test-Path $logRoot) {
    Get-ChildItem -Path $logRoot -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$DaysToKeep) } | Remove-Item -Force
}
