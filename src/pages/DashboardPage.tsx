import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { useCategories } from '../hooks/useCategories'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { calculateBudgetSummary, getCategoryBreakdown } from '../utils/budgetCalculations'
import { shiftMonth } from '../utils/dateHelpers'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function DashboardPage() {
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })

  const { incomes, loading: incomeLoading, error: incomeError } = useIncome()
  const { expenses, loading: expensesLoading, error: expensesError } = useExpenses()
  const { categories, loading: categoriesLoading } = useCategories()

  const loading = incomeLoading || expensesLoading || categoriesLoading
  const error = incomeError || expensesError

  const summary = useMemo(
    () => calculateBudgetSummary(incomes, expenses, view.year, view.month),
    [incomes, expenses, view.year, view.month],
  )

  const breakdown = useMemo(
    () => getCategoryBreakdown(expenses, view.year, view.month),
    [expenses, view.year, view.month],
  )

  function categoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {monthNames[view.month - 1]} {view.year}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setView((v) => shiftMonth(v.year, v.month, -1))}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => setView((v) => shiftMonth(v.year, v.month, 1))}>
            Next
          </Button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-500">Income</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">€{summary.income.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Expenses</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">€{summary.expenses.toFixed(2)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Remaining</p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  summary.remaining >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                €{summary.remaining.toFixed(2)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Daily allowance</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">€{summary.dailyAllowance.toFixed(2)}</p>
            </Card>
          </div>

          <Card>
            <h2 className="mb-4 text-base font-medium text-slate-900">Spending by category</h2>
            {breakdown.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses this month.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {breakdown.map((item) => (
                  <li key={item.categoryId} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{categoryName(item.categoryId)}</span>
                    <span className="font-medium text-slate-900">€{item.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
