import { Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { CalendarPage } from './pages/CalendarPage'
import { CurrencyConverterPage } from './pages/CurrencyConverterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { HomePage } from './pages/HomePage'
import { IncomePage } from './pages/IncomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SavingsGoalsPage } from './pages/SavingsGoalsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <AppLayout>
              <IncomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExpensesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CalendarPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SavingsGoalsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/converter"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CurrencyConverterPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
