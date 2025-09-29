[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Approved','Deployed','RolledBack','Failed')]
    [string]$EventType,

    [Parameter(Mandatory = $true)]
    [string]$Environment,

    [string]$Revision,

    [string]$Initiator = $env:USERNAME,

    [string]$ChangeRequestId,

    [string]$Notes,

    [string]$WebhookUrl = $env:MCMS_DEPLOY_TEAMS_WEBHOOK,

    [string]$LogDirectory = 'logs\\deploy\\notifications'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..\\..')
$timestamp = Get-Date

if ([string]::IsNullOrWhiteSpace($WebhookUrl)) {
    Write-Verbose 'Webhook URL not provided; notifications will be 로그로만 기록합니다.'
    $WebhookUrl = $null
}

$themeColor = switch ($EventType) {
    'Approved'   { '107C10' }
    'Deployed'   { '0078D7' }
    'RolledBack' { 'D83B01' }
    'Failed'     { 'A4262C' }
    default      { '0078D7' }
}

$summary = "MCMS 배포 이벤트: $EventType ($Environment)"
$facts = @()
if ($Initiator) {
    $facts += @{ name = 'Initiator'; value = $Initiator }
}
if ($Revision) {
    $facts += @{ name = 'Revision'; value = $Revision }
}
if ($ChangeRequestId) {
    $facts += @{ name = 'Change Request'; value = $ChangeRequestId }
}

$cardPayload = @{
    '@type'    = 'MessageCard'
    '@context' = 'https://schema.org/extensions'
    summary    = $summary
    themeColor = $themeColor
    title      = "${Environment} 환경 배포 ${EventType}"
    sections   = @(
        @{
            activityTitle = "**${Environment}** 환경에서 **${EventType}** 이벤트가 발생했습니다."
            activitySubtitle = $timestamp.ToString('yyyy-MM-dd HH:mm:ss K')
            facts = $facts
            text  = if ($Notes) { $Notes } else { '자동 배포 알림입니다.' }
        }
    )
}

$cardJson = $cardPayload | ConvertTo-Json -Depth 6

$notificationStatus = 'skipped'
$webhookError = $null
if ($WebhookUrl) {
    try {
        Invoke-RestMethod -Method Post -Uri $WebhookUrl -Body $cardJson -ContentType 'application/json' | Out-Null
        $notificationStatus = 'sent'
    }
    catch {
        $notificationStatus = 'failed'
        $webhookError = $_.Exception.Message
        Write-Warning "Webhook 전송 실패: $webhookError"
    }
}

$logRoot = Join-Path $repoRoot $LogDirectory
if (-not (Test-Path $logRoot)) {
    New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
}
$logPath = Join-Path $logRoot ("deploy_notification_{0}.jsonl" -f $timestamp.ToString('yyyyMMdd'))

$logEntry = @{
    timestamp  = $timestamp.ToString('o')
    eventType  = $EventType
    environment = $Environment
    revision   = $Revision
    initiator  = $Initiator
    changeRequestId = $ChangeRequestId
    notes      = $Notes
    webhookStatus = $notificationStatus
    webhookError  = $webhookError
} | ConvertTo-Json -Depth 4

Add-Content -Path $logPath -Value $logEntry

Write-Host "[$($timestamp.ToString('yyyy-MM-dd HH:mm:ss'))] 이벤트 ${EventType} 기록 완료 (상태: $notificationStatus). 로그: $logPath"

