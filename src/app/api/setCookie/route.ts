import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const body = await req.json();

  const twoHoursInSeconds = 60 * 60 * 2;

  cookieStore.set(body.name, body.value, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: twoHoursInSeconds,
  });

  return new Response("Cookie Set Successful", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
