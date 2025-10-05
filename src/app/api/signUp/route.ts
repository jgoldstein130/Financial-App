import { signUp, SignUpData } from "../../../auth/actions";

export async function POST(req: Request) {
  // TODO: check all fields exist and check lengths
  const body: SignUpData = await req.json();
  const result = await signUp(body);

  if (result !== "Unable to create account" && result !== "Account already exists for this email") {
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
