"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountAccordion from "./Components/AccountAccordion";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

export interface Account {
  name?: string;
  id?: string;
  startingBalance?: string;
  annualInterest?: string;
  monthlyContribution?: string;
}

// TODO: add ability to change account name

const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = () => {
    setAccounts((prevAccounts) => [
      ...prevAccounts,
      { name: "New Account", id: uuid() },
    ]);
  };

  const updateAccount = (id: string, updatedAccount: Account) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.id === id ? updatedAccount : account
      )
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((account) => account.id !== id)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        <Typography variant="h5">Dashboard</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          padding: "16px",
          gap: 2,
        }}
      >
        <Card
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flex: "0 0 auto" }}>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
              onClick={addAccount}
            >
              Add Account
            </button>
          </CardContent>
          <CardContent
            sx={{
              flex: 1,
              overflowY: "auto",
              paddingTop: "10px",
            }}
          >
            {accounts.map((account) => (
              <div
                key={account.name + "-" + account.id}
                style={{ marginBottom: "8px" }}
              >
                <AccountAccordion
                  account={account}
                  updateAccount={updateAccount}
                  deleteAccount={deleteAccount}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Graph</Typography>
              <div style={{ height: "300px" }}>[Graph Placeholder]</div>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">Details / Info</Typography>
              <div>More insights or secondary charts can go here.</div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
