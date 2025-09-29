param(
    [string]$LogRoot = 'artifacts/offline/logs',
    [int]$DaysToKeep = 14
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $LogRoot)) {
    Write-Warning "Log root not found: $LogRoot"
    return
}

Get-ChildItem -Path $LogRoot -File -Recurse |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$DaysToKeep) } |
    Remove-Item -Force

[pscustomobject]@{
    logRoot = (Resolve-Path $LogRoot).Path
    daysToKeep = $DaysToKeep
    cleanedAt = (Get-Date).ToString('o')
}
