import { ChangeEvent, ReactNode, useContext, useState } from "react";
import { Account } from "../../app/App";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./AccountCard.css";
import EditAccountModal from "../EditAccountModal/EditAccountModal";
import { ConfirmModalContext } from "../../contexts/ConfirmModalContext";

const AccountCard = ({ children, ...props }: Props) => {
  const [editAccountModalIsOpen, setEditAccountModalIsOpen] = useState<boolean>(false);
  const [accountAfterEdit, setAccountAfterEdit] = useState<Account>(props.account);
  const { setIsConfirmModalOpen, setConfirmModalTitle, setConfirmModalFunction } = useContext(ConfirmModalContext);

  const sanitizeString = (str: string) => {
    return str.replace(/[^0-9.]/g, "");
  };

  const handleAccountValueChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (!props.account.id) return;

    const sanitizedValue = sanitizeString(e.target.value);

    props.updateAccount(props.account.id, {
      ...props.account,
      [field]: sanitizedValue,
    });
  };

  const handleAccountValueClick = (field: string) => {
    if (!props.account.id) return;

    let sanitizedValue;

    if (field === "startingBalance") {
      sanitizedValue = sanitizeString(props.account.startingBalance || "");
    } else if (field === "annualInterest") {
      sanitizedValue = sanitizeString(props.account.annualInterest || "");
    } else if (field === "monthlyContribution") {
      sanitizedValue = sanitizeString(props.account.monthlyContribution || "");
    }

    props.updateAccount(props.account.id, {
      ...props.account,
      [field]: sanitizedValue,
    });
  };

  const cleanAccountValue = (field: string) => {
    if (!props.account.id) return;

    let newValue;

    if (field === "startingBalance") {
      newValue = props.account.startingBalance ? "$" + Number(props.account.startingBalance).toFixed(2) : "";
    } else if (field === "annualInterest") {
      newValue = props.account.annualInterest ? Number(props.account.annualInterest).toFixed(2) + "%" : "";
    } else if (field === "monthlyContribution") {
      newValue = props.account.monthlyContribution ? "$" + Number(props.account.monthlyContribution).toFixed(2) : "";
    }

    props.updateAccount(props.account.id, {
      ...props.account,
      [field]: newValue,
    });
  };

  const handleDeleteButtonClick = () => {
    setConfirmModalFunction(() => () => {
      if (props.account.id) {
        props.deleteAccount(props.account.id);
      }
    });
    setConfirmModalTitle(`Are You Sure You Want To Delete The Account "${props.account.name}"?`);
    setIsConfirmModalOpen(true);
  };

  const openEditAccountModal = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setEditAccountModalIsOpen(true);
    e.stopPropagation();
  };

  const handleEditAccountModalClose = () => {
    setEditAccountModalIsOpen(false);
    setAccountAfterEdit(props.account);
  };

  const handleEditAccountModalSave = () => {
    if (!props.account.id) return;

    props.updateAccount(props.account.id, {
      ...props.account,
      name: accountAfterEdit.name,
    });

    setEditAccountModalIsOpen(false);
  };

  return (
    <>
      <EditAccountModal
        accountName={props.account.name || ""}
        onSave={handleEditAccountModalSave}
        onCancel={handleEditAccountModalClose}
        isOpen={editAccountModalIsOpen}
        onClose={handleEditAccountModalClose}
        accountAfterEdit={accountAfterEdit}
        setAccountAfterEdit={setAccountAfterEdit}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
          border: "2px solid #516DF5",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {props.account.name || ""}
          <EditIcon
            fontSize="medium"
            style={{ color: "#b8b8b8" }}
            className="mt-1 mr-2 edit-icon"
            onClick={(e) => openEditAccountModal(e)}
          />
        </div>
        <TextField
          label="Starting Balance"
          variant="outlined"
          value={props.account.startingBalance || ""}
          onChange={(e) => handleAccountValueChange(e, "startingBalance")}
          onClick={() => handleAccountValueClick("startingBalance")}
          onBlur={() => cleanAccountValue("startingBalance")}
          autoComplete="off"
        />
        <TextField
          label="Annual Interest (%)"
          variant="outlined"
          value={props.account.annualInterest || ""}
          onChange={(e) => handleAccountValueChange(e, "annualInterest")}
          onClick={() => handleAccountValueClick("annualInterest")}
          onBlur={() => cleanAccountValue("annualInterest")}
          autoComplete="off"
        />
        <TextField
          label="Monthly Contribution"
          variant="outlined"
          value={props.account.monthlyContribution || ""}
          onChange={(e) => handleAccountValueChange(e, "monthlyContribution")}
          onClick={() => handleAccountValueClick("monthlyContribution")}
          onBlur={() => cleanAccountValue("monthlyContribution")}
          autoComplete="off"
        />
        {children}
        <Button variant="outlined" color="error" disableRipple onClick={() => handleDeleteButtonClick()}>
          Delete Account
        </Button>
      </div>
    </>
  );
};

interface Props {
  children?: ReactNode;
  account: Account;
  updateAccount: (id: string, updatedAccount: Account) => void;
  deleteAccount: (id: string) => void;
  expandedAccount: string;
  setExpandedAccount: (id: string) => void;
}

export default AccountCard;
