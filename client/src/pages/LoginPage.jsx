import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { TextInput } from '../components/TextInput.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function LoginPage() {
    const { login } = useApp()
    const nav = useNavigate()
    const loc = useLocation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const errors = useMemo(() => {
        if (!submitted) return {}
        const e = {}
        if (!validateEmail(email)) e.email = 'Enter a valid email address.'
        if (password.length < 6) e.password = 'Password must be at least 6 characters.'
        return e
    }, [email, password, submitted])

    function onSubmit(e) {
        e.preventDefault()
        setSubmitted(true)
        if (Object.keys(errors).length) return
        login(email)
        const to = loc.state?.from || PATHS.dashboard
        nav(to)
    }

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Log in</h1>
                <p className="subtle">Use large inputs and clear validation.</p>
            </div>

            <div className="card">
                <form className="formGrid" onSubmit={onSubmit} noValidate>
                    <div className="sr-only" aria-live="polite" role="status">
                        {submitted && Object.keys(errors).length
                            ? 'There are validation errors. Review the fields and try again.'
                            : ''}
                    </div>

                    <TextInput
                        label="Email"
                        value={email}
                        onChange={setEmail}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        error={errors.email}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        type="password"
                        autoComplete="current-password"
                        required
                        showPasswordToggle
                        error={errors.password}
                    />

                    <div className="formActions">
                        <Button type="submit" variant="primary">
                            Continue
                        </Button>
                        <Button to={PATHS.signup} variant="secondary">
                            Create account
                        </Button>
                    </div>

                    <p className="hint">
                        If you are experiencing symptoms now, use <strong>CALL 108</strong> from the emergency screen.
                    </p>
                </form>
            </div>
        </div>
    )
}
