import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { prettyJSON } from "hono/pretty-json";

import { gateway } from "./routes/gateway";
import { search } from "./routes/search";

export type Bindings = {
  development: boolean;
};

export const app = new Hono<{ Bindings: Bindings }>({
  strict: false,
})
  .use(
    prettyJSON(),
    logger(),
    cors({
      origin: "*",
      credentials: true,
      allowHeaders: [
        "X-CSRF-Token",
        "X-Requested-With",
        "Accept",
        "Accept-Version",
        "Content-Length",
        "Content-MD5",
        "Content-Type",
        "Date",
        "X-Api-Version",
        "x-lobe-trace",
        "x-lobe-plugin-settings",
        "x-lobe-chat-auth",
      ],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
    serveStatic({ root: "./public" }),
  )

  .get("/", (c) =>
    c.text(
      "Welcome to Web Search Plugin!, A plugin for LobeChat to search the web through Google Custom Search Engine. All the routes are under `/api`.",
    ),
  )

  .basePath("/api")

  .get("/", (c) =>
    c.json({
      message: "Welcome to Web Search Plugin!",
      description:
        "A plugin for LobeChat to search the web through Google Custom Search Engine.",
      routes: [
        {
          path: "/gateway",
          method: "POST",
          description: "Gateway for the plugin.",
        },
        {
          path: "/search",
          method: "POST",
          description: "Search the web through Google Custom Search Engine.",
        },
      ],
    }),
  )

  .route("/gateway", gateway)
  .route("/search", search);

export default app;
