import { useEffect, useState } from 'react'
import { fetchCurrencies } from '../services/currencyService'
import type { Currency } from '../services/currencyService'

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchCurrencies()
      .then(setCurrencies)
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false))
  }, [])

  return { currencies, loading, error }
}
