import { isAuthEnabled } from "~console/lib/env";

// FUTURE: use dynamic imports to enable tree shaking
import { authService as betterAuthService } from "./better-auth";
import { authService as dummyAuthService } from "./dummy-auth";

import type { AuthService } from "./types";

const authService: AuthService = isAuthEnabled
  ? betterAuthService
  : (console.warn("⚠️ No auth configured, using dummy"), dummyAuthService);

export { authService };
