import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import * as contract from "./utils/contract";
import AccountInfo from "./components/AccountInfo";

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

    return (
        <>
            <AccountInfo account = {account} />
            <div><b>Your Data:</b></div>
            <ul className = "data-entries">
                {account.accountId ? (
                    dataEntries.map(({ id, title }) => (
                        <li>{title}&nbsp;<Link to = {`/data/${id}`} key = {id}>(view)</Link></li>
                    ))
                ) : ""}
            </ul>
            <style jsx>{`
                
            `}</style>
        </>
    );
}

export default App;