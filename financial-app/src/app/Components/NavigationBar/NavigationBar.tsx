import { Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { MdLogin } from "react-icons/md";

const NavigationBar = ({ children, ...props }: Props) => {
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    setBalance(addCommasToBalance(props.balance));
  }, [props.balance]);

  const addCommasToBalance = (balance: number) => {
    let balanceString = balance.toString();
    let balanceWithCommas = "";
    let characterCounter = 0;
    for (let i = balanceString.length - 1; i >= 0; i--) {
      characterCounter++;
      balanceWithCommas = balanceString[i] + balanceWithCommas;
      if (characterCounter % 3 === 0 && characterCounter !== 0 && i !== 0) {
        balanceWithCommas = "," + balanceWithCommas;
      }
    }

    return "$" + balanceWithCommas;
  };

  return (
    <div className="bg-[#516DF5]" style={{ height: "100vh" }}>
      <div
        style={{
          width: "300px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="bg-[#6e85f8]"
          style={{
            width: "200px",
            height: "125px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "50px",
          }}
        >
          <Typography variant="h4">{balance}</Typography>
          <Typography variant="body1">Current Balance</Typography>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex",
          gap: "20px",
          color: "white",
          marginTop: "40px",
          marginLeft: "50px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "fit-content" }}>
          <MdLogin size={25} />
          <Typography variant="h5">Login</Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", width: "fit-content" }}>
          <RxDashboard size={25} />
          <Typography variant="h5">Dashboard</Typography>
        </div>
      </div>
    </div>
  );
};

interface Props {
  children?: ReactNode;
  balance: number;
}

export default NavigationBar;
