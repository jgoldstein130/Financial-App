import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
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
import { v4 as uuid } from "uuid";
import { ConfirmModalContext } from "../../contexts/ConfirmModalContext";
import DeleteButton from "../DeleteButton/DeleteButton";
import { BudgetItem } from "../../app/budget/page";

export interface Category {
  categoryName: string;
  color: string;
}

const BudgetSection = ({ children, ...props }: Props) => {
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());
  const [isBudgetCategoriesModalOpen, setIsBudgetCategoriesModalOpen] = useState<boolean>(false);
  const [frequencyOptions, setFrequencyOptions] = useState<string[]>(["Monthly", "Yearly"]);
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
    const categoryName = newCategories.get(categoryKey)?.categoryName;
    newCategories.delete(categoryKey);
    setCategories(newCategories);

    const newBudgetItems = [...props.budgetItems];
    for (let i = 0; i < newBudgetItems.length; i++) {
      if (newBudgetItems[i].category === categoryName) {
        newBudgetItems[i].category = "";
      }
    }
    props.setBudgetItems(newBudgetItems);
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
      props.setBudgetItems((prevItems) => [...prevItems.filter((item) => item.id !== id)]);
    });
    setConfirmModalTitle(`Are You Sure You Want To Delete The Budget Item "${name}"?`);
    setIsConfirmModalOpen(true);
  };

  const updateBudgetItem = (id: string, typeOfUpdate: keyof BudgetItem, newValue: string) => {
    const newBudgetItems = [...props.budgetItems];
    const index = newBudgetItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      (newBudgetItems[index][typeOfUpdate] as any) = newValue;
      props.setBudgetItems(newBudgetItems);
    }
  };

  return (
    <>
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
      {props.budgetItems.length > 0 && (
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
              {props.budgetItems.map((item) => (
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
                  <TableCell
                    align="left"
                    sx={{
                      maxWidth: "150px",
                      minWidth: "150px",
                    }}
                  >
                    <FormControl fullWidth>
                      {!item.frequency && <InputLabel>Frequency</InputLabel>}
                      <Select
                        value={item.frequency}
                        onChange={(e) => updateBudgetItem(item.id, "frequency", e.target.value)}
                      >
                        <MenuItem value={""}>Select Frequency</MenuItem>
                        {frequencyOptions.map((frequencyOption) => (
                          <MenuItem value={frequencyOption}>{frequencyOption}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
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
                        <MenuItem value={""}>Select Category</MenuItem>
                        {[...categories.values()].map((category) => (
                          <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left">
                    <DeleteButton onClick={() => removeBudgetItem(item.id, item.name)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

interface Props {
  children?: ReactNode;
  budgetItems: BudgetItem[];
  setBudgetItems: Dispatch<SetStateAction<BudgetItem[]>>;
}

export default BudgetSection;
