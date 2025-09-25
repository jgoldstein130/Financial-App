import { Account } from "@/app/page";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

const AddAccountModal = ({ children, ...props }: Props) => {
  const [newAccount, setNewAccount] = useState<Account>({});
  const [showErrorMessage, setShowErrorMessage] = useState<string>("");

  const handleCreateAccountClick = () => {
    if (newAccount) {
      if (newAccount.name) {
        props.addAccount(newAccount);
        setNewAccount({});
        props.onClose();
        setShowErrorMessage("");
      } else {
        setShowErrorMessage("You Must Add An Account Name");
      }
    }
  };

  const handleCancelClick = () => {
    setNewAccount({});
    setShowErrorMessage("");
    props.onCancel();
  };

  const handleClose = () => {
    setShowErrorMessage("");
    setNewAccount({});
    props.onClose();
  };

  return (
    <Modal open={props.isOpen} onClose={handleClose}>
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Account
        </Typography>
        <div className="my-4">
          <TextField
            label="Account Name"
            variant="outlined"
            className="w-full"
            value={newAccount.name || ""}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                name: e.target.value,
              })
            }
          />
        </div>
        {showErrorMessage && <h6 style={{ color: "#D32F2F" }}>{showErrorMessage}</h6>}
        <div className="flex justify-between mt-4">
          <Button variant="outlined" color="error" disableRipple onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" disableRipple onClick={handleCreateAccountClick}>
            Create Account
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

interface Props {
  children?: ReactNode;
  accountName: string;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
  addAccount: (account: Account) => void;
}

export default AddAccountModal;
