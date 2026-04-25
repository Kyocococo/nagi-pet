$deployDir = "c:\Work\Google_Antigravity\nagi-pet-deploy"

Write-Host "Creating deploy folder..."
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

Write-Host "Copying files..."
Copy-Item "c:\Work\Google_Antigravity\AIPet\index.html" -Destination $deployDir
Copy-Item "c:\Work\Google_Antigravity\AIPet\style.css" -Destination $deployDir
Copy-Item "c:\Work\Google_Antigravity\AIPet\script.js" -Destination $deployDir
Copy-Item "c:\Work\Google_Antigravity\AIPet\package.json" -Destination $deployDir
Copy-Item "c:\Work\Google_Antigravity\AIPet\api" -Destination $deployDir -Recurse

$imagePath = "C:\Users\kyoko\.gemini\antigravity\brain\8bb85f27-21fd-4933-8923-84aba674d14e\nagi_1777049000477.png"
Copy-Item $imagePath -Destination "$deployDir\nagi.png"

Write-Host "Initializing Git repository..."
Set-Location $deployDir
git init
git add .
git commit -m "Initial commit of Nagi AI Pet"

Write-Host "------------------------------------------------"
Write-Host "Preparation complete!"
Write-Host "Your deployment files are ready in:"
Write-Host $deployDir
Write-Host ""
Write-Host "To publish to Vercel via GitHub, run the following command in this terminal:"
Write-Host "(Note: requires GitHub CLI 'gh')"
Write-Host "gh repo create nagi-pet --public --source=. --remote=origin --push"
Write-Host "------------------------------------------------"
