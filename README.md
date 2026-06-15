# Spreetail Expense App

A full-stack Next.js application designed to import, validate, and visualize monthly expense data.

## Public Deployed URL
https://spreetail-expense.vercel.app/

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/abhishekchauhan1365/spreetail-expense-app.git
   cd expense-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_Z9BAJho3LDCy@ep-super-grass-atyk45f6-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```
4. Run Prisma migrations / generate client:
   ```bash
   npx prisma generate
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Prisma
- Neon Database (PostgreSQL)
- Papaparse (CSV parsing)

## AI Used
- DeepMind Antigravity (Gemini/Claude models) for pair programming and code generation. See `AI_USAGE.md` for more details.
