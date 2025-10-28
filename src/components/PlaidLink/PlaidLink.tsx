import { Button } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidLink = ({ children, ...props }: Props) => {
  const [linkToken, setLinkToken] = useState<string>("");

  // TODO: we should only get the link token if we dont have a permanent token

  useEffect(() => {
    const getLinkToken = async () => {
      const response = await fetch("/api/createLinkToken");
      const { link_token } = await response.json();
      setLinkToken(link_token);
    };

    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      await fetch("/api/exchangePublicToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token }),
      });
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error("Plaid exited with error:", err);
      } else {
        console.log("User exited Plaid flow:", metadata);
      }
    },
  });

  return (
    <Button onClick={() => open()} disabled={!ready} variant="contained" style={{ backgroundColor: "#6e85f8" }}>
      {props.text || "Connect Bank Account"}
    </Button>
  );
};

interface Props {
  children?: ReactNode;
  text?: string;
}

export default PlaidLink;
