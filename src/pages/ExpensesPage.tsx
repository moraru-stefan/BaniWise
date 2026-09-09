import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ExpenseForm } from '../components/ExpenseForm'
import { useCategories } from '../hooks/useCategories'
import { useExpenses } from '../hooks/useExpenses'
import type { Expense, ExpenseInput } from '../types/expense'
import type { RecurrenceFrequency } from '../types/recurrence'

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  one_time: 'One time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export function ExpensesPage() {
  const { expenses, loading, error, addExpense, editExpense, removeExpense } = useExpenses()
  const { categories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  function categoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId
  }

  async function handleCreate(input: ExpenseInput) {
    await addExpense(input)
    setShowForm(false)
  }

  async function handleUpdate(input: ExpenseInput) {
    if (!editingExpense) return
    await editExpense(editingExpense.id, input)
    setEditingExpense(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    await removeExpense(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Expenses</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}>Add expense</Button>}
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 text-lg font-medium text-slate-900">New expense</h2>
          <ExpenseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {editingExpense && (
        <Card>
          <h2 className="mb-4 text-lg font-medium text-slate-900">Edit expense</h2>
          <ExpenseForm
            initialValues={editingExpense}
            onSubmit={handleUpdate}
            onCancel={() => setEditingExpense(null)}
          />
        </Card>
      )}

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && expenses.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">No expenses yet. Add your first one to get started.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-900">{expense.label}</p>
              <p className="text-sm text-slate-500">
                €{expense.amount.toFixed(2)} · {categoryName(expense.category_id)} ·{' '}
                {frequencyLabels[expense.frequency]} · from {expense.start_date}
              </p>
              {expense.notes && <p className="mt-1 text-sm text-slate-400">{expense.notes}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditingExpense(expense)}>
                Edit
              </Button>
              <Button variant="secondary" onClick={() => handleDelete(expense.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
