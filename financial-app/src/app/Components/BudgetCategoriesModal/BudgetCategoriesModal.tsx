import { ReactNode, useState } from "react";
import { Box, Button, Modal } from "@mui/material";

const BudgetCategoriesModal = ({ children, ...props }: Props) => {
  return (
    <>
      <Modal open={props.isOpen} onClose={props.onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          Categories
          {props.categories.map((category) => (
            <p>{category}</p>
          ))}
        </Box>
      </Modal>
    </>
  );
};

interface Props {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  categories: String[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
}

export default BudgetCategoriesModal;
