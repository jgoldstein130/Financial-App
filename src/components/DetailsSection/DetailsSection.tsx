import { ReactNode, useEffect, useState } from "react";
import { Typography, TextField, CardContent, Card } from "@mui/material";
import PlaidLink from "../PlaidLink/PlaidLink";

const DetailsSection = ({ children, ...props }: Props) => {
  const [hasConnectedBank, setHasConnectedBank] = useState<boolean>();
  const [accounts, setAccounts] = useState<any[]>([]);
  // const [salary, setSalary] = useState<string>();
  // const [tax, setTax] = useState<string>();

  // const handleSalaryClick = () => {
  //   let sanitizedSalary;
  //   sanitizedSalary = sanitizeString(salary || "");
  //   setSalary(sanitizedSalary);
  // };

  // const handleSalaryBlur = () => {
  //   let salaryWithDollarSign;
  //   salaryWithDollarSign = salary ? "$" + Number(salary).toFixed(2) : "";
  //   props.setSalary(Number(salary));
  //   setSalary(salaryWithDollarSign);
  // };

  // const sanitizeString = (str: string) => {
  //   return str.replace(/[^0-9.]/g, "");
  // };

  useEffect(() => {
    const getHasConnectedBank = async () => {
      const hasConnectedBankCall = await fetch("/api/hasConnectedBankAccount", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await hasConnectedBankCall.json();
      setHasConnectedBank(response);
    };
    const getAccounts = async () => {
      const accountsCall = await fetch("/api/getAccounts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await accountsCall.json();
      setAccounts(response);
      console.log(response);
    };

    getHasConnectedBank();
    getAccounts();
  }, []);

  return (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        <b>Bank Accounts</b>
      </Typography>
      <div className="flex gap-4 mt-4">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
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
          {/*<TextField
            value={salary || ""}
            label="Salary"
            variant="outlined"
            fullWidth
            onChange={(e) => setSalary(e.target.value)}
            onClick={handleSalaryClick}
            onBlur={handleSalaryBlur}
          />*/}
          {!hasConnectedBank && <PlaidLink />}
          {hasConnectedBank && <PlaidLink text="Connect a Different Bank" />}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account, index) => (
              <Card key={index} className="p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                    <p className="text-sm text-gray-500">Type: {account.subtype}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-600">Available:</span>{" "}
                      <span className="font-semibold text-green-600">
                        ${account.balances.available?.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-600">Current:</span>{" "}
                      <span className="font-semibold text-blue-600">${account.balances.current?.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
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
