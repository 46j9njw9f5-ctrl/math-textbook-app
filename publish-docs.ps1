$ErrorActionPreference = "Stop"

npm run build:docs

New-Item -ItemType File -Path ".\\docs\\.nojekyll" -Force | Out-Null

git add docs

if (git diff --cached --quiet) {
  Write-Host "docs に差分はありません。"
  exit 0
}

git commit -m "Update published docs"
git push
