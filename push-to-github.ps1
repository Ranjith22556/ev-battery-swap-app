# PowerShell script to push code to GitHub

# Set your GitHub username and repository name
$username = "ranjith22556"
$repoName = "ev-battery-swap-app"

# Set the remote URL
git remote set-url origin "https://github.com/$username/$repoName.git"

# Push the code to GitHub
Write-Host "Pushing code to GitHub..."
git push -u origin main

Write-Host "Done!" 