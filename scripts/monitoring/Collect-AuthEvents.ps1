param(
    [string]$OutputDirectory = 'logs/security/events',
    [int[]]$EventIds = @(401, 403)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$logPath = Join-Path $OutputDirectory "auth_events_${timestamp}.json"

$events = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=$EventIds} -MaxEvents 200 | Select-Object TimeCreated, Id, LevelDisplayName, Message
$events | ConvertTo-Json -Depth 4 | Set-Content -Path $logPath -Encoding UTF8

[pscustomobject]@{
    eventsCollected = $events.Count
    output = $logPath
    timestamp = (Get-Date).ToString('o')
}
