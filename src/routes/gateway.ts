import { Hono } from "hono";

import type { Bindings } from "..";

export const gateway = new Hono<{ Bindings: Bindings }>()
  .get("/", (c) =>
    c.json(
      { message: "GET /api/gateway is not supported, use POST instead" },
      405,
    ),
  )
  .post("/", async (c) => {
    if (process.env.NODE_ENV === "development") {
      const { createGatewayOnEdgeRuntime } = await import(
        "@lobehub/chat-plugins-gateway"
      );
      return createGatewayOnEdgeRuntime()(c.req.raw);
    }

    return c.newResponse("gateway", 200);
  });
