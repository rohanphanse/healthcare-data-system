import React, { useState, useEffect, useCallback } from "react";
import { accountBalance, login, logout } from "./utils/near";
import contract from "./utils/contract";

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

    return (
        <>
            <div className = "title">Unified Healthcare Data System</div>
            {account.accountId ? (
                <>
                    <div>{account.accountId}</div>
                    <div>Balance: {balance} NEAR</div>
                    <button onClick={logout}>LOG OUT</button>
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