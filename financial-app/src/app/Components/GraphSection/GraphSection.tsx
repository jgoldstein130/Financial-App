import { ReactNode } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Account } from "@/app/page";

// TODO: Maybe have a choice of how often you contribute to an account

// TODO: Add tax rate to accounts, maybe add account type and roth accounts will not have tax field

// TODO: We want to do calculations for after retirement too

// make graphs better fit their box

const GraphSection = ({ children, ...props }: Props) => {
  const xAxisGenerator = (currentAge: number, retirementAge: number) => {
    const xAxis: number[] = [];
    for (let i = 0; i <= retirementAge - currentAge; i++) {
      xAxis.push(i);
    }
    return xAxis;
  };

  const sumArraysIn2dArray = (arr: number[][]) => {
    if (arr.length === 0) return [];
    const total = [...arr[0]];
    for (let i = 1; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        total[j] += arr[i][j];
      }
    }
    return total;
  };

  const getDataForAllAccounts = (numYears: number) => {
    const data = [];
    if (props.mode === "individual accounts") {
      for (let i = 0; i < props.accounts.length; i++) {
        data.push({
          data: getDataForAnAccount(props.accounts[i], numYears),
          label: props.accounts[i].name,
        });
      }
      return data;
    } else if (props.mode === "net worth") {
      for (let i = 0; i < props.accounts.length; i++) {
        data.push(getDataForAnAccount(props.accounts[i], numYears));
      }
      return [{ data: sumArraysIn2dArray(data), label: "Net Worth" }];
    }
  };

  const getDataForAnAccount = (account: Account, numYears: number) => {
    if (
      !account.startingBalance ||
      !account.annualInterest ||
      !account.monthlyContribution
    ) {
      return [];
    }

    const startingBalance = Number(
      account.startingBalance.replace(/[^0-9.]/g, "")
    );
    const annualInterest =
      Number(account.annualInterest.replace(/[^0-9.]/g, "")) / 100;
    const monthlyContribution = Number(
      account.monthlyContribution.replace(/[^0-9.]/g, "")
    );

    const monthlyInterest = annualInterest / 12;
    numYears -= 1;
    const numMonths = numYears * 12;

    let balanceEveryMonthyStartingBalance: number[] = [startingBalance];
    let balanceEveryMonthFromContributions: number[] = [0];
    let totalBalanceEveryMonth: number[] = [];
    for (let i = 1; i <= numMonths; i++) {
      balanceEveryMonthFromContributions.push(
        balanceEveryMonthFromContributions[
          balanceEveryMonthFromContributions.length - 1
        ] +
          monthlyContribution * Math.pow(1 + monthlyInterest, i - 1)
      );
    }
    for (let i = 1; i <= numMonths; i++) {
      balanceEveryMonthyStartingBalance.push(
        balanceEveryMonthyStartingBalance[
          balanceEveryMonthyStartingBalance.length - 1
        ] +
          balanceEveryMonthyStartingBalance[
            balanceEveryMonthyStartingBalance.length - 1
          ] *
            monthlyInterest
      );
    }
    totalBalanceEveryMonth = sumArraysIn2dArray([
      balanceEveryMonthyStartingBalance,
      balanceEveryMonthFromContributions,
    ]);

    const totalBalanceEveryYear = totalBalanceEveryMonth.filter(
      (_, index) => (index + 1) % 12 === 1
    );

    return totalBalanceEveryYear;
  };

  const getShorthandForBigNumbers = (num: number) => {
    if (num >= 1000 && num < 1000000) {
      return (num / 1000).toFixed(2) + "K";
    } else if (num >= 1000000 && num < 1000000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else {
      return num.toFixed(2).toString();
    }
  };

  return (
    <LineChart
      series={(getDataForAllAccounts(65 - 24) || []).map((series) => ({
        ...series,
        valueFormatter: (value) =>
          value !== null ? "$" + getShorthandForBigNumbers(value) : "",
      }))}
      xAxis={[{ data: xAxisGenerator(24, 65), label: "Year" }]}
      yAxis={[
        {
          label: "Balance ($)",
          width: 80,
          tickNumber: 4,
          valueFormatter: (balance: number) =>
            getShorthandForBigNumbers(balance),
        },
      ]}
      margin={0}
      sx={{ marginTop: "20px" }}
    />
  );
};

interface Props {
  children?: ReactNode;
  accounts: Account[];
  mode: "individual accounts" | "net worth";
}

export default GraphSection;
