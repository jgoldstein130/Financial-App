import { Account } from "@/app/page";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { ReactNode } from "react";

const EditAccountModal = ({ children, ...props }: Props) => {
  return (
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Account
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
            value={props.accountAfterEdit.name}
            onChange={(e) =>
              props.setAccountAfterEdit({
                ...props.accountAfterEdit,
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
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableRipple
            onClick={props.onSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

interface Props {
  children?: ReactNode;
  accountName: string;
  onSave: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
  accountAfterEdit: Account;
  setAccountAfterEdit: (account: Account) => void;
}

export default EditAccountModal;
