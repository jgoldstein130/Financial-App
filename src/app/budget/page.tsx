"use client";

import CardContent from "@mui/material/CardContent";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import IncomeBreakdown from "../../components/IncomeBreakdown/IncomeBreakdown";
import BudgetSection from "../../components/BudgetSection/BudgetSection";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FaPlus } from "react-icons/fa";
import { ConfirmModalProvider } from "@/contexts/ConfirmModalContext";
import Transactions from "@/components/Transactions/Transactions";
import BudgetCategoriesModal from "@/components/BudgetCategoriesModal/BudgetCategoriesModal";
import { hexToRgb, rgbToHex } from "@/utils/Utilities";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  category: string;
}

export interface Category {
  id: string;
  categoryName: string;
  color: string;
}

export interface Transaction {
  transaction_id: string;
  name: string;
  account_id: string;
  amount: string;
  date: string;
  category: string;
  manuallyAdded: boolean;
}

interface GraphData {
  category: string;
  budget?: number;
  transaction?: number;
  color: string;
}

const Budget = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());
  const [allTransactions, setAllTransactions] = useState<Map<String, Transaction>>(new Map());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasConnectedBank, setHasConnectedBank] = useState<boolean>();
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState<boolean>(false);
  const [dataForGraph, setDataForGraph] = useState<GraphData[]>([]);

  useEffect(() => {
    const getHasConnectedBank = async () => {
      const hasConnectedBankCall = await fetch("/api/hasConnectedBankAccount", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await hasConnectedBankCall.json();
      setHasConnectedBank(response);
    };

    getHasConnectedBank();
  }, []);

  useEffect(() => {
    const data = getDataForGraph();

    setDataForGraph(data);
  }, [budgetItems, transactions]);

  const addBudgetItem = () => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems.push({ id: uuid(), name: "", cost: 0, frequency: "", category: "" });
    setBudgetItems(newBudgetItems);
  };

  const addTransaction = () => {
    const newTransaction = new Map();
    const transactionId = uuid();
    newTransaction.set(transactionId, {
      transaction_id: transactionId,
      name: "",
      account_id: "",
      amount: "0",
      date: "",
      category: "",
      manuallyAdded: true,
    });
    setAllTransactions(new Map([...newTransaction, ...allTransactions]));
  };

  const sanitizeString = (str: string) => {
    str = str.toString();
    return str.replace(/(?!^)-|[^0-9.-]/g, "");
  };

  const addCategory = (categoryName: string, color: string) => {
    const newCategories = new Map(categories);
    let newCategoryName = categoryName;
    const currentCategoryNames = new Set(newCategories.values().map((category) => category.categoryName));
    let i = 1;
    while (currentCategoryNames.has(newCategoryName)) {
      newCategoryName = newCategoryName + "-" + i;
      i++;
    }
    const categoryKey = newCategoryName + uuid();
    newCategories.set(categoryKey, { categoryName: newCategoryName, color: color, id: categoryKey });
    setCategories(newCategories);
  };

  const removeCategory = (categoryKey: string) => {
    const newCategories = new Map(categories);
    newCategories.delete(categoryKey);
    setCategories(newCategories);
  };

  const updateCategoryColor = (categoryKey: string, color: string) => {
    const newCategories = new Map(categories);
    const newCategory = newCategories.get(categoryKey);
    if (newCategory) {
      newCategory.color = color;
      newCategories.set(categoryKey, newCategory);
    }
    setCategories(newCategories);
  };

  const updateCategoryName = (categoryKey: string, categoryName: string) => {
    const newCategories = new Map(categories);
    const newCategory = newCategories.get(categoryKey);
    let newCategoryName;
    if (newCategory) {
      newCategoryName = categoryName;
      newCategory.categoryName = newCategoryName;
      newCategories.set(categoryKey, newCategory);
    }
    setCategories(newCategories);
  };

  const makeCategoryNameUnique = (categoryKey: string) => {
    const newCategories = new Map(categories);
    const newCategory = newCategories.get(categoryKey);
    const currentCategoryNames = [...newCategories.values().map((category) => category.categoryName)];
    if (newCategory) {
      let newCategoryName = newCategory.categoryName;
      let i = 1;
      while (currentCategoryNames.filter((categoryName) => categoryName === newCategoryName).length > 1) {
        newCategoryName = newCategory.categoryName + "-" + i;
        i++;
      }
      newCategory.categoryName = newCategoryName;
      newCategories.set(categoryKey, newCategory);
    }
    setCategories(newCategories);
  };

  const getCategoryColorFromId = (categoryId: string) => {
    const categoryValues = [...categories.values()];
    const correctCategory = categoryValues.filter(
      (category) => category.categoryName === categories.get(categoryId)?.categoryName
    )[0];
    return correctCategory ? correctCategory.color : "white";
  };

  const getLighterVersionOfColor = (color: string) => {
    const scalingFactor = 1.25;
    const rgb = hexToRgb(color);

    if (rgb && rgb.r && rgb.g && rgb.b) {
      const newRed = Math.min(Math.round(rgb?.r * scalingFactor), 255);
      const newGreen = Math.min(Math.round(rgb?.g * scalingFactor), 255);
      const newBlue = Math.min(Math.round(rgb?.b * scalingFactor), 255);

      const newHexColor = rgbToHex(newRed, newGreen, newBlue);
      if (newRed === 255 && newGreen === 255 && newBlue === 255) {
        return color;
      }
      return newHexColor;
    } else {
      return "black";
    }
  };

  const getDataForGraph = () => {
    const data: GraphData[] = [];
    const categoryNameToColorMap = new Map();

    [...categories.values()].forEach((category) => {
      categoryNameToColorMap.set(category.categoryName, category.color);
    });

    let categoryMap = new Map();
    budgetItems.forEach((budgetItem) => {
      const categoryName = categories.get(budgetItem.category)?.categoryName;

      if (categoryName) {
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            budget: Number(budgetItem.cost),
            color: categoryNameToColorMap.get(categoryName),
          });
        } else {
          const prevCost = categoryMap.get(categoryName).budget;
          categoryMap.set(categoryName, {
            budget: Number(prevCost) + Number(budgetItem.cost),
            color: categoryNameToColorMap.get(categoryName),
          });
        }
      }
    });

    transactions.forEach((transaction) => {
      const categoryName = categories.get(transaction.category)?.categoryName;

      if (categoryName) {
        if (categoryMap.has(categoryName)) {
          const prevBudget = categoryMap.get(categoryName).budget || 0;
          const prevTransaction = categoryMap.get(categoryName).transaction || 0;
          categoryMap.set(categoryName, {
            budget: prevBudget,
            transaction: Number(prevTransaction) + Number(sanitizeString(transaction.amount)),
            color: categoryNameToColorMap.get(categoryName),
          });
        } else {
          categoryMap.set(categoryName, {
            budget: null,
            transaction: Number(sanitizeString(transaction.amount)),
            color: categoryNameToColorMap.get(categoryName),
          });
        }
      }
    });

    categoryMap.entries().forEach((entry) => {
      const newGraphData: any = {
        category: entry[0],
        budget_Total: entry[1].budget,
        transactions_Total: entry[1].transaction,
        color: entry[1].color,
      };
      data.push(newGraphData);
    });

    return data.sort((a, b) => a.category.localeCompare(b.category));
  };

  return (
    <ConfirmModalProvider>
      <ConfirmModal />
      <BudgetCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        addCategory={addCategory}
        removeCategory={removeCategory}
        updateCategoryColor={updateCategoryColor}
        updateCategoryName={updateCategoryName}
        makeCategoryNameUnique={makeCategoryNameUnique}
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
                      <b>Transactions</b>
                    </Typography>
                    <FaPlus onClick={addTransaction} size={25} color="#b8b8b8" />
                  </div>
                  <Transactions
                    hasConnectedBank={hasConnectedBank}
                    allTransactions={allTransactions}
                    setAllTransactions={setAllTransactions}
                    transactions={transactions}
                    setTransactions={setTransactions}
                    categories={categories}
                    setCategories={setCategories}
                    setIsCategoriesModalOpen={setIsCategoriesModalOpen}
                    getCategoryColorFromId={getCategoryColorFromId}
                  />
                </div>
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
                    addCategory={addCategory}
                    removeCategory={removeCategory}
                    updateCategoryColor={updateCategoryColor}
                    updateCategoryName={updateCategoryName}
                    makeCategoryNameUnique={makeCategoryNameUnique}
                    getCategoryColorFromId={getCategoryColorFromId}
                  />
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: "white", borderRadius: "10px" }}>
                <CardContent className="flex flex-col">
                  <Typography variant="h6">
                    <b>Spending Breakdown</b>
                  </Typography>
                  <BarChart
                    style={{ width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 }}
                    responsive
                    data={dataForGraph}
                    margin={{
                      top: 20,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis width="auto" />
                    <Tooltip />
                    <Bar dataKey="transactions_Total">
                      {dataForGraph.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="budget_Total">
                      {dataForGraph.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getLighterVersionOfColor(entry.color)} />
                      ))}
                    </Bar>
                  </BarChart>
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
                  <Typography variant="h6">
                    <b>Income Breakdown</b>
                  </Typography>
                  <IncomeBreakdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfirmModalProvider>
  );
};

export default Budget;
