import { redirect, type MetaFunction } from "react-router";

import { authService } from "~console/lib/auth";

async function verifyMagicLinkMiddleware({ request }: { request: Request }) {
  const searchParams = new URL(request.url).searchParams;
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  if (!email || !otp) throw redirect("/signin");

  try {
    await authService.signInWithMagicLink(otp.toUpperCase(), email);
  } catch {
    throw redirect("/signin");
  }
  throw redirect("/");
}

export const clientMiddleware = [verifyMagicLinkMiddleware];

// Prevent referrer leaks: OTP and email are in the URL query string, and without
// this policy, the referrer header would leak them to third parties (fonts, analytics, etc.)
export const meta: MetaFunction = () => [
  { name: "referrer", content: "no-referrer" },
];

export default function MagicLinkVerification() {
  return null;
}

