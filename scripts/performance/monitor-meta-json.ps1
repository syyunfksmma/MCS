param(
    [int]$ProcessId,
    [string]$ProcessName = 'MCMS.API',
    [int]$RefreshIntervalSeconds = 5,
    [int]$DurationSeconds = 300,
    [string]$OutputPath = 'logs/meta-json-counters.ndjson'
)

function Write-MonitorLog {
    param([string]$Message)
    $timestamp = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
    Write-Host "[$timestamp] $Message"
}

$dotnetCounters = Get-Command dotnet-counters -ErrorAction Stop

if (-not $ProcessId) {
    $process = Get-Process -Name $ProcessName -ErrorAction Stop | Select-Object -First 1
    $ProcessId = $process.Id
    Write-MonitorLog "Resolved process '$ProcessName' to PID $ProcessId."
}

$arguments = @(
    'monitor',
    '--refresh-interval', $RefreshIntervalSeconds,
    '--counters', 'MCMS.FileStorage:meta-json-queue-length,MCMS.FileStorage:meta-json-write-duration-ms,MCMS.FileStorage:meta-json-queue-wait-ms',
    '--process-id', $ProcessId,
    '--format', 'json'
)

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $dotnetCounters.Source
$arguments | ForEach-Object { $psi.ArgumentList.Add($_) }
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $psi
$null = $proc.Start()

$directory = Split-Path $OutputPath -Parent
if (-not [string]::IsNullOrWhiteSpace($directory) -and -not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

Write-MonitorLog "Collecting counters for up to $DurationSeconds seconds. Output -> $OutputPath"
$endTime = (Get-Date).AddSeconds($DurationSeconds)

while (-not $proc.HasExited) {
    if ([Console]::KeyAvailable) {
        $key = [Console]::ReadKey($true)
        if ($key.Key -eq 'Q') {
            Write-MonitorLog 'Operator requested quit.'
            $proc.Kill()
            break
        }
    }

    if ((Get-Date) -ge $endTime) {
        Write-MonitorLog 'Duration reached; stopping collection.'
        $proc.Kill()
        break
    }

    while (-not $proc.StandardOutput.EndOfStream) {
        $line = $proc.StandardOutput.ReadLine()
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }
        try {
            $payload = $line | ConvertFrom-Json
        }
        catch {
            continue
        }

        $record = [pscustomobject]@{
            timestamp = (Get-Date).ToString('o')
            processId = $ProcessId
            counters  = $payload
        }
        $ndjson = $record | ConvertTo-Json -Depth 5 -Compress
        Add-Content -Path $OutputPath -Value $ndjson
    }

    Start-Sleep -Milliseconds 200
}

if (-not $proc.HasExited) {
    $proc.WaitForExit()
}

if (-not $proc.StandardError.EndOfStream) {
    Write-MonitorLog "dotnet-counters stderr:`n$($proc.StandardError.ReadToEnd())"
}

Write-MonitorLog 'Counter capture complete.'
