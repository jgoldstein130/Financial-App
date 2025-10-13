import { getUserIdFromSessionId } from "@/auth/actions";
import { db } from "@/drizzle/db";
import { UserInfoTable } from "@/drizzle/schema";
import { cookies } from "next/headers";
import { AccountsGetRequest, Configuration, PlaidApi, PlaidEnvironments, TransactionsGetRequest } from "plaid";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return;
  }

  const userId = await getUserIdFromSessionId(sessionId);

  const userInfos = await db
    .select({ token: UserInfoTable.plaidToken })
    .from(UserInfoTable)
    .where(eq(UserInfoTable.userId, userId));

  const { token } = userInfos[0];

  if (token) {
    const config = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV as string],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
          "PLAID-SECRET": process.env.PLAID_SECRET!,
        },
      },
    });

    const client = new PlaidApi(config);

    const request: AccountsGetRequest = {
      access_token: token,
    };

    const response = await client.accountsBalanceGet(request);
    const accounts = response.data.accounts;

    return new Response(JSON.stringify(accounts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
