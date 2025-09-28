param(
    [string]$Name,
    [switch]$ResetAfter,
    [switch]$AutoCreate,
    [switch]$Verbose
)

if ([string]::IsNullOrWhiteSpace($Name)) {
    throw 'Provide a named event via -Name (e.g., Global\MCS.Apply.Completed).'
}

$created = $false
$event = $null

try {
    $event = [System.Threading.EventWaitHandle]::OpenExisting($Name)
} catch {
    if ($AutoCreate) {
        $event = New-Object System.Threading.EventWaitHandle($false, [System.Threading.EventResetMode]::ManualReset, $Name, [ref]$created)
        if ($Verbose) {
            Write-Host "Created event '$Name'."
        }
    } else {
        throw "Event '$Name' does not exist. Use -AutoCreate to create it."
    }
}

try {
    $event.Set() | Out-Null
    Write-Host "Event '$Name' signalled." -ForegroundColor Green
    if ($ResetAfter) {
        $event.Reset() | Out-Null
        if ($Verbose) {
            Write-Host "Event '$Name' reset." -ForegroundColor Yellow
        }
    }
}
finally {
    if ($event) { $event.Dispose() }
}
