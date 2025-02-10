import { Hono } from "hono";
// import { JSDOM } from "jsdom";
// import { Readability } from "@mozilla/readability";
import {
  createErrorResponse,
  getPluginSettingsFromRequest,
  PluginErrorType,
} from "@lobehub/chat-plugin-sdk";
import { PROMPT } from "../lib/constants";
import { ROLE } from "../lib/constants";

type Settings = {
  BASE_URL: string;
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
    console.log(`>>> Using base URL: ${JSON.stringify(settings)}`);

    if (!settings) {
      console.error("Plugin settings not found.");
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: "Plugin settings not found.",
      });
    }

    try {
      console.log(`>>> Searching web for ${params.query}`);

      const url = `${settings.BASE_URL}?q=${encodeURIComponent(params.query)}&language=auto&time_range=&safesearch=0&categories=general&format=json`
      const search = await fetch(url);


      const json = (await search.json()) as {
        results: { title: string; url: string; publishedDate?: string, content: string }[];
      };

      const firstFiveItems = json.results.slice(0, 5);

      const contentPromises = firstFiveItems.map(async (item) => {
        try {
          return {
            source: {
              title: item.title,
              link: item.url,
              publishedDate: item.publishedDate,
            },
            content: item?.content || "",
          };
        } catch (error) {
          console.error(`Error fetching content for ${item.url}:`, error);
          return {
            source: {
              title: item.title,
              link: item.url,
              publishedDate: item.publishedDate,
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
