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
near call healthcare.rohanphanse.testnet add_account_info '{"public_key": "pub_key"}' --accountId rohanphanse.testnet
```

## Get account public key (view)
```
near view healthcare.rohanphanse.testnet get_account_public_key '{"account_id": "rohanphanse.testnet"}'
```

## Add contributor (call)
```
near call healthcare.rohanphanse.testnet add_contributor '{ "new_contributor": "doc.rohanphanse.testnet" }' --accountId rohanphanse.testnet
```

## Get account contributors (view)
```
near view healthcare.rohanphanse.testnet get_account_contributors '{ "account_id": "doc.rohanphanse.testnet" }'
```

## Remove contributor (call)
```
near call healthcare.rohanphanse.testnet remove_contributor '{ "removed_contributor": "doc.rohanphanse.testnet" }' --accountId rohanphanse.testnet
```

## Remove data (call)
```
near call healthcare.rohanphanse.testnet remove_data '{ "data_id": "etyxlz" }' --accountId rohanphanse-2.testnet
```

## Upload data (call)
```
near call healthcare.rohanphanse.testnet upload_data '{ "account_id": "rohanphanse-2.testnet", "data_id": "doc4life", "encrypted_symmetric_key": "{ key: 45a6c20f7f9e9bb96186992cc6610fc5876d087ca07aa8b9b32eab7ec70f711698731ec72e8e50740c47fa9aae85e7fbbb26acb7ee4c2b5180126a7faf651f5c615e3fcc3b752bba5b6db2f0fd0ef9c3d2c3ceb86de50118dddf09d46cbfc72daeeb615d, iv: ""}", "encrypted_data": "c8e59858d9ce32235e1def929cabf5aa9819060b5d0225bf34", "title": "From the doc!" }' --accountId doc.rohanphanse.testnet
```

## Get account data IDs (view)
```
near view healthcare.rohanphanse.testnet get_account_data_ids '{ "account_id": "rohanphanse-2.testnet" }'
```

## Get encrypted symmetric key (view)
```
near view healthcare.rohanphanse.testnet get_encrypted_symmetric_key '{ "data_id": "d63g" }'
```

## Get encrypted data (view)
```
near view healthcare.rohanphanse.testnet get_encrypted_data '{ "data_id": "5nx1eh" }'
```

## Get data uploader (view)
```
near view healthcare.rohanphanse.testnet get_data_uploader '{ "data_id": "3e3uedh3dhd" }'
```

## Get data title (view)
```
near view healthcare.rohanphanse.testnet get_data_title '{ "data_id": "3e3uedsh3dhd" }'
```

## Delete account (call)
```
near call healthcare.rohanphanse.testnet delete_account '{}' --accountId rohanphanse.testnet
```

## Remove data (call)
```
near call healthcare.rohanphanse.testnet remove_data '{ "data_id": "rlp0fm" }' --accountId rohanphanse.testnet
```