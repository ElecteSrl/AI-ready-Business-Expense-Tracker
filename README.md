# AI-ready Business Expense Tracker

A small, local-first expense tracker for a business or a freelancer: expenses, budgets, recurring costs, a monthly forecast, and exports clean enough to hand to an analytics tool. Everything stays in the browser (localStorage); there is no account and no server.

**Status:** maintained as a utility, not a product. Issues and pull requests are read; features are added when someone needs them.

## What "AI-ready" means here

The point of the app is the data it leaves behind, not the screens. Every record is a flat, typed row (date, amount, category, payment method, tax-deductible flag, tags, notes), and the CSV export writes exactly those columns with ISO dates and two-decimal amounts. That is the shape a forecasting or analytics service ingests without cleaning. The dashboard's own forecast is a three-month linear regression with an R² confidence figure: enough to see the direction, deliberately not more.

If you want a real forecast, a report or a deck from the same data, export the CSV and upload it to the [ELECTE platform](https://platform.electe.net), which is what this app was built next to.

## Features

- **Dashboard** with monthly totals, a category breakdown, and a next-month forecast card.
- **Expenses** with categories, payment methods, receipt links, tax-deductible flag, tags and notes; search and filters.
- **Recurring expenses** (monthly, quarterly, yearly) generated automatically, with an optional end date.
- **Budgets** per category, monthly or yearly, with warning thresholds.
- **Exports**: CSV of the filtered expenses, a plain-text summary report, and a tax-deduction report per year.
- **Dark mode**, keyboard navigation, responsive layout.

## Quickstart

```bash
git clone https://github.com/ElecteSrl/AI-ready-Business-Expense-Tracker.git
cd AI-ready-Business-Expense-Tracker
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` writes a static site to `dist/`; `npm run lint` runs ESLint.

Data lives in the browser's localStorage (up to 1,000 expenses or 5 MB). Clearing site data clears the expenses: export first.

## CSV format

```
Date,Amount,Category,Description,Payment Method,Tax Deductible,Receipt URL,Tags,Notes
2026-09-01,120.00,software,"Design tool subscription",credit_card,Yes,,saas;design,
```

Dates are ISO (`YYYY-MM-DD`), amounts have two decimals and no currency symbol, tags are `;`-separated, free text is quoted.

## Stack

React 18, TypeScript, Vite, Tailwind CSS, Recharts, date-fns, Lucide icons.

## Project structure

```
src/
├── components/   # dashboard, forms, lists, export dialog, forecast card
├── hooks/        # theme, loading state, keyboard navigation
├── utils/        # storage, budgets, analytics (forecast), export, search
├── types.ts
└── App.tsx
```

## License

[MIT](LICENSE) © ELECTE S.R.L.
