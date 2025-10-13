import { getUserIdFromSessionId } from "@/auth/actions";
import { db } from "@/drizzle/db";
import { UserInfoTable } from "@/drizzle/schema";
import { cookies } from "next/headers";
import { Configuration, PlaidApi, PlaidEnvironments, TransactionsGetRequest } from "plaid";
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

  const transactions = await getTransactions(token!);

  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

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

const getTransactions = async (accessToken: string) => {
  const request: TransactionsGetRequest = {
    access_token: accessToken,
    start_date: "2020-01-01",
    end_date: "2025-10-11",
  };
  try {
    const response = await client.transactionsGet(request);
    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;

    while (transactions.length < total_transactions) {
      const paginatedRequest: TransactionsGetRequest = {
        access_token: accessToken,
        start_date: "2020-01-01",
        end_date: "2025-10-11",
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      transactions = transactions.concat(paginatedResponse.data.transactions);
    }
    return transactions;
  } catch (error) {
    console.error(error);
  }
};
