import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLinkButton() {
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

      const transactionsCall = await fetch("/api/getTransactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const transactions = await transactionsCall.json();

      console.log(transactions);
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
    <Button onClick={() => open()} disabled={!ready} variant="contained">
      Connect Bank Account
    </Button>
  );
}
