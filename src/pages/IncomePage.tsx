import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { IncomeForm } from '../components/IncomeForm'
import { useIncome } from '../hooks/useIncome'
import type { Income, IncomeInput, RecurrenceFrequency } from '../types/income'

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  one_time: 'One time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export function IncomePage() {
  const { incomes, loading, error, addIncome, editIncome, removeIncome } = useIncome()
  const [showForm, setShowForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)

  async function handleCreate(input: IncomeInput) {
    await addIncome(input)
    setShowForm(false)
  }

  async function handleUpdate(input: IncomeInput) {
    if (!editingIncome) return
    await editIncome(editingIncome.id, input)
    setEditingIncome(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this income?')) return
    await removeIncome(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Income</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}>Add income</Button>}
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 text-base font-medium text-slate-900">New income</h2>
          <IncomeForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {editingIncome && (
        <Card>
          <h2 className="mb-4 text-base font-medium text-slate-900">Edit income</h2>
          <IncomeForm
            initialValues={editingIncome}
            onSubmit={handleUpdate}
            onCancel={() => setEditingIncome(null)}
          />
        </Card>
      )}

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && incomes.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">No income yet. Add your first one to get started.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {incomes.map((income) => (
          <Card key={income.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-900">{income.label}</p>
              <p className="text-sm text-slate-500">
                €{income.amount.toFixed(2)} · {frequencyLabels[income.frequency]} · from {income.start_date}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditingIncome(income)}>
                Edit
              </Button>
              <Button variant="secondary" onClick={() => handleDelete(income.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
