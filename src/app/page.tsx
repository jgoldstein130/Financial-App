"use client";

import CardContent from "@mui/material/CardContent";
import AccountCard from "../components/AccountCard/AccountCard";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { Typography } from "@mui/material";
import AddAccountModal from "../components/AddAccountModal/AddAccountModal";
import GraphSection from "../components/GraphSection/GraphSection";
import DetailsSection from "../components/DetailsSection/DetailsSection";
import IncomeBreakdown from "../components/IncomeBreakdown/IncomeBreakdown";
import BudgetSection from "../components/BudgetSection/BudgetSection";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { FaPlus } from "react-icons/fa";
import PlaidLink from "@/components/PlaidLink/PlaidLink";
import { ConfirmModalProvider } from "@/contexts/ConfirmModalContext";

export interface Account {
  name?: string;
  id?: string;
  startingBalance?: string;
  annualInterest?: string;
  monthlyContribution?: string;
}

const Dashboard = () => {
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

  return (
    <ConfirmModalProvider>
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
        ></div>
      </div>
    </ConfirmModalProvider>
  );
};

export default Dashboard;
