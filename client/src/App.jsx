import { BrowserRouter, Link, useNavigate } from 'react-router-dom'
import { AppProvider, useApp } from './state/AppContext.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'
import { PATHS } from './routes/paths.js'
import { Button } from './components/Button.jsx'

function BrandMark() {
  return (
    <svg className="brandMark" viewBox="0 0 40 40" role="img" aria-labelledby="brandTitle">
      <title id="brandTitle">Stroke risk app</title>
      <circle cx="20" cy="20" r="18" fill="#1e3a8a" />
      <path
        d="M14 21c3-9 9-9 12 0 2 6 6 7 6 7H8s4-1 6-7z"
        fill="#3b82f6"
        opacity="0.9"
      />
      <circle cx="20" cy="18" r="3" fill="#fff" opacity="0.95" />
    </svg>
  )
}

function TopBar() {
  const { state, logout } = useApp()
  const nav = useNavigate()

  return (
    <header className="topBar">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="topBarInner">
        <Link className="brand" to={PATHS.landing} aria-label="Go to landing page">
          <BrandMark />
          StrokeCheck
        </Link>

        <nav aria-label="Primary" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {state.auth.user ? (
            <>
              <Button to={PATHS.dashboard} variant="link">
                Dashboard
              </Button>
              <Button to={PATHS.history} variant="link">
                History
              </Button>
              <Button to={PATHS.hospitals} variant="link">
                Hospitals
              </Button>
              <Button to={PATHS.emergency} variant="danger">
                CALL 108
              </Button>
              <button
                className="btn btnSecondary"
                type="button"
                onClick={() => {
                  logout()
                  nav(PATHS.landing)
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Button to={PATHS.login} variant="secondary">
                Log in
              </Button>
              <Button to={PATHS.signup} variant="primary">
                Sign up
              </Button>
              <Button to={PATHS.emergency} variant="danger">
                CALL 108
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function Shell() {
  return (
    <div className="appShell">
      <TopBar />
      <main id="main" className="main">
        <AppRoutes />
      </main>
      <footer className="footer">
        <div className="footerInner">
          This tool is for early screening only and is not a diagnosis. If you suspect a stroke, call emergency services.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  )
}
