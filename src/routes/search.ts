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
  BASE_URL: string;
};

export const search = new Hono()
  .get("/", (context) =>
    context.json(
      { message: "GET /api/search is not supported, use POST instead" },
      405,
    ),
  )
  .post("/", async (context) => {
    const params = (await context.req.json()) as { query: string };
    const settings = getPluginSettingsFromRequest<Settings>(context.req.raw);
    console.log(`>>> Using base URL: ${JSON.stringify(settings)}`);

    if (!settings) {
      console.error("Plugin settings not found.");
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: "Plugin settings not found.",
      });
    }

    if (!params.query || params.query.trim() === "") {
      return createErrorResponse(PluginErrorType.BadRequest, {
        message: "Search query cannot be empty.",
      });
    }
    
    try {
      console.log(`>>> Searching web for ${params.query}`);

      const url = `${settings.BASE_URL}?q=${encodeURIComponent(params.query)}&language=auto&time_range=&safesearch=0&categories=general&format=json`;
      const search = await fetch(url);

      const json = (await search.json()) as {
        results: {
          title: string;
          url: string;
          publishedDate?: string;
          content: string;
        }[];
      };

      const firstThreeItems = json.results.slice(0, 3);

      const contentPromises = firstThreeItems.map(async (item, index) => {
        try {
          let articleContent = item.content;
          // Fetch content for the first two items
          if (index < 2) {
            const response = await fetch(item.url);
            const html = await response.text();
            const doc = new JSDOM(html);
            const reader = new Readability(doc.window.document);
            articleContent = reader.parse()?.textContent!;
          }
          return {
            source: {
              title: item.title,
              link: item.url,
              publishedDate: item.publishedDate,
            },
            content: articleContent || "",
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
            PublishedDate: ${result.source.publishedDate}
            ----
            `)
            .join("\n")}`;

      console.log(`>>> Returning search results ${formattedResponse}`);
      return context.text(formattedResponse);
    } catch (err) {
      console.error(`Error searching web:`, err);
      return createErrorResponse(
        PluginErrorType.PluginServerError,
        err as object,
      );
    }
  });
