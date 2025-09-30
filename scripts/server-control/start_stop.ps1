param(
    [string]$ConfigPath = "config/server-control.config.json"
)

$ErrorActionPreference = 'Stop'

function Resolve-AbsolutePath {
    param(
        [Parameter(Mandatory = $true)][string]$BasePath,
        [Parameter(Mandatory = $true)][string]$Path
    )
    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $BasePath
    }
    if ([System.IO.Path]::IsPathRooted($Path)) {
        return (Resolve-Path -Path $Path -ErrorAction Stop).Path
    }
    $candidate = Join-Path -Path $BasePath -ChildPath $Path
    try {
        return (Resolve-Path -Path $candidate -ErrorAction Stop).Path
    } catch {
        return $candidate
    }
}

function Initialize-LauncherConfig {
    param([string]$Path)
    if (!(Test-Path -Path $Path)) {
        throw "Launcher configuration not found at $Path"
    }
    $resolvedConfig = (Resolve-Path -Path $Path -ErrorAction Stop).Path
    $configRoot = Split-Path -Parent $resolvedConfig
    $json = Get-Content -Path $resolvedConfig -Raw | ConvertFrom-Json
    if (-not $json.services) {
        throw "Launcher configuration must include a services collection."
    }

    $logSetting = if ([string]::IsNullOrWhiteSpace($json.logDirectory)) { '.' } else { $json.logDirectory }
    $logDirectory = Resolve-AbsolutePath -BasePath $configRoot -Path $logSetting
    if (-not (Test-Path -Path $logDirectory)) {
        New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    }
    $json.logDirectory = $logDirectory

    foreach ($svc in $json.services) {
        $workingDirSetting = if ([string]::IsNullOrWhiteSpace($svc.workingDirectory)) { '.' } else { $svc.workingDirectory }
        $svc.workingDirectory = Resolve-AbsolutePath -BasePath $configRoot -Path $workingDirSetting
        if (-not $svc.PSObject.Properties.Match('logPrefix')) {
            $svc | Add-Member -MemberType NoteProperty -Name logPrefix -Value ($svc.name -replace '\s','-') -Force
        }
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

function Get-LogTargets {
    param([psobject]$Service)
    $prefix = if ($Service.logPrefix) { $Service.logPrefix } else { $Service.name }
    $prefix = $prefix.ToLower()
    return @{
        StdOut = Join-Path $Global:LauncherConfig.logDirectory "$prefix-stdout.log"
        StdErr = Join-Path $Global:LauncherConfig.logDirectory "$prefix-stderr.log"
    }
}

function Start-LauncherService {
    param([Parameter(Mandatory=$true)][string]$Name)
    $service = $Global:LauncherConfig.services | Where-Object { $_.name -eq $Name }
    if (-not $service) {
        throw "Service '$Name' not defined in configuration."
    }
    if ($Global:LauncherState.ContainsKey($Name) -and $Global:LauncherState[$Name] -and -not ($Global:LauncherState[$Name].HasExited)) {
        Write-LauncherLog "Service '$Name' already running (PID $($Global:LauncherState[$Name].Id))." 'WARN'
        return $Global:LauncherState[$Name]
    }

    $logTargets = Get-LogTargets -Service $service
    $startInfo = @{
        FilePath = $service.command
        WorkingDirectory = $service.workingDirectory
        RedirectStandardOutput = $true
        RedirectStandardError  = $true
        UseNewWindow = $false
    }
    if ($service.arguments) {
        $startInfo.ArgumentList = $service.arguments
    }

    $process = Start-Process @startInfo -PassThru
    $process.add_OutputDataReceived({ param($sender,$args) if ($args.Data) { Add-Content -Path $logTargets.StdOut -Value $args.Data } })
    $process.add_ErrorDataReceived({ param($sender,$args) if ($args.Data) { Add-Content -Path $logTargets.StdErr -Value $args.Data } })
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()

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
            if (-not $process.WaitForExit(5000)) {
                $process.Kill()
                $process.WaitForExit()
            }
        } catch {
            Write-LauncherLog "Force stopping service '$Name': $_" 'WARN'
            try { $process.Kill(); $process.WaitForExit() } catch {}
        }
    }
    if ($process) { $process.Dispose() }
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
                $exception = $_.Exception
                $code = if ($exception.Response) { $exception.Response.StatusCode.value__ } else { 0 }
                $body = if ($exception.Response) {
                    try {
                        $reader = New-Object System.IO.StreamReader($exception.Response.GetResponseStream())
                        $reader.ReadToEnd()
                    } catch {
                        $exception.Message
                    }
                } else {
                    $exception.Message
                }
                $health = @{ code = $code; body = $body }
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