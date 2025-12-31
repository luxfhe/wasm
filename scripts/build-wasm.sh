#!/bin/bash
# Build Go TFHE to WebAssembly
#
# Requires: Go 1.21+
# Output: wasm/tfhe.wasm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="$(dirname "$SCRIPT_DIR")"
TFHE_DIR="$HOME/work/lux/tfhe"
WASM_DIR="$PKG_DIR/wasm"

echo "Building LuxFHE WASM..."

# Create output directory
mkdir -p "$WASM_DIR"

# Copy Go WASM exec helper
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" "$WASM_DIR/"

# Build WASM from Go TFHE
cd "$TFHE_DIR"
GOOS=js GOARCH=wasm go build -o "$WASM_DIR/tfhe.wasm" ./wasm/

echo "✓ Built: $WASM_DIR/tfhe.wasm"
echo "✓ Copied: $WASM_DIR/wasm_exec.js"

# Show size
ls -lh "$WASM_DIR/tfhe.wasm"
