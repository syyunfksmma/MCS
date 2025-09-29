param(
    [string[]]$Services = @('MCMS-Portal', 'MCMS-API'),
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$results = @()
foreach ($serviceName in $Services) {
    $exists = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if (-not $exists) {
        $results += [pscustomobject]@{
            service = $serviceName
            action = 'Skip (not found)'
            timestamp = (Get-Date).ToString('o')
        }
        continue
    }
    if ($DryRun) {
        $results += [pscustomobject]@{
            service = $serviceName
            action = 'DryRun'
            timestamp = (Get-Date).ToString('o')
        }
        continue
    }
    Restart-Service -Name $serviceName -ErrorAction Stop
    $results += [pscustomobject]@{
        service = $serviceName
        action = 'Restarted'
        timestamp = (Get-Date).ToString('o')
    }
}

$results
