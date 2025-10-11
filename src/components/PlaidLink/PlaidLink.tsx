import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<string>("");

  // TODO: we should only get the link token after we click the button to connect

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
    <button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </button>
  );
}
