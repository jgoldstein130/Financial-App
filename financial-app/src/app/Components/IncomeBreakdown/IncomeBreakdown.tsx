import { ReactNode, useEffect, useState } from "react";
import {
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getFederalTaxData } from "@/app/Utilities/ApiService";
import { PieChart } from "@mui/x-charts";

export interface TaxData {
  country: string;
  region: string;
  income: number;
  taxable_income: number;
  deductions: number;
  credits: number;
  federal_effective_rate: number;
  federal_taxes_owed: number;
  fica_social_security: number;
  fica_medicare: number;
  fica_total: number;
  region_effective_rate: number;
  region_taxes_owed: number;
  total_taxes_owed: number;
  income_after_tax: number;
  total_effective_tax_rate: number;
}

const testData = {
  country: "US",
  region: "CA",
  income: 100000,
  taxable_income: 100000,
  deductions: 0,
  credits: 0,
  federal_effective_rate: 0.17053,
  federal_taxes_owed: 17053,
  fica_social_security: 6200,
  fica_medicare: 1450,
  fica_total: 7650,
  region_effective_rate: 0.05952849999999999,
  region_taxes_owed: 5952.849999999999,
  total_taxes_owed: 30655.85,
  income_after_tax: 69344.15,
  total_effective_tax_rate: 0.3065585,
};

const IncomeBreakdown = ({ children, ...props }: Props) => {
  const [filingStatus, setFilingStatus] = useState("single");
  const [federalTaxData, setFederalTaxData] = useState<TaxData>();
  const [stateTaxRate, setStateTaxRate] = useState<number>();
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  useEffect(() => {
    const getTaxData = async () => {
      if (props.salary) {
        // const federalTaxDataResponse = await getFederalTaxData(
        //   props.salary,
        //   filingStatus
        // );
        //console.log(federalTaxDataResponse);
        // setFederalTaxData(federalTaxDataResponse);
        setFederalTaxData(testData);
      }
    };
    getTaxData();
  }, [filingStatus, props.salary]);

  const getIncomeAfterTax = () => {
    if (federalTaxData) {
      let income = props.salary;
      income -= federalTaxData.federal_taxes_owed;
      income -= federalTaxData.fica_total;
      if (stateTaxRate) {
        income -= (props.salary * stateTaxRate) / 100;
      }
      return income;
    }
    return 0;
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <FormControl fullWidth>
          <InputLabel>Filing Status</InputLabel>
          <Select
            value={filingStatus}
            label="Filing Status"
            onChange={(e) => setFilingStatus(e.target.value)}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married</MenuItem>
            <MenuItem value="married_separate">Married Separetely</MenuItem>
            <MenuItem value="head_of_household">Head of Household</MenuItem>
          </Select>
        </FormControl>
        <TextField
          value={stateTaxRate}
          label="State Income Tax Rate"
          variant="outlined"
          onChange={(e) => setStateTaxRate(Number(e.target.value))}
        />
        <a
          href="https://taxfoundation.org/data/all/state/state-income-tax-rates/"
          target="_blank"
          className="text-blue-600 underline hover:text-blue-800"
        >
          What is My State Income Tax Rate?
        </a>
        {!props.salary && <i>Input Salary To Calculate Tax</i>}
        {federalTaxData && (
          <div className="flex flex-col items-center gap-4">
            <PieChart
              series={[
                {
                  data: [
                    {
                      value: getIncomeAfterTax(),
                      label: "Income After Tax",
                    },
                    {
                      value: Number(
                        federalTaxData.federal_taxes_owed.toFixed(2)
                      ),
                      label: "Federal Income Tax",
                    },
                    {
                      value: Number(
                        federalTaxData.fica_social_security.toFixed(2)
                      ),
                      label: "Social Security",
                    },
                    {
                      value: Number(federalTaxData.fica_medicare.toFixed(2)),
                      label: "Medicare",
                    },
                    {
                      value: stateTaxRate
                        ? Number(
                            ((props.salary * stateTaxRate) / 100).toFixed(2)
                          )
                        : 0,
                      label: "State Income Tax",
                    },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
            <Button
              className="w-md"
              variant="contained"
              onClick={() => setShowTaxDetails((prevValue) => !prevValue)}
            >
              {showTaxDetails ? "Hide" : "Show"} Details
            </Button>

            {showTaxDetails && (
              <div
                className="p-4 flex flex-col w-full"
                style={{ border: "1px solid gray", borderRadius: "5px" }}
              >
                <p>
                  Federal Income Tax: $
                  {federalTaxData.federal_taxes_owed.toFixed(2)}
                </p>
                <p>
                  Social Security: $
                  {federalTaxData.fica_social_security.toFixed(2)}
                </p>
                <p>Medicare: ${federalTaxData.fica_medicare.toFixed(2)}</p>
                <p>
                  State Income Tax: $
                  {stateTaxRate
                    ? Number((props.salary * stateTaxRate) / 100).toFixed(2)
                    : 0}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
};

interface Props {
  children?: ReactNode;
  salary: number;
}

export default IncomeBreakdown;
