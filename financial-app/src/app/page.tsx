"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountAccordion from "./Components/AccountAccordion";
import { useState } from "react";

interface Account {
  name: string;
}

const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = () => {
    setAccounts((prevAccounts) => [...prevAccounts, { name: "Roth IRA" }]);
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
              name={account.name}
              key={account.name + "-" + index}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
