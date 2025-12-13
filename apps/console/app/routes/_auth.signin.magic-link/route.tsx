import { redirect } from "react-router";

import { authService } from "~console/lib/auth";

export async function clientLoader({ request }: { request: Request }) {
  const searchParams = new URL(request.url).searchParams;
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  if (!email || !otp) return redirect("/signin");

  try {
    await authService.signInWithMagicLink(otp.toUpperCase(), email);
  } catch (error) {
    return redirect("/signin");
  }
  return redirect("/");
}

export default function MagicLinkVerification() {
  return null;
}

