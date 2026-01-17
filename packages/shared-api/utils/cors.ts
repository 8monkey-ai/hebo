import { authUrl } from "../env";
import { getRootDomain } from "./root-domain";

const rootDomain = getRootDomain(authUrl);

export const corsConfig = rootDomain
  ? {
      // Matches HTTPS origins for exact domain or subdomains
      // eslint-disable-next-line security/detect-non-literal-regexp
      origin: new RegExp(
        String.raw`^https:\/\/(?:` +
          rootDomain.replaceAll(".", String.raw`\.`) +
          String.raw`|(?:[a-z0-9-]+\.)+` +
          rootDomain.replaceAll(".", String.raw`\.`) +
          ")$",
        "i",
      ),
      credentials: true,
      // reduces noise of OPTION calls without compromising security
      maxAge: 3600,
    }
  : {
      origin: true,
      credentials: true,
      maxAge: 3600,
    };
