import { ReactNode, useContext, useState } from "react";
import {
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

export interface Category {
  categoryName: string;
  color: string;
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
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());
  const [isBudgetCategoriesModalOpen, setIsBudgetCategoriesModalOpen] = useState<boolean>(false);
  const { setIsConfirmModalOpen, setConfirmModalTitle, setConfirmModalFunction } = useContext(ConfirmModalContext);

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
    newCategories.set(categoryKey, { categoryName: newCategoryName, color: color });
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

  const getCategoryColorFromName = (categoryName: string) => {
    const categoryValues = [...categories.values()];
    const correctCategory = categoryValues.filter((category) => category.categoryName === categoryName)[0];
    return correctCategory ? correctCategory.color : "white";
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
        updateCategoryName={updateCategoryName}
        makeCategoryNameUnique={makeCategoryNameUnique}
      />
      <TableContainer component={Paper} className="w-full">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="left">Cost</TableCell>
              <TableCell align="left">Frequency</TableCell>
              <TableCell align="left">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "flex-start",
                  }}
                >
                  Category
                  <FaPlusSquare size={20} color="green" onClick={() => setIsBudgetCategoriesModalOpen(true)} />
                </div>
              </TableCell>
              <TableCell align="left"></TableCell>
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
                <TableCell align="left">
                  <TextField
                    value={item.cost}
                    variant="standard"
                    onChange={(e) => updateBudgetItem(item.id, "cost", e.target.value)}
                  ></TextField>
                </TableCell>
                <TableCell align="left">{item.frequency}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    backgroundColor: getCategoryColorFromName(item.category),
                    maxWidth: "200px",
                    minWidth: "200px",
                  }}
                >
                  <FormControl fullWidth>
                    {!item.category && <InputLabel>Category</InputLabel>}
                    <Select
                      value={item.category}
                      onChange={(e) => updateBudgetItem(item.id, "category", e.target.value)}
                    >
                      {[...categories.values()].map((category) => (
                        <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="left">
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
