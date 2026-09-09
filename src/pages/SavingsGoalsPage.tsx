import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { SavingsGoalForm } from '../components/SavingsGoalForm'
import { useSavingsGoals } from '../hooks/useSavingsGoals'
import type { SavingsGoal, SavingsGoalInput } from '../types/savingsGoal'
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

export function SavingsGoalsPage() {
  const { goals, loading, error, addGoal, editGoal, removeGoal } = useSavingsGoals()
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)

  async function handleCreate(input: SavingsGoalInput) {
    await addGoal(input)
    setShowForm(false)
  }

  async function handleUpdate(input: SavingsGoalInput) {
    if (!editingGoal) return
    await editGoal(editingGoal.id, input)
    setEditingGoal(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this savings goal?')) return
    await removeGoal(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Savings Goals</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}>Add goal</Button>}
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 text-lg font-medium text-slate-900">New savings goal</h2>
          <SavingsGoalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {editingGoal && (
        <Card>
          <h2 className="mb-4 text-lg font-medium text-slate-900">Edit savings goal</h2>
          <SavingsGoalForm initialValues={editingGoal} onSubmit={handleUpdate} onCancel={() => setEditingGoal(null)} />
        </Card>
      )}

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && goals.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">No savings goals yet. Add your first one to get started.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {goals.map((goal) => {
          const progress = calculateSavingsProgress(
            goal.current_amount,
            goal.target_amount,
            goal.monthly_contribution,
          )
          return (
            <Card key={goal.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{goal.name}</p>
                  <p className="text-sm text-slate-500">
                    €{goal.current_amount.toFixed(2)} of €{goal.target_amount.toFixed(2)}
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {progress.estimatedMonthsRemaining !== null && progress.estimatedCompletionMonth
                      ? `Estimated ~${progress.estimatedMonthsRemaining} month${
                          progress.estimatedMonthsRemaining === 1 ? '' : 's'
                        } left, around ${monthNames[progress.estimatedCompletionMonth.month - 1]} ${
                          progress.estimatedCompletionMonth.year
                        }. This is just an estimate based on your numbers, not financial advice.`
                      : progress.remainingAmount === 0
                        ? 'Goal reached!'
                        : 'Add a monthly contribution to see an estimate.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditingGoal(goal)}>
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(goal.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
