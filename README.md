# TejastraX Chatbot 🚀

A modern, real-time, secure AI chat application built with React, Apollo, and Nhost/Hasura GraphQL. TejastraX delivers a polished chat experience with authentication, live updates, markdown/code rendering, and thoughtful UX.

---

### ✨ Live Demo

- Deployed Site: https://tejastrax-chatbot.netlify.app/

---
## About

TejastraX is a full-stack AI assistant designed for fast, context-aware conversations. It uses a serverless architecture with GraphQL end-to-end. The frontend never exposes AI keys directly—messages are sent via a secure Hasura Action to a backend workflow that calls the model and persists results.

---
## Key Features

- Secure auth with email/password (Nhost Auth)
- Per-user data isolation with Row-Level Security (RLS)
- Real-time chat via GraphQL Subscriptions
- Markdown rendering with syntax-highlighted code blocks and copy-to-clipboard
- Chat management: create, rename, delete with confirmation
- Edit your last user message and regenerate the response
- Responsive UI with light/dark theme, smooth transitions (Framer Motion)
- Clean, focused chat layout with collapsible sidebar

---
## Tech Stack

- Frontend: React 18 (Vite), Tailwind CSS, Framer Motion
- State/Data: Apollo Client, GraphQL
- Backend (BaaS): Nhost (Postgres + Hasura GraphQL + Auth)
- Real-time: GraphQL Subscriptions
- Automation/AI middleware: Hasura Action → secure backend workflow (e.g., n8n)
- Deployment: Netlify

---
## Architecture Overview

1) Frontend (Netlify): React app talks only to GraphQL using Apollo and Nhost SDKs.
2) API & DB (Nhost/Hasura): Authenticated GraphQL with RLS policies to restrict data per user.
3) Hasura Action: Frontend calls a custom mutation `sendMessage` instead of hitting the AI directly.
4) Secure workflow (e.g., n8n): Validates user/chat, fetches history, calls the AI provider, writes the assistant reply back via GraphQL, returns the final text.

---
## App Structure (high level)

- Routes: `/sign-in`, `/sign-up`, `/` (protected dashboard)
- Core UI: `ChatList` (sidebar), `MessageView` (chat), `ProtectedRoute`
- GraphQL:
    - Query: `GetChats`
    - Subscription: `MessagesSubscription(chat_id)`
    - Mutations: `CreateChat`, `UpdateChatTitle`, `DeleteChat`, `InsertUserMessage`, `UpdateMessage`, `DeleteMessage`
    - Action: `sendMessage(chat_id, message)` → triggers backend workflow

---
## Quick Start (Local)

Prerequisites
- Node.js LTS and npm
- An Nhost project (provides Hasura GraphQL, Postgres, and Auth)

1) Install dependencies
```
npm install
```

2) Configure environment
- Create a `.env.local` file in the project root with your Nhost details:
```
VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
VITE_NHOST_REGION=your-nhost-region
```

3) Backend setup (Nhost/Hasura)
- Create tables (suggested):
    - `chats`: id (uuid, pk), user_id (uuid), title (text), created_at (timestamptz)
    - `messages`: id (uuid, pk), chat_id (uuid, fk), user_id (uuid), role (text: 'user'|'assistant'), content (text), created_at (timestamptz)
- Enable RLS so users only see their own chats/messages.
- Create a Hasura Action named `sendMessage` matching the variables used in the app:
    - Input: `chat_id: uuid!`, `message: String!`
    - Handler: your secure workflow URL (e.g., n8n)
    - The handler should fetch history, call your AI provider, and insert an assistant message via GraphQL.

4) Run the app
```
npm run dev
```

5) Build/Preview
```
npm run build
npm run preview
```

---
## Deployment (Netlify)

- Connect the repo or deploy the build folder.
- Set environment variables in Netlify site settings:
    - `VITE_NHOST_SUBDOMAIN`
    - `VITE_NHOST_REGION`
- Build command: `npm run build`
- Publish directory: `dist`

---
## Notable UI/UX Details

- Elegant hero screen when no chat is selected with quick-start prompts
- Theme toggle in the sidebar/header and auth screens
- Animated branding (`LogoTejastraX`) and tasteful motion
- Code blocks are highlighted and include a one-click copy button

---
## Credits

Built with ❤️ as TejastraX. UI refinements and animations by Souvik Senapati.

---
## License

This project is provided as-is for educational and demo purposes. Add a LICENSE file if you intend to distribute under a specific license.