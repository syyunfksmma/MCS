
param(
  [string]$Destination = "$PSScriptRoot/../web/mcs-portal/node_modules/.cache/ms-playwright"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Destination)) {
  New-Item -ItemType Directory -Path $Destination | Out-Null
}

$env:PLAYWRIGHT_BROWSERS_PATH = '0'
Write-Host "Installing Playwright browsers into $Destination"

Push-Location "$PSScriptRoot/../web/mcs-portal"
try {
  npm install --no-fund --prefer-offline
  npx playwright install --with-deps
}
finally {
  Pop-Location
}
