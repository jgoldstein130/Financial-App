import { ReactNode, useState } from "react";
import { Box, Typography, TextField, CardContent } from "@mui/material";

const DetailsSection = ({ children, ...props }: Props) => {
  const [salary, setSalary] = useState<string>();
  const [tax, setTax] = useState<string>();

  const handleSalaryClick = () => {
    let sanitizedSalary;
    sanitizedSalary = sanitizeString(salary || "");
    setSalary(sanitizedSalary);
  };

  const handleSalaryBlur = () => {
    let salaryWithDollarSign;
    salaryWithDollarSign = salary ? "$" + Number(salary).toFixed(2) : "";
    props.setSalary(Number(salary));
    setSalary(salaryWithDollarSign);
  };

  const sanitizeString = (str: string) => {
    return str.replace(/[^0-9.]/g, "");
  };
  return (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Details / Info
      </Typography>
      <div className="flex gap-4">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            width: "300px",
          }}
        >
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            onChange={(e) => props.setCurrentAge(Number(e.target.value))}
          />
          <TextField
            label="Retirement Age"
            variant="outlined"
            fullWidth
            onChange={(e) => props.setRetirementAge(Number(e.target.value))}
          />
          <TextField
            value={salary || ""}
            label="Salary"
            variant="outlined"
            fullWidth
            onChange={(e) => setSalary(e.target.value)}
            onClick={handleSalaryClick}
            onBlur={handleSalaryBlur}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            width: "300px",
          }}
        >
          <p>add more fields here if needed</p>
        </Box>
      </div>
    </CardContent>
  );
};

interface Props {
  children?: ReactNode;
  setCurrentAge: (age: number) => void;
  setRetirementAge: (age: number) => void;
  setSalary: (age: number) => void;
  setTaxRate: (taxRate: number) => void;
}

export default DetailsSection;
