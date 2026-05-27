import { router } from "./trpc";

import { submissionRouter } from "./routes/submission/route";
import {formsRouter} from "./routes/forms/route";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  forms:formsRouter, 
  submission: submissionRouter, 
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
