import { MiddlewareHandler } from "hono";

export function serveStaticLocal(): MiddlewareHandler {
  return async (c, next) => {
    if (!process.env.VERCEL) {
      const { serveStatic } = await import("hono/bun");
      return serveStatic({ root: "./public" })(c, next);
    }
    return next();
  };
}
