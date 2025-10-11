import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { db } from "@/drizzle/db";
import { UserInfoTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getUserIdFromSessionId } from "@/auth/actions";

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

export async function POST(req: Request) {
  try {
    const { public_token } = await req.json();

    if (!public_token) {
      return NextResponse.json({ error: "Missing public_token" }, { status: 400 });
    }

    const response = await client.itemPublicTokenExchange({ public_token });

    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    updateUserInfoTableWithPlaidAccessToken(access_token);

    return NextResponse.json({ access_token, item_id });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json({ error: "Failed to exchange public token" }, { status: 500 });
  }
}

const updateUserInfoTableWithPlaidAccessToken = async (accessToken: string) => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return;
  }

  const userId = await getUserIdFromSessionId(sessionId);

  await db
    .insert(UserInfoTable)
    .values({ userId: userId, plaidToken: accessToken })
    .onConflictDoUpdate({
      target: UserInfoTable.userId,
      set: {
        plaidToken: accessToken,
      },
    });
};
