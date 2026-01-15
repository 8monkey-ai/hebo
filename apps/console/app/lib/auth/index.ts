import { isDevLocal } from "~console/lib/env";

let authService;
if (isDevLocal) {
  console.warn("⚠️ No auth configured, using dummy auth service");
  ({ authService } = await import("./dummy-auth"));
} else {
  ({ authService } = await import("./better-auth"));
}

export { authService };
