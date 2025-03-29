# AI-Friendly Expense Tracker

A modern, feature-rich expense tracking application built with React, TypeScript, and Tailwind CSS. This application helps users manage their expenses, track budgets, and generate detailed financial reports.

![Expense Tracker Screenshot](https://unsplash.com/photos/person-using-laptop-on-white-wooden-table-iusJ25iYu1c?w=1200&h=630&fit=crop)

## Features

- 📊 **Dashboard Overview**
  - Total expenses summary
  - Monthly trends and analytics
  - Quick action buttons
  - Category-wise expense breakdown

- 💰 **Expense Management**
  - Add, edit, and delete expenses
  - Attach receipts via URL
  - Categorize expenses
  - Mark tax-deductible items
  - Multiple payment methods support

- 🔄 **Recurring Expenses**
  - Set up monthly, quarterly, or yearly recurring expenses
  - Automatic expense generation
  - Flexible date range management
  - End date configuration

- 📅 **Budget Planning**
  - Set category-wise budgets
  - Monthly and yearly budget tracking
  - Warning notifications for budget thresholds
  - Visual progress indicators

- 📈 **Reports and Analytics**
  - Detailed expense reports
  - Category-wise breakdown
  - Export data in multiple formats
  - Tax deduction summaries

- 🎨 **Modern UI/UX**
  - Clean, intuitive interface
  - Dark mode support
  - Responsive design
  - Accessible components

## Technology Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Key Components

- **Dashboard**: Main overview page with expense summaries and quick actions
- **ExpenseForm**: Form for adding and editing expenses
- **ExpenseList**: Tabular view of all expenses with search and filter
- **BudgetForm**: Budget creation and management interface
- **RecurringExpenseForm**: Setup recurring expense patterns
- **ExpenseReport**: Detailed financial reports and analytics

## Features in Detail

### Expense Management
- Add detailed expense entries with categories
- Attach receipt images via URLs
- Mark expenses as tax-deductible
- Multiple payment method support
- Rich text descriptions and notes

### Budget Tracking
- Set monthly or yearly budgets
- Category-wise budget allocation
- Visual progress tracking
- Customizable warning thresholds
- Budget vs actual comparison

### Recurring Expenses
- Configure expenses that repeat
- Multiple frequency options
- Optional end date setting
- Automatic expense generation
- Easy management interface

### Reporting
- Export expenses to CSV
- Generate summary reports
- Tax deduction reports
- Category-wise analysis
- Custom date range filtering

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
