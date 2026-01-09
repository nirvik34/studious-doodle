import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { ProgressDots } from '../components/ProgressDots.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n))
}

export function ProfileWizardPage() {
    const { state, updateProfile, setFast } = useApp()
    const nav = useNavigate()

    const [step, setStep] = useState(1)
    const [submitted, setSubmitted] = useState(false)

    const errors = useMemo(() => {
        if (!submitted) return {}
        const e = {}
        if (step === 1) {
            const age = Number(state.profile.age)
            if (!Number.isFinite(age) || age < 18 || age > 110) e.age = 'Enter an age between 18 and 110.'
        }
        return e
    }, [submitted, step, state.profile.age])

    function next() {
        setSubmitted(true)
        if (Object.keys(errors).length) return
        setSubmitted(false)
        setStep((s) => clamp(s + 1, 1, 5))
    }

    function back() {
        setSubmitted(false)
        setStep((s) => clamp(s - 1, 1, 5))
    }

    function finish() {
        updateProfile({ completed: true })
        nav(PATHS.tour)
    }

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Medical profile</h1>
                <p className="subtle">5 steps. Use the keyboard Tab key to move between fields.</p>
            </div>

            <div className="card" aria-live="polite">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <ProgressDots total={5} current={step} label="Medical profile" />
                    <div className="kbdHint">Step {step} of 5</div>
                </div>

                <hr className="hr" style={{ margin: '16px 0' }} />

                {step === 1 ? (
                    <div className="formGrid">
                        <div className="field">
                            <div className="labelRow">
                                <label className="label" htmlFor="age">Age</label>
                                <span className="hint">Years</span>
                            </div>
                            <input
                                id="age"
                                className="input"
                                inputMode="numeric"
                                value={state.profile.age}
                                onChange={(e) => updateProfile({ age: e.target.value.replace(/[^0-9]/g, '') })}
                                aria-invalid={errors.age ? 'true' : 'false'}
                                aria-describedby={errors.age ? 'age-err' : undefined}
                                placeholder="e.g., 62"
                            />
                            {errors.age ? (
                                <div id="age-err" className="error" role="alert">
                                    {errors.age}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {step === 2 ? (
                    <div className="formGrid">
                        <div className="field">
                            <div className="labelRow">
                                <span className="label">Blood pressure (systolic)</span>
                                <span className="hint">{state.profile.bpSystolic} mmHg</span>
                            </div>
                            <input
                                className="input"
                                type="range"
                                min="90"
                                max="200"
                                value={state.profile.bpSystolic}
                                onChange={(e) => updateProfile({ bpSystolic: Number(e.target.value) })}
                                aria-label="Systolic blood pressure"
                            />
                        </div>

                        <div className="field">
                            <div className="labelRow">
                                <span className="label">Blood pressure (diastolic)</span>
                                <span className="hint">{state.profile.bpDiastolic} mmHg</span>
                            </div>
                            <input
                                className="input"
                                type="range"
                                min="60"
                                max="130"
                                value={state.profile.bpDiastolic}
                                onChange={(e) => updateProfile({ bpDiastolic: Number(e.target.value) })}
                                aria-label="Diastolic blood pressure"
                            />
                        </div>
                    </div>
                ) : null}

                {step === 3 ? (
                    <div className="formGrid">
                        <div className="field">
                            <div className="labelRow">
                                <span className="label">Medical conditions</span>
                            </div>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.diabetes}
                                    onChange={(e) => updateProfile({ diabetes: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Diabetes
                            </label>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.smoking}
                                    onChange={(e) => updateProfile({ smoking: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Smoking (current)
                            </label>
                        </div>
                    </div>
                ) : null}

                {step === 4 ? (
                    <div className="formGrid">
                        <div className="inlineNotice">
                            If symptoms are present now, go to Emergency and call 108.
                        </div>
                        <div className="field">
                            <div className="labelRow">
                                <span className="label">FAST symptoms</span>
                                <span className="hint">Check what applies</span>
                            </div>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.fast.faceDroop}
                                    onChange={(e) => setFast({ faceDroop: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Face drooping
                            </label>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.fast.armWeakness}
                                    onChange={(e) => setFast({ armWeakness: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Arm weakness
                            </label>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.fast.speechDifficulty}
                                    onChange={(e) => setFast({ speechDifficulty: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Speech difficulty
                            </label>
                            <label className="hint" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={state.profile.fast.timeCritical}
                                    onChange={(e) => setFast({ timeCritical: e.target.checked })}
                                    style={{ width: 22, height: 22 }}
                                />
                                Symptoms started recently (time-critical)
                            </label>
                        </div>
                    </div>
                ) : null}

                {step === 5 ? (
                    <div className="formGrid">
                        <div className="card" style={{ background: '#fff' }}>
                            <h2 className="sectionTitle">Review</h2>
                            <p className="subtle" style={{ marginTop: 0 }}>
                                Age: <strong>{state.profile.age || '—'}</strong>
                                <br />
                                Blood pressure: <strong>{state.profile.bpSystolic}/{state.profile.bpDiastolic}</strong>
                                <br />
                                Diabetes: <strong>{state.profile.diabetes ? 'Yes' : 'No'}</strong>
                                <br />
                                Smoking: <strong>{state.profile.smoking ? 'Yes' : 'No'}</strong>
                            </p>
                            <p className="subtle">
                                FAST: Face({state.profile.fast.faceDroop ? 'Y' : 'N'}) • Arm({
                                    state.profile.fast.armWeakness ? 'Y' : 'N'
                                }) • Speech({state.profile.fast.speechDifficulty ? 'Y' : 'N'}) • Time({
                                    state.profile.fast.timeCritical ? 'Y' : 'N'
                                })
                            </p>
                        </div>
                        <div className="inlineNotice">
                            You can update this anytime from your journey by returning to Medical profile.
                        </div>
                    </div>
                ) : null}

                <hr className="hr" style={{ margin: '16px 0' }} />

                <div className="formActions">
                    <Button variant="secondary" onClick={back} disabled={step === 1}>
                        Back
                    </Button>

                    {step < 5 ? (
                        <Button variant="primary" onClick={next}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={finish}>
                            Continue to app tour
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
