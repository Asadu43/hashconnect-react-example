import "./App.css";
import "antd/dist/antd.css";
import { Button, Card, Space, Layout, Collapse } from "antd";
import React, { useState } from "react";
import { useHashConnect } from "./hooks/useHashconnect";
import { Client, AccountBalanceQuery } from "@hashgraph/sdk";

const { Panel } = Collapse;

const { Header, Content, Footer } = Layout;
function App() {
  const {
    connectToExtension,
    disconnect,
    pairingData,
    availableExtension,
    network,
    pairingString,
    sendTransaction,
  } = useHashConnect();
  console.log("🚀 ~ file: App.jsx ~ line 40 ~ App ~ pairingData", pairingData);

  // Configure the Hedera client
  const client = Client.forTestnet(); 

  const [balance, setBalance] = useState("");

  const fetchBalance = async () => {
    try {
      const userBalance = await getUserBalance();
      setBalance(userBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const getUserBalance = async () => {
    if (pairingData && pairingData.accountIds && pairingData.accountIds.length > 0) {
      try {
        const accountId = pairingData.accountIds[0];
        console.log("===============Network: P " + network + " ================");
        console.log("===============Account ID: " + accountId + " ================");

        // Create the query
        const query = new AccountBalanceQuery()
          .setAccountId(accountId);

        // Execute the query
        const accountBalance = await query.execute(client);
        console.log("===============Network: Balance " + accountBalance.hbars.toString() + " ================");
        return accountBalance.hbars.toString(); // Returning the balance in HBAR
      } catch (error) {
        console.error("Error retrieving user balance:", error);
        throw error; // Re-throw the error so it can be handled by the caller
      }
    } else {
      console.error("No valid pairing data available.");
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <h1 className="logo">Hashconnect React</h1>
      </Header>
      <Content className="site-layout-content">
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          {pairingData != null && (
            <Collapse size="small">
              <Panel header="HashPack Connection Info">
                <p>Network: {network}</p>
                <p>Account Id: {pairingData.accountIds}</p>
                <p>Account Balance: {balance}</p>
                {/* <p>Account Id: {balance}</p> */}
              </Panel>
            </Collapse>
          )}

          <Space>
            <Button disabled={pairingData != null} type="primary" onClick={connectToExtension}>
              Connect HashPack
            </Button>
            <Button disabled={pairingData == null} type="primary" onClick={disconnect}>
              Disconnect HashPack
            </Button>

            <Button disabled={pairingData == null} type="primary" onClick={fetchBalance}>
              Get Balance
            </Button>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
