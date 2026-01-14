import { isDevLocal } from "~console/lib/env";

import { authService as betterAuthService } from "./better-auth";
import { authService as dummyAuthService } from "./dummy-auth";

import type { AuthService } from "./types";

const authService: AuthService = isDevLocal
  ? dummyAuthService
  : betterAuthService;

if (isDevLocal) console.warn("⚠️ No auth configured, using dummy auth service");

export { authService };
