import React, { useState, useEffect, useCallback, createRef } from "react";
import { Link } from "react-router-dom";
import * as contract from "./utils/contract";
import AccountInfo from "./components/AccountInfo";
import * as cryptography from "./utils/cryptography";

const App = () => {
    const account = window.walletConnection.account();

    // Get key pair
    const [keyPair, updateKeyPair] = useState({})
    const [showPrivateKeyField, updatePrivateKeyFieldVis] = useState(true)
    const [privateKeyField, updatePrivateKeyField] = useState(localStorage.getItem("privateKey") || "Fetching private key...")
    const privateKeyRead = createRef()
    const privateKeyInput = createRef()

    async function uploadOrGetPublicKey(accountId) {
        let publicKey = await contract.getAccountPublicKey(accountId)
        if (publicKey === null) {
            let keyPair = await cryptography.createKeyPair()
            let publicKeyJSON = JSON.stringify(keyPair.publicKey)
            let privateKeyJSON = JSON.stringify(keyPair.privateKey)
            await contract.addAccountInfo(publicKeyJSON)
            localStorage.setItem("privateKey", privateKeyJSON);
            updatePrivateKeyFieldVis(true)
            updatePrivateKeyField(privateKeyJSON)
            publicKey = await contract.getAccountPublicKey(accountId)
        }
        let publicKeyJSON = JSON.parse(publicKey)
        publicKey = await cryptography.importPublicKey(publicKeyJSON)
        return publicKey
    }
    const fetchKeyPair = useCallback(async () => {
        let publicKey = await uploadOrGetPublicKey(account.accountId)
        let privateKey = null
        try {
            const privateKeyString = localStorage.getItem("privateKey")
            if (privateKeyString === null) { throw "error" }
            updatePrivateKeyField(privateKeyString)
            privateKey = await cryptography.importPrivateKey(JSON.parse(privateKeyString))
        } catch {
            updatePrivateKeyFieldVis(false)
            updatePrivateKeyField("")
            updateKeyPair({
                publicKey,
                privateKey: null
            })
            console.log("keypair", keyPair)
            return
        }
        updateKeyPair({
            publicKey,
            privateKey
        })
        console.log("keypair", keyPair)
    }, [account.accountId])
    useEffect(() => {
        fetchKeyPair();
    }, [fetchKeyPair]);

    // Data entries
    const [dataEntries, updateDataEntries] = useState(JSON.parse(localStorage.getItem("data")) || []);
    const fetchDataEntries = useCallback(async () => {
        if (account.accountId) {
            let entries = []
            let ids = (await contract.getAccountDataIds(account.accountId)) || [];
            console.log(account.accountId, ids)
            for (const id of ids) {
                let title = await contract.getDataTitle(id)
                entries.push({ id, title })
            }
            updateDataEntries(entries)
            localStorage.setItem("data", JSON.stringify(entries))
            console.log("entries", entries)
        }
    }, [account.accountId])
    useEffect(() => {
        fetchDataEntries();
    }, [fetchDataEntries]);

    const [contributors, updateContributors] = useState(JSON.parse(localStorage.getItem("contributors")) || [])
    const fetchContributors = useCallback(async () => {
        if (account.accountId) {
            const contributors = await contract.getAccountContributors(account.accountId)
            console.log(contributors)
            updateContributors(contributors)
            localStorage.setItem("contributors", JSON.stringify(contributors))
        }
    }, [account.accountId])
    useEffect(() => {
        fetchContributors()
    }, [fetchContributors])

    // Upload data
    const accountInput = createRef()
    const titleInput = createRef()
    const dataInput = createRef()
    const uploadButton = createRef()
    let [showAccountInput, updateAccountInputVisibility] = useState(true)

    async function uploadEncryptedData() {
        let toAccount = showAccountInput ? account.accountId : accountInput.current.value
        // Fetch intended recipient's public key from blockchain 
        const receiverPublicKey = showAccountInput ? keyPair.publicKey : 
            await cryptography.importPublicKey(JSON.parse(await contract.getAccountPublicKey(toAccount)))
        let title = titleInput.current.value
        let data = dataInput.current.value
        // Encrypt data with symmetric key
        const iv = window.crypto.getRandomValues(new Uint8Array(12)) // Initial vector
        let symmetricKey = await cryptography.createSymmetricKey()
        let keyString = await cryptography.exportSymmetricKey(symmetricKey)
        let encryptedData = await cryptography.symmetricKeyEncrypt(symmetricKey, iv, data)
        // Export encrypted buffer as hexadecimal string and serialize data as JSON
        let encryptedSymmetricKey = await cryptography.publicKeyEncrypt(receiverPublicKey, 
            JSON.stringify({ key: keyString, iv: cryptography.bufferToHex(iv) })) 
        // Upload encrypted data and encrypted symmetric key to blockchain
        contract.uploadData(toAccount, encryptedSymmetricKey, encryptedData, title)
    }

    function copyPrivateKey() {
        privateKeyRead.current.value = privateKeyField
        privateKeyRead.current.select()
        navigator.clipboard.writeText(privateKeyField)
    }

    function setPrivateKey() {
        try {
            let privateKey = JSON.parse(privateKeyInput.current.value)
            updatePrivateKeyFieldVis(true)
            updatePrivateKeyField(privateKeyInput.current.value)
            updateKeyPair({
                publicKey: keyPair.publicKey,
                privateKey,
            })
            localStorage.setItem("privateKey", privateKeyInput.current.value)
        } catch (error) {
            console.log(error)
            privateKeyInput.current.value = "Invalid private key!"
        }
    }

    const deleteDataInput = createRef()
    async function deleteData() {
        const id = deleteDataInput.current.value
        console.log("delete", id)
        const result = await contract.removeData(id)
        console.log("delres", result)
    }

    const contributorInput = createRef()
    async function addContributor() {
        const newContributor = contributorInput.current.value
        await contract.addContributor(newContributor)
    }

    const removeContributorInput = createRef()
    async function removeContributor() {
        const removedContributor = removeContributorInput.current.value
        await contract.removeContributor(removedContributor)
    }

    return (
        <>
            <AccountInfo account={account} />
            {account.accountId && (
                <>
                    <div className="private-key-section">
                        {privateKeyField !== "" ? (
                            <>
                                <div>
                                    <b>View Your Private Key:&nbsp;</b>
                                    <input type="checkbox" onClick={() => updatePrivateKeyFieldVis(!showPrivateKeyField)} checked={showPrivateKeyField} />
                                </div>
                                {showPrivateKeyField && (
                                    <>
                                        Private key:
                                        <input ref={privateKeyRead} value={privateKeyField} />
                                        <button onClick={() => copyPrivateKey()}>Copy</button>
                                        <button onClick={() => updatePrivateKeyField("")}>Re-enter</button>
                                        <div><i>Locally store your private key on your device and do not share it with anyone.</i></div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div>
                                <b>Paste Your Private Key: </b>
                                <input ref={privateKeyInput} />
                                <button onClick={() => setPrivateKey()}>Submit</button>
                                <div><i>Make sure your private key starts with a "{"{"}" and ends with a "{"}"}" (JSON format).</i></div>
                            </div>
                        )}
                    </div>
                    <div><b>Your Data:</b></div>
                    <ul className="data-entries">
                        {dataEntries.map(({ id, title }) => (
                            <li key={id}>
                                {title}&nbsp;
                                <Link to={`/data/${id}`}>(view)</Link>
                            </li>
                        ))}
                    </ul>
                    <div className="section-title"><b>Upload Data:</b></div>
                    <div>
                        <div>
                            To your account:&nbsp;
                            <input type="checkbox" checked={showAccountInput} onClick={() => updateAccountInputVisibility(!showAccountInput)} />
                        </div>
                        {!showAccountInput && (
                            <div>
                                Account:&nbsp;
                                <input ref={accountInput} />
                            </div>
                        )}
                        <div>
                            Title:&nbsp;
                            <input ref={titleInput} />
                        </div>
                        <div>
                            Data:&nbsp;
                            <input ref={dataInput} />
                        </div>
                        <button ref={uploadButton} onClick={async () => await uploadEncryptedData()}>Upload</button>
                    </div>

                    <div className = "space-above">
                        <b>Delete Data:</b>
                        <input ref = {deleteDataInput} placeholder = "Enter Data ID..." />
                        <button onClick={async () => await deleteData()}>Delete</button>
                    </div>

                    <div className="section-title"><b>Contributors:</b> {contributors.length === 0 && "None"}</div>
                    <ul>
                        {contributors.map((c) => (
                            <li key={c}>
                                {c}
                            </li>
                        ))}
                    </ul>

                    <div className="section-title">
                        <div>
                            <b>Add Contributor:</b>
                            <input ref = {contributorInput} />
                            <button onClick={async () => await addContributor()}>Add</button>
                        </div>
                        <div>
                            <b>Remove Contributor:</b>
                            <input ref = {removeContributorInput} />
                            <button onClick={async () => await removeContributor()}>Remove</button>
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
                .section-title {
                    margin-top: 50px;
                }

                .space-above {
                    margin-top: 20px;
                }

                .private-key-section {
                    margin-bottom: 30px;
                }

                .private-key-field {
                    font-size: 0.7rem;
                    margin: 0 50px;
                    font-family: monospace;
                }
            `}</style>
        </>
    );
}

export default App;
