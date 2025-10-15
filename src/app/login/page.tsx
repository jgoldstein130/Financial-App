"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import LoginBackground from "../../assets/LoginBackground.jpg";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "@/utils/Utilities";

interface LoginInfo {
  email: string;
  password: string;
}

const SignUpPage = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const sessionIdCall = await fetch("/api/getCookie?name=sessionId", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sessionId = await sessionIdCall.text();
      if (sessionId) {
        router.push("/");
      }
    };

    redirectIfLoggedIn();
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async () => {
    if (!isValidEmail(loginInfo.email)) {
      setErrorMessage("Invalid Email");
      return;
    }

    setIsLoading(true);

    const loginCall = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });
    const loginResponse = await loginCall.text();

    if (loginCall.status !== 200) {
      setErrorMessage(loginResponse);
      setIsLoading(false);
      return;
    }

    await fetch("/api/setCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "sessionId", value: loginResponse }),
    });

    setCookie("loggedIn", true, 0.05);

    router.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <NavigationBar balance={30500} />

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${LoginBackground.src})`,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            width: "500px",
            height: "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h4">
              <b>Login</b>
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              onChange={(e) => setLoginInfo((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              label="Password"
              variant="outlined"
              onChange={(e) => setLoginInfo((prev) => ({ ...prev, password: e.target.value }))}
            />
            {errorMessage && (
              <Typography variant="body1" color="red">
                {errorMessage}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={login}
              style={{ borderRadius: "20px", background: "linear-gradient(to right, #A4D4F8, #8669F5)" }}
            >
              {isLoading ? <CircularProgress size="30px" color="inherit" /> : "Login"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            Don't Have An Account?
            <Link href="/signUp">
              <b>SIGN UP</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
