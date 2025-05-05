import { ReactNode } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Account } from "@/app/page";

// TODO: We need a way to get current age and retirement age to get the xAxis
// TODO: This should probably be in the section that will get other info like salary so we can do stuff like % of income saved
// TODO: We want to do calculations for after retirement too

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
    if (!account.startingBalance || !account.annualInterest) {
      return [];
    }

    const startingBalance = Number(
      account.startingBalance.replace(/[^0-9.]/g, "")
    );
    const annualInterest =
      Number(account.annualInterest.replace(/[^0-9.]/g, "")) / 100;

    let balanceAtTimes: number[] = [startingBalance];
    for (let i = 1; i <= numYears; i++) {
      balanceAtTimes.push(
        balanceAtTimes[balanceAtTimes.length - 1] +
          balanceAtTimes[balanceAtTimes.length - 1] * annualInterest
      );
    }
    return balanceAtTimes;
  };

  return (
    <div style={{ height: "300px", marginTop: "20px" }}>
      <LineChart
        xAxis={[{ data: xAxisGenerator(24, 65) }]}
        series={getDataForAllAccounts(65 - 24) || []}
        height={200}
        margin={0}
      />
    </div>
  );
};

interface Props {
  children?: ReactNode;
  accounts: Account[];
  mode: "individual accounts" | "net worth";
}

export default GraphSection;
