import { getUserIdFromSessionId } from "@/auth/actions";
import { db } from "@/drizzle/db";
import { UserInfoTable } from "@/drizzle/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  let hasConnectedBank = false;
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
    hasConnectedBank = true;
  } else {
    hasConnectedBank = false;
  }

  return new Response(JSON.stringify(hasConnectedBank), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
