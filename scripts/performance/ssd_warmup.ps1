param(
    [Parameter(Mandatory=$true)] [string]$TargetPath,
    [int]$Iterations = 3
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $TargetPath)) {
    throw "Target path not found: $TargetPath"
}

$files = Get-ChildItem -Path $TargetPath -File -Recurse
if (-not $files) {
    Write-Warning "No files found to warm up."
    return
}

for ($i = 1; $i -le $Iterations; $i++) {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    foreach ($file in $files) {
        [System.IO.File]::OpenRead($file.FullName).Dispose()
    }
    $stopwatch.Stop()
    [pscustomobject]@{
        iteration = $i
        elapsedMs = [Math]::Round($stopwatch.Elapsed.TotalMilliseconds, 2)
        fileCount = $files.Count
        timestamp = (Get-Date).ToString('o')
    }
}
