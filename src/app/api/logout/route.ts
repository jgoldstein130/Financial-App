import { logout } from "../../../auth/actions";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await logout(body.sessionId);

  if (result === "Logged Out") {
    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    return new Response(result, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
