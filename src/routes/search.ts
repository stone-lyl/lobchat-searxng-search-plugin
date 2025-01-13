import { Hono } from "hono";
import {
  createErrorResponse,
  getPluginSettingsFromRequest,
  PluginErrorType,
} from "@lobehub/chat-plugin-sdk";

type Settings = {
  API_KEY: string;
  ENGINE_ID: string;
};

export const search = new Hono()
  .get("/", (c) =>
    c.json(
      { message: "GET /api/search is not supported, use POST instead" },
      405,
    ),
  )
  .post("/", async (c) => {
    const params = (await c.req.json()) as { query: string };
    const settings = getPluginSettingsFromRequest<Settings>(c.req.raw);

    if (!settings) {
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: "Plugin settings not found.",
      });
    }

    try {
      const returnable: {
        title: string;
        link: string;
        description: string;
      }[] = [];

      console.log(`>>> Searching web for ${params.query}`);

      const search = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${settings.API_KEY}&cx=${settings.ENGINE_ID}&q=${encodeURIComponent(params.query)}`,
      );
      const json = (await search.json()) as {
        items: { title: string; link: string; snippet: string }[];
      };

      for (const item of json.items) {
        returnable.push({
          title: item.title,
          link: item.link,
          description: item.snippet,
        });
      }

      return c.newResponse(JSON.stringify(returnable));
    } catch (err) {
      return createErrorResponse(
        PluginErrorType.PluginServerError,
        err as object,
      );
    }
  });
