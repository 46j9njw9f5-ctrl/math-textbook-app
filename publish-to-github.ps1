param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,

  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

git branch -M $Branch

$hasOrigin = git remote | Select-String '^origin$'
if ($hasOrigin) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

git push -u origin $Branch
