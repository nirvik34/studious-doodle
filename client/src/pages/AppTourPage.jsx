import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { ProgressDots } from '../components/ProgressDots.jsx'
import { PATHS } from '../routes/paths.js'

const STEPS = [
    {
        title: 'Welcome',
        body:
            'This tour explains the app in 4 short steps. Everything is designed for clarity and large touch targets.',
    },
    {
        title: 'Start Scan',
        body:
            'From the dashboard, select Start Scan. The scan page is a camera-style mock with clear status indicators.',
    },
    {
        title: 'Results',
        body:
            'Results include a color-coded risk badge and a confidence gauge. If urgent symptoms exist, call emergency services.',
    },
    {
        title: 'Hospitals & Emergency',
        body:
            'Use Hospital Finder for nearby care options and Emergency for one-tap CALL 108 confirmation.',
    },
]

export function AppTourPage() {
    const [step, setStep] = useState(1)
    const nav = useNavigate()

    const s = STEPS[step - 1]

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">App tour</h1>
                <p className="subtle">4 steps. You can skip anytime.</p>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <ProgressDots total={4} current={step} label="App tour" />
                    <div className="kbdHint">Step {step} of 4</div>
                </div>

                <hr className="hr" style={{ margin: '16px 0' }} />

                <h2 className="sectionTitle">{s.title}</h2>
                <p className="subtle" style={{ marginTop: 0 }}>
                    {s.body}
                </p>

                <div className="formActions" style={{ marginTop: '16px' }}>
                    <Button variant="secondary" onClick={() => setStep((v) => Math.max(1, v - 1))} disabled={step === 1}>
                        Back
                    </Button>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Button variant="secondary" onClick={() => nav(PATHS.dashboard)}>
                            Skip tour
                        </Button>
                        {step < 4 ? (
                            <Button variant="primary" onClick={() => setStep((v) => Math.min(4, v + 1))}>
                                Next
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={() => nav(PATHS.dashboard)}>
                                Finish
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
