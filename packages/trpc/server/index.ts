import { router } from "./trpc";

import {formsRouter} from "./routes/forms/route";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  forms:formsRouter, 
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
