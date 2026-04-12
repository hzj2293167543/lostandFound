$REGISTRY = "sgccr.ccs.tencentyun.com/fire/lostfound"
$SERVICES = if ($args.Count -gt 0) { $args } else { @("postgres", "backend", "frontend", "ollama") }

Write-Host "=== Push Docker Images ==="

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
    Write-Host "[OK] $SERVICE done"
}

Write-Host ""
Write-Host "=== All Done ==="
Write-Host "Registry: $REGISTRY"
foreach ($SERVICE in $SERVICES) {
    Write-Host "  - ${SERVICE}:latest"
}
