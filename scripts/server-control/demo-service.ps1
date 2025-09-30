param(
    [Parameter(Mandatory=$true)][string]$ServiceName,
    [int]$IntervalSeconds = 5
)

Write-Host "[$(Get-Date -Format o)] $ServiceName demo service started."
while ($true) {
    Write-Host "[$(Get-Date -Format o)] $ServiceName heartbeat"
    Start-Sleep -Seconds $IntervalSeconds
}