param(
    [Parameter(Mandatory=$true)] [string]$FilePath,
    [int]$ChunkSizeBytes = 262144
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $FilePath)) {
    throw "File not found: $FilePath"
}

$sha256 = [System.Security.Cryptography.SHA256]::Create()
$stream = [System.IO.File]::OpenRead($FilePath)
$buffer = New-Object byte[] $ChunkSizeBytes
$chunkIndex = 0
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

try {
    while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
        $chunkIndex++
        $sha256.TransformBlock($buffer, 0, $read, $null, 0) | Out-Null
        [pscustomobject]@{
            chunkIndex = $chunkIndex
            bytesRead  = $read
            elapsedMs  = $stopwatch.Elapsed.TotalMilliseconds
        }
    }
    $sha256.TransformFinalBlock([byte[]]::new(0), 0, 0) | Out-Null
    [pscustomobject]@{
        filePath    = $FilePath
        chunkSize   = $ChunkSizeBytes
        totalChunks = $chunkIndex
        hash        = ([System.BitConverter]::ToString($sha256.Hash)).Replace('-', '')
        elapsedMs   = $stopwatch.Elapsed.TotalMilliseconds
    }
}
finally {
    $stream.Dispose()
    $sha256.Dispose()
}
