import type { RecurrenceFrequency } from '../types/recurrence'

interface RecurringAmount {
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
}

/** Approximate monthly equivalent of a recurring amount. Not meaningful for one-time amounts. */
export function monthlyEquivalent(amount: number, frequency: RecurrenceFrequency): number {
  switch (frequency) {
    case 'weekly':
      return (amount * 52) / 12
    case 'monthly':
      return amount
    case 'yearly':
      return amount / 12
    case 'one_time':
      return 0
    default: {
      const exhaustiveCheck: never = frequency
      throw new Error(`Unhandled frequency: ${exhaustiveCheck}`)
    }
  }
}

export function getDaysInMonth(year: number, month: number): number {
  // Day 0 of "next month" is the last day of "month" -- handles Feb 28/29 automatically
  return new Date(year, month, 0).getDate()
}

/** How much this item contributes to the given month's total. */
export function getMonthlyContribution(item: RecurringAmount, year: number, month: number): number {
  const start = new Date(item.start_date)

  if (item.frequency === 'one_time') {
    const matchesMonth = start.getFullYear() === year && start.getMonth() === month - 1
    return matchesMonth ? item.amount : 0
  }

  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)

  if (start > monthEnd) return 0
  if (item.end_date && new Date(item.end_date) < monthStart) return 0

  return monthlyEquivalent(item.amount, item.frequency)
}

export function sumMonthlyContributions(items: RecurringAmount[], year: number, month: number): number {
  return items.reduce((total, item) => total + getMonthlyContribution(item, year, month), 0)
}

export interface BudgetSummary {
  income: number
  expenses: number
  remaining: number
  dailyAllowance: number
}

export function calculateBudgetSummary(
  incomes: RecurringAmount[],
  expenses: RecurringAmount[],
  year: number,
  month: number,
): BudgetSummary {
  const income = sumMonthlyContributions(incomes, year, month)
  const expensesTotal = sumMonthlyContributions(expenses, year, month)
  const remaining = income - expensesTotal
  const dailyAllowance = remaining / getDaysInMonth(year, month)

  return { income, expenses: expensesTotal, remaining, dailyAllowance }
}
