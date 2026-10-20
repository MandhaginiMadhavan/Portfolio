# Mandhagini Madhavan — AI Engineer Portfolio

A cinematic, responsive portfolio for AI Engineer Mandhagini Madhavan, including project case studies and a portfolio-grounded AI assistant.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide icons
- Express
- OpenAI Responses API

## Getting started

```bash
npm install
npm run dev
```

In a second terminal, start the local API server:

```bash
npm run dev:server
```

Open the local URL printed by Vite. Vite proxies `/api` requests to the server on port 8787.

## AI assistant configuration

Copy `.env.example` to `.env`, then set:

```text
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5-mini
```

Load those variables in your shell or hosting provider before starting the server. Never use a `VITE_` prefix for the API key: Vite-prefixed values are exposed to browser code. The key must remain a server-only `OPENAI_API_KEY`.

The assistant uses verified facts from `server/portfolioKnowledge.mjs`. Both Professional and Friendly modes use that same knowledge; only their communication style differs.

## Production build

```bash
npm run build
npm start
```

The production server exposes `/api/chat` and serves the compiled `dist` directory. Deploy it to a Node.js-capable host, configure `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`, `PORT`, and `TRUST_PROXY=true` when the host uses a trusted reverse proxy), then use `npm run build` as the build command and `npm start` as the start command. A static-only host cannot securely run the chatbot endpoint.

Run the chatbot policy and validation tests with:

```bash
npm run test:chat
```

## Content checklist

All unverified personal information is marked with square-bracket placeholders. Before publishing:

1. Replace the portrait placeholder in the About section with a real, optimised image.
2. Add a verified About biography and location.
3. Add accurate project summaries and technology lists for InsightForge, Persona Multiplier AI, Wildfire Detection, and Timesync AI.
4. Add career and education entries with verified dates and descriptions.
5. Replace skill prompts with verified skills.
6. Keep the verified email address, LinkedIn URL, and GitHub URL current.
7. Review metadata in `index.html` and add social preview artwork when available.

No achievements, employers, metrics, dates, credentials, or links have been invented.

## Structure

```text
src/
  components/
    Navbar.tsx
    Reveal.tsx
    SectionHeading.tsx
  App.tsx
  data.ts
  index.css
  main.tsx
```

Reusable content data lives in `src/data.ts`; shared visual and motion primitives live in `src/components`.

## Accessibility

The page includes semantic landmarks, a skip link, keyboard-visible focus states, an accessible mobile navigation toggle, appropriate labels, responsive typography, and reduced-motion support.

The cinematic intro includes a keyboard-accessible Skip Intro control, is skipped automatically when `prefers-reduced-motion` is enabled, and plays only once per browser session.

## Asset attribution

The opening anatomical brain model is adapted from **Brain, Male v1.3** by Kristen Browne and Heidi Schlehlein via [NIH 3D / Human Reference Atlas](https://3d.nih.gov/entries/20960?version=1), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The mesh is simplified for web delivery; its anatomical identity is unchanged.

