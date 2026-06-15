# Shared Expenses App

This repository contains the completed assignment for Spreetail: a Shared Expenses App built with Next.js, Prisma, and PostgreSQL (configured for SQLite in local development for ease of setup).

## AI Used
- **AI Tool:** Gemini 3.1 Pro (via Antigravity / Cursor IDE)
- **AI Role:** Primary development collaborator used to scaffold the application, generate the Prisma schema, and write the initial CSV parser.
- **See `AI_USAGE.md`** for detailed prompts, AI mistakes, and how I corrected them.
- **See `SCOPE.md`** for the anomaly log and database schema.
- **See `DECISIONS.md`** for a log of significant technical choices.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Running Locally
1. Clone this repository and navigate to the project directory:
   ```bash
   cd expense-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema (using SQLite locally for immediate testing):
   ```bash
   npx prisma db push
   ```
   *(Note: The assignment requires a relational DB. Prisma is configured to use SQLite out-of-the-box locally, but the code is fully compatible with PostgreSQL. See Deployment for Postgres setup).*

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Data Import
1. Navigate to the `/import` page on the running application.
2. Upload the `expenses_export.csv` file provided in the assignment.
3. The app will generate an **Import Report** highlighting the 12+ anomalies it found and the actions taken.
4. Once processed, you can view the expenses and calculated balances on the Dashboard.

### Deployment (Vercel + PostgreSQL)
To deploy this application to production using a real PostgreSQL database:
1. Push your code to a GitHub repository.
2. Create a new project on [Vercel](https://vercel.com) and link your repository.
3. Go to the **Storage** tab in your Vercel project and provision a new **Postgres** database.
4. Vercel will automatically inject the `DATABASE_URL` environment variable.
5. Update `prisma/schema.prisma` to use `provider = "postgresql"` instead of `sqlite` before pushing to GitHub.
6. Deploy the project. The schema will be automatically synchronized if you add a build step or run `npx prisma db push` during deployment.
