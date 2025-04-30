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

  const deleteAccountByName = (name: string) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((account) => account.name !== name)
    );
  };

  return (
    <div>
      <Card sx={{ height: "100vh", backgroundColor: "#eee" }}>
        <CardContent>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
            onClick={addAccount}
          >
            Add Account
          </button>

          <div className="pt-5">
            {accounts.map((account, index) => (
              <AccountAccordion
                account={account}
                updateAccount={updateAccountByName}
                deleteAccount={deleteAccountByName}
                key={account.name + "-" + index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
