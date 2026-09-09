import type { RecurrenceFrequency } from '../types/recurrence'

interface RecurringAmount {
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
}

// Supabase returns "date" columns as plain "YYYY-MM-DD" strings. new Date(string)
// parses those as UTC midnight, which can shift the day when compared against a
// Date built from local year/month/day -- so we parse manually instead.
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Day-of-month (1-31) of every occurrence of this item within the given month. */
export function getOccurrenceDays(item: RecurringAmount, year: number, month: number): number[] {
  const start = parseLocalDate(item.start_date)
  const end = item.end_date ? parseLocalDate(item.end_date) : null
  const daysInMonth = new Date(year, month, 0).getDate()
  const days: number[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month - 1, day)

    if (item.frequency === 'one_time') {
      if (current.getTime() === start.getTime()) days.push(day)
      continue
    }

    if (current < start) continue
    if (end && current > end) continue

    const matches =
      (item.frequency === 'monthly' && current.getDate() === start.getDate()) ||
      (item.frequency === 'yearly' &&
        current.getDate() === start.getDate() &&
        current.getMonth() === start.getMonth()) ||
      (item.frequency === 'weekly' && current.getDay() === start.getDay())

    if (matches) days.push(day)
  }

  return days
}

export function getDailyTotals(expenses: RecurringAmount[], year: number, month: number): Map<number, number> {
  const totals = new Map<number, number>()

  for (const expense of expenses) {
    for (const day of getOccurrenceDays(expense, year, month)) {
      totals.set(day, (totals.get(day) ?? 0) + expense.amount)
    }
  }

  return totals
}

export function getExpensesOnDay<T extends RecurringAmount>(
  expenses: T[],
  year: number,
  month: number,
  day: number,
): T[] {
  return expenses.filter((expense) => getOccurrenceDays(expense, year, month).includes(day))
}
