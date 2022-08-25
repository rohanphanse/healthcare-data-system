# Unified Healthcare App 

## Patient - User Flow:
1. User signs in with NEAR wallet. If they do not have a public/private key pair, one is generated for them and they are asked to write it down and keep it confidential.
2. User can add doctor's account as contributor.
3. The doctor can then upload the data to user's account. The data is encrypted client-side with a symmetric key, which is in turn encrypted with user's public key and stored along with data.
4. The data is decrypted client-side with the user's private key and the user can see it. 
5. The user can securely share this data with another doctor, by encrypting the symmetric key with the doctor's public key and sending it to them.

Instead of storing data on-chain, can store data off-chain in IPFS and just store content id on-chain.