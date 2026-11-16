$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$OutFile = 'D:\Bevibe\cap-nhat-bevibe.zip'

if (Test-Path $OutFile) { Remove-Item $OutFile -Force }
$temp = 'D:\Bevibe\temp_update'
if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }

New-Item -ItemType Directory -Path "$temp\assets" -Force | Out-Null
Copy-Item 'D:\Bevibe\dist\index.html' -Destination "$temp\index.html"
Copy-Item 'D:\Bevibe\dist\assets\*.js' -Destination "$temp\assets\"
Copy-Item 'D:\Bevibe\dist\assets\*.css' -Destination "$temp\assets\"

Compress-Archive -Path "$temp\*" -DestinationPath $OutFile -Force
Remove-Item $temp -Recurse -Force

$item = Get-Item $OutFile
Write-Host "SUCCESS: Created $OutFile with size $([math]::Round($item.Length / 1KB, 2)) KB"
