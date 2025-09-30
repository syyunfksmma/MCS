param(
    [string]$ConfigPath = "config/server-control.config.json"
)

$ErrorActionPreference = 'Stop'

function Initialize-LauncherConfig {
    param([string]$Path)
    if (!(Test-Path -Path $Path)) {
        throw "Launcher configuration not found at $Path"
    }
    $json = Get-Content -Path $Path -Raw | ConvertFrom-Json
    if (-not $json.services) {
        throw "Launcher configuration must include a services collection."
    }
    if (-not (Test-Path -Path $json.logDirectory)) {
        New-Item -ItemType Directory -Path $json.logDirectory | Out-Null
    }
    $Global:LauncherConfig = $json
    if (-not $Global:LauncherState) {
        $Global:LauncherState = @{}
    }
}

function Write-LauncherLog {
    param(
        [string]$Message,
        [ValidateSet('INFO','WARN','ERROR')] [string]$Level = 'INFO'
    )
    $timestamp = Get-Date -Format o
    $line = "[$timestamp] [$Level] $Message"
    $logPath = Join-Path $Global:LauncherConfig.logDirectory 'launcher.log'
    Add-Content -Path $logPath -Value $line
    Write-Host $line
}

function Start-LauncherService {
    param([Parameter(Mandatory=$true)][string]$Name)
    $service = $Global:LauncherConfig.services | Where-Object { $_.name -eq $Name }
    if (-not $service) {
        throw "Service '$Name' not defined in configuration."
    }
    if ($Global:LauncherState.ContainsKey($Name) -and $Global:LauncherState[$Name].Id -and -not ($Global:LauncherState[$Name].HasExited)) {
        Write-LauncherLog "Service '$Name' already running (PID $($Global:LauncherState[$Name].Id))." 'WARN'
        return $Global:LauncherState[$Name]
    }
    $startInfo = @{ FilePath = $service.command }
    if ($service.arguments) { $startInfo.ArgumentList = $service.arguments }
    if ($service.workingDirectory) { $startInfo.WorkingDirectory = $service.workingDirectory }
    $process = Start-Process @startInfo -PassThru -WindowStyle Hidden
    $Global:LauncherState[$Name] = $process
    Write-LauncherLog "Started service '$Name' (PID $($process.Id))."
    return $process
}

function Stop-LauncherService {
    param([Parameter(Mandatory=$true)][string]$Name)
    if (-not $Global:LauncherState.ContainsKey($Name)) {
        Write-LauncherLog "Service '$Name' not tracked." 'WARN'
        return
    }
    $process = $Global:LauncherState[$Name]
    if ($process -and -not $process.HasExited) {
        Write-LauncherLog "Stopping service '$Name' (PID $($process.Id))."
        try {
            $process.CloseMainWindow() | Out-Null
            Start-Sleep -Seconds 2
            if (-not $process.HasExited) {
                $process.Kill()
            }
        } catch {
            Write-LauncherLog "Force stopping service '$Name': $_" 'WARN'
            try { $process.Kill() } catch {}
        }
    }
    $Global:LauncherState.Remove($Name)
}

function Start-LauncherAll {
    foreach ($svc in $Global:LauncherConfig.services) {
        Start-LauncherService -Name $svc.name | Out-Null
    }
}

function Stop-LauncherAll {
    foreach ($svc in $Global:LauncherConfig.services) {
        Stop-LauncherService -Name $svc.name
    }
}

function Get-LauncherHealth {
    param([string]$Name)
    $services = if ($Name) { $Global:LauncherConfig.services | Where-Object { $_.name -eq $Name } } else { $Global:LauncherConfig.services }
    $result = @()
    foreach ($svc in $services) {
        $status = 'Stopped'
        if ($Global:LauncherState.ContainsKey($svc.name) -and -not $Global:LauncherState[$svc.name].HasExited) {
            $status = 'Running'
        }
        $health = $null
        if ($svc.healthUrl) {
            try {
                $response = Invoke-WebRequest -Uri $svc.healthUrl -TimeoutSec 3
                $health = @{ code = $response.StatusCode; body = $response.Content }
            } catch {
                $health = @{ code = 0; body = $_.Exception.Message }
            }
        }
        $result += [pscustomobject]@{
            Name   = $svc.name
            Status = $status
            Health = $health
        }
    }
    return $result
}

Initialize-LauncherConfig -Path $ConfigPath

if ($MyInvocation.InvocationName -eq '.') {
    Write-LauncherLog "Launcher module loaded from $ConfigPath"
}