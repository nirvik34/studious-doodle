import { Button } from '../components/Button.jsx'
import { RiskBadge } from '../components/RiskBadge.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'

export function DashboardPage() {
    const { state } = useApp()

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Dashboard</h1>
                <p className="subtle">A single clear next action, plus emergency access.</p>
            </div>

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">Start</h2>
                    <p className="subtle">
                        Use the scan when you’re ready. If symptoms are present now, use Emergency.
                    </p>
                    <div className="heroActions" style={{ marginTop: 0 }}>
                        <Button to={PATHS.scan} className="ctaPulse">
                            Start Scan
                        </Button>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                    </div>
                    <p className="hint" style={{ marginTop: '12px' }}>
                        Touch targets are 48×48px minimum.
                    </p>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Your profile</h2>
                    <p className="subtle">
                        Status:{' '}
                        <strong>{state.profile.completed ? 'Complete' : 'Incomplete'}</strong>
                    </p>
                    <div className="heroActions" style={{ marginTop: 0 }}>
                        <Button to={PATHS.profile} variant="secondary">
                            Edit medical profile
                        </Button>
                        <Button to={PATHS.tour} variant="secondary">
                            View app tour
                        </Button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Last result</h2>
                    {state.lastResult ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                                <RiskBadge level={state.lastResult.level} />
                                <span className="hint">Score: {state.lastResult.score}/100</span>
                            </div>
                            <div className="heroActions" style={{ marginTop: '12px' }}>
                                <Button to={PATHS.results} variant="primary">
                                    View results
                                </Button>
                                <Button to={PATHS.history} variant="secondary">
                                    Scan history
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="subtle">No scan yet. Start a scan to see results.</p>
                    )}
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Care options</h2>
                    <p className="subtle">Find nearby hospitals using geolocation (with permission).</p>
                    <div className="heroActions" style={{ marginTop: 0 }}>
                        <Button to={PATHS.hospitals} variant="secondary">
                            Hospital finder
                        </Button>
                        <Button to={PATHS.recommendations} variant="secondary">
                            Recommendations
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
