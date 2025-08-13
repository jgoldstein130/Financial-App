"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountAccordion from "./Components/AccountAccordion/AccountAccordion";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import AddAccountModal from "./Components/AddAccountModal/AddAccountModal";
import GraphSection from "./Components/GraphSection/GraphSection";
import DetailsSection from "./Components/DetailsSection/DetailsSection";

export interface Account {
  name?: string;
  id?: string;
  startingBalance?: string;
  annualInterest?: string;
  monthlyContribution?: string;
}

const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expandedAccount, setExpandedAccount] = useState<string>("");
  const [isAddAccountModalOpened, setIsAddAccountModalOpened] =
    useState<boolean>(false);
  const [currentAge, setCurrentAge] = useState<number>(18);
  const [retirementAge, setRetirementAge] = useState<number>(65);

  const openAddAccountModal = () => {
    setIsAddAccountModalOpened(true);
  };

  const addAccount = (account: Account) => {
    const id = uuid();
    setAccounts((prevAccounts) => [...prevAccounts, { ...account, id: id }]);
    setExpandedAccount(id);
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
    <>
      <AddAccountModal
        accountName={""}
        onCancel={() => setIsAddAccountModalOpened(false)}
        isOpen={isAddAccountModalOpened}
        onClose={() => setIsAddAccountModalOpened(false)}
        addAccount={addAccount}
      />
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
            overflowY: "auto",
            padding: "16px",
            gap: 2,
          }}
        >
          <div className="flex flex-col gap-4 flex-1">
            <Card
              className="h-full"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  paddingTop: "10px",
                }}
              >
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md my-4 w-full"
                  onClick={openAddAccountModal}
                >
                  Add Account
                </button>
                {accounts.map((account) => (
                  <div
                    key={account.name + "-" + account.id}
                    style={{ marginBottom: "8px" }}
                  >
                    <AccountAccordion
                      account={account}
                      updateAccount={updateAccount}
                      deleteAccount={deleteAccount}
                      expandedAccount={expandedAccount}
                      setExpandedAccount={setExpandedAccount}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card
              className="h-full"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            ></Card>
          </div>
          <div
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Card sx={{ flex: 1 }}>
                <DetailsSection
                  setCurrentAge={(currentAge: number) =>
                    setCurrentAge(currentAge)
                  }
                  setRetirementAge={(retirementAge: number) =>
                    setRetirementAge(retirementAge)
                  }
                />
              </Card>
            </div>
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Card sx={{ flex: 1 }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">Individual Accounts</Typography>
                  <GraphSection
                    accounts={accounts}
                    mode="individual accounts"
                    currentAge={currentAge}
                    retirementAge={retirementAge}
                  />
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">Net Worth</Typography>
                  <GraphSection
                    accounts={accounts}
                    mode="net worth"
                    currentAge={currentAge}
                    retirementAge={retirementAge}
                  />
                </CardContent>
              </Card>
            </div>
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Card sx={{ flex: 1 }}>
                <CardContent className="flex flex-col"></CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent className="flex flex-col"></CardContent>
              </Card>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Home;
