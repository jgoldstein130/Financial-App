"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import LoginBackground from "../../assets/LoginBackground.jpg";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async () => {
    if (!isValidEmail(loginInfo.email)) {
      setErrorMessage("Invalid Email");
      return;
    }

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
      return;
    }

    await fetch("/api/setCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "sessionId", value: loginResponse }),
    });

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
            gap: "20px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <Typography variant="h5">Login</Typography>
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
          <Button variant="contained" onClick={login}>
            Login
          </Button>
          <Link href="/signUp">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
