"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountAccordion from "./Components/AccountAccordion";
import { useState } from "react";

export interface Account {
  name?: string;
  startingBalance?: string;
  annualInterest?: string;
  monthlyContribution?: string;
}

// TODO: add check to make sure two accounts aren't named the same

const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = () => {
    setAccounts((prevAccounts) => [
      ...prevAccounts,
      { name: "Account " + (prevAccounts.length + 1) },
    ]);
  };

  const updateAccountByName = (name: string, updatedAccount: Account) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.name === name ? updatedAccount : account
      )
    );
  };

  return (
    <div>
      <Card sx={{ height: "100vh", backgroundColor: "#eee" }}>
        <CardContent>
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md"
            onClick={addAccount}
          >
            Add Account
          </button>
          {accounts.map((account, index) => (
            <AccountAccordion
              account={account}
              updateAccount={updateAccountByName}
              key={account.name + "-" + index}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
