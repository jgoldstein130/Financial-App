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
    onSuccess: () => {},
    onExit: (err, metadata) => {
      if (err) console.error("Plaid exited with error:", err);
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </button>
  );
}
