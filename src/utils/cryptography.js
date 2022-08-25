import * as contract from "./contract"

export async function uploadOrGetPublicKey(account) {
    let publicKey = await contract.getAccountPublicKey(account.accountId)
    if (publicKey === null) {
        let keyPair = await createKeyPair()
        let publicKeyJSON = JSON.stringify(keyPair.publicKey)
        let privateKeyJSON = JSON.stringify(keyPair.privateKey)
        await contract.addAccountInfo(publicKeyJSON)
        localStorage.setItem("privateKey", privateKeyJSON);
        alert("This is your private key. Store it locally on your computer and keep it confidential.\n" + privateKeyJSON)
        publicKey = await contract.getAccountPublicKey(account.accountId)
    }
    return JSON.parse(publicKey)
}

export async function getPrivateKey() {
    let privateKey = localStorage.getItem("privateKey")
    if (privateKey === null) {
        privateKey = prompt("Paste in private key:")
    }
    return JSON.parse(privateKey)
}

// Create asymmetric (public & private) key pair
// Credit: https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/rsa-oaep.js
export async function createKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    )
    const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey)
    const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey)
    return { publicKey, privateKey }
}

export function createSymmetricKey() {

}

