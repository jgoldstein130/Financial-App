import { ReactNode, useState } from "react";
import {
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BudgetCategoriesModal from "../BudgetCategoriesModal/BudgetCategoriesModal";
import { FaPlusSquare } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { v4 as uuid } from "uuid";

interface budgetItem {
  key: string;
  name: string;
  cost: number;
  frequency: string;
  category: string;
}

const BudgetSection = ({ children, ...props }: Props) => {
  const [items, setItems] = useState<budgetItem[]>([
    {
      key: uuid(),
      name: "car",
      cost: 300,
      frequency: "monthly",
      category: "car",
    },
    {
      key: uuid(),
      name: "rent",
      cost: 1409,
      frequency: "monthly",
      category: "rent",
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryToColorMap, setCategoryToColorMap] =
    useState<Map<string, string>>();
  const [isBudgetCategoriesModalOpen, setIsBudgetCategoriesModalOpen] =
    useState<boolean>(false);

  const addCategory = (category: string) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };

  const removeCategory = (category: string) => {
    const newCategories = categories.filter((x) => x !== category);
    setCategories(newCategories);
  };

  return (
    <CardContent>
      <BudgetCategoriesModal
        isOpen={isBudgetCategoriesModalOpen}
        onClose={() => setIsBudgetCategoriesModalOpen(false)}
        categories={categories}
        addCategory={addCategory}
        removeCategory={removeCategory}
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
                  <FaPlusSquare
                    size={20}
                    color="green"
                    onClick={() => setIsBudgetCategoriesModalOpen(true)}
                  />
                </div>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.cost}</TableCell>
                <TableCell align="right">{item.frequency}</TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: categoryToColorMap?.get(item.name) }}
                >
                  {item.category}
                </TableCell>
                <TableCell align="right">
                  <TiDelete color="#ad151c" size={30} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  );
};

interface Props {
  children?: ReactNode;
}

export default BudgetSection;
