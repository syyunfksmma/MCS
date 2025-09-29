param(
  [ValidateSet('stage','prod')]
  [string]$Environment = 'stage',
  [switch]$RunSmoke = $true
)

Write-Host "Starting MCMS deployment for environment: $Environment" -ForegroundColor Cyan

$slot = if ($Environment -eq 'prod') { 'production' } else { 'staging' }
$deployScript = Join-Path $PSScriptRoot 'routing-' + $slot + '.ps1'

if (-not (Test-Path $deployScript)) {
  throw "Deploy script not found: $deployScript"
}

Write-Host "Executing $deployScript" -ForegroundColor Yellow
& $deployScript -ErrorAction Stop

if ($RunSmoke) {
  Write-Host "Running smoke tests..." -ForegroundColor Yellow
  $smokeScript = Join-Path $PSScriptRoot '..\automation\run-smoke-ci.ps1'
  if (Test-Path $smokeScript) {
    & $smokeScript -Environment $Environment -SkipShareCopy
  } else {
    Write-Warning "Smoke script not found: $smokeScript"
  }
}

Write-Host "Deployment completed." -ForegroundColor Green
