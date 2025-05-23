import { Account } from "@/app/page";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

const AddAccountModal = ({ children, ...props }: Props) => {
  const [newAccount, setNewAccount] = useState<Account>({});

  const handleCreateAccountClick = () => {
    if (newAccount) {
      props.addAccount(newAccount);
      setNewAccount({});
      props.onClose();
    }
  };

  const handleCancelClick = () => {
    props.onCancel();
    setNewAccount({});
  };

  const handleClose = () => {
    props.onClose();
    setNewAccount({});
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
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          className="mt-8 mb-10"
        >
          <TextField
            label="Account Name"
            variant="outlined"
            value={newAccount.name || ""}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                name: e.target.value,
              })
            }
          />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Button
            variant="outlined"
            color="error"
            disableRipple
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableRipple
            onClick={handleCreateAccountClick}
          >
            Create Account
          </Button>
        </Box>
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
