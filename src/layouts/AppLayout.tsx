import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

interface AppLayoutProps {
  children: ReactNode
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/income', label: 'Income' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/goals', label: 'Goals' },
  { to: '/converter', label: 'Converter' },
]

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative border-b border-slate-200 bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <img src="/baniwise-logo.png" alt="" className="h-8 w-8" />
            BaniWise
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-30 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-slate-600 transition-transform duration-300 ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-600 transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-600 transition-transform duration-300 ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        {menuOpen && (
          <nav className="absolute inset-x-0 top-full z-20 flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-3">
                <span className="px-2 text-sm text-slate-500">{user.email}</span>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </nav>
        )}
      </header>
      <main className="container py-6 sm:py-8">{children}</main>
    </div>
  )
}
