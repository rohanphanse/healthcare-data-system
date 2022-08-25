import React, { useState, useEffect, useCallback } from "react";
import { accountBalance, login, logout } from "../utils/near";

export default function AccountInfo({ account }) {
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
            <h2 className = "title">Unified Healthcare Data System</h2>
            {account.accountId ? (
                <div className = "account-info">
                    <div><b>Account:</b> {account.accountId}</div>
                    <div><b>Balance:</b> {balance} NEAR</div>
                    <button onClick={logout}>LOG OUT</button> 
                </div>
            ) : (
                <>
                    <button onClick={login}>CONNECT WALLET</button>
                </>
            )}
            <style jsx = "true">{`
                .account-info {
                    margin-bottom: 20px;
                }

                .title {
                    margin: 0;
                }
            `}</style>
        </>
    )
}