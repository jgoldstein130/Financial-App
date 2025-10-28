import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import {
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
import { FaEdit } from "react-icons/fa";
import { ConfirmModalContext } from "../../contexts/ConfirmModalContext";
import DeleteButton from "../DeleteButton/DeleteButton";
import { BudgetItem, Category } from "../../app/budget/page";

const BudgetSection = ({ children, ...props }: Props) => {
  const [isBudgetCategoriesModalOpen, setIsBudgetCategoriesModalOpen] = useState<boolean>(false);
  const [frequencyOptions, setFrequencyOptions] = useState<string[]>(["Monthly", "Yearly"]);
  const { setIsConfirmModalOpen, setConfirmModalTitle, setConfirmModalFunction } = useContext(ConfirmModalContext);

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
        categories={props.categories}
        addCategory={props.addCategory}
        removeCategory={props.removeCategory}
        updateCategoryColor={props.updateCategoryColor}
        updateCategoryName={props.updateCategoryName}
        makeCategoryNameUnique={props.makeCategoryNameUnique}
      />
      {props.budgetItems.length > 0 && (
        <TableContainer component={Paper} className="w-full" style={{ maxHeight: "500px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="left">Cost</TableCell>
                {/*<TableCell align="left">Frequency</TableCell>*/}
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
                    <FaEdit size={20} onClick={() => setIsBudgetCategoriesModalOpen(true)} />
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
                    />
                  </TableCell>
                  <TableCell align="left">
                    <TextField
                      value={item.cost}
                      variant="standard"
                      onChange={(e) => updateBudgetItem(item.id, "cost", e.target.value)}
                    />
                  </TableCell>
                  {/* <TableCell
                    align="left"
                    sx={{
                      maxWidth: "150px",
                      minWidth: "150px",
                    }}
                  >
                    <FormControl size="small" fullWidth>
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
                  </TableCell>*/}
                  <TableCell align="left">
                    <FormControl size="small" style={{ width: "200px" }}>
                      {!item.category && <InputLabel>Category</InputLabel>}
                      <Select
                        value={item.category}
                        onChange={(e) => updateBudgetItem(item.id, "category", e.target.value)}
                        style={{ backgroundColor: props.getCategoryColorFromId(item.category) }}
                      >
                        <MenuItem value={""}>Select Category</MenuItem>
                        {[...props.categories.entries()].map((category) => (
                          <MenuItem value={category[0]}>{category[1].categoryName}</MenuItem>
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
  categories: Map<string, Category>;
  setCategories: Dispatch<SetStateAction<Map<string, Category>>>;
  addCategory: (categoryName: string, color: string) => void;
  removeCategory: (categoryKey: string) => void;
  updateCategoryColor: (categoryKey: string, color: string) => void;
  updateCategoryName: (categoryKey: string, categoryName: string) => void;
  makeCategoryNameUnique: (categoryKey: string) => void;
  getCategoryColorFromId: (categoryId: string) => string;
}

export default BudgetSection;
