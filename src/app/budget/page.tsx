"use client";

import CardContent from "@mui/material/CardContent";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { Typography } from "@mui/material";
import IncomeBreakdown from "../../components/IncomeBreakdown/IncomeBreakdown";
import BudgetSection from "../../components/BudgetSection/BudgetSection";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FaPlus } from "react-icons/fa";
import { ConfirmModalProvider } from "@/contexts/ConfirmModalContext";
import Transactions from "@/components/Transactions/Transactions";
import { BarChart } from "@mui/x-charts";

export interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  category: string;
}

export interface Category {
  categoryName: string;
  color: string;
}

const Budget = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());

  const addBudgetItem = () => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems.push({ id: uuid(), name: "", cost: 0, frequency: "", category: "" });
    setBudgetItems(newBudgetItems);
  };

  const getCategoryChartData = () => {
    const categoryNameToColorMap = new Map();
    [...categories.values()].forEach((category) => {
      categoryNameToColorMap.set(category.categoryName, category.color);
    });

    const categoryCostMap = new Map();
    budgetItems.forEach((budgetItem) => {
      console.log(budgetItem.category, categoryCostMap);
      if (!categoryCostMap.has(budgetItem.category)) {
        categoryCostMap.set(budgetItem.category, {
          cost: budgetItem.cost,
          color: categoryNameToColorMap.get(budgetItem.category) || "black",
        });
      } else {
        const prevCost = categoryCostMap.get(budgetItem.category).cost;
        categoryCostMap.set(budgetItem.category, {
          cost: Number(prevCost) + Number(budgetItem.cost),
          color: categoryNameToColorMap.get(budgetItem.category) || "black",
        });
      }
    });
    return categoryCostMap;
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
                  <Transactions />
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

                  <BudgetSection
                    budgetItems={budgetItems}
                    setBudgetItems={setBudgetItems}
                    categories={categories}
                    setCategories={setCategories}
                  />
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Spending Breakdown</b>
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        data: [...getCategoryChartData().keys()],
                        colorMap: {
                          type: "ordinal",
                          values: [...getCategoryChartData().keys()],
                          colors: [...getCategoryChartData().values()].map((category) => category.color),
                        },
                      },
                    ]}
                    series={[{ data: [...getCategoryChartData().values()].map((category) => Number(category.cost)) }]}
                    height={300}
                  />
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
