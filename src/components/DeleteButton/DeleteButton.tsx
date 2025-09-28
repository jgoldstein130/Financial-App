import { Button } from "@mui/material";
import { ReactNode } from "react";
import { FaTrash } from "react-icons/fa";

const DeleteButton = ({ children, ...props }: Props) => {
  return (
    <Button
      variant="contained"
      color="error"
      style={{ height: "50px", width: "50px", maxWidth: "50px", minWidth: "50px", padding: 0 }}
    >
      <FaTrash color="white" size={25} onClick={props.onClick} />
    </Button>
  );
};

interface Props {
  children?: ReactNode;
  onClick: () => void;
}

export default DeleteButton;
