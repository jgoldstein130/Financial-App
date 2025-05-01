import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { ChangeEvent, ReactNode } from "react";
import Box from "@mui/material/Box";
import { Account } from "../page";
import { Button, IconButton, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const AccountAccordion = ({ children, ...props }: Props) => {
  const handleAccountValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (!props.account.id) return;

    let sanitizedValue;
    let formattedValue;

    sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");

    if (field === "startingBalance" || field === "monthlyContribution") {
      formattedValue = sanitizedValue ? `$${sanitizedValue}` : "";
    } else if (field === "annualInterest") {
      formattedValue = sanitizedValue || "";
    }

    props.updateAccount(props.account.id, {
      ...props.account,
      [field]: formattedValue,
    });
  };

  const cleanAccountValue = (field: string) => {
    if (!props.account.id) return;

    let newValue;

    if (field === "startingBalance") {
      newValue = props.account.startingBalance
        ? "$" + Number(props.account.startingBalance.slice(1)).toFixed(2)
        : "";
    } else if (field === "annualInterest") {
      newValue = props.account.annualInterest
        ? Number(props.account.annualInterest).toFixed(2) + "%"
        : "";
    } else if (field === "monthlyContribution") {
      newValue = props.account.monthlyContribution
        ? "$" + Number(props.account.monthlyContribution.slice(1)).toFixed(2)
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

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <TextField
          variant="standard"
          value={props.account.name}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <EditIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Starting Balance"
            variant="outlined"
            value={props.account.startingBalance || ""}
            onChange={(e) => handleAccountValueChange(e, "startingBalance")}
            onBlur={() => cleanAccountValue("startingBalance")}
          />
          <TextField
            label="Annual Interest (%)"
            variant="outlined"
            value={props.account.annualInterest || ""}
            onChange={(e) => handleAccountValueChange(e, "annualInterest")}
            onBlur={() => cleanAccountValue("annualInterest")}
          />
          <TextField
            label="Monthly Contribution"
            variant="outlined"
            value={props.account.monthlyContribution || ""}
            onChange={(e) => handleAccountValueChange(e, "monthlyContribution")}
            onBlur={() => cleanAccountValue("monthlyContribution")}
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
  );
};

interface Props {
  children?: ReactNode;
  account: Account;
  updateAccount: (name: string, updatedAccount: Account) => void;
  deleteAccount: (name: string) => void;
}

export default AccountAccordion;
