# Download @ffmpeg/core UMD matching ffmpeg-page-load.js (must match @ffmpeg/ffmpeg vendor version)
$ErrorActionPreference = "Stop"
$version = "0.12.10"
$base = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@${version}/dist/umd"
$dir = $PSScriptRoot
$jsPath = Join-Path $dir "ffmpeg-core.js"
$wasmPath = Join-Path $dir "ffmpeg-core.wasm"

Write-Host "Downloading ffmpeg-core.js..."
curl.exe -fsSL "${base}/ffmpeg-core.js" -o $jsPath

Write-Host "Downloading ffmpeg-core.wasm (large)..."
curl.exe -fsSL "${base}/ffmpeg-core.wasm" -o $wasmPath

$head = [System.IO.File]::ReadAllBytes($wasmPath)[0..3]
$ok = ($head[0] -eq 0) -and ($head[1] -eq 0x61) -and ($head[2] -eq 0x73) -and ($head[3] -eq 0x6d)

if (-not $ok) {
    Remove-Item $wasmPath -Force -ErrorAction SilentlyContinue
    throw "ffmpeg-core.wasm magic bytes invalid"
}

Write-Host "OK: $jsPath"
Write-Host "OK: $wasmPath"
