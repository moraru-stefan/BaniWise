import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SavingsGoal, SavingsGoalInput } from '../types/savingsGoal'
import { Button } from './Button'

interface SavingsGoalFormProps {
  initialValues?: SavingsGoal
  onSubmit: (input: SavingsGoalInput) => Promise<void>
  onCancel?: () => void
}

export function SavingsGoalForm({ initialValues, onSubmit, onCancel }: SavingsGoalFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(initialValues?.target_amount?.toString() ?? '')
  const [currentAmount, setCurrentAmount] = useState(initialValues?.current_amount?.toString() ?? '0')
  const [monthlyContribution, setMonthlyContribution] = useState(
    initialValues?.monthly_contribution?.toString() ?? '0',
  )
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)

    await onSubmit({
      name,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      monthly_contribution: Number(monthlyContribution),
    })

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Goal name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="target_amount" className="block text-sm font-medium text-slate-700">
          Target amount (€)
        </label>
        <input
          id="target_amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="current_amount" className="block text-sm font-medium text-slate-700">
          Current amount (€)
        </label>
        <input
          id="current_amount"
          type="number"
          step="0.01"
          min="0"
          required
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="monthly_contribution" className="block text-sm font-medium text-slate-700">
          Monthly contribution (€, optional)
        </label>
        <input
          id="monthly_contribution"
          type="number"
          step="0.01"
          min="0"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
