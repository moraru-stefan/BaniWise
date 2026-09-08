import { useEffect, useState } from 'react'
import { fetchCategories } from '../services/categoriesService'
import type { Category } from '../types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading, error }
}
