import React, { useState, useEffect, useCallback } from "react";
import { accountBalance, login, logout } from "./utils/near";
import contract, { getAccountDataIds } from "./utils/contract";

function App() {
    const account = window.walletConnection.account();
    // Balance
    const [balance, updateBalance] = useState("0");
    const fetchBalance = useCallback(async () => {
        if (account.accountId) {
            updateBalance(await accountBalance());
        }
    }, [account.accountId]);
    useEffect(() => {
        fetchBalance();
    }, [fetchBalance])

    // Uploaded data
    const [uploadedData, updateUploadedData] = useState([]);
    const fetchUploadedData = useCallback(async () => {
        if (account.accountId) {
            await getAccountDataIds();
        }
    })

    return (
        <>
            <div className = "title">Unified Healthcare Data System</div>
            {account.accountId ? (
                <>
                    <div>{account.accountId}</div>
                    <div>Balance: {balance} NEAR</div>
                    <button onClick={logout}>LOG OUT</button>
                    <div>Uploaded Data:</div>
                    
                </>
            ) : (
                <button onClick={login}>CONNECT WALLET</button>
            )}
            <style jsx>{`
                .title {
                    font-style: italic;
                }

                .center {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
            `}</style>
        </>
    );
}

export default App;