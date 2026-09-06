import { Button } from './components/Button'
import { Card } from './components/Card'
import { AppLayout } from './layouts/AppLayout'

function App() {
  return (
    <AppLayout>
      <Card>
        <h1 className="text-xl font-semibold text-slate-900">Welcome to BaniWise</h1>
        <p className="mt-2 text-sm text-slate-600">
          This is a placeholder page used to verify our base layout, typography and reusable components.
        </p>
        <Button className="mt-4">Get started</Button>
      </Card>
    </AppLayout>
  )
}

export default App
