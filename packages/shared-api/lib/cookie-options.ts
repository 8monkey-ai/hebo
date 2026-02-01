import { authUrl } from "../env";
import { getRootDomain } from "../utils/domains";

// eTLD+1 domain for cross-subdomain cookies (e.g., "hebo.ai")
const cookieDomain = getRootDomain(authUrl);
const useSecureCookies = process.env.NODE_ENV === "production" ? true : false;

export const betterAuthCookieOptions = {
  advanced: {
    crossSubDomainCookies: {
      enabled: Boolean(cookieDomain),
      domain: cookieDomain,
    },
    // FUTURE: security tradeoff - restore default once we have SSR session checks
    defaultCookieAttributes: {
      httpOnly: false,
    },
    useSecureCookies,
  },
} as const;

export { cookieDomain };
