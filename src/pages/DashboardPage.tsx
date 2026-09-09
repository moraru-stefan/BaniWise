import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DonutChart } from '../components/DonutChart'
import { useCategories } from '../hooks/useCategories'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { useSavingsGoals } from '../hooks/useSavingsGoals'
import { calculateBudgetSummary, getCategoryBreakdown } from '../utils/budgetCalculations'
import { shiftMonth } from '../utils/dateHelpers'
import { calculateSavingsProgress } from '../utils/savingsCalculations'

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

const CHART_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#64748b']

export function DashboardPage() {
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })

  const { incomes, loading: incomeLoading, error: incomeError } = useIncome()
  const { expenses, loading: expensesLoading, error: expensesError } = useExpenses()
  const { categories, loading: categoriesLoading } = useCategories()
  const { goals, loading: goalsLoading } = useSavingsGoals()

  const loading = incomeLoading || expensesLoading || categoriesLoading || goalsLoading
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-base font-medium text-slate-900">Spending by category</h2>
              {breakdown.length === 0 ? (
                <p className="text-sm text-slate-500">No expenses this month.</p>
              ) : (
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <DonutChart
                    data={breakdown.map((item, index) => ({
                      label: categoryName(item.categoryId),
                      value: item.amount,
                      color: CHART_COLORS[index % CHART_COLORS.length],
                    }))}
                  />
                  <ul className="flex w-full flex-col gap-2">
                    {breakdown.map((item, index) => (
                      <li key={item.categoryId} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-700">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          {categoryName(item.categoryId)}
                        </span>
                        <span className="font-medium text-slate-900">€{item.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="mb-4 text-base font-medium text-slate-900">Savings goals</h2>
              {goals.length === 0 ? (
                <p className="text-sm text-slate-500">No savings goals yet.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {goals.map((goal) => {
                    const progress = calculateSavingsProgress(
                      goal.current_amount,
                      goal.target_amount,
                      goal.monthly_contribution,
                    )
                    return (
                      <li key={goal.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-900">{goal.name}</span>
                          <span className="text-slate-500">{progress.progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${progress.progressPercent}%` }}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
