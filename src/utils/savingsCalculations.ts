export interface SavingsProgress {
  progressPercent: number
  remainingAmount: number
  estimatedMonthsRemaining: number | null
  estimatedCompletionMonth: { year: number; month: number } | null
}

export function calculateSavingsProgress(
  currentAmount: number,
  targetAmount: number,
  monthlyContribution: number,
): SavingsProgress {
  const remainingAmount = Math.max(targetAmount - currentAmount, 0)
  const progressPercent = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0

  if (monthlyContribution <= 0 || remainingAmount === 0) {
    return { progressPercent, remainingAmount, estimatedMonthsRemaining: null, estimatedCompletionMonth: null }
  }

  const estimatedMonthsRemaining = Math.ceil(remainingAmount / monthlyContribution)
  const today = new Date()
  const target = new Date(today.getFullYear(), today.getMonth() + estimatedMonthsRemaining, 1)

  return {
    progressPercent,
    remainingAmount,
    estimatedMonthsRemaining,
    estimatedCompletionMonth: { year: target.getFullYear(), month: target.getMonth() + 1 },
  }
}
