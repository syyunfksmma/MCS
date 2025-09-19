param(
    [string]$Configuration = "Release",
    [string]$Output = "publish"
)

$root = Resolve-Path "..\.."
Push-Location $root

Write-Host "Publishing API..."
dotnet publish src/MCMS.Api/MCMS.Api.csproj -c $Configuration -o "$Output/api"

Write-Host "Publishing Workers..."
dotnet publish src/MCMS.Workers/MCMS.Workers.csproj -c $Configuration -o "$Output/workers"

Write-Host "Publishing CmdHost..."
dotnet publish src/MCMS.CmdHost/MCMS.CmdHost.csproj -c $Configuration -o "$Output/cmdhost"

Write-Host "Publishing Client..."
dotnet publish src/MCMS.Client/MCMS.Client.csproj -c $Configuration -o "$Output/client"

Pop-Location
