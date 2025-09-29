param(
    [Parameter(Mandatory=$true)] [string]$ReferenceHashFile,
    [Parameter(Mandatory=$true)] [string]$TargetFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ReferenceHashFile)) {
    throw "Reference hash file not found: $ReferenceHashFile"
}

if (-not (Test-Path $TargetFile)) {
    throw "Target file not found: $TargetFile"
}

$reference = Get-Content -Path $ReferenceHashFile | Where-Object { $_ -match '\S' }
$expectedHash = $reference.Split(' ')[0]

$actual = Get-FileHash -Algorithm SHA256 -Path $TargetFile
$matches = $actual.Hash -eq $expectedHash

[pscustomobject]@{
    target = (Resolve-Path $TargetFile).Path
    expected = $expectedHash
    actual = $actual.Hash
    matches = $matches
    timestamp = (Get-Date).ToString('o')
}
