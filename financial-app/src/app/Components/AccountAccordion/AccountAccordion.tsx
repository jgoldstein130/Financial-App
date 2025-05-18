import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { ChangeEvent, ReactNode, useState } from "react";
import { Account } from "../../page";
import { Button, Box, Modal, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./AccountAccordion.css";
import EditAccountModal from "../EditAccountModal/EditAccountModal";

const AccountAccordion = ({ children, ...props }: Props) => {
  const [editAccountModalIsOpen, setEditAccountModalIsOpen] =
    useState<boolean>(false);
  const [accountAfterEdit, setAccountAfterEdit] = useState<Account>(
    props.account
  );

  const sanitizeString = (str: string) => {
    return str.replace(/[^0-9.]/g, "");
  };

  const handleAccountValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
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
      newValue = props.account.startingBalance
        ? "$" + Number(props.account.startingBalance).toFixed(2)
        : "";
    } else if (field === "annualInterest") {
      newValue = props.account.annualInterest
        ? Number(props.account.annualInterest).toFixed(2) + "%"
        : "";
    } else if (field === "monthlyContribution") {
      newValue = props.account.monthlyContribution
        ? "$" + Number(props.account.monthlyContribution).toFixed(2)
        : "";
    }

    props.updateAccount(props.account.id, {
      ...props.account,
      [field]: newValue,
    });
  };

  const handleDeleteButtonClick = () => {
    if (props.account.id) {
      props.deleteAccount(props.account.id);
    }
  };

  const openEditAccountModal = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setEditAccountModalIsOpen(true);
    e.stopPropagation();
  };

  const handleAccordionClick = () => {
    if (!props.account.id) {
      return;
    }
    if (props.expandedAccount !== props.account.id) {
      props.setExpandedAccount(props.account.id);
    } else {
      props.setExpandedAccount("");
    }
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
      <Accordion
        expanded={props.account.id === props.expandedAccount}
        onChange={handleAccordionClick}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <EditIcon
            fontSize="small"
            className="mt-1 mr-2 edit-icon"
            onClick={(e) => openEditAccountModal(e)}
          />
          {props.account.name}
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
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
              onChange={(e) =>
                handleAccountValueChange(e, "monthlyContribution")
              }
              onClick={() => handleAccountValueClick("monthlyContribution")}
              onBlur={() => cleanAccountValue("monthlyContribution")}
              autoComplete="off"
            />
            {children}
            <Button
              variant="outlined"
              color="error"
              disableRipple
              onClick={() => handleDeleteButtonClick()}
            >
              Delete Account
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
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

export default AccountAccordion;
