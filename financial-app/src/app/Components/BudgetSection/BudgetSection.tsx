import { ReactNode, useContext, useState } from "react";
import {
  Button,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import BudgetCategoriesModal from "../BudgetCategoriesModal/BudgetCategoriesModal";
import { FaPlusSquare } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { v4 as uuid } from "uuid";
import { ConfirmModalContext } from "@/app/Contexts/ConfirmModalContext";

interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  frequency: string;
  category: string;
}

const BudgetSection = ({ children, ...props }: Props) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: uuid(),
      name: "car",
      cost: 300,
      frequency: "monthly",
      category: "car",
    },
    {
      id: uuid(),
      name: "rent",
      cost: 1409,
      frequency: "monthly",
      category: "rent",
    },
  ]);
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [isBudgetCategoriesModalOpen, setIsBudgetCategoriesModalOpen] = useState<boolean>(false);
  const { setIsConfirmModalOpen, setConfirmModalTitle, setConfirmModalFunction } = useContext(ConfirmModalContext);

  const addCategory = (category: string, color: string) => {
    const newCategories = new Map(categories);
    let categoryName = category;
    let i = 1;
    while (newCategories.has(categoryName)) {
      categoryName = category + "-" + i;
      i++;
    }
    newCategories.set(categoryName, color);
    setCategories(newCategories);
  };

  const removeCategory = (category: string) => {
    const newCategories = new Map(categories);
    newCategories.delete(category);
    setCategories(newCategories);
  };

  const updateCategoryColor = (categoryName: string, color: string) => {
    const newCategories = new Map(categories);
    newCategories.set(categoryName, color);
    setCategories(newCategories);
  };

  const removeBudgetItem = (id: string, name: string) => {
    setConfirmModalFunction(() => () => {
      setBudgetItems((prevItems) => [...prevItems.filter((item) => item.id !== id)]);
    });
    setConfirmModalTitle(`Are You Sure You Want To Delete The Budget Item "${name}"?`);
    setIsConfirmModalOpen(true);
  };

  const addBudgetItem = () => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems.push({ id: uuid(), name: "", cost: 0, frequency: "monthly", category: "" });
    setBudgetItems(newBudgetItems);
  };

  const updateBudgetItem = (id: string, typeOfUpdate: keyof BudgetItem, newValue: string) => {
    const newBudgetItems = [...budgetItems];
    const index = newBudgetItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      (newBudgetItems[index][typeOfUpdate] as any) = newValue;
      setBudgetItems(newBudgetItems);
    }
  };

  return (
    <CardContent>
      <BudgetCategoriesModal
        isOpen={isBudgetCategoriesModalOpen}
        onClose={() => setIsBudgetCategoriesModalOpen(false)}
        categories={categories}
        addCategory={addCategory}
        removeCategory={removeCategory}
        updateCategoryColor={updateCategoryColor}
      />
      <TableContainer component={Paper} sx={{ width: 500 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Frequency</TableCell>
              <TableCell align="right">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "flex-end",
                  }}
                >
                  Category
                  <FaPlusSquare size={20} color="green" onClick={() => setIsBudgetCategoriesModalOpen(true)} />
                </div>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  <TextField
                    value={item.name}
                    variant="standard"
                    onChange={(e) => updateBudgetItem(item.id, "name", e.target.value)}
                  ></TextField>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    value={item.cost}
                    variant="standard"
                    onChange={(e) => updateBudgetItem(item.id, "cost", e.target.value)}
                  ></TextField>
                </TableCell>
                <TableCell align="right">{item.frequency}</TableCell>
                <TableCell align="center" sx={{ backgroundColor: categories?.get(item.category) }}>
                  {item.category}
                </TableCell>
                <TableCell align="right">
                  <TiDelete color="#ad151c" size={30} onClick={() => removeBudgetItem(item.id, item.name)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={addBudgetItem}>
        Add Budget Item
      </Button>
    </CardContent>
  );
};

interface Props {
  children?: ReactNode;
}

export default BudgetSection;
