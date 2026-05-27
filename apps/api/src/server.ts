import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

import { rateLimit } from "./rate-limit";

import cookieParser from "cookie-parser";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Streamyst OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
        origin:process.env.WEB_URL,
        credentials:true,
    })
)
}

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "Streamyst is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Streamyst server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
    "/trpc/auth.login",
    rateLimit({
        windowSeconds: 15 * 60,  
        maxRequests: 10,          
        keyPrefix: "login",
    })
);

app.use(
    "/trpc/submissions.submitForm",
    rateLimit({
        windowSeconds: 10 * 60, 
        maxRequests: 8,          
        keyPrefix: "submit",
    })
);

app.use(
    "/trpc/forms.createForm",
    rateLimit({
        windowSeconds: 24 * 60 * 60,  
        maxRequests: 20,               
        keyPrefix: "create_form",
    })
);

app.use(
    "/trpc",
    rateLimit({
        windowSeconds: 60,   
        maxRequests: 100,    
        keyPrefix: "general",
    })
);

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: serverRouter,
        createContext,
    })
);



app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);


export default app;
