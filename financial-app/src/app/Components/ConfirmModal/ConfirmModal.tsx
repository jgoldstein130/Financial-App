import { ReactNode, useContext } from "react";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { ConfirmModalContext } from "@/app/Contexts/ConfirmModalContext";

const ConfirmModal = ({ children, ...props }: Props) => {
  const {
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    confirmModalTitle,
    confirmModalFunction,
  } = useContext(ConfirmModalContext);
  return (
    <Modal
      open={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          bgcolor: "background.paper",
          boxShadow: 8,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6">{confirmModalTitle}</Typography>

        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsConfirmModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              confirmModalFunction();
              setIsConfirmModalOpen(false);
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

interface Props {
  children?: ReactNode;
}

export default ConfirmModal;
