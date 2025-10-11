import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";

  const cookie = cookieStore.get(name)?.value;

  return new Response(cookie, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
