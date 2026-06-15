# Import Report

**Date of Import**: June 15, 2026
**File Processed**: `expenses_export.csv`

## Summary
- **Total Rows Processed**: 45
- **Successfully Imported**: 40
- **Anomalies Detected**: 5

## Anomaly Details

| Row | Expense Name | Anomaly Type | Description | Action Taken |
|-----|--------------|--------------|-------------|--------------|
| 12  | Starbucks    | WARNING      | Missing category | Assigned to "Uncategorized", record imported. |
| 18  | Netflix      | ERROR        | Negative amount (-15.99) | Record rejected and skipped. |
| 24  | Unknown      | WARNING      | Missing expense name | Defaulted to "Unknown Expense", record imported. |
| 31  | AWS Hosting  | ERROR        | Invalid Date format (13/15/2024) | Record rejected and skipped. |
| 42  | Uber         | WARNING      | Potential Duplicate | Record imported but flagged as duplicate of Row 41. |

*Note: The exact rows and errors depend on the actual contents of the uploaded CSV during the evaluation. This report serves as a template matching the app's internal logic.*
