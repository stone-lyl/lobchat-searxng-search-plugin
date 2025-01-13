# LobeChat Web Search Plugin

A web search plugin for LobeChat that enables internet search capabilities using the Google Custom Search API.

## Features

- 🔍 Google Custom Search integration
- 🚀 Built with Hono.js for high performance
- 🛡️ CORS enabled for cross-origin requests
- 🔌 Compatible with LobeHub Chat Plugin SDK
- ⚡ Deployable on Vercel

## Prerequisites

- [Bun](https://bun.sh/) runtime
- Google Custom Search API Key
- Google Custom Search Engine ID

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd lobechat-websearch
```

2. Install dependencies:

```bash
bun install
```

3. Set up your environment variables:
   - `API_KEY`: Your Google Custom Search API Key
   - `ENGINE_ID`: Your Google Custom Search Engine ID

## Development

To run the development server:

```bash
bun run dev
```

For Vercel development environment:

```bash
bun run dev:vc
```

## Deployment

The project is configured for deployment on Vercel. To deploy:

```bash
bun run deploy
```

## Type Checking

Run type checks using TypeScript:

```bash
bun run type-check
```

## License

MIT License
