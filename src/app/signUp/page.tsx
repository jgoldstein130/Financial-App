"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import LoginBackground from "../../assets/LoginBackground.jpg";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignUpInfo {
  name: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const checkSignInInfo = (info: SignUpInfo) => {
    if (info.name.length < 4 || info.name.length > 50) {
      setErrorMessage("Name must be between 4 and 50 characters");
      return false;
    } else if (!isValidEmail(info.email)) {
      setErrorMessage("Email format is invalid");
      return false;
    } else if (info.password.length < 7 || info.password.length > 50) {
      setErrorMessage("Password must be between 7 and 50 characters");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const signUp = async () => {
    const validSignUpinfo = checkSignInInfo(signUpInfo);
    if (!validSignUpinfo) {
      return;
    }

    const signUpCall = await fetch("/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpInfo),
    });
    const signUpResult = await signUpCall.text();

    if (signUpCall.status !== 200) {
      setErrorMessage(signUpResult);
      return;
    }

    await fetch("/api/setCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "sessionId", value: signUpResult }),
    });

    router.push("/");
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          <Typography variant="h5">Sign Up</Typography>
          <TextField
            label="Name"
            variant="outlined"
            onChange={(e) => setSignUpInfo((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Email"
            variant="outlined"
            onChange={(e) => setSignUpInfo((prev) => ({ ...prev, email: e.target.value }))}
          />
          <TextField
            label="Password"
            variant="outlined"
            onChange={(e) => setSignUpInfo((prev) => ({ ...prev, password: e.target.value }))}
          />
          {errorMessage && (
            <Typography variant="body1" color="red">
              {errorMessage}
            </Typography>
          )}
          <Button variant="contained" onClick={() => signUp()}>
            Sign Up
          </Button>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
