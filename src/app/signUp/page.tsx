"use client";

import NavigationBar from "@/components/NavigationBar/NavigationBar";
import LoginBackground from "../../assets/LoginBackground.jpg";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

    setIsLoading(true);

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
      setIsLoading(false);
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
            justifyContent: "space-between",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h4">
              <b>Sign Up</b>
            </Typography>
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
            <Button
              variant="contained"
              onClick={() => signUp()}
              style={{
                borderRadius: "20px",
                background: "linear-gradient(to right, #A4D4F8, #8669F5)",
                height: "40px",
              }}
            >
              {isLoading ? <CircularProgress size="30px" color="inherit" /> : "Sign Up"}
            </Button>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            Already Have An Account?
            <Link href="/login">
              <b>LOGIN</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
