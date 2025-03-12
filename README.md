# LobeChat SearxNG Search Plugin

[![Bun](https://img.shields.io/badge/Runtime-Bun-%23fbf0df)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A LobeChat plugin that enables web searches through SearxNG instances, providing AI-powered analysis of search results.

## Features

- 🔍 Web search powered by SearxNG
- 🧠 AI analysis of webpage content
- 🔒 Self-hostable solution
- 🌐 Global real-time information

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/stone-lyl/lobchat-searxng-search-plugin.git
    ```
2. Navigate to the repository:
    ```bash
    cd lobchat-searxng-search-plugin
    ```
3. Install dependencies:
    ```bash
    bun install
    ```
4. Start the development server:
    ```bash
    bun run dev
    ```
5. deploy the plugin in docker:
    using the `Dockerfile` provided.

## Usage

1. Open the LobeChat web app:
    - Go to [https://lobechat.com](https://lobechat.com)
2. Add the plugin:
    - Click on the "Plugin Store" button.
    - Select "LobeChat SearxNG Search Plugin" from the list.
3. You should configure your SearxNG settings.yml to allow JSON formats.[SearxNG Settings](https://github.com/searxng/searxng/discussions/3542)
4. Enter the BASE_URL for your SearxNG link
![Image](https://github.com/user-attachments/assets/ffcc271f-1a09-4131-9d12-a9323287df18)
5. Open the LobeChat conversation interface to use it.
![searxng-video](https://github.com/user-attachments/assets/deaf8284-c3f1-4b09-99a0-2896fb66667a)


## Prerequisites

- [Bun](https://bun.sh) v1.1.4 or later
- Node.js v18+
- Docker (optional)