param(
    [Parameter(Mandatory=$true)] [string]$TargetPath,
    [string]$OutputDirectory = 'logs/security/acl',
    [string]$BaselineFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $TargetPath)) {
    throw "Target path not found: $TargetPath"
}

if (-not (Test-Path $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$currentFile = Join-Path $OutputDirectory "permissions_${timestamp}.csv"

Get-Acl -Path $TargetPath | Select-Object -ExpandProperty Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited |
    Export-Csv -Path $currentFile -NoTypeInformation -Encoding UTF8

if ($BaselineFile -and (Test-Path $BaselineFile)) {
    $baseline = Import-Csv -Path $BaselineFile
    $current = Import-Csv -Path $currentFile
    $diff = Compare-Object -ReferenceObject $baseline -DifferenceObject $current -Property IdentityReference, FileSystemRights, AccessControlType, IsInherited
    $diffFile = Join-Path $OutputDirectory "permissions_diff_${timestamp}.csv"
    $diff | Export-Csv -Path $diffFile -NoTypeInformation -Encoding UTF8
}

[pscustomobject]@{
    target = (Resolve-Path $TargetPath).Path
    export = $currentFile
    baseline = $BaselineFile
    timestamp = (Get-Date).ToString('o')
}
