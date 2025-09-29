param(
    [Parameter(Mandatory=$true)] [string]$InstallerPath,
    [Parameter(Mandatory=$true)] [string]$SharePath,
    [string]$Version,
    [string]$HashFile = 'SHA256SUMS.txt'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $InstallerPath)) {
    throw "Installer not found: $InstallerPath"
}

if (-not $Version) {
    $Version = (Split-Path $InstallerPath -Leaf).Split('_')[-1].Replace('.zip','')
}

$shareTarget = Join-Path $SharePath $Version
if (-not (Test-Path $shareTarget)) {
    New-Item -ItemType Directory -Path $shareTarget -Force | Out-Null
}

$hash = Get-FileHash -Algorithm SHA256 -Path $InstallerPath
$hashLine = "{0}  {1}" -f $hash.Hash, (Split-Path $InstallerPath -Leaf)

$hashFilePath = Join-Path $shareTarget $HashFile
Set-Content -Path $hashFilePath -Value $hashLine -Encoding UTF8

Copy-Item -Path $InstallerPath -Destination $shareTarget -Force

[pscustomobject]@{
    installer = (Resolve-Path $InstallerPath).Path
    share = (Resolve-Path $shareTarget).Path
    hash = $hash.Hash
    timestamp = (Get-Date).ToString('o')
}
