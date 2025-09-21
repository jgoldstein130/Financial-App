import { ReactNode, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { ColorResult } from "react-color";
import { Category } from "../BudgetSection/BudgetSection";

const BudgetCategoriesModal = ({ children, ...props }: Props) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [categoryForColorPicker, setCategoryForColorPicker] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("white");

  return (
    <>
      <Modal open={props.isOpen} onClose={props.onClose}>
        {/* TODO: this box should be its own component and each modal should use it*/}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "5px",
          }}
        >
          <div className="mb-4 font-bold">Categories</div>
          <TableContainer component={Paper} style={{ maxHeight: 350, overflowY: "auto" }}>
            <Table stickyHeader aria-label="category table">
              <TableBody>
                {[...props.categories.entries()].map(([categoryKey, category], index) => (
                  <TableRow key={categoryKey}>
                    <TableCell component="th" scope="row" className="w-full">
                      <div className="flex gap-2 items-center">
                        <div
                          style={{
                            width: "25px",
                            height: "25px",
                            backgroundColor: category.color,
                            borderRadius: "5px",
                            border: "1px solid black",
                          }}
                          onClick={() => {
                            setShowColorPicker(true);
                            setCategoryForColorPicker(categoryKey);
                          }}
                        />
                        <TextField
                          value={category.categoryName}
                          onChange={(e) => props.updateCategoryName(categoryKey, e.target.value)}
                          onBlur={() => props.makeCategoryNameUnique(categoryKey)}
                          variant="standard"
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell align="right" onClick={() => props.removeCategory(categoryKey)}>
                      Delete
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.addCategory("New Category", "blue");
            }}
          >
            New Category
          </Button>
          <Modal open={showColorPicker} onClose={() => setShowColorPicker(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
              }}
            >
              <SketchPicker
                color={selectedColor}
                onChange={(color: ColorResult) => {
                  props.updateCategoryColor(categoryForColorPicker, color.hex);
                  setSelectedColor(color.hex);
                }}
              />
            </Box>
          </Modal>
        </Box>
      </Modal>
    </>
  );
};

interface Props {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  categories: Map<string, Category>;
  addCategory: (categoryName: string, color: string) => void;
  removeCategory: (categoryKey: string) => void;
  updateCategoryColor: (categoryKey: string, color: string) => void;
  updateCategoryName: (categoryKey: string, categoryName: string) => void;
  makeCategoryNameUnique: (categoryKey: string) => void;
}

export default BudgetCategoriesModal;
