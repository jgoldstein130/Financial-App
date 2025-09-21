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
} from "@mui/material";
import { SketchPicker } from "react-color";
import { ColorResult } from "react-color";

const BudgetCategoriesModal = ({ children, ...props }: Props) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [categoryNameForColorPicker, setCategoryNameForColorPicker] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("white");

  const handleColorPickerChange = (categoryName: string, color: string) => {
    // need a new function for editing the color on a category.
  };

  // and we will need one for editing the name on the category.  maybe the categories map should map a uuid to a [categoryName, color] instead.
  return (
    <>
      <Modal open={props.isOpen} onClose={props.onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            minHeight: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          Categories
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...props.categories.entries()].map(([category, color], index) => (
                  <TableRow key={category + "-" + index}>
                    <TableCell component="th" scope="row">
                      {category}
                    </TableCell>
                    <TableCell align="left">
                      <div
                        style={{
                          width: "25px",
                          height: "25px",
                          backgroundColor: color,
                          borderRadius: "5px",
                          border: "1px solid black",
                        }}
                        onClick={() => {
                          setShowColorPicker(true);
                          setCategoryNameForColorPicker(category);
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" onClick={() => props.removeCategory(category)}>
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
                  props.updateCategoryColor(categoryNameForColorPicker, color.hex);
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
  categories: Map<string, string>;
  addCategory: (category: string, color: string) => void;
  removeCategory: (category: string) => void;
  updateCategoryColor: (category: string, color: string) => void;
}

export default BudgetCategoriesModal;
