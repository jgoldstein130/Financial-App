"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountCard from "../components/AccountCard/AccountCard";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import AddAccountModal from "../components/AddAccountModal/AddAccountModal";
import GraphSection from "../components/GraphSection/GraphSection";
import DetailsSection from "../components/DetailsSection/DetailsSection";
import IncomeBreakdown from "../components/IncomeBreakdown/IncomeBreakdown";
import BudgetSection from "../components/BudgetSection/BudgetSection";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { FaPlus } from "react-icons/fa";

export interface Account {
  name?: string;
  id?: string;
  startingBalance?: string;
  annualInterest?: string;
  monthlyContribution?: string;
}

const App = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expandedAccount, setExpandedAccount] = useState<string>("");
  const [isAddAccountModalOpened, setIsAddAccountModalOpened] = useState<boolean>(false);
  const [currentAge, setCurrentAge] = useState<number>(18);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [salary, setSalary] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);

  const openAddAccountModal = () => {
    setIsAddAccountModalOpened(true);
  };

  const addAccount = (account: Account) => {
    const id = uuid();
    setAccounts((prevAccounts) => [...prevAccounts, { ...account, id: id }]);
    setExpandedAccount(id);
  };

  const updateAccount = (id: string, updatedAccount: Account) => {
    setAccounts((prevAccounts) => prevAccounts.map((account) => (account.id === id ? updatedAccount : account)));
  };

  const deleteAccount = (id: string) => {
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
  };

  //useEffect(() => {
  //fetch("/api/josh")
  // .then((res) => res.json())
  // .then((data) => console.log(data))
  // .catch((err) => console.error(err));
  //}, []);

  return (
    <>
      <ConfirmModal />
      <AddAccountModal
        accountName={""}
        onCancel={() => setIsAddAccountModalOpened(false)}
        isOpen={isAddAccountModalOpened}
        onClose={() => setIsAddAccountModalOpened(false)}
        addAccount={addAccount}
      />
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <NavigationBar balance={30500} />
        <div
          style={{
            display: "flex",
            flex: 1,
            overflowY: "auto",
            padding: "30px",
            gap: 30,
          }}
        >
          <div
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <div style={{ flex: 1 }}>
                <DetailsSection
                  setCurrentAge={(currentAge: number) => setCurrentAge(currentAge)}
                  setRetirementAge={(retirementAge: number) => setRetirementAge(retirementAge)}
                  setSalary={(salary: number) => setSalary(salary)}
                  setTaxRate={(taxRate: number) => setTaxRate(taxRate)}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 30,
              }}
            >
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <div className="flex flex-col p-4">
                  <div className="flex justify-between items-center">
                    <Typography variant="h6">
                      <b>Accounts</b>
                    </Typography>
                    <FaPlus onClick={openAddAccountModal} size={25} color="#b8b8b8" />
                  </div>
                  <div className="flex flex-col gap-4 pt-4">
                    {accounts.map((account) => (
                      <div key={account.name + "-" + account.id} style={{ marginBottom: "8px" }}>
                        <AccountCard
                          account={account}
                          updateAccount={updateAccount}
                          deleteAccount={deleteAccount}
                          expandedAccount={expandedAccount}
                          setExpandedAccount={setExpandedAccount}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Income Breakdown</b>
                  </Typography>
                  <IncomeBreakdown salary={salary} />
                </CardContent>
              </div>
            </div>
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 30,
              }}
            >
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <div className="flex flex-col p-4">
                  <div className="flex justify-between items-center pb-4">
                    <Typography variant="h6">
                      <b>Budget</b>
                    </Typography>
                    <FaPlus
                      onClick={() => {} /* add budget item function is in Budget Section Component*/}
                      size={25}
                      color="#b8b8b8"
                    />
                  </div>

                  <BudgetSection />
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Spending Breakdown</b>
                  </Typography>
                </CardContent>
              </div>
            </div>
            <div
              style={{
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 30,
              }}
            >
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px", marginBottom: "30px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Individual Accounts</b>
                  </Typography>
                  <GraphSection
                    accounts={accounts}
                    mode="individual accounts"
                    currentAge={currentAge}
                    retirementAge={retirementAge}
                  />
                </CardContent>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px", marginBottom: "30px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Net Worth</b>
                  </Typography>
                  <GraphSection
                    accounts={accounts}
                    mode="net worth"
                    currentAge={currentAge}
                    retirementAge={retirementAge}
                  />
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
