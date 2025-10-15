import { Button } from "@mui/material";
import { ReactNode } from "react";
import { FaTrash } from "react-icons/fa";

const DeleteButton = ({ children, ...props }: Props) => {
  return (
    <Button
      variant="contained"
      style={{
        height: "40px",
        width: "40px",
        maxWidth: "40px",
        minWidth: "40px",
        padding: 0,
        backgroundColor: "#e33b3b",
      }}
      onClick={props.onClick}
    >
      <FaTrash color="white" size={20} />
    </Button>
  );
};

interface Props {
  children?: ReactNode;
  onClick: () => void;
}

export default DeleteButton;
