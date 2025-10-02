[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$CertificatePath,

    [Parameter(Mandatory = $false)]
    [string]$StoreName = "Root",

    [Parameter(Mandatory = $false)]
    [ValidateSet("CurrentUser", "LocalMachine")]
    [string]$StoreLocation = "CurrentUser",

    [Parameter(Mandatory = $false)]
    [string]$FriendlyName,

    [switch]$Force
)

if (-not (Test-Path -Path $CertificatePath -PathType Leaf)) {
    throw "지정한 인증서 파일을 찾을 수 없습니다: $CertificatePath"
}

try {
    $certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $certificate.Import($CertificatePath)
} catch {
    throw "인증서를 불러오지 못했습니다. PEM/DER 형식의 루트 인증서를 지정해 주십시오."
}

if (-not $FriendlyName) {
    $FriendlyName = if ([string]::IsNullOrWhiteSpace($certificate.FriendlyName)) { "MCS Dev Root" } else { $certificate.FriendlyName }
}

$store = New-Object System.Security.Cryptography.X509Certificates.X509Store($StoreName, $StoreLocation)
$store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)

try {
    $existing = $store.Certificates | Where-Object { $_.Thumbprint -eq $certificate.Thumbprint }

    if ($existing -and -not $Force) {
        Write-Verbose "이미 설치된 인증서입니다. -Force 옵션을 사용하면 갱신할 수 있습니다."
        [PSCustomObject]@{
            Status = "Unchanged"
            Thumbprint = $certificate.Thumbprint
            Store = "$StoreLocation/$StoreName"
            FriendlyName = $FriendlyName
        } | ConvertTo-Json -Depth 1
        return
    }

    foreach ($item in $existing) {
        $store.Remove($item)
    }

    $certificate.FriendlyName = $FriendlyName
    $store.Add($certificate)

    [PSCustomObject]@{
        Status = "Imported"
        Thumbprint = $certificate.Thumbprint
        Store = "$StoreLocation/$StoreName"
        FriendlyName = $FriendlyName
    } | ConvertTo-Json -Depth 1
} finally {
    $store.Close()
}
