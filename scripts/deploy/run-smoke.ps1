[CmdletBinding()]
param(
    [ValidateSet('InternalStage','InternalProd','Lab')]
    [string]$Environment = 'InternalStage',

    [string]$BaseUrl,

    [string]$ApiUrl,

    [string]$OutputDir = 'artifacts\offline\logs',

    [switch]$DisableWindowsAuth,

    [switch]$SkipPortal,

    [switch]$SkipApi,

    [switch]$SkipShareCopy,

    [string]$ShareRoot = '\\MCMS_SHARE',

    [int]$TimeoutSeconds = 20
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\..')
$timestamp = Get-Date
$runId = $timestamp.ToString('yyyyMMdd_HHmmss')

$envMap = @{
    InternalStage = @{
        BaseUrl = 'https://mcms-stage.internal'
        ApiUrl = 'https://mcms-stage.internal/api'
    }
    InternalProd = @{
        BaseUrl = 'https://mcms.internal'
        ApiUrl = 'https://mcms.internal/api'
    }
    Lab = @{
        BaseUrl = 'https://mcms-lab.internal'
        ApiUrl = 'https://mcms-lab.internal/api'
    }
}

if (-not $BaseUrl -and $envMap.ContainsKey($Environment)) {
    $BaseUrl = $envMap[$Environment].BaseUrl
}
if (-not $ApiUrl -and $envMap.ContainsKey($Environment)) {
    $ApiUrl = $envMap[$Environment].ApiUrl
}
if (-not $ApiUrl -and $BaseUrl) {
    $ApiUrl = (Join-Path $BaseUrl 'api')
}
if (-not $BaseUrl) {
    throw "BaseUrl could not be resolved for environment '$Environment'. Specify -BaseUrl explicitly."
}

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13

$outputRoot = Join-Path $repoRoot $OutputDir
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$logFile = Join-Path $outputRoot "smoke_$runId.log"
$resultsJson = Join-Path $outputRoot "smoke_$runId.json"
$resultsCsv = Join-Path $outputRoot "smoke_$runId.csv"

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('INFO','WARN','ERROR','DEBUG')]
        [string]$Level = 'INFO'
    )

    $line = "{0:yyyy-MM-dd HH:mm:ss} [{1}] {2}" -f (Get-Date), $Level, $Message
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

function Invoke-SmokeRequest {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = 'GET',
        [int[]]$ExpectedStatus = @(200),
        [switch]$UseDefaultCredentials,
        [hashtable]$Headers,
        [string]$Body,
        [switch]$ValidateNegotiate,
        [switch]$CaptureBody
    )

    $handler = [System.Net.Http.HttpClientHandler]::new()
    $handler.UseDefaultCredentials = [bool]$UseDefaultCredentials
    $handler.PreAuthenticate = [bool]$UseDefaultCredentials

    $client = [System.Net.Http.HttpClient]::new($handler)
    $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSeconds)

    try {
        $httpMethod = switch ($Method.ToUpperInvariant()) {
            'POST' { [System.Net.Http.HttpMethod]::Post }
            'PUT' { [System.Net.Http.HttpMethod]::Put }
            'DELETE' { [System.Net.Http.HttpMethod]::Delete }
            default { [System.Net.Http.HttpMethod]::Get }
        }

        $request = [System.Net.Http.HttpRequestMessage]::new($httpMethod, $Url)

        if ($Headers) {
            foreach ($key in $Headers.Keys) {
                $null = $request.Headers.TryAddWithoutValidation($key, $Headers[$key])
            }
        }

        if ($Body) {
            $request.Content = [System.Net.Http.StringContent]::new($Body, [System.Text.Encoding]::UTF8, 'application/json')
        }

        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = $client.SendAsync($request).GetAwaiter().GetResult()
        $stopwatch.Stop()

        $status = [int]$response.StatusCode
        $success = $ExpectedStatus -contains $status
        $wwwAuth = ''
        if ($response.Headers.Contains('WWW-Authenticate')) {
            $wwwAuth = ($response.Headers.GetValues('WWW-Authenticate') -join ', ')
        }
        if ($ValidateNegotiate) {
            if ($wwwAuth -notmatch 'Negotiate') {
                $success = $false
            }
        }

        $snippet = ''
        if ($CaptureBody -or -not $success) {
            $snippet = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if ($snippet.Length -gt 512) {
                $snippet = $snippet.Substring(0,512)
            }
        }

        return [pscustomobject]@{
            Name = $Name
            Url = $Url
            Method = $Method.ToUpperInvariant()
            Status = $status
            Expected = ($ExpectedStatus -join ',')
            Success = $success
            DurationMs = [math]::Round($stopwatch.Elapsed.TotalMilliseconds,2)
            UseDefaultCredentials = [bool]$UseDefaultCredentials
            WwwAuthenticate = $wwwAuth
            BodySnippet = $snippet
            Error = $null
        }
    }
    catch {
        return [pscustomobject]@{
            Name = $Name
            Url = $Url
            Method = $Method.ToUpperInvariant()
            Status = -1
            Expected = ($ExpectedStatus -join ',')
            Success = $false
            DurationMs = 0
            UseDefaultCredentials = [bool]$UseDefaultCredentials
            WwwAuthenticate = ''
            BodySnippet = ''
            Error = $_.Exception.Message
        }
    }
    finally {
        $client.Dispose()
    }
}

$tests = @()
$windowsAuthEnabled = -not $DisableWindowsAuth

if ($windowsAuthEnabled -and -not $SkipApi) {
    $tests += [ordered]@{
        Name = 'Kerberos Challenge'
        Url = (Join-Path $ApiUrl 'health')
        Method = 'GET'
        ExpectedStatus = @(401)
        UseDefaultCredentials = $false
        ValidateNegotiate = $true
        CaptureBody = $false
    }
}

if (-not $SkipApi) {
    $tests += [ordered]@{
        Name = 'API Health'
        Url = (Join-Path $ApiUrl 'health')
        Method = 'GET'
        ExpectedStatus = @(200)
        UseDefaultCredentials = $windowsAuthEnabled
        ValidateNegotiate = $false
        CaptureBody = $windowsAuthEnabled
    }
    $tests += [ordered]@{
        Name = 'Swagger Document'
        Url = (Join-Path $BaseUrl 'swagger/v1/swagger.json')
        Method = 'GET'
        ExpectedStatus = @(200)
        UseDefaultCredentials = $windowsAuthEnabled
        ValidateNegotiate = $false
        CaptureBody = $false
    }
}

if (-not $SkipPortal) {
    $tests += [ordered]@{
        Name = 'Portal Root'
        Url = $BaseUrl
        Method = 'GET'
        ExpectedStatus = @(200,302)
        UseDefaultCredentials = $windowsAuthEnabled
        ValidateNegotiate = $false
        CaptureBody = $false
    }
}

if ($tests.Count -eq 0) {
    Write-Log 'No smoke tests scheduled (all suites skipped).' 'WARN'
}

$results = @()
foreach ($test in $tests) {
    Write-Log "Running $($test.Name) => $($test.Url)"
    $result = Invoke-SmokeRequest @test
    if (-not $result.Success) {
        Write-Log "Failed: $($result.Name) (Status=$($result.Status), Expected=$($result.Expected))" 'ERROR'
        if ($result.WwwAuthenticate) {
            Write-Log "WWW-Authenticate: $($result.WwwAuthenticate)" 'DEBUG'
        }
        if ($result.Error) {
            Write-Log "Error: $($result.Error)" 'ERROR'
        }
    }
    else {
        Write-Log "Success: $($result.Name) (Status=$($result.Status))"
    }
    $results += $result
}

$failed = @($results | Where-Object { -not $_.Success })
$failedCount = $failed.Count
$totalCount = $results.Count

$results | ConvertTo-Json -Depth 5 | Set-Content -Path $resultsJson -Encoding UTF8
$results | Export-Csv -Path $resultsCsv -NoTypeInformation -Encoding UTF8

if (-not $SkipShareCopy) {
    $shareTarget = Join-Path $ShareRoot ("logs\smoke\$Environment\{0:yyyy}\{0:yyyyMMdd}" -f $timestamp)
    try {
        New-Item -ItemType Directory -Path $shareTarget -Force | Out-Null
        if (Test-Path $logFile) { Copy-Item -Path $logFile -Destination $shareTarget -Force }
        if (Test-Path $resultsJson) { Copy-Item -Path $resultsJson -Destination $shareTarget -Force }
        if (Test-Path $resultsCsv) { Copy-Item -Path $resultsCsv -Destination $shareTarget -Force }
        Write-Log "Copied smoke results to $shareTarget"
    }
    catch {
        Write-Log "Failed to copy smoke results to share: $_" 'WARN'
    }
}
else {
    Write-Log 'Skip share copy stage' 'WARN'
}

$summary = [pscustomobject]@{
    Environment = $Environment
    BaseUrl = $BaseUrl
    ApiUrl = $ApiUrl
    RunId = $runId
    Total = $totalCount
    Failed = $failedCount
    Log = $logFile
    Json = $resultsJson
    Csv = $resultsCsv
}

$summary | ConvertTo-Json -Depth 3 | Set-Content -Path (Join-Path $outputRoot "smoke_$runId.summary.json") -Encoding UTF8

Write-Log "Smoke run complete. Total=$totalCount Failed=$failedCount"

$summary

if ($failedCount -gt 0) {
    exit 1
}


