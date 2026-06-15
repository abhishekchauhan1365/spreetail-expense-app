# Decisions Log

This document records the significant technical and product decisions made during the development of the Shared Expenses App, including options considered and the rationale behind the final choices.

## 1. Tech Stack Selection
**Decision:** Use Next.js (App Router), Tailwind CSS, PostgreSQL, and Prisma.
- **Options Considered:** 
  1. *React (Vite) + Express.js backend + MongoDB:* Good for fast iteration but requires managing two separate codebases and repositories, making deployment slightly more complex. Non-relational DBs violate the assignment requirements.
  2. *Next.js + Prisma + PostgreSQL:* Full-stack framework with built-in API routes. Prisma provides excellent type safety and schema migrations. PostgreSQL satisfies the strict "Use relational DBs only" requirement.
- **Why we chose it:** Next.js allows us to build and deploy everything from a single repository quickly. Prisma with PostgreSQL ensures strict data integrity, which is crucial for financial applications and data imports.

## 2. Handling Missing/Unknown Users in the CSV
**Decision:** Create a deterministic mapping of names and auto-create missing core members, but map "guest" members to their hosts.
- **Options Considered:**
  1. *Fail the import* if an unknown user is found. (Violates "a crashed import... is a failing answer").
  2. *Silently create every new name* as a new user.
  3. *Map known variations* (`Priya S` -> `Priya`, `rohan ` -> `Rohan`) and assign guests (`Dev's friend Kabir`) to the core member (`Dev`).
- **Why we chose it:** Option 3 keeps the group roster clean. The prompt states "members join and leave", but adding a guest for a single day shouldn't permanently alter the core roster. Kabir's expenses are logically Dev's responsibility.

## 3. Currency Conversion Strategy
**Decision:** Convert USD to INR at the point of import using a fixed exchange rate (e.g., 1 USD = 83 INR) while storing the original currency and amount for transparency.
- **Options Considered:**
  1. *Store in USD and calculate balances in multiple currencies.* (Out of scope for the time limit, makes the UI extremely complex).
  2. *Convert silently and discard the original USD amount.* (Violates transparency).
  3. *Convert at import time, store both.* 
- **Why we chose it:** Addresses Priya's specific request ("The sheet pretends a dollar is a rupee. That can't be right.") while keeping the global balance calculation simple (everything is normalized to INR).

## 4. Conflict Resolution (Duplicate/Conflicting Rows)
**Decision:** Flag highly similar rows for manual user approval before finalizing the import.
- **Options Considered:**
  1. *Always keep the first row, discard the second.*
  2. *Always keep the row with the higher amount.*
  3. *Flag for user review.*
- **Why we chose it:** Meera explicitly requested: "Clean up the duplicates — but I want to approve anything the app deletes or changes." Silent guessing is a failing answer per the prompt. The app will generate an "Import Report" that flags Row 5 vs 6 and Row 24 vs 25 as `REQUIRES_APPROVAL`.

## 5. Fractional Currency (Rounding)
**Decision:** Round all final split amounts to 2 decimal places using standard rounding rules.
- **Options Considered:**
  1. *Keep high precision floats in DB.* (Can cause floating-point math errors later).
  2. *Round to nearest whole number.* (Can lose significant amounts over many transactions).
  3. *Round to 2 decimal places.*
- **Why we chose it:** Standard financial practice. `899.995` becomes `900.00`.

## 6. Balance Calculation Approach
**Decision:** Calculate balances dynamically on-the-fly from the `ExpenseSplit` and `Settlement` tables rather than storing a running total on the `User` or `GroupMember` model.
- **Options Considered:**
  1. *Running totals:* Update a `balance` field on the user every time an expense is added. (Fast to read, but highly prone to desynchronization bugs if an expense is edited or deleted).
  2. *Dynamic Calculation:* Sum all `amountOwed` minus `amountPaid` every time the dashboard loads.
- **Why we chose it:** Data integrity is paramount. Since the dataset is small for a single group, dynamic calculation is fast enough and guarantees 100% accuracy, satisfying Aisha's request ("Who pays whom, how much, done").

## 7. Former Members (Meera's Departure)
**Decision:** Ignore Meera in any `split_with` arrays for expenses dated after she moved out, redistributing her share.
- **Options Considered:**
  1. *Charge her anyway.* (Violates common sense and the prompt).
  2. *Fail the import.*
  3. *Exclude her and recalculate the split among the remaining active members.*
- **Why we chose it:** Sam asks "Why would March electricity affect my balance?" implying chronological context matters. Meera moving out means she shouldn't pay for April groceries.

## 8. Settlements vs Expenses
**Decision:** Infer settlements from missing split types and keywords (e.g., "paid back").
- **Options Considered:**
  1. *Treat as an equal split expense.* (Would mean Rohan pays himself and Aisha).
  2. *Treat as a settlement.*
- **Why we chose it:** Line 14 is clearly a settlement ("Rohan paid Aisha back"). We set `isSettlement = true` so the balance calculator knows to reduce Rohan's debt to Aisha, rather than treating it as a shared cost.
