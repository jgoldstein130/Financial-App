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

  const getDataForAllAccounts = (numYears: number) => {
    const data = [];
    for (let i = 0; i < props.accounts.length; i++) {
      data.push({
        data: getDataForAnAccount(props.accounts[i], numYears),
        label: props.accounts[i].name,
      });
    }
    return data;
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
          balanceAtTimes[balanceAtTimes.length - 1] * Number(annualInterest)
      );
    }
    return balanceAtTimes;
  };

  return (
    <div style={{ height: "300px", marginTop: "20px" }}>
      <LineChart
        xAxis={[{ data: xAxisGenerator(24, 65) }]}
        series={getDataForAllAccounts(65 - 24)}
        height={200}
        margin={0}
      />
    </div>
  );
};

interface Props {
  children?: ReactNode;
  accounts: Account[];
}

export default GraphSection;
