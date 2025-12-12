import { type Logger } from "@bogeychan/elysia-logger/types";
import { bearer } from "@elysiajs/bearer";
import { Elysia } from "elysia";

import { BadRequestError } from "../../errors";
import { auth } from "../../lib/auth";

export const authServiceBetterAuth = new Elysia({
  name: "authenticate-user-better-auth",
})
  .use(bearer())
  .resolve(async (ctx) => {
    const apiKey = ctx.bearer;
    const cookies = ctx.request.headers.get("cookie");
    const log = (ctx as unknown as { log: Logger }).log;

    if (apiKey && cookies) {
      throw new BadRequestError(
        "Provide exactly one credential: Bearer API Key or JWT Header",
      );
    }

    if (apiKey) {
      const { key, error } = await auth.api.verifyApiKey({
        body: { key: apiKey },
      });

      if (key) {
        return { userId: key.userId } as const;
      }

      log.info({ error }, "Better Auth API key validation failed");
      return { userId: undefined } as const;
    }

    if (cookies) {
      const session = await auth.api.getSession({
        headers: ctx.request.headers,
      });

      if (!session) {
        log.info("JWT verification failed");
        return { userId: undefined } as const;
      }

      return { userId: session.user.id } as const;
    }

    log.info("No credentials provided");
    return { userId: undefined } as const;
  })
  .as("scoped");
