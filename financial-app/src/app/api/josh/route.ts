import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

export async function GET(req: Request) {
  await db.insert(UserTable).values({ name: "Josh" });
  const users = await db.select().from(UserTable);
  return new Response(JSON.stringify(users), { status: 200 });
}
