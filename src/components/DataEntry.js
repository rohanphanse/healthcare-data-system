import { useParams, Link } from "react-router-dom"
import React, { useState, useEffect, useCallback } from "react";
import AccountInfo from "./AccountInfo";
import * as contract from "../utils/contract";
import { getPrivateKey, uploadOrGetPublicKey } from "../utils/cryptography"

export default function DataEntry() {
    const account = window.walletConnection.account();
    let { id } = useParams()
    const [dataEntry, updateDataEntry] = useState({})
    const fetchDataEntry = useCallback(async () => {
        if (account.accountId) {
            let entry = {}
            let ids = await contract.getAccountDataIds(account.accountId)
            if (!ids.includes(id)) {
                entry.notFound = true
                updateDataEntry(entry)
                return;
            }
            const encryptedSymmetricKey = await contract.getEncryptedSymmetricKey(id)
            const encryptedData = await contract.getEncryptedData(id)
            const uploader = await contract.getDataUploader(id)
            const title = await contract.getDataTitle(id)
            entry = {
                uploader,
                data: encryptedData,
                title,
            }
            let publicKey = await uploadOrGetPublicKey(account)
            let privateKey = await getPrivateKey()
            console.log(publicKey, privateKey)
            updateDataEntry(entry)
        }
    }, [account.accountId])
    useEffect(() => {
        fetchDataEntry()
    }, [fetchDataEntry])

    return (
        <>
            <AccountInfo account = {account} />
            {dataEntry.notFound ? (
                ""
            ) : (
                <>
                    <div><b>Title:</b> {dataEntry.title}</div>
                    <div><b>Data:</b> {dataEntry.data}</div>
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