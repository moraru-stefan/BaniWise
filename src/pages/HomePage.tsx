import { Link } from 'react-router'
import { Button } from '../components/Button'

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center">
      <img src="/baniwise-logo.png" alt="" className="h-16 w-16" />
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">BaniWise</h1>
      <p className="max-w-md text-slate-600">
        Track your income and expenses, understand your budget, and reach your savings goals.
      </p>
      <div className="flex gap-3">
        <Link to="/register">
          <Button>Get started</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
    </main>
  )
}
