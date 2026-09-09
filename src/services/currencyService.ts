export interface Currency {
  iso_code: string
  name: string
}

interface ExchangeRate {
  date: string
  base: string
  quote: string
  rate: number
}

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2'

export async function fetchCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/currencies`)
  if (!response.ok) throw new Error('Could not load the currency list.')
  return response.json()
}

export async function fetchExchangeRate(base: string, quote: string): Promise<ExchangeRate> {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/rate/${base}/${quote}`)
  if (!response.ok) throw new Error('Could not fetch the exchange rate. Try again later.')
  return response.json()
}
