---
name: /fix
description:
  EXPLICITLY TRIGGERED when user wants to fix code, resolve lint errors, format code, or says "fix",
  "修复", "清理".
---

1. Run pnpm run lint:fix to attempt automatic fixes.
2. Read the terminal output for any remaining errors.
3. If there are errors ESLint cannot auto-fix (e.g., TypeScript type errors, logic errors):
   - Locate the exact file and line number.
   - Read .ai-context/lessons-learned.md to check for relevant historical pitfalls.
   - Directly modify the code to resolve these errors. Do not ask the user how to fix it, just fix
     it.
4. After applying fixes, run pnpm run lint again to ensure it returns zero errors.
