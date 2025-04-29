import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { ChangeEvent, ReactNode } from "react";
import Box from "@mui/material/Box";
import { Account } from "../page";

const AccountAccordion = ({ children, ...props }: Props) => {
  const handleAccountValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (!props.account.name) return;

    if (field === "startingBalance") {
      const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");
      const formattedValue = sanitizedValue ? `$${sanitizedValue}` : "";

      props.updateAccount(props.account.name, {
        ...props.account,
        startingBalance: formattedValue,
      });
    }
  };

  const cleanAccountValue = (field: string) => {
    if (!props.account.name) return;

    if (field === "startingBalance") {
      const newStartingBalance = props.account.startingBalance
        ? "$" + Number(props.account.startingBalance.slice(1)).toFixed(2)
        : "";
      props.updateAccount(props.account.name, {
        ...props.account,
        startingBalance: newStartingBalance,
      });
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {props.account.name}
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
            type="number"
          />
          <TextField
            label="Monthly Contribution"
            variant="outlined"
            type="number"
          />
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

interface Props {
  children?: ReactNode;
  account: Account;
  updateAccount: (name: string, updatedAccount: Account) => void;
}

export default AccountAccordion;
