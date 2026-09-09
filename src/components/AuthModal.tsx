import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { Modal } from './Modal'
import { RegisterForm } from './RegisterForm'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  initialMode: AuthMode
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  return (
    <Modal onClose={onClose}>
      {mode === 'login' ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}

      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="cursor-pointer font-medium text-emerald-600 hover:text-emerald-700"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="cursor-pointer font-medium text-emerald-600 hover:text-emerald-700"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </Modal>
  )
}
