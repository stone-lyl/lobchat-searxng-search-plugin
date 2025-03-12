import { Hono } from "hono";
import fs from "fs";
import path from "path";

import type { Bindings } from "..";

export const manifest = new Hono<{ Bindings: Bindings }>()
  .get("/", (c) => {
    const manifest = fs.readFileSync(path.join(__dirname, "..", "..", "public", "manifest.tpl.json"), "utf8");
    
    // replace all {{SERVER_URL}} with environment variable
    const serverUrl = process.env.SERVER_URL || "http://localhost:3400";
    const content = manifest.replace(/{{SERVER_URL}}/g, serverUrl);
    return c.text(content);
  });
