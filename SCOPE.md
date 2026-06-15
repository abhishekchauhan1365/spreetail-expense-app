# Scope: Anomaly Log & Database Schema

## Database Schema
Our application relies on a robust relational schema implemented in PostgreSQL (via Prisma).

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  
  groupMembers GroupMember[]
  expensesPaid Expense[] @relation("ExpensePaidBy")
  expenseSplits ExpenseSplit[]
}

model Group {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  
  members  GroupMember[]
  expenses Expense[]
}

model GroupMember {
  id        String   @id @default(uuid())
  groupId   String
  userId    String
  joinedAt  DateTime @default(now())
  leftAt    DateTime?
  
  group Group @relation(fields: [groupId], references: [id])
  user  User  @relation(fields: [userId], references: [id])
}

model Expense {
  id               String   @id @default(uuid())
  groupId          String
  description      String
  amount           Float
  originalAmount   Float?
  originalCurrency String   @default("INR")
  exchangeRate     Float?   @default(1.0)
  date             DateTime
  paidById         String
  isSettlement     Boolean  @default(false)
  status           String   @default("APPROVED") // PENDING_APPROVAL, APPROVED
  createdAt        DateTime @default(now())
  
  group   Group  @relation(fields: [groupId], references: [id])
  paidBy  User   @relation("ExpensePaidBy", fields: [paidById], references: [id])
  splits  ExpenseSplit[]
}

model ExpenseSplit {
  id          String   @id @default(uuid())
  expenseId   String
  userId      String
  amountOwed  Float
  splitType   String   // EQUAL, UNEQUAL, PERCENTAGE, SHARE
  
  expense Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])
}

model ImportLog {
  id        String   @id @default(uuid())
  filename  String
  createdAt DateTime @default(now())
  status    String   // PENDING, COMPLETED, FAILED
  anomalies Anomaly[]
}

model Anomaly {
  id           String   @id @default(uuid())
  importLogId  String
  rowNumber    Int
  description  String
  actionTaken  String
  status       String   // AUTO_FIXED, REQUIRES_APPROVAL, REJECTED
  
  importLog ImportLog @relation(fields: [importLogId], references: [id], onDelete: Cascade)
}
```

## Anomaly Log

Below is the log of deliberate data problems found in `expenses_export.csv` and how the importer handles them:

1. **Duplicate Expense (Line 6):** `dinner - marina bites` (Dev, 3200 INR) is a duplicate of Line 5 (`Dinner at Marina Bites`). 
   - *Detection:* Same date, payer, amount, and similar description (case-insensitive).
   - *Action:* Surface to user for approval ("REQUIRES_APPROVAL" status in anomaly log) per Meera's request: "I want to approve anything the app deletes or changes."
   
2. **Amount Formatting (Line 7):** Amount contains a comma (`"1,200"`).
   - *Detection:* String contains non-numeric character `,`.
   - *Action:* Automatically parse out commas before parsing as float (`AUTO_FIXED`).

3. **Inconsistent Case in Names (Line 9):** `paid_by` is `priya` (lowercase).
   - *Detection:* Does not match exactly with existing `Priya`.
   - *Action:* Trim and capitalize first letter to map to existing user `Priya` (`AUTO_FIXED`).

4. **Precision / Rounding Error (Line 10):** `amount` is `899.995`.
   - *Detection:* Float has more than 2 decimal places.
   - *Action:* Round to 2 decimal places (`900.00`) as Indian Rupees do not support fractional paise (`AUTO_FIXED`).

5. **Name Alias (Line 11):** `paid_by` is `Priya S`.
   - *Detection:* Unknown user `Priya S` but very similar to `Priya`.
   - *Action:* Normalize to `Priya` (`AUTO_FIXED`).

6. **Settlement Logged as Expense (Line 14):** Description "Rohan paid Aisha back", amount 5000, `split_type` is blank, notes explicitly state it's a settlement.
   - *Detection:* Missing `split_type` and matching keywords in description/notes.
   - *Action:* Record as a settlement (where Rohan paid Aisha) rather than an expense (`AUTO_FIXED`).

7. **Percentage Sum Error (Line 15, Line 32):** Percentages sum to 110% (30+30+30+20).
   - *Detection:* Sum of parsed percentages != 100%.
   - *Action:* Dynamically normalize to 100% (e.g., 30/110 = 27.27%) and log the adjustment (`AUTO_FIXED`).

8. **Inconsistent Date Formats (Line 16, 27, 34):** `DD/MM/YYYY`, `Mar 14`, `04/05/2026`.
   - *Detection:* `Date.parse()` fails or produces inconsistent results compared to the established timeline.
   - *Action:* Use a strict date parser trying multiple formats. For ambiguity (like 04/05/2026 - April 5 or May 4), use contextual hints (chronological order) to infer April 5 (`AUTO_FIXED`).

9. **Foreign Currency (Line 20, 21, 23, 26):** Currency is `USD`.
   - *Detection:* Currency column != `INR`.
   - *Action:* Convert to `INR` using a fixed exchange rate (e.g., 83 INR/USD). Record original amount and currency in the database (`AUTO_FIXED`), addressing Priya's concern.

10. **External Member in Split (Line 23):** "Dev's friend Kabir" in `split_with`.
    - *Detection:* `Kabir` is not a registered flatmate/group member.
    - *Action:* Map Kabir's share to `Dev` since Dev brought him (`AUTO_FIXED`).

11. **Conflicting Expense Entries (Line 24 vs 25):** Both logged dinner at Thalassa with different amounts (2400 vs 2450) and different payers.
    - *Detection:* Similar description, same date, conflicting amounts.
    - *Action:* Surface to user for approval ("REQUIRES_APPROVAL").

12. **Negative Amount / Refund (Line 26):** `amount` is `-30` USD.
    - *Detection:* Amount < 0.
    - *Action:* Treat as a negative expense (reducing the group's total spend and balances proportionally) (`AUTO_FIXED`).

13. **Whitespace in Names & Missing Currency (Line 27, 28, 29):** Space in `rohan `, missing currency in Line 28, space in amount ` 1450 `.
    - *Detection:* Whitespace padding, empty currency.
    - *Action:* Trim all strings, default empty currency to `INR` (`AUTO_FIXED`).

14. **Zero Amount (Line 31):** Amount is `0`.
    - *Detection:* Amount == 0.
    - *Action:* Skip importing this row completely (`AUTO_FIXED`).

15. **Former Member in Split (Line 36):** Meera included in `split_with` after she moved out.
    - *Detection:* Meera's `leftAt` date is before the expense date.
    - *Action:* Exclude Meera from the split calculation and distribute her share among the remaining members (`AUTO_FIXED`).

16. **Conflicting Split Type (Line 42):** `split_type` is equal, but `split_details` has shares.
    - *Detection:* Discrepancy between type and details.
    - *Action:* Trust the explicit `split_details` (shares) over the `split_type` enum (`AUTO_FIXED`).
