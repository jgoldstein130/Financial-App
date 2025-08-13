import { ReactNode } from "react";
import { Box, Typography, TextField, CardContent } from "@mui/material";

const DetailsSection = ({ children, ...props }: Props) => {
  return (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Details / Info
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          label="Age"
          variant="outlined"
          type="number"
          fullWidth
          onChange={(e) => props.setCurrentAge(Number(e.target.value))}
        />
        <TextField
          label="Retirement Age"
          variant="outlined"
          fullWidth
          onChange={(e) => props.setRetirementAge(Number(e.target.value))}
        />
        <TextField label="Salary" variant="outlined" fullWidth />
      </Box>
    </CardContent>
  );
};

interface Props {
  children?: ReactNode;
  setCurrentAge: (age: number) => void;
  setRetirementAge: (age: number) => void;
}

export default DetailsSection;
