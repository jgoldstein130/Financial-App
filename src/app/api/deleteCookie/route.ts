import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();

  cookieStore.set(body.name, "", {
    path: "/",
    maxAge: 0,
  });

  return new Response("Cookie Deleted Successful", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
