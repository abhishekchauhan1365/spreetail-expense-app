git init
git config user.email "intern@spreetail.com"
git config user.name "Spreetail Intern"
git add README.md package.json tsconfig.json eslint.config.mjs postcss.config.mjs next.config.ts .gitignore
git commit -m "chore: initialize project and configuration"

git add public/
git commit -m "chore: add public assets"

git add prisma/
git commit -m "feat: setup Prisma schema for PostgreSQL/SQLite"

git add src/lib/
git commit -m "feat: implement CSV importer with anomaly detection logic"

git add src/app/api/
git commit -m "feat: create API routes for importer and dashboard data"

git add src/app/import/
git commit -m "feat: build frontend UI for import report and anomaly surfacing"

git add src/app/dashboard/ src/app/page.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: add dashboard for group balances and main navigation"

git add ../SCOPE.md ../DECISIONS.md ../AI_USAGE.md ../Updated_Assignment_Spreetail.pdf ../expenses_export.csv ../AI_CONTEXT.md ../BUILD_PLAN.md
git commit -m "docs: add assignment deliverables and requirement logs"
