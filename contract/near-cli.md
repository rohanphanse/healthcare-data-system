# NEAR CLI

## Test contract (show output)
```
cargo test -- --nocapture
```

## Build contract code
```
sh build.sh
```

## Delete contract subaccount (good practice)
```
near delete healthcare.rohanphanse.testnet rohanphanse.testnet
```

## Create contract subaccount
```
near create-account healthcare.rohanphanse.testnet --masterAccount rohanphanse.testnet --initialBalance 25
```

## Deploy contract
```
near deploy --wasmFile wasm/unified_healthcare_contract.wasm --accountId healthcare.rohanphanse.testnet
```

## Add account info (call)
```
near call healthcare.rohanphanse.testnet add_account_info '{"public_key": "rororo"}' --accountId rohanphanse.testnet
```

## Get account public key (view)
```
near view healthcare.rohanphanse.testnet get_account_public_key '{"account_id": "doc.rohanphanse.testnet"}'
```

## Add contributor (call)
```
near call healthcare.rohanphanse.testnet add_contributor '{ "new_contributor": "doc.rohanphanse.testnet" }' --accountId rohanphanse.testnet
```

## Get account contributors (view)
```
near view healthcare.rohanphanse.testnet get_account_contributors '{ "account_id": "rohanphanse.testnet" }'
```

## Remove contributor (call)
```
near call healthcare.rohanphanse.testnet remove_contributor '{ "removed_contributor": "doc.rohanphanse.testnet" }' --accountId rohanphanse.testnet
```

## Upload data (call)
```
near call healthcare.rohanphanse.testnet upload_data '{ "account_id": "rohanphanse.testnet", "encrypted_symmetric_key": "rokey!", "encrypted_data": "rodata!" }' --accountId rohanphanse.testnet
```

## Get account data IDs (view)
```
near view healthcare.rohanphanse.testnet get_account_data_ids '{ "account_id": "rohanphanse.testnet" }'
```

## Get encrypted symmetric key (view)
```
near view healthcare.rohanphanse.testnet get_encrypted_symmetric_key '{ "data_id": 2 }'
```

## Get encrypted data (view)
```
near view healthcare.rohanphanse.testnet get_encrypted_data '{ "data_id": 0 }'
```

## Get uploader (view)
```
near view healthcare.rohanphanse.testnet get_uploader '{ "data_id": 2 }'
```