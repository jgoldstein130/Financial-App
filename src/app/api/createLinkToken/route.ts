import { NextResponse } from "next/server";
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";
import { getUserIdFromSessionId } from "../../../auth/actions";
import { cookies } from "next/headers";

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as string],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});
const client = new PlaidApi(config);

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return;
  }

  const userId = await getUserIdFromSessionId(sessionId);
  const tokenResponse = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Finance App",
    products: ["auth", "transactions"] as Products[],
    country_codes: ["US"] as CountryCode[],
    language: "en",
  });

  return NextResponse.json({ link_token: tokenResponse.data.link_token });
}
