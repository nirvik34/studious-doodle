import { Button } from '../components/Button.jsx'
import { RiskBadge } from '../components/RiskBadge.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'
import { levelFill } from '../utils/risk.js'

function FastIcons({ fast }) {
    const items = [
        { key: 'faceDroop', label: 'Face' },
        { key: 'armWeakness', label: 'Arm' },
        { key: 'speechDifficulty', label: 'Speech' },
        { key: 'timeCritical', label: 'Time' },
    ]

    return (
        <div className="grid2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {items.map((it) => {
                const on = Boolean(fast?.[it.key])
                return (
                    <div key={it.key} className="card" style={{ background: '#fff', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <strong>{it.label}</strong>
                            <span className="hint">{on ? 'Checked' : 'Not checked'}</span>
                        </div>
                        <div aria-hidden="true" style={{ marginTop: '8px' }}>
                            <svg width="100%" viewBox="0 0 120 22">
                                <rect x="2" y="6" width="116" height="10" rx="6" fill="#e2e8f0" />
                                <rect
                                    x="2"
                                    y="6"
                                    width={on ? 116 : 32}
                                    height="10"
                                    rx="6"
                                    fill={on ? '#dc2626' : '#3b82f6'}
                                    opacity="0.9"
                                />
                            </svg>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function ResultsPage() {
    const { state } = useApp()
    const r = state.lastResult

    if (!r) {
        return (
            <div className="container">
                <div className="pageHeader">
                    <h1 className="h1">Results</h1>
                    <p className="subtle">No result yet. Run a scan first.</p>
                </div>
                <Button to={PATHS.scan} variant="primary">
                    Go to scan
                </Button>
            </div>
        )
    }

    const confidencePct = Math.round(r.confidence * 100)

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Results</h1>
                <p className="subtle">Color-coded risk badge with confidence gauge.</p>
            </div>

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">Risk summary</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <RiskBadge level={r.level} />
                        <span className="hint">Score: {r.score}/100</span>
                    </div>

                    <div className="gauge" style={{ marginTop: '12px' }}>
                        <div className="labelRow">
                            <span className="label">Confidence</span>
                            <span className="hint">{confidencePct}%</span>
                        </div>
                        <div
                            className="gaugeBar"
                            role="meter"
                            aria-label="Confidence"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={confidencePct}
                        >
                            <div
                                className="gaugeFill"
                                style={{ width: `${confidencePct}%`, background: levelFill(r.level) }}
                            />
                        </div>
                    </div>

                    <p className="inlineNotice" style={{ marginTop: '16px' }}>
                        If FAST symptoms are present, treat this as urgent and seek emergency care.
                    </p>

                    <div className="heroActions" style={{ marginTop: '12px' }}>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                        <Button to={PATHS.hospitals} variant="secondary">
                            Hospital finder
                        </Button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">FAST review</h2>
                    <p className="subtle">These are the symptoms you selected in your profile.</p>
                    <FastIcons fast={state.profile.fast} />
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Next steps</h2>
                    <div className="heroActions" style={{ marginTop: 0 }}>
                        <Button to={PATHS.recommendations} variant="primary">
                            Personalized recommendations
                        </Button>
                        <Button to={PATHS.history} variant="secondary">
                            Scan history
                        </Button>
                        <Button to={PATHS.dashboard} variant="secondary">
                            Back to dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
