# AI Usage Log

This document outlines how AI was utilized during the development of the Shared Expenses App, including the tools used, key prompts, and instances where the AI's output had to be corrected.

## AI Tools Used
- **Primary Collaborator:** Gemini 3.1 Pro (via Antigravity coding assistant / Cursor IDE).
- **Purpose:** Scaffolding the Next.js project, generating the Prisma schema, and drafting the initial CSV parsing logic.

## Key Prompts
1. *"You are a senior full-stack engineer. I need to build a shared expenses app with a CSV importer in Next.js and Prisma. Here is the CSV format. Please design a Prisma schema that can handle equal, unequal, percentage, and exact share splits, as well as tracking group members joining and leaving."*
2. *"Write a CSV parsing utility using `csv-parse` that detects duplicate rows based on date and amount, and normalizes date formats from `DD/MM/YYYY` and `YYYY-MM-DD` into standard ISO strings."*
3. *"Write an algorithm to calculate exactly who owes whom based on a list of ExpenseSplit and Settlement records, optimizing to minimize the number of transactions."*

## AI Mistakes & Corrections

### Case 1: Incorrect Percentage Normalization
- **What went wrong:** When prompted to handle the anomaly where percentages sum to 110% (Lines 15 and 32), the AI suggested an auto-fix script that simply subtracted the excess 10% from the last person in the array. This would unfairly penalize Meera (reducing her share to 10% while others paid 30%).
- **How I caught it:** I reviewed the unit test output for the CSV parser and noticed the total amounts calculated for Meera didn't reflect a fair proportion of the meal.
- **What I changed:** I discarded the AI's naive subtraction method and implemented a proper proportional normalization algorithm: `(User_Percentage / Total_Percentage) * 100`.

### Case 2: Handling Meera's Departure
- **What went wrong:** The AI wrote a Prisma query to calculate balances by summing up all `ExpenseSplit` records associated with a `groupId`. However, it ignored the `leftAt` timestamp on the `GroupMember` model, meaning Meera was still being assigned parts of expenses that occurred in April.
- **How I caught it:** While manually stepping through the balance calculation for the "March electricity" and "April groceries", Meera's balance was incorrectly decreasing in April.
- **What I changed:** I modified the dynamic balance calculation logic to first filter the `split_with` list based on the expense date: `activeMembers = members.filter(m => m.joinedAt <= expense.date && (!m.leftAt || m.leftAt >= expense.date))`. If a member in the CSV was no longer active, I removed them and redistributed the cost.

### Case 3: Over-engineering the Settlement Algorithm
- **What went wrong:** I asked the AI for a balance calculation algorithm. It generated a highly complex "Debt Simplification" algorithm using Max-Flow Min-Cut on a directed graph to minimize the total number of transactions across the group.
- **How I caught it:** The code was hundreds of lines long, heavily abstracted, and very difficult to understand or explain. Since the assignment explicitly stated, "A polished app you cannot navigate scores lower than a rough app you understand completely," I knew I couldn't use it. Furthermore, Aisha's requirement was simply "Who pays whom, how much, done," not necessarily minimal transactions.
- **What I changed:** I deleted the graph algorithm entirely and wrote a much simpler, deterministic ledger system. It just calculates exactly how much `User A` owes `User B` directly based on individual expenses, resulting in a slightly longer settlement list but 100% transparent and explainable code that directly satisfies Rohan's request ("no magic numbers").
