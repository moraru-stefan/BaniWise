import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { useCategories } from '../hooks/useCategories'
import { useExpenses } from '../hooks/useExpenses'
import { getDailyTotals, getExpensesOnDay } from '../utils/calendarCalculations'
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
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthGridDays(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
}

export function CalendarPage() {
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 })
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const { expenses, loading, error } = useExpenses()
  const { categories } = useCategories()

  const dailyTotals = useMemo(
    () => getDailyTotals(expenses, view.year, view.month),
    [expenses, view.year, view.month],
  )
  const gridDays = useMemo(() => getMonthGridDays(view.year, view.month), [view.year, view.month])
  const selectedExpenses = useMemo(
    () => (selectedDay ? getExpensesOnDay(expenses, view.year, view.month, selectedDay) : []),
    [expenses, view.year, view.month, selectedDay],
  )

  function categoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId
  }

  function changeMonth(delta: number) {
    setView((v) => shiftMonth(v.year, v.month, delta))
    setSelectedDay(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {monthNames[view.month - 1]} {view.year}
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => changeMonth(-1)}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => changeMonth(1)}>
            Next
          </Button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <Card>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
              {weekdayLabels.map((label) => (
                <div key={label} className="py-1">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {gridDays.map((day, index) => {
                if (day === null) return <div key={`blank-${index}`} />
                const total = dailyTotals.get(day)
                const isSelected = day === selectedDay
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`flex h-12 cursor-pointer flex-col items-center justify-center rounded-md border text-xs sm:h-16 sm:text-sm ${
                      isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-slate-900">{day}</span>
                    {total !== undefined && (
                      <span className="text-[10px] text-red-600 sm:text-xs">€{total.toFixed(2)}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {selectedDay && (
            <Card>
              <h2 className="mb-4 text-base font-medium text-slate-900">
                {monthNames[view.month - 1]} {selectedDay}, {view.year}
              </h2>
              {selectedExpenses.length === 0 ? (
                <p className="text-sm text-slate-500">No expenses on this day.</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-2">
                    {selectedExpenses.map((expense) => (
                      <li key={expense.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">
                          {expense.label} · {categoryName(expense.category_id)}
                        </span>
                        <span className="font-medium text-slate-900">€{expense.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-slate-200 pt-3 text-sm font-medium text-slate-900">
                    Total: €{(dailyTotals.get(selectedDay) ?? 0).toFixed(2)}
                  </p>
                </>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
