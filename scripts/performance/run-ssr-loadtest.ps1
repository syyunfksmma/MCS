param(
  [string]$BaseUrl = "https://stg.mcms.corp",
  [int]$Requests = 50
)

Write-Host "Running SSR load test against $BaseUrl" -ForegroundColor Cyan

$durations = @()
for ($i = 0; $i -lt $Requests; $i++) {
  $start = Get-Date
  try {
    Invoke-WebRequest -Uri "$BaseUrl/explorer" -UseBasicParsing | Out-Null
    $duration = (Get-Date) - $start
    $durations += $duration.TotalMilliseconds
  } catch {
    Write-Warning "Request $i failed: $_"
  }
}

if ($durations.Count -eq 0) {
  Write-Warning "No successful responses captured."
  exit 1
}

$average = [Math]::Round(($durations | Measure-Object -Average).Average, 2)
$max = [Math]::Round(($durations | Measure-Object -Maximum).Maximum, 2)
$min = [Math]::Round(($durations | Measure-Object -Minimum).Minimum, 2)

Write-Host "SSR load test summary" -ForegroundColor Green
Write-Host "Count: $($durations.Count)"
Write-Host "Avg(ms): $average | Min(ms): $min | Max(ms): $max"

if ($average -gt 800) {
  Write-Warning "Average SSR response time exceeded 800ms threshold."
}
