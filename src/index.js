import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DataEntry from "./components/DataEntry"
import { initializeContract } from "./utils/near";

window.nearInitPromise = initializeContract()
    .then(() => {
        ReactDOM.render(
            <React.StrictMode>
                <BrowserRouter>
                    <Routes>
                        <Route path = "/" element = {<App />} />
                        <Route path = "/data" element = {<DataEntry />}>
                            <Route path = ":id" element = {<DataEntry />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </React.StrictMode>,
            document.getElementById("root")
        );
    })
    .catch(console.error);
