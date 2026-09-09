import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { useCurrencies } from '../hooks/useCurrencies'
import { fetchExchangeRate } from '../services/currencyService'

export function CurrencyConverterPage() {
  const { currencies, loading: currenciesLoading, error: currenciesError } = useCurrencies()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [result, setResult] = useState<number | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setConverting(true)
    setError(null)
    setResult(null)

    try {
      const { rate } = await fetchExchangeRate(from, to)
      setResult(Number(amount) * rate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Currency Converter</h1>

      <Card className="max-w-md">
        {currenciesError && (
          <p className="mb-4 text-sm text-red-600">Could not load the currency list: {currenciesError}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="from" className="block text-sm font-medium text-slate-700">
                From
              </label>
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                disabled={currenciesLoading}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {currencies.map((currency) => (
                  <option key={currency.iso_code} value={currency.iso_code}>
                    {currency.iso_code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="pb-2 text-slate-400">→</span>

            <div className="flex-1">
              <label htmlFor="to" className="block text-sm font-medium text-slate-700">
                To
              </label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={currenciesLoading}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                {currencies.map((currency) => (
                  <option key={currency.iso_code} value={currency.iso_code}>
                    {currency.iso_code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={converting || currenciesLoading}>
            {converting ? 'Converting...' : 'Convert'}
          </Button>
        </form>

        {result !== null && (
          <p className="mt-4 border-t border-slate-200 pt-4 text-lg font-medium text-slate-900">
            {amount} {from} = {result.toFixed(2)} {to}
          </p>
        )}
      </Card>
    </div>
  )
}
