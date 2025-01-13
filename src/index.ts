import { Hono } from "hono";

export const app = new Hono().get("/", (c) =>
  c.text(
    "Welcome to LobeChat Web Search!, A plugin for LobeChat to search the web through Google Custom Search Engine. All the routes are under `/api`.",
  ),
);

export default app;
