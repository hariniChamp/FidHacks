# Flourish

**Females investing in females.** Your first money moves companion.

Built for Fidelity's "Smart Money Moves" challenge at FidHacks 2026: helping early career women build smart money habits, connect finances to career growth, build community, and feel confident making their first money moves.

## Architecture

```
flourish/
  frontend/   React 18 + Vite + Tailwind single-page app
  backend/    Zero-dependency Java 21 HTTP server (runs with `java Server.java`)
  data/       Mock client data store (JSON) read and written by the backend
```

- The **frontend** renders the product: portfolio hub, Discover, the AI news
  translator, and the coach with After Dark mode.
- The **backend** does three jobs: proxies chat requests to the Anthropic API
  (so the key never reaches the browser), serves mock client account data from
  `/data`, and persists saved interests back into `/data`.
- The **data** folder stands in for a production database. Client data is
  hardcoded JSON for the demo; the backend reads and writes it like a store.

## Running it

Backend (needs Java 11+, no build tools required):

```bash
cd backend
cp .env.example .env      # add your Anthropic API key
java Server.java
```

Frontend (in a second terminal):

```bash
cd frontend
npm install
npm run dev
```

Open the printed URL. Every AI feature works live through the backend; if the
backend is offline or has no key, the app still runs and AI features fall back
to static demo responses.

## AI + RAG

Claude (claude-sonnet-4-6) powers the news translator, discover briefings,
coach chat, portfolio health reads, and Quick Prep. Prompts are grounded in a
curated knowledge base (see `data/knowledge-base.json` and
`GET /api/knowledge`) and personalized with the client profile, holdings, and
saved interests. Guardrails keep every answer educational: no buy or sell
recommendations. In this prototype, generation is live and retrieval is
represented by the curated corpus rather than a deployed vector store.

## API

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET  | /api/health | liveness check |
| POST | /api/chat | Anthropic proxy (key stays server-side) |
| GET  | /api/client/{id} | mock client account data |
| POST | /api/client/{id}/interests | persist saved interests |
| GET  | /api/knowledge | coach knowledge base |

## Notes for judges

24-hour hackathon prototype. Holdings, correlations, and community posts are
sample data, not real accounts. Nothing here is investment advice.
