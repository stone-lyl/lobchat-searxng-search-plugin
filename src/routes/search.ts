import { Hono } from "hono";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import {
  createErrorResponse,
  getPluginSettingsFromRequest,
  PluginErrorType,
} from "@lobehub/chat-plugin-sdk";
import { PROMPT } from "../lib/constants";
import { ROLE } from "../lib/constants";

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
      console.log(`>>> Searching web for ${params.query}`);

      const search = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${settings.API_KEY}&cx=${settings.ENGINE_ID}&q=${encodeURIComponent(params.query)}`,
      );

      const json = (await search.json()) as {
        items: { title: string; link: string; snippet: string }[];
      };

      const firstFiveItems = json.items.slice(0, 5);

      const contentPromises = firstFiveItems.map(async (item) => {
        try {
          const response = await fetch(item.link);
          const html = await response.text();
          const doc = new JSDOM(html);
          const reader = new Readability(doc.window.document);
          const article = reader.parse();

          return {
            source: {
              title: item.title,
              link: item.link,
              description: item.snippet,
            },
            content: article?.textContent || "",
          };
        } catch (error) {
          console.error(`Error fetching content for ${item.link}:`, error);
          return {
            source: {
              title: item.title,
              link: item.link,
              description: item.snippet,
            },
            content: "", // Return empty content if fetch fails
          };
        }
      });

      const results = await Promise.all(contentPromises);

      const formattedResponse = `
Role: ${ROLE}

Prompt: ${PROMPT}

Query: ${params.query}

Data:
${results
  .filter((result) => result.content)
  .map(
    (result) => `
Source: ${result.source.title}
URL: ${result.source.link}
Content: ${result.content.trim()}
`,
  )
  .join("\n")}`;

      return c.text(formattedResponse);
    } catch (err) {
      return createErrorResponse(
        PluginErrorType.PluginServerError,
        err as object,
      );
    }
  });
