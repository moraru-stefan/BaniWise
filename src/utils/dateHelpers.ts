export function shiftMonth(year: number, month: number, delta: number) {
  const zeroBased = month - 1 + delta
  const newYear = year + Math.floor(zeroBased / 12)
  const newMonth = (((zeroBased % 12) + 12) % 12) + 1
  return { year: newYear, month: newMonth }
}
