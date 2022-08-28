// Create asymmetric (public & private) key pair
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
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

// Credit: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
export async function createSymmetricKey() {
    let key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
    return key
}

// Credit: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
export async function exportSymmetricKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "raw",
        key
    )
    const exportedKeyBuffer = new Uint8Array(exported)
    return bufferToHex(exportedKeyBuffer)
}

export async function importSymmetricKey(keyString) {
    const rawKey = hexToBuffer(keyString)
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    )
}

export function bufferToHex(buffer) {
    let hex = []
    for (const n of buffer) {
        hex.push(Number(n).toString(16).padStart(2, "0"))
    }
    return hex.join("")
}

// Credit: https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
export function hexToBuffer(hexString) {
    return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
}

// Credit: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
export async function symmetricKeyEncrypt(key, iv, data) {
    let encoder = new TextEncoder()
    let encoded = encoder.encode(data)
    let cipherText = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded,
    )
    let buffer = new Uint8Array(cipherText)
    let dec = new TextDecoder().decode(buffer)
    return bufferToHex(buffer)
}

export async function publicKeyEncrypt(publicKey, data) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)
    let cipherText = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
    )
    console.log(cipherText)
    let buffer = new Uint8Array(cipherText)
    return bufferToHex(buffer)
}

export async function privateKeyDecrypt(privateKey, cipherString) {
    const cipherText = hexToBuffer(cipherString)
    const buffer = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        cipherText
    )
    let dec = new TextDecoder().decode(new Uint8Array(buffer))
    return dec
}

export async function symmetricKeyDecrypt(key, iv, cipherString) {
    const cipherText = hexToBuffer(cipherString)
    const buffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherText
    )
    let dec = new TextDecoder().decode(new Uint8Array(buffer))
    return dec
}

// Credit: https://developer.cybersource.com/library/documentation/dev_guides/Secure_Acceptance_Flex/Key/html/wwhelp/wwhimpl/common/html/wwhelp.htm#href=keys.html&single=true
export async function importPublicKey(keyJSON) {
    return await window.crypto.subtle.importKey(
        "jwk",
        keyJSON,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        false,
        ["encrypt"]
    )
}

export async function importPrivateKey(keyJSON) {
    return await window.crypto.subtle.importKey(
        "jwk",
        keyJSON,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" }
        },
        false,
        ["decrypt"]
    )
}
