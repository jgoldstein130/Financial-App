import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

const AccountAccordion = ({ children, ...props }: Props) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {props.name}
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Starting Balance"
            variant="outlined"
            type="number"
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
  name: string;
}

export default AccountAccordion;
