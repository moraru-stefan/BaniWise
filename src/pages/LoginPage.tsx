import { Card } from '../components/Card'

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
        <p className="mt-2 text-sm text-slate-600">
          The real login form will be built in Phase 6, once Supabase Auth is connected.
        </p>
      </Card>
    </main>
  )
}
