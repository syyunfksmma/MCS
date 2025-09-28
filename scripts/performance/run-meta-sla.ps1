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

function Get-MetricPercentile {
    param(
        [object]$Metric,
        [string]$Percentile
    )

    if (-not $Metric) {
        return $null
    }

    $propertyName = "p($Percentile)"
    $property = $Metric.PSObject.Properties[$propertyName]
    if ($property) {
        return [double]$property.Value
    }

    $percentiles = $Metric.percentiles
    if ($percentiles) {
        $altName = "0.{0}" -f $Percentile
        $altProperty = $percentiles.PSObject.Properties[$altName]
        if ($altProperty) {
            return [double]$altProperty.Value
        }
    }

    return $null
}

$metaMetric = $summary.metrics.meta_generation_wait_ms
$completeMetric = $summary.metrics.chunk_upload_complete_ms
$iterationMetric = $summary.metrics.chunk_upload_iteration_ms

$metaP95 = Get-MetricPercentile $metaMetric '95'
$metaP99 = Get-MetricPercentile $metaMetric '99'
$completeP95 = Get-MetricPercentile $completeMetric '95'
$iterationP95 = Get-MetricPercentile $iterationMetric '95'

if ($metaP95 -eq $null) {
    Write-Warning 'meta_generation_wait_ms metric missing p(95); recorded as blank.'
}
if ($completeP95 -eq $null) {
    Write-Warning 'chunk_upload_complete_ms metric missing p(95); recorded as blank.'
}
if ($iterationP95 -eq $null) {
    Write-Warning 'chunk_upload_iteration_ms metric missing p(95); recorded as blank.'
}

$metaP95Value = if ($metaP95 -ne $null) { [math]::Round($metaP95, 2) } else { '' }
$metaP99Value = if ($metaP99 -ne $null) { [math]::Round($metaP99, 2) } else { '' }
$completeP95Value = if ($completeP95 -ne $null) { [math]::Round($completeP95, 2) } else { '' }
$iterationP95Value = if ($iterationP95 -ne $null) { [math]::Round($iterationP95, 2) } else { '' }
$scriptBug = if ($metaP95Value -ne '' -and $metaP95Value -eq '0') { 'true' } else { 'false' }
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")

if (-not (Test-Path $OutputPath)) {
    'timestamp,base_url,chunk_size_bytes,chunk_count,meta_p95_ms,meta_p99_ms,complete_p95_ms,iteration_p95_ms,script_bug' | Out-File -FilePath $OutputPath -Encoding UTF8
}
"$timestamp,$BaseUrl,$ChunkSizeBytes,$ChunkCount,$metaP95Value,$metaP99Value,$completeP95Value,$iterationP95Value,$scriptBug" | Out-File -FilePath $OutputPath -Encoding UTF8 -Append

Write-Host "Logged meta SLA measurement to $OutputPath" -ForegroundColor Green






