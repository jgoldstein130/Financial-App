import { login, LoginData } from "../../../auth/actions";

export async function POST(req: Request) {
  // TODO: check all fields exist and check lengths
  const body: LoginData = await req.json();
  const result = await login(body);

  if (result !== "Incorrect Password" && result !== "No account exists for this email") {
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
