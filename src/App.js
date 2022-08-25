import React, { useState, useEffect, useCallback, createRef } from "react";
import { Link } from "react-router-dom";
import * as contract from "./utils/contract";
import AccountInfo from "./components/AccountInfo";
import { getPrivateKey, uploadOrGetPublicKey } from "./utils/cryptography";

const App = () => {
    const account = window.walletConnection.account();
    
    // Data entries
    const [dataEntries, updateDataEntries] = useState([]);
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
            console.log(entries)
        }
    }, [account.accountId])
    useEffect(() => {
        fetchDataEntries();
    }, [fetchDataEntries]);

    // Upload data
    const accountInput = createRef()
    const titleInput = createRef()
    const dataInput = createRef()
    const uploadButton = createRef()

    async function uploadEncryptedData() {
        let account = accountInput.current.value
        let title = titleInput.current.value
        let data = dataInput.current.value
        console.log(account, title, data)
        let accountPublicKey = await contract.getAccountPublicKey(account.accountId)
        console.log(accountPublicKey)
    }

    return (
        <>
            <AccountInfo account = {account} />
            {account.accountId ? (
                <>
                    <div><b>Your Data:</b></div>
                    <ul className = "data-entries">
                        {dataEntries.map(({ id, title }) => (
                            <li key = {id}>
                                {title}&nbsp;
                                <Link to = {`/data/${id}`}>(view)</Link>
                            </li>
                        ))}
                    </ul>
                    <div className = "upload-data-title"><b>Upload Data:</b></div>
                    <div>
                        <div>
                            To account:&nbsp;
                            <input ref = {accountInput} />
                        </div>
                        <div>
                            Title:&nbsp;
                            <input ref = {titleInput} />
                        </div>
                        <div>
                            Data:&nbsp;
                            <input ref = {dataInput} />
                        </div>
                        <button ref = {uploadButton} onClick = {async () => await uploadEncryptedData()}>Upload</button>
                    </div>
                </>
            ) : ""}
            <style jsx>{`
                .upload-data-title {
                    margin-top: 50px;
                }
            `}</style>
        </>
    );
}

export default App;