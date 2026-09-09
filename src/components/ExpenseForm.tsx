import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCategories } from '../hooks/useCategories'
import type { Expense, ExpenseInput } from '../types/expense'
import type { RecurrenceFrequency } from '../types/recurrence'
import { Button } from './Button'

interface ExpenseFormProps {
  initialValues?: Expense
  onSubmit: (input: ExpenseInput) => Promise<void>
  onCancel?: () => void
}

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  one_time: 'One time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export function ExpenseForm({ initialValues, onSubmit, onCancel }: ExpenseFormProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const [label, setLabel] = useState(initialValues?.label ?? '')
  const [amount, setAmount] = useState(initialValues?.amount?.toString() ?? '')
  const [categoryId, setCategoryId] = useState(initialValues?.category_id ?? '')
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(initialValues?.frequency ?? 'monthly')
  const [startDate, setStartDate] = useState(initialValues?.start_date ?? '')
  const [endDate, setEndDate] = useState(initialValues?.end_date ?? '')
  const [notes, setNotes] = useState(initialValues?.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)

    await onSubmit({
      label,
      amount: Number(amount),
      category_id: categoryId,
      frequency,
      start_date: startDate,
      end_date: frequency === 'one_time' ? null : endDate || null,
      notes: notes || null,
    })

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-slate-700">
          Label
        </label>
        <input
          id="label"
          type="text"
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
          Amount (€)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={categoriesLoading}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="" disabled>
            {categoriesLoading ? 'Loading...' : 'Select a category'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium text-slate-700">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as RecurrenceFrequency)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {Object.entries(frequencyLabels).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium text-slate-700">
          {frequency === 'one_time' ? 'Date' : 'Start date'}
        </label>
        <input
          id="start_date"
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {frequency !== 'one_time' && (
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-slate-700">
            End date (optional)
          </label>
          <input
            id="end_date"
            type="date"
            value={endDate ?? ''}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={2}
          value={notes ?? ''}
          onChange={(e) => setNotes(e.target.value)}
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
