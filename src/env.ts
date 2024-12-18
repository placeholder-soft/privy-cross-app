import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PRIVY_APP_ID: z.string(),
  },
  runtimeEnv: import.meta.env,
});
