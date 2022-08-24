# Credit: https://github.com/near-examples/crossword-tutorial-chapter-1/blob/94f42e75cf70ed2aafb9c29a1faa1e21f079a49e/contract/build.sh
#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/unified_healthcare_contract.wasm ./wasm/
