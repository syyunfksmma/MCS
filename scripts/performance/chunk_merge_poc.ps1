param(
    [Parameter(Mandatory=$true)] [string]$SourceDirectory,
    [Parameter(Mandatory=$true)] [string]$OutputFile,
    [string]$Pattern = '*.chunk',
    [switch]$VerifyHash,
    [string]$HashAlgorithm = 'SHA256'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $SourceDirectory)) {
    throw "Source directory not found: $SourceDirectory"
}

$chunks = Get-ChildItem -Path $SourceDirectory -Filter $Pattern | Sort-Object Name
if (-not $chunks) {
    throw "No chunk files found in $SourceDirectory matching $Pattern"
}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$hash     = if ($VerifyHash) { [System.Security.Cryptography.HashAlgorithm]::Create($HashAlgorithm) } else { $null }

try {
    $outStream = [System.IO.File]::Create($OutputFile)
    try {
        foreach ($chunk in $chunks) {
            $bytes = [System.IO.File]::ReadAllBytes($chunk.FullName)
            $outStream.Write($bytes, 0, $bytes.Length)
            if ($hash) { $hash.TransformBlock($bytes, 0, $bytes.Length, $null, 0) | Out-Null }
            [pscustomobject]@{
                chunk    = $chunk.Name
                size     = $bytes.Length
                elapsedMs = $stopwatch.Elapsed.TotalMilliseconds
            }
        }
        if ($hash) {
            $hash.TransformFinalBlock([byte[]]::new(0), 0, 0) | Out-Null
            $hashValue = ([System.BitConverter]::ToString($hash.Hash)).Replace('-', '')
        }
    }
    finally {
        $outStream.Dispose()
    }
}
finally {
    if ($hash) { $hash.Dispose() }
}

[pscustomobject]@{
    outputFile = $OutputFile
    mergedChunks = $chunks.Count
    elapsedMs = $stopwatch.Elapsed.TotalMilliseconds
    hash = $hashValue
}
