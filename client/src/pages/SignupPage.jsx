import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { TextInput } from '../components/TextInput.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function SignupPage() {
    const { login } = useApp()
    const nav = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [agree, setAgree] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const errors = useMemo(() => {
        if (!submitted) return {}
        const e = {}
        if (!validateEmail(email)) e.email = 'Enter a valid email address.'
        if (password.length < 6) e.password = 'Password must be at least 6 characters.'
        if (!agree) e.agree = 'Please confirm you understand this is not a diagnosis.'
        return e
    }, [email, password, agree, submitted])

    function onSubmit(e) {
        e.preventDefault()
        setSubmitted(true)
        if (Object.keys(errors).length) return
        login(email)
        nav(PATHS.profile)
    }

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Create account</h1>
                <p className="subtle">A minimal account step for saving your journey on this device.</p>
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
                        autoComplete="new-password"
                        required
                        showPasswordToggle
                        error={errors.password}
                    />

                    <div className="field">
                        <div className="labelRow">
                            <span className="label">Clinical disclaimer</span>
                        </div>
                        <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                style={{ width: 22, height: 22 }}
                                aria-invalid={errors.agree ? 'true' : 'false'}
                            />
                            I understand this app provides guidance and is not a medical diagnosis.
                        </label>
                        {errors.agree ? (
                            <div className="error" role="alert">
                                {errors.agree}
                            </div>
                        ) : null}
                    </div>

                    <div className="formActions">
                        <Button type="submit" variant="primary">
                            Start medical profile
                        </Button>
                        <Button to={PATHS.login} variant="secondary">
                            Back to login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
