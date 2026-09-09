import { useCallback, useEffect, useState } from 'react'
import {
  createSavingsGoal,
  deleteSavingsGoal,
  fetchSavingsGoals,
  updateSavingsGoal,
} from '../services/savingsGoalsService'
import type { SavingsGoal, SavingsGoalInput } from '../types/savingsGoal'
import { useAuth } from './useAuth'

export function useSavingsGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGoals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSavingsGoals()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetching on mount is the intended use of this effect (synchronizing
    // with the Supabase "external system"), so the resulting setState is expected.
    // oxlint-disable-next-line react/set-state-in-effect
    loadGoals()
  }, [loadGoals])

  async function addGoal(input: SavingsGoalInput) {
    if (!user) return
    await createSavingsGoal(input, user.id)
    await loadGoals()
  }

  async function editGoal(id: string, input: SavingsGoalInput) {
    await updateSavingsGoal(id, input)
    await loadGoals()
  }

  async function removeGoal(id: string) {
    await deleteSavingsGoal(id)
    await loadGoals()
  }

  return { goals, loading, error, addGoal, editGoal, removeGoal }
}
