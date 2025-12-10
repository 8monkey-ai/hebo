import { authService as betterAuthService } from "./better-auth";

import type { AuthService } from "./types";

const authService: AuthService = betterAuthService;

export { authService };
