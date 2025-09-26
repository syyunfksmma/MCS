<#!
.SYNOPSIS
    Automation workflow that listens for Apply completion events, orchestrates Esprit Edge, and injects Setup values.
.DESCRIPTION
    This script replaces the file-based Apply trigger with named EventWaitHandle coordination and performs
    Esprit automation steps using COM interop. When Esprit Edge raises a readiness event, the script attaches to
    the running instance, creates a new temple (placeholder command), and applies pre-configured Setup values
    based on scripts/automation/setup-payload.json.
.NOTES
    Named events (default):
      - Apply completion:  Global\MCS.Apply.Completed
      - Esprit ready:     Global\MCS.Esprit.Ready
    Another process must Set() these events after completing its work. Use Signal-McsEvent.ps1 for testing.
#>

param(
    [string]$ApplyEventName = 'Global\MCS.Apply.Completed',
    [string]$EspritReadyEventName = 'Global\MCS.Esprit.Ready',
    [int]$ApplyWaitSeconds = 1800,
    [int]$EspritReadyWaitSeconds = 900,
    [string]$EspritExecutable = 'C:\\Program Files\\Hexagon\\ESPRIT EDGE\\Prog\\ESPRITEDGE.exe',
    [string]$SetupSourcePath = 'C:\\Users\\syyun\\Documents\\GitHub\\MCS\\TEST\\Setup',
    [string]$SetupPayloadPath = 'C:\\Users\\syyun\\Documents\\GitHub\\MCS\\scripts\\automation\\setup-payload.json',
    [switch]$SkipEspritReadyWait
)

function Write-WorkflowLog {
    param(
        [string]$Message,
        [ValidateSet('INFO','WARN','ERROR')]
        [string]$Level = 'INFO'
    )
    $timestamp = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
    Write-Host "[$timestamp][$Level] $Message"
}

function Wait-NamedEvent {
    param(
        [string]$Name,
        [int]$TimeoutSeconds,
        [switch]$ResetAfterSignal
    )

    Write-WorkflowLog -Message "Waiting for named event '$Name' (timeout ${TimeoutSeconds}s)" -Level INFO
    $created = $false
    $event = New-Object System.Threading.EventWaitHandle($false, [System.Threading.EventResetMode]::ManualReset, $Name, [ref]$created)
    if ($created) {
        Write-WorkflowLog -Message "Event '$Name' did not exist; created handle and awaiting producer signal." -Level WARN
    }

    try {
        if (-not $event.WaitOne([TimeSpan]::FromSeconds($TimeoutSeconds))) {
            throw "Timed out waiting for event '$Name' after $TimeoutSeconds seconds."
        }
        Write-WorkflowLog -Message "Event '$Name' signalled." -Level INFO
        if ($ResetAfterSignal) {
            $event.Reset() | Out-Null
        }
    }
    finally {
        $event.Dispose()
    }
}

function Wait-EspritProcessReady {
    param(
        [System.Diagnostics.Process],
        [int] = 120
    )

    if (-not ) {
        return
    }

    if (.HasExited) {
        Write-WorkflowLog -Message 'Esprit Edge process exited before ready wait.' -Level WARN
        return
    }

     = [Math]::Min([int]::MaxValue, [Math]::Max(1000,  * 1000))
    Write-WorkflowLog -Message "Waiting for Esprit Edge input idle (s budget)." -Level INFO

    try {
         = .WaitForInputIdle()
        if () {
            Write-WorkflowLog -Message 'Esprit Edge reported input idle.' -Level INFO
        } else {
            Write-WorkflowLog -Message 'Esprit Edge did not reach input idle within timeout.' -Level WARN
        }
    } catch {
        Write-WorkflowLog -Message "WaitForInputIdle raised: " -Level WARN
    }
}

function Signal-NamedEvent {
    param(
        [string],
        [switch]
    )

     = False
     = New-Object System.Threading.EventWaitHandle(False, [System.Threading.EventResetMode]::ManualReset, , [ref])

    try {
        if () {
            .Reset() | Out-Null
        }

        if (.Set()) {
             =  ? 'created and signalled' : 'signalled'
            Write-WorkflowLog -Message "Event '' ." -Level INFO
        } else {
            Write-WorkflowLog -Message "Event '' Set() returned false (already signalled)." -Level WARN
        }
    }
    finally {
        .Dispose()
    }
}
function Start-EspritEdgeProcess {
    param(
        [string]$ExecutablePath
    )

    if (-not (Test-Path $ExecutablePath)) {
        throw "Esprit Edge executable not found at $ExecutablePath"
    }

    Write-WorkflowLog -Message "Starting Esprit Edge at $ExecutablePath" -Level INFO
    $process = Start-Process -FilePath $ExecutablePath -PassThru -ErrorAction Stop
    return $process
}

function Connect-EspritApplication {
    Write-WorkflowLog -Message 'Attempting to attach to Esprit automation interface.' -Level INFO
    try {
        $app = [Runtime.InteropServices.Marshal]::GetActiveObject('Esprit.Application')
    } catch {
        Write-WorkflowLog -Message 'Active Esprit instance not found; trying to create new COM instance.' -Level WARN
        $app = New-Object -ComObject Esprit.Application
        Start-Sleep -Seconds 2
    }

    if (-not $app) {
        throw 'Unable to acquire Esprit.Application COM instance.'
    }

    try {
        $app.Visible = $true
    } catch {
        Write-WorkflowLog -Message 'Failed to set Esprit visibility; continuing.' -Level WARN
    }

    Write-WorkflowLog -Message 'Esprit automation interface attached.' -Level INFO
    return $app
}

function Initialize-NewTemple {
    param(
        [Parameter(Mandatory)]
        $Application
    )

    Write-WorkflowLog -Message 'Creating/initialising new temple via Esprit automation.' -Level INFO
    try {
        $doc = $Application.Document
        if ($null -eq $doc) {
            Write-WorkflowLog -Message 'No active document detected; invoking NewDocument.' -Level INFO
            $Application.NewDocument()
            $doc = $Application.Document
        }

        if ($null -ne $doc) {
            # Placeholder automation: clear existing selections and ensure a clean workspace
            try {
                $doc.SelectionSet.Clear()
            } catch {
                Write-WorkflowLog -Message 'SelectionSet clear failed (non-fatal).' -Level WARN
            }
            Write-WorkflowLog -Message 'Temple preparation complete (placeholder).' -Level INFO
        }
        else {
            Write-WorkflowLog -Message 'Document acquisition failed after NewDocument call.' -Level WARN
        }
    }
    catch {
        Write-WorkflowLog -Message "Temple initialisation encountered an error: $($_.Exception.Message)" -Level WARN
    }
}

function Backup-FileIfNeeded {
    param(
        [string]$TargetPath
    )

    $backupPath = "$TargetPath.mcs.bak"
    if (-not (Test-Path $backupPath)) {
        Copy-Item -Path $TargetPath -Destination $backupPath -Force
        Write-WorkflowLog -Message "Backup created: $backupPath" -Level INFO
    }
}

function Apply-Replacements {
    param(
        [string]$Content,
        [Object[]]$Replacements
    )
    $updated = $Content
    foreach ($replacement in $Replacements) {
        $pattern = $replacement.pattern
        $value = $replacement.replacement
        if ([string]::IsNullOrWhiteSpace($pattern)) { continue }
        $regex = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
        if (-not $regex.IsMatch($updated)) {
            Write-WorkflowLog -Message "Pattern not found for replacement: $pattern" -Level WARN
            continue
        }
        $updated = $regex.Replace($updated, $value)
    }
    return $updated
}

function Apply-Injections {
    param(
        [System.Collections.Generic.List[string]]$Lines,
        [Object[]]$Injections
    )

    foreach ($injection in $Injections) {
        $anchor = $injection.anchor
        $mode = $injection.mode
        $snippet = [System.Collections.Generic.List[string]]::new()
        foreach ($line in $injection.lines) { $snippet.Add($line) | Out-Null }

        $index = $Lines.IndexOf($anchor)
        if ($index -eq -1) {
            Write-WorkflowLog -Message "Injection anchor not located: $anchor" -Level WARN
            continue
        }

        $alreadyPresent = $false
        if ($snippet.Count -gt 0) {
            $alreadyPresent = $Lines -join "`n" -like "*${($snippet[0])}*"
        }

        if ($alreadyPresent) {
            Write-WorkflowLog -Message "Injection skipped; snippet already present near anchor '$anchor'." -Level INFO
            continue
        }

        switch ($mode) {
            'After' {
                for ($i = $snippet.Count - 1; $i -ge 0; $i--) {
                    $Lines.Insert($index + 1, $snippet[$i])
                }
            }
            'Replace' {
                $Lines[$index] = $snippet[0]
                if ($snippet.Count -gt 1) {
                    for ($i = 1; $i -lt $snippet.Count; $i++) {
                        $Lines.Insert($index + $i, $snippet[$i])
                    }
                }
            }
            default { # Before
                for ($i = $snippet.Count - 1; $i -ge 0; $i--) {
                    $Lines.Insert($index, $snippet[$i])
                }
            }
        }
        Write-WorkflowLog -Message "Snippet injected around anchor '$anchor' (mode=$mode)." -Level INFO
    }
}

function Push-SetupValues {
    param(
        [string]$SetupPath,
        [string]$PayloadPath
    )

    if (-not (Test-Path $PayloadPath)) {
        Write-WorkflowLog -Message "Setup payload file $PayloadPath not found." -Level WARN
        return
    }

    $payload = Get-Content -Path $PayloadPath -Raw | ConvertFrom-Json
    foreach ($fileSpec in $payload.files) {
        $target = Join-Path $SetupPath $fileSpec.path
        if (-not (Test-Path $target)) {
            Write-WorkflowLog -Message "Skipping missing Setup file: $target" -Level WARN
            continue
        }

        Backup-FileIfNeeded -TargetPath $target

        $originalContent = Get-Content -Path $target -Raw
        $updatedContent = $originalContent

        if ($fileSpec.replacements) {
            $updatedContent = Apply-Replacements -Content $updatedContent -Replacements $fileSpec.replacements
        }

        if ($fileSpec.injections) {
            $lineList = [System.Collections.Generic.List[string]]::new()
            $updatedContent -split "`n" | ForEach-Object { $null = $lineList.Add($_) }
            Apply-Injections -Lines $lineList -Injections $fileSpec.injections
            $updatedContent = $lineList -join "`n"
        }

        if ($originalContent -ne $updatedContent) {
            Set-Content -Path $target -Value $updatedContent
            Write-WorkflowLog -Message "Setup file updated: $target" -Level INFO
        }
        else {
            Write-WorkflowLog -Message "No changes applied to $target (content already up to date)." -Level INFO
        }
    }
}

function Show-LicenseAlert {
    param(
        [string]$Message = 'Esprit Edge license issue detected. Please resolve before continuing.'
    )

    Write-WorkflowLog -Message $Message -Level WARN
    try {
        [System.Windows.Forms.MessageBox]::Show($Message, 'MCS Esprit Automation', 'OK', 'Warning') | Out-Null
    } catch {
        # silent fall back to log only
    }
}

Add-Type -AssemblyName System.Windows.Forms | Out-Null

try {
    Wait-NamedEvent -Name $ApplyEventName -TimeoutSeconds $ApplyWaitSeconds

    $process = Start-EspritEdgeProcess -ExecutablePath $EspritExecutable

    if (-not $SkipEspritReadyWait) {
        Wait-EspritProcessReady -Process $process -TimeoutSeconds $EspritReadyWaitSeconds
    }

    $espritApp = Connect-EspritApplication

    Initialize-NewTemple -Application $espritApp

    Push-SetupValues -SetupPath $SetupSourcePath -PayloadPath $SetupPayloadPath

    $licenseOk = $true
    try {
        $licenseManager = $espritApp.LicenseManager
        if ($licenseManager -and $licenseManager.IsLicenseValid() -eq $false) {
            $licenseOk = $false
        }
    } catch {
        Write-WorkflowLog -Message 'License manager probe not available; proceeding with optimistic assumption.' -Level WARN
    }

    if (-not $licenseOk) {
        Show-LicenseAlert -Message 'Esprit Edge reported an invalid license state. Please revalidate before continuing.'
    } else {
        Write-WorkflowLog -Message 'License state nominal.' -Level INFO
    }

    Signal-NamedEvent -Name $EspritReadyEventName -ResetBefore
    Write-WorkflowLog -Message 'Workflow completed successfully.' -Level INFO
}
catch {
    Write-WorkflowLog -Message $_.Exception.Message -Level ERROR
    Show-LicenseAlert -Message "Automation aborted due to error: $($_.Exception.Message)"
    throw
}





