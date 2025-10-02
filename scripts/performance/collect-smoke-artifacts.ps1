[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$InputPath = "artifacts/perf/k6-smoke-latest.json",

    [Parameter(Mandatory = $false)]
    [string]$OutputDirectory = "artifacts/perf/history",

    [Parameter(Mandatory = $false)]
    [string]$SnapshotPrefix = "k6-smoke"
)

if (-not (Test-Path -Path $InputPath -PathType Leaf)) {
    throw "Smoke summary not found at '$InputPath'. 먼저 k6 스크립트를 실행해 산출물을 생성해 주십시오."
}

if (-not (Test-Path -Path $OutputDirectory -PathType Container)) {
    New-Item -Path $OutputDirectory -ItemType Directory -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$destination = Join-Path -Path $OutputDirectory -ChildPath ("{0}_{1}.json" -f $SnapshotPrefix, $timestamp)

Copy-Item -Path $InputPath -Destination $destination -Force

$latest = Resolve-Path -Path $InputPath
$snapshot = Resolve-Path -Path $destination

[PSCustomObject]@{
    LatestArtifact = $latest.Path
    SnapshotArtifact = $snapshot.Path
    CreatedAt = (Get-Date).ToString("s")
} | ConvertTo-Json -Depth 2
