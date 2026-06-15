# DECISIONS.md - Decision Log

## 1. Choice of Framework: Next.js (App Router)
- **Options Considered**: Next.js, React (Vite) + Express backend, Vanilla JS.
- **Decision**: Next.js with the App Router.
- **Why**: It provides a seamless full-stack experience. API routes can handle the CSV parsing and database logic in the same repository as the frontend, which speeds up development and simplifies deployment on Vercel.

## 2. Database Choice: PostgreSQL (Neon) via Prisma
- **Options Considered**: MongoDB, SQLite, PostgreSQL (Neon).
- **Decision**: PostgreSQL via Neon, using Prisma ORM.
- **Why**: The data is highly structured and relational (expenses, categories, dates). PostgreSQL is robust. Neon offers serverless Postgres which works perfectly with Vercel. Prisma provides excellent type safety and auto-completion, reducing runtime errors.

## 3. CSV Parsing Library: Papaparse
- **Options Considered**: `csv-parser` (Node.js native), `papaparse` (Browser/Node).
- **Decision**: Papaparse.
- **Why**: Papaparse works flawlessly both on the client and server. We opted to parse the file on the client-side to provide immediate anomaly feedback (warnings/errors) before sending the valid data to the backend API. This reduces server load and improves user experience.

## 4. Handling Anomalies (Strict vs. Lenient)
- **Options Considered**:
  1. Strict: Reject the entire file if any anomaly is found.
  2. Lenient: Import everything and flag anomalies in the DB.
  3. Hybrid: Reject critical errors (e.g., invalid amounts) but import and flag minor warnings (e.g., missing categories).
- **Decision**: Hybrid approach.
- **Why**: A strict approach is frustrating for users, while a lenient approach pollutes the database with invalid math. The hybrid approach ensures data integrity (amounts are valid) while maintaining a smooth user experience.

## 5. UI/UX Design
- **Decision**: Adopted a dark-mode, premium aesthetic using Tailwind CSS and Lucide React icons.
- **Why**: To provide a modern, professional feel. Financial dashboards need to be clear, but a polished UI significantly enhances the perceived value of the application.
