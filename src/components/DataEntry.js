import { useParams, Link } from "react-router-dom"
import AccountInfo from "./AccountInfo";
import * as contract from "../utils/contract";

export default function DataEntry() {
    const account = window.walletConnection.account();
    let params = useParams()
    return (
        <>
            <AccountInfo account = {account} />
            <Link to = "/">Back to dashboard</Link>
            <h2>Data entry: {params.id}</h2>
        </>
    )
}