import React, { useState, useEffect, useCallback } from "react";
import { accountBalance, login, logout } from "../utils/near";

export default function AccountInfo({ account }) {
    // Balance
    const [balance, updateBalance] = useState(localStorage.getItem("balance") || "---.--");
    const fetchBalance = useCallback(async () => {
        if (account.accountId) {
            // Fetch current balance on each page visit
            let _balance = await accountBalance()
            // Cache last balance
            localStorage.setItem("balance", _balance)
            updateBalance(_balance)
            // Check for locally saved account
            if (localStorage.getItem("account") !== account.accountId) {
                // Remove private key of prior account
                // This will prompt current account to enter private key
                localStorage.removeItem("privateKey")
                localStorage.setItem("account", account.accountId)
            }
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
                    <div><b>By:</b> Rohan Phanse (<a href = "https://github.com/rohanphanse" target = "_blank">github</a>)</div>
                    <button className = "connect-wallet" onClick={login}>CONNECT WALLET</button>
                </>
            )}
            <style jsx = "true">{`
                .account-info {
                    margin-bottom: 20px;
                }

                .title {
                    margin: 0;
                }

                .connect-wallet {
                    margin-top: 10px;
                }
            `}</style>
        </>
    )
}