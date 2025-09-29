Param(
  [string]$Output = "test-results/uat/bootstrap.log"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$entries = @(
  "$timestamp :: UAT 계정 템플릿 생성 (CAM_UAT_ENGINEER, CAM_UAT_REVIEWER, CAM_UAT_ADMIN)",
  "$timestamp :: Shared sandbox reset → npm run test:data:reset",
  "$timestamp :: Shared sandbox seed → npm run test:data:seed",
  "$timestamp :: Placeholder - 실제 AD 그룹 매핑은 인프라 승인 후 실행"
)

$directory = Split-Path -Parent $Output
if (-not (Test-Path $directory)) {
  New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

$entries | Out-File -FilePath $Output -Encoding utf8
Write-Output "[bootstrap-uat] wrote log to $Output"
