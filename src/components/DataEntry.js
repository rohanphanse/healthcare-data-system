import { useParams, Link } from "react-router-dom"
import React, { useState, useEffect, useCallback } from "react";
import AccountInfo from "./AccountInfo";
import * as contract from "../utils/contract";
import * as cryptography from "../utils/cryptography"

export default function DataEntry() {
    const account = window.walletConnection.account();
    let { id } = useParams()
    const [dataEntry, updateDataEntry] = useState({})
    const fetchDataEntry = useCallback(async () => {
        if (account.accountId) {
            let entry = {}
            let ids = await contract.getAccountDataIds(account.accountId)
            if (!ids.includes(id)) {
                entry.error = true
                entry.errorMessage = `No data entry found for id of "${id}"`
                updateDataEntry(entry)
                return;
            }
            try {
                const encryptedSymmetricKey = await contract.getEncryptedSymmetricKey(id)
                const encryptedData = await contract.getEncryptedData(id)
                const uploader = await contract.getDataUploader(id)
                const title = await contract.getDataTitle(id)
                const privateKey = await cryptography.importPrivateKey(JSON.parse(localStorage.getItem("privateKey")))
                console.log(privateKey)
                const decryptedSym = await cryptography.privateKeyDecrypt(privateKey, encryptedSymmetricKey) 
                const symKey = await cryptography.importSymmetricKey(JSON.parse(decryptedSym).key)
                const decIV = cryptography.hexToBuffer(JSON.parse(decryptedSym).iv)
                const decryptedData = await cryptography.symmetricKeyDecrypt(symKey, decIV, encryptedData)
                console.log("decdata", decryptedData)
                updateDataEntry({
                    title,
                    uploader,
                    data: decryptedData
                })
            } catch (e) {
                console.log(e)
                updateDataEntry({
                    error: true,
                    errorMessage: "Decryption error. Make sure you entered your private key correctly or check if you have access to this data."
                })
            }
        }
    }, [account.accountId])
    useEffect(() => {
        fetchDataEntry()
    }, [fetchDataEntry])

    return (
        <>
            <AccountInfo account = {account} />
            {dataEntry.error ? (
                <div><i>{dataEntry.errorMessage}</i></div>
            ) : (
                <>
                    <div><b>Title:</b> {dataEntry.title}</div>
                    <div><b>Data:</b> {dataEntry.data}</div>
                    <div><b>Uploader:</b> {dataEntry.uploader}</div>
                </>
            )}
            <div className = "back-link">
                <Link to = "/">Back to home page</Link>
            </div>
            <style jsx = "true">{`
                .back-link {
                    margin-top: 20px;
                }
            `}</style>
        </>
    )
}