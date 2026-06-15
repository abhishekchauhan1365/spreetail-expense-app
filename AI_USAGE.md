# AI_USAGE.md - AI Tools and Prompts

## AI Tools Used
- **DeepMind Antigravity (Gemini/Claude)**: Used as an autonomous coding assistant within the IDE to generate boilerplate, refactor components, and implement the database schema.
- **V0 by Vercel (Inspiration)**: Used for UI/UX inspiration for modern dashboard layouts.

## Key Prompts Used
- *"Create a Next.js landing page with a modern dark theme, hero section, and feature cards."*
- *"Implement a Prisma schema for an expense tracker with fields for date, amount, category, and name."*
- *"Write an API route in Next.js to bulk insert an array of parsed CSV records into the Neon PostgreSQL database."*
- *"Design an importer UI with a drag-and-drop zone and a table displaying validation errors/warnings."*

## Instances where AI Produced Something Wrong

1. **Incorrect Prisma Client Import in Next.js Edge Runtime**:
   - **What happened**: The AI tried to use the standard `@prisma/client` directly inside a Next.js middleware/edge API route, which caused a runtime error because standard Prisma relies on Node.js APIs not available in the edge runtime.
   - **How I caught it**: Vercel build logs threw an error regarding unsupported modules in the Edge environment.
   - **What I changed**: I moved the database logic to a standard Node.js serverless API route instead of an edge route.

2. **Faulty Date Parsing Logic**:
   - **What happened**: The AI generated a basic `new Date(row.date)` for parsing CSV dates. However, the CSV contained dates in `DD/MM/YYYY` format, and JS `new Date()` expects `MM/DD/YYYY` or ISO format. This led to "Invalid Date" errors for valid days past the 12th of the month.
   - **How I caught it**: During the CSV import test, all expenses from the 13th onward were flagged as anomalies (Invalid Date).
   - **What I changed**: I implemented a custom date parsing utility function that explicitly splits the string by `/` and constructs the date using `new Date(year, month - 1, day)`.

3. **Client-Side Environment Variable Leakage**:
   - **What happened**: The AI attempted to connect to the Neon database directly from a React Client Component to verify connection status, embedding the `DATABASE_URL` in the frontend code.
   - **How I caught it**: Noticed the database URL was visible in the network tab and the code had `process.env.DATABASE_URL` in a `'use client'` file.
   - **What I changed**: Moved all database connection and querying logic strictly to the Next.js API routes (`src/app/api/...`), ensuring the frontend only makes HTTP requests to our own API.
