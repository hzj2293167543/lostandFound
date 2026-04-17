$REGISTRY = "sgccr.ccs.tencentyun.com/fire/lostfound"
$SERVICES = if ($args.Count -gt 0) { $args } else { @("postgres", "backend", "frontend", "ollama") }

if (-not $env:TAG) {
    try {
        $env:TAG = git rev-parse --short HEAD 2>$null
    } catch {}
    if (-not $env:TAG) {
        $env:TAG = Get-Date -Format "yyyyMMddHHmmss"
    }
}
Write-Host "=== Push Docker Images ==="
Write-Host "[INFO] TAG: $env:TAG"

try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw
    }
} catch {
    Write-Host "[ERROR] Not logged in to Docker. Please run:"
    Write-Host "  docker login $REGISTRY --username=your_username"
    exit 1
}

foreach ($SERVICE in $SERVICES) {
    Write-Host ""
    Write-Host "[INFO] Pushing $SERVICE..."

    docker tag "lostandfound-${SERVICE}:latest" "${REGISTRY}:${SERVICE}"
    docker push "${REGISTRY}:${SERVICE}"

    docker tag "lostandfound-${SERVICE}:latest" "${REGISTRY}:${SERVICE}-$env:TAG"
    docker push "${REGISTRY}:${SERVICE}-$env:TAG"

    Write-Host "[OK] $SERVICE done"
}

Write-Host ""
Write-Host "=== All Done ==="
Write-Host "Registry: $REGISTRY"
Write-Host "TAG: $env:TAG"
Write-Host ""
Write-Host "Deployed (use :latest to pull):"
foreach ($SERVICE in $SERVICES) {
    Write-Host "  - ${REGISTRY}:${SERVICE}"
}
Write-Host ""
Write-Host "Archived (for rollback, keep 5 versions):"
foreach ($SERVICE in $SERVICES) {
    Write-Host "  - ${REGISTRY}:${SERVICE}-$env:TAG"
}
