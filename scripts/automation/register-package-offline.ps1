param(
    [string]$TaskName = 'MCMS-PackageOffline',
    [string]$ScriptPath = 'scripts/deploy/package-offline.ps1',
    [string]$LogDirectory = 'artifacts/offline/tasks',
    [string]$Schedule = 'Daily 02:00'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ScriptPath)) {
    throw "Script not found: $ScriptPath"
}

if (-not (Test-Path $LogDirectory)) {
    New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
}

$timePart = $Schedule.Split(' ')[1]
if (-not [DateTime]::TryParseExact($timePart, 'HH:mm', $null, [System.Globalization.DateTimeStyles]::None, [ref]([DateTime]$null))) {
    throw "Invalid schedule format (expected e.g. 'Daily 02:00')"
}
$time = [DateTime]::ParseExact($timePart, 'HH:mm', $null)
$trigger = New-ScheduledTaskTrigger -Daily -At ([DateTime]::Today.Add($time.TimeOfDay))
$action = New-ScheduledTaskAction -Execute 'pwsh' -Argument "-NoProfile -File `"$ScriptPath`" -SkipWebBuild"
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest

Register-ScheduledTask -TaskName $TaskName -Trigger $trigger -Action $action -Principal $principal -Description 'MCMS nightly package-offline run' -Force

[pscustomobject]@{
    taskName = $TaskName
    schedule = $Schedule
    script = (Resolve-Path $ScriptPath).Path
    logDirectory = (Resolve-Path $LogDirectory).Path
    timestamp = (Get-Date).ToString('o')
}
