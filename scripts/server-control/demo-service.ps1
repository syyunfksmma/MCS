param(
    [Parameter(Mandatory = $true)][string]$ServiceName,
    [int]$IntervalSeconds = 5,
    [string]$StopSignalPath
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($StopSignalPath)) {
    $StopSignalPath = Join-Path -Path $PSScriptRoot -ChildPath "$ServiceName.stop"
}

$script:serviceRunning = $true
try {
    [console]::TreatControlCAsInput = $false
} catch {
}

$ctrlEvent = Register-EngineEvent -SourceIdentifier ConsoleBreak -Action {
    $script:serviceRunning = $false
    Write-Host "[$(Get-Date -Format o)] $ServiceName received Ctrl+C signal."
}

$exitEvent = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    $script:serviceRunning = $false
    Write-Host "[$(Get-Date -Format o)] $ServiceName received exit signal."
}

Write-Host "[$(Get-Date -Format o)] $ServiceName demo service started. Stop signal: $StopSignalPath"

try {
    while ($script:serviceRunning) {
        if (Test-Path -Path $StopSignalPath) {
            Write-Host "[$(Get-Date -Format o)] $ServiceName stop signal detected at $StopSignalPath"
            try { Remove-Item -Path $StopSignalPath -Force } catch {}
            break
        }
        Write-Host "[$(Get-Date -Format o)] $ServiceName heartbeat"
        Start-Sleep -Seconds $IntervalSeconds
    }
} finally {
    Write-Host "[$(Get-Date -Format o)] $ServiceName demo service shutting down."
    if ($ctrlEvent) { Unregister-Event -SourceIdentifier ConsoleBreak -Force }
    if ($exitEvent) { Unregister-Event -SourceIdentifier PowerShell.Exiting -Force }
}