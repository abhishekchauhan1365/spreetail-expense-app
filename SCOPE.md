# SCOPE.md - Anomaly Log & Database Schema

## Anomaly Log

During the development and testing of the CSV importer, several data anomalies were identified in the provided dataset. Here is how they were handled:

1. **Missing Expense Names**:
   - **Problem**: Some rows were missing the expense name (e.g., Starbucks transaction without a name).
   - **Action Taken**: Tagged as a `WARNING`. The record is imported with the name "Unknown Expense", and a flag is added to the anomaly report.

2. **Negative/Invalid Amounts**:
   - **Problem**: Some rows had negative amounts (e.g., -50.00 for Netflix) or non-numeric values.
   - **Action Taken**: Tagged as an `ERROR`. The row is rejected and not imported into the database. Listed in the anomaly report.

3. **Future or Invalid Dates**:
   - **Problem**: Dates in the future or unparseable formats.
   - **Action Taken**: Tagged as an `ERROR`. The row is rejected. Dates must be strictly parsed to ensure accurate monthly rollups.

4. **Duplicate Transactions**:
   - **Problem**: Identical transactions appearing multiple times.
   - **Action Taken**: Tagged as a `WARNING`. The application currently imports them but flags them as potential duplicates based on exact matches of date, amount, and name.

5. **Missing Categories**:
   - **Problem**: Categories were empty for some valid expenses.
   - **Action Taken**: Tagged as a `WARNING`. The expense is categorized as "Uncategorized".

## Database Schema

We used Prisma with a PostgreSQL database.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Expense {
  id          String   @id @default(uuid())
  date        DateTime
  amount      Float
  category    String
  name        String
  description String?
  createdAt   DateTime @default(now())
}
```
