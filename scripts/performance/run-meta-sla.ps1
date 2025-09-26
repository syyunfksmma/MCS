param(
    [string]$BaseUrl = "http://localhost:5229",
    [string]$OutputPath = "docs/sprint/meta_sla_history.csv",
    [int]$ChunkSizeBytes = 262144,
    [int]$ChunkCount = 4,
    [int]$MetaSlaMs = 1000
)

$k6Command = Get-Command k6 -ErrorAction SilentlyContinue
if (-not $k6Command) {
    $fallback = Join-Path $Env:ProgramFiles 'k6/k6.exe'
    if (Test-Path $fallback) {
        $k6Command = Get-Command $fallback -ErrorAction SilentlyContinue
    }
}
if (-not $k6Command) {
    throw 'k6 executable not found on PATH or Program Files.'
}
$k6Path = $k6Command.Source

$summaryPath = Join-Path $PSScriptRoot 'meta_sla_last.json'
$env:BASE_URL = $BaseUrl
$env:META_SLA_MS = $MetaSlaMs.ToString()
$env:CHUNK_SIZE = $ChunkSizeBytes.ToString()
$env:CHUNK_COUNT = $ChunkCount.ToString()

Write-Host "Running k6 meta SLA scenario against $BaseUrl..."
& $k6Path run --summary-export $summaryPath "$PSScriptRoot/../../tests/k6/chunk_upload.js"
if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 99) {
    throw "k6 run failed with exit code $LASTEXITCODE"
}
if ($LASTEXITCODE -eq 99) {
    Write-Warning "k6 reported threshold failures (exit code 99); logging results regardless."
}

$summary = Get-Content $summaryPath | ConvertFrom-Json
$metaP95 = [math]::Round($summary.metrics.meta_generation_wait_ms.percentiles."0.95", 2)
$metaP99 = [math]::Round($summary.metrics.meta_generation_wait_ms.percentiles."0.99", 2)
$completeP95 = [math]::Round($summary.metrics.chunk_upload_complete_ms.percentiles."0.95", 2)
$iterationP95 = [math]::Round($summary.metrics.chunk_upload_iteration_ms.percentiles."0.95", 2)
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")

if (-not (Test-Path $OutputPath)) {
    'timestamp,base_url,chunk_size_bytes,chunk_count,meta_p95_ms,meta_p99_ms,complete_p95_ms,iteration_p95_ms' | Out-File -FilePath $OutputPath -Encoding UTF8
}
"$timestamp,$BaseUrl,$ChunkSizeBytes,$ChunkCount,$metaP95,$metaP99,$completeP95,$iterationP95" | Out-File -FilePath $OutputPath -Encoding UTF8 -Append

Write-Host "Logged meta SLA measurement to $OutputPath" -ForegroundColor Green

