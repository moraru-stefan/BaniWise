import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
            BaniWise
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <Link to="/income" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Income
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
