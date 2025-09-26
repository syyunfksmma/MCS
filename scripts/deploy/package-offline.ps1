[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$Version,

    [string]$Configuration = 'Release',

    [string]$StageRoot = 'artifacts\offline',

    [string]$ShareRoot = '\\MCMS_SHARE',

    [string]$PackageName,

    [switch]$SkipBuild,

    [switch]$SkipWebBuild,

    [switch]$SkipShareCopy,

    [switch]$CreateSfx
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\..')
$timestamp = Get-Date

if (-not $PackageName) {
    $PackageName = "MCMS_Setup_$Version"
}

$stageRoot = Join-Path $repoRoot $StageRoot
$packageRoot = Join-Path $stageRoot $PackageName
$payloadRoot = Join-Path $packageRoot 'payload'
$metaRoot = Join-Path $packageRoot 'meta'
$logRoot = Join-Path $packageRoot 'logs'
$stagingRoot = Join-Path $packageRoot 'staging'
$publishRoot = Join-Path $stagingRoot 'publish'
$webStaging = Join-Path $stagingRoot 'web'

if (Test-Path $packageRoot) {
    Remove-Item $packageRoot -Recurse -Force
}

foreach ($dir in @($payloadRoot,$metaRoot,$logRoot,$publishRoot,$webStaging)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$logFile = Join-Path $logRoot ("package-offline_{0:yyyyMMdd_HHmmss}.log" -f $timestamp)
$script:LogLevelPreference = if ($PSBoundParameters.ContainsKey('Verbose')) { 'DEBUG' } else { 'INFO' }

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('INFO','WARN','ERROR','DEBUG')]
        [string]$Level = 'INFO'
    )

    if ($Level -eq 'DEBUG' -and $script:LogLevelPreference -ne 'DEBUG') {
        return
    }

    $line = "{0:yyyy-MM-dd HH:mm:ss} [{1}] {2}" -f (Get-Date), $Level, $Message
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

function Resolve-GitCommit {
    try {
        Push-Location $repoRoot
        $sha = (git rev-parse HEAD).Trim()
        return $sha
    }
    catch {
        Write-Log "Unable to read git commit: $_" 'WARN'
        return ''
    }
    finally {
        Pop-Location | Out-Null
    }
}

function Copy-Tree {
    param(
        [string]$Source,
        [string]$Destination,
        [switch]$AllowMissing
    )

    if (-not (Test-Path $Source)) {
        if ($AllowMissing) {
            Write-Log "Skipped missing source: $Source" 'WARN'
            return
        }
        throw "Source path not found: $Source"
    }

    $items = Get-ChildItem -LiteralPath $Source -Force
    if (-not $items) {
        Write-Log "Source contains no items: $Source" 'WARN'
        return
    }

    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Write-Log "Copy $Source -> $Destination"
    Copy-Item -Path $items.FullName -Destination $Destination -Recurse -Force
}

Write-Log "Packaging version $Version (configuration: $Configuration)"
Write-Log "Repository root: $repoRoot"

if (-not $SkipBuild) {
    Write-Log "Publishing .NET applications to $publishRoot"
    Push-Location $scriptDir
    try {
        & "$scriptDir\publish-all.ps1" -Configuration $Configuration -Output $publishRoot
        if ($LASTEXITCODE -ne 0) {
            throw "publish-all.ps1 exited with code $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location | Out-Null
    }
}
else {
    Write-Log "Skipping .NET publish stage" 'WARN'
}

$runtimeTarget = Join-Path $payloadRoot 'runtime'
Copy-Tree -Source $publishRoot -Destination $runtimeTarget -AllowMissing:$SkipBuild

if (-not $SkipWebBuild) {
    $webPath = Join-Path $repoRoot 'web\mcs-portal'
    if (Test-Path $webPath) {
        Write-Log "Building web portal at $webPath"
        $npmCache = Join-Path $repoRoot '.storage\npm-cache'
        New-Item -ItemType Directory -Path $npmCache -Force | Out-Null
        $previousCache = $env:NPM_CONFIG_CACHE

        try {
            $env:NPM_CONFIG_CACHE = $npmCache
            Push-Location $webPath
            try {
                Write-Log 'npm ci --no-audit --no-fund --prefer-offline'
                npm ci --no-audit --no-fund --prefer-offline | Out-Null
            }
            catch {
                Write-Log "npm ci (offline preferred) failed: $_" 'WARN'
                Write-Log 'Retry npm install --no-audit --no-fund'
                npm install --no-audit --no-fund | Out-Null
            }

            Write-Log 'npm run build'
            npm run build | Out-Null

            if (Test-Path (Join-Path $webPath 'node_modules')) {
                Write-Log 'npm prune --omit=dev'
                npm prune --omit=dev | Out-Null
            }
        }
        finally {
            Pop-Location | Out-Null
            $env:NPM_CONFIG_CACHE = $previousCache
        }

        $portalTarget = Join-Path $payloadRoot 'web\portal'
        Copy-Tree -Source (Join-Path $webPath '.next') -Destination (Join-Path $portalTarget '.next')
        Copy-Tree -Source (Join-Path $webPath 'public') -Destination (Join-Path $portalTarget 'public') -AllowMissing
        Copy-Tree -Source (Join-Path $webPath 'node_modules') -Destination (Join-Path $portalTarget 'node_modules')

        foreach ($file in @('package.json','package-lock.json','next.config.js','appsettings.portal.json')) {
            $sourceFile = Join-Path $webPath $file
            if (Test-Path $sourceFile) {
                Copy-Item -Path $sourceFile -Destination $portalTarget -Force
            }
        }
    }
    else {
        Write-Log "Web portal directory not found: $webPath" 'WARN'
    }
}
else {
    Write-Log "Skipping web build" 'WARN'
}

$toolsTarget = Join-Path $payloadRoot 'tools'
New-Item -ItemType Directory -Path $toolsTarget -Force | Out-Null
$smokeScript = Join-Path $scriptDir 'run-smoke.ps1'
if (Test-Path $smokeScript) {
    Copy-Item -Path $smokeScript -Destination $toolsTarget -Force
}

$installScript = @"
param(
    [string]`$InstallRoot = 'C:\MCMS',
    [string]`$SiteName = 'MCMS',
    [string]`$AppPoolName = 'MCMS.AppPool'
)

Set-StrictMode -Version Latest
`$ErrorActionPreference = 'Stop'

Write-Host "Installing MCMS package to `$InstallRoot"
New-Item -ItemType Directory -Path `$InstallRoot -Force | Out-Null
Copy-Item -Path (Join-Path `$PSScriptRoot '..\payload\runtime\*') -Destination `$InstallRoot -Recurse -Force
Copy-Item -Path (Join-Path `$PSScriptRoot '..\payload\web\portal') -Destination (Join-Path `$InstallRoot 'portal') -Recurse -Force
Write-Host 'Artifacts copied. Configure IIS and services per Phase10 Runbook.'
"@
Set-Content -Path (Join-Path $packageRoot 'Install-MCMS.ps1') -Value $installScript -Encoding UTF8

$manifest = [ordered]@{
    version = $Version
    packageName = $PackageName
    builtAt = (Get-Date).ToString('o')
    configuration = $Configuration
    gitCommit = (Resolve-GitCommit)
    runtimePath = 'payload/runtime'
    webPortalPath = 'payload/web/portal'
    tools = @('payload/tools/run-smoke.ps1','Install-MCMS.ps1')
}
$manifestPath = Join-Path $metaRoot 'manifest.json'
$manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Encoding UTF8

$hashFile = Join-Path $metaRoot 'SHA256SUMS.txt'
$hashLines = Get-ChildItem -Path $payloadRoot -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($payloadRoot.Length).TrimStart('\')
    $hashValue = Get-FileHash -Path $_.FullName -Algorithm SHA256 | Select-Object -ExpandProperty Hash
    "{0} *payload/{1}" -f $hashValue, $relative
}
$hashLines | Set-Content -Path $hashFile -Encoding ASCII

$readme = @"
MCMS Offline Package - $Version
===============================

생성 일시: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K')
출력 경로: $packageRoot

1. Install-MCMS.ps1을 관리자 PowerShell에서 실행해 파일을 배치합니다.
2. Phase10_DeploymentRunbook.md와 Shared Drive 구조 문서를 참고해 IIS, 서비스 계정, Windows 인증을 구성합니다.
3. 설치 서버에서 payload\tools\run-smoke.ps1 -Environment InternalProd 를 실행해 통합 인증 스모크를 수행합니다.
4. 결과 로그와 manifest.json, SHA256SUMS.txt를 \\MCMS_SHARE\installers\$Version 폴더에 업로드합니다.

이 패키지는 오프라인 환경을 가정하며 npm 캐시를 .storage\npm-cache 에 유지합니다.
"@
Set-Content -Path (Join-Path $packageRoot 'README.txt') -Value $readme -Encoding UTF8

$archivePath = Join-Path $stageRoot ("$PackageName.zip")
if (Test-Path $archivePath) {
    Remove-Item $archivePath -Force
}

$archiveSources = @(
    (Join-Path $packageRoot 'payload')
    (Join-Path $packageRoot 'meta')
    (Join-Path $packageRoot 'logs')
    (Join-Path $packageRoot 'Install-MCMS.ps1')
    (Join-Path $packageRoot 'README.txt')
)

Write-Log "Creating archive at $archivePath"
Compress-Archive -Path $archiveSources -DestinationPath $archivePath -Force

if ($CreateSfx) {
    $sedPath = Join-Path $packageRoot 'MCMS_Setup.sed'
    $exePath = [System.IO.Path]::ChangeExtension($archivePath, '.exe')
    $sedContent = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=2
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=I
InstallPrompt=""
DisplayLicense=""
FinishMessage="MCMS offline package extracted. Run Install-MCMS.ps1"
TargetName="$exePath"
FriendlyName="MCMS Offline Package"
AppLaunched="powershell.exe"
PostInstallCmd="-NoProfile -ExecutionPolicy Bypass -File Install-MCMS.ps1"
AdminQuietInstCmd="-NoProfile -ExecutionPolicy Bypass -File Install-MCMS.ps1"
SourceFiles=SourceFiles
[SourceFiles]
SourceFiles0=$packageRoot
[SourceFiles0]
SourceFilename0=Install-MCMS.ps1
SourceFilename1=README.txt
SourceFilename2=payload
SourceFilename3=meta
SourceFilename4=logs
[Strings]
"@
    Set-Content -Path $sedPath -Value $sedContent -Encoding UTF8
    try {
        Write-Log 'Creating self-extracting EXE via iexpress.exe'
        Start-Process -FilePath 'iexpress.exe' -ArgumentList '/n', $sedPath -NoNewWindow -Wait
        if (Test-Path $exePath) {
            Write-Log "Self-extracting package created at $exePath"
        }
    }
    catch {
        Write-Log "Failed to create self-extracting package: $_" 'WARN'
    }
}

if (-not $SkipShareCopy) {
    $shareTarget = Join-Path $ShareRoot ("installers\$Version")
    try {
        New-Item -ItemType Directory -Path $shareTarget -Force | Out-Null
        Copy-Item -Path $archivePath -Destination $shareTarget -Force
        Copy-Item -Path $manifestPath -Destination $shareTarget -Force
        Write-Log "Copied archive to $shareTarget"
    }
    catch {
        Write-Log "Failed to copy archive to share: $_" 'WARN'
    }
}
else {
    Write-Log 'Skip share copy stage' 'WARN'
}

Write-Log "Package complete: $archivePath"
return $archivePath


