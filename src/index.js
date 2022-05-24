import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";


ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://17rpk0edncmh.usemoralis.com:2053/server" appId="kc4IGRmUD2z70miKyJzrZ1cixlEwgLIArPSZpVCn">
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);