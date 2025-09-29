param(
    [string]$ServiceAccount = 'MCMS\\svc-mcms',
    [string]$OutputDirectory = 'logs/security'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$spnLog = Join-Path $OutputDirectory "spn_${timestamp}.txt"
$klistLog = Join-Path $OutputDirectory "klist_${timestamp}.txt"

setspn.exe -L $ServiceAccount | Out-File -FilePath $spnLog -Encoding UTF8
klist.exe | Out-File -FilePath $klistLog -Encoding UTF8

[pscustomobject]@{
    serviceAccount = $ServiceAccount
    spnLog = $spnLog
    klistLog = $klistLog
    timestamp = (Get-Date).ToString('o')
}
