import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '../components/Button'

export function HomePage() {
  return (
    <div className="bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <img src="/baniwise-logo.png" alt="" className="h-8 w-8" />
            BaniWise
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
            >
              Features
            </a>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link to="/register">
              <Button variant="accent">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white sm:block sm:min-h-0">
        <img src="/hero-mobile.jpg" alt="" className="absolute inset-0 h-full w-full object-cover sm:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/40 sm:hidden" />

        <img
          src="/hero-baniwise.jpg"
          alt="BaniWise dashboard shown on a laptop and a phone"
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/85 to-white/10 sm:block" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="max-w-lg">
            <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
              Personal finance, made simple
            </p>
            <h1 className="mt-8 text-4xl font-bold text-slate-900 sm:mt-3 sm:text-5xl">
              Plan today for a <span className="text-emerald-600">brighter</span> tomorrow
            </h1>
            <p className="mt-10 text-slate-600 sm:mt-4">
              BaniWise helps you track income and expenses, follow your budget, and reach your
              savings goals — all in one simple, private place.
            </p>
            <div className="mt-12 flex flex-wrap gap-4 sm:mt-6 sm:gap-3">
              <Link to="/register">
                <Button variant="accent">Get started</Button>
              </Link>
              <a href="#features">
                <Button variant="secondary">See features</Button>
              </a>
            </div>
            <p className="mt-10 text-sm text-slate-500 sm:mt-3">Free to use — no credit card, ever.</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <FeatureCard
            icon={<BarChartIcon />}
            title="Stay in control"
            description="Track your income and expenses, and see exactly how much you have left to spend."
          />
          <FeatureCard
            icon={<CalendarIcon />}
            title="Plan with ease"
            description="Manage recurring income and expenses, and see them laid out on a calendar."
          />
          <FeatureCard
            icon={<TargetIcon />}
            title="Reach your goals"
            description="Set savings goals and track your progress toward them."
          />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src="/bg-baniwise.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              More clarity today. More freedom tomorrow.
            </h2>
            <p className="mt-3 max-w-md text-slate-600">
              BaniWise gives you a clear picture of your money, so you can make better decisions.
            </p>
            <Link to="/register" className="mt-6 inline-block">
              <Button variant="accent">Get started</Button>
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <TrustPoint
              icon={<ShieldIcon />}
              title="Private by design"
              description="Your data is protected with row-level security — only you can see it."
            />
            <TrustPoint
              icon={<DevicesIcon />}
              title="Works everywhere"
              description="Fully responsive, on your phone, tablet, or computer."
            />
            <TrustPoint
              icon={<TagIcon />}
              title="Free to use"
              description="No subscriptions, no hidden costs."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6">
          <div className="flex items-center gap-2 text-slate-900">
            <img src="/baniwise-logo.png" alt="" className="h-5 w-5" />
            <span className="font-semibold">BaniWise</span>
          </div>
          <p>© 2026 BaniWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <h3 className="mt-4 font-medium text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function TrustPoint({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect x="4" y="12" width="3" height="8" rx="1" fill="currentColor" />
      <rect x="10.5" y="7" width="3" height="13" rx="1" fill="currentColor" />
      <rect x="17" y="3" width="3" height="17" rx="1" fill="currentColor" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
    </svg>
  )
}

function DevicesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="4" width="13" height="9" rx="1" />
      <rect x="15" y="9" width="6" height="11" rx="1" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 12l-8 8-9-9V4h7l10 8z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
