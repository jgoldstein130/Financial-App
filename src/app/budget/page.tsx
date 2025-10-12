"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountCard from "../../components/AccountCard/AccountCard";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import AddAccountModal from "../../components/AddAccountModal/AddAccountModal";
import GraphSection from "../../components/GraphSection/GraphSection";
import IncomeBreakdown from "../../components/IncomeBreakdown/IncomeBreakdown";
import BudgetSection from "../../components/BudgetSection/BudgetSection";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FaPlus } from "react-icons/fa";
import PlaidLink from "@/components/PlaidLink/PlaidLink";
import { ConfirmModalProvider } from "@/contexts/ConfirmModalContext";

export interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  category: string;
}

const Budget = () => {
  const [currentAge, setCurrentAge] = useState<number>(18);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [salary, setSalary] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  const addBudgetItem = () => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems.push({ id: uuid(), name: "", cost: 0, frequency: "", category: "" });
    setBudgetItems(newBudgetItems);
  };

  return (
    <ConfirmModalProvider>
      <ConfirmModal />
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
                flex: 1.5,
                display: "flex",
                flexDirection: "row",
                gap: 30,
              }}
            >
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Transactions</b>
                  </Typography>
                  <PlaidLink />
                </CardContent>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Income Breakdown</b>
                  </Typography>
                  <IncomeBreakdown />
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
                    <FaPlus onClick={addBudgetItem} size={25} color="#b8b8b8" />
                  </div>

                  <BudgetSection budgetItems={budgetItems} setBudgetItems={setBudgetItems} />
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
          </div>
        </div>
      </div>
    </ConfirmModalProvider>
  );
};

export default Budget;
