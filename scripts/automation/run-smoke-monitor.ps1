param(
    [string]$Environment = 'InternalProd',
    [string]$BaseUrl,
    [string]$ApiUrl,
    [switch]$Notify,
    [string]$Notes = 'Automated run-smoke monitor'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$script = 'scripts/deploy/run-smoke.ps1'
if (-not (Test-Path $script)) {
    throw "run-smoke.ps1 not found"
}

$arguments = @('-Environment', $Environment)
if ($BaseUrl) { $arguments += @('-BaseUrl', $BaseUrl) }
if ($ApiUrl) { $arguments += @('-ApiUrl', $ApiUrl) }
$arguments += '-SkipShareCopy'

$start = Get-Date
try {
    & $script @arguments | Tee-Object -Variable output
    $status = 'Success'
}
catch {
    $output = $_.Exception.Message
    $status = 'Failed'
}
$end = Get-Date

if ($Notify) {
    & 'scripts/deploy/notify-deploy.ps1' -EventType ($status -eq 'Success' ? 'Deployed' : 'Failed') -Environment $Environment -Notes $Notes | Out-Null
}

$result = [pscustomobject]@{
    environment = $Environment
    status = $status
    durationSeconds = [Math]::Round(($end - $start).TotalSeconds, 2)
    output = $output -join [Environment]::NewLine
    timestamp = $end.ToString('o')
}

$result
