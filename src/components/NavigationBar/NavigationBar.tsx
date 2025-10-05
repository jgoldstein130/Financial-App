import { Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { MdLogin } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./NavigationBar.css";

const NavigationBar = ({ children, ...props }: Props) => {
  const page = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean>();

  useEffect(() => {
    setLoggedIn(getCookie("sessionId") !== undefined);
  }, []);

  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(name + "="));
    return cookie?.split("=")[1];
  };

  const logout = async () => {
    const sessionId = getCookie("sessionId");
    const session = { sessionId: sessionId };
    const logoutCall = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    });

    await fetch("/api/deleteCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "sessionId" }),
    });

    router.push("/login");
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
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex",
          color: "white",
          marginLeft: "25px",
          marginRight: "25px",
          gap: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" style={{ marginTop: "70px", marginBottom: "60px" }}>
          Finance App
        </Typography>
        {!loggedIn && (
          <Link href="/login">
            <div
              className="page"
              style={{
                color: page === "/login" ? "white" : "#c4d1ff",
                backgroundColor: page === "/login" ? "#6e85f8" : "#516DF5",
              }}
            >
              <MdLogin size={25} />
              <Typography variant="h5">Login</Typography>
            </div>
          </Link>
        )}
        <Link href="/">
          <div
            className="page"
            style={{
              color: page === "/" ? "white" : "#c4d1ff",
              backgroundColor: page === "/" ? "#6e85f8" : "#516DF5",
            }}
          >
            <RxDashboard size={25} />
            <Typography variant="h5">Dashboard</Typography>
          </div>
        </Link>
        {loggedIn && (
          <div
            className="page"
            style={{
              color: "#c4d1ff",
            }}
            onClick={logout}
          >
            <MdLogin size={25} style={{ transform: "scaleX(-1)" }} />
            <Typography variant="h5">Logout</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

interface Props {
  children?: ReactNode;
  balance: number;
}

export default NavigationBar;
