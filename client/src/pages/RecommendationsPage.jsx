import { Button } from '../components/Button.jsx'
import { RiskBadge } from '../components/RiskBadge.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'

function RecommendationList({ level }) {
    const base = [
        'Keep emergency contact information easy to access.',
        'Maintain medication adherence as prescribed by your clinician.',
        'Prefer regular, gentle physical activity if medically safe.',
        'Prioritize sleep and hydration.',
    ]

    const medium = [
        'Schedule a check-in with a healthcare provider to review blood pressure and risk factors.',
        'Consider home blood pressure monitoring and share trends with a clinician.',
    ]

    const high = [
        'If symptoms are present now, call emergency services immediately.',
        'Do not drive yourself to the hospital if acute symptoms are present.',
        'Ask for urgent clinical evaluation of stroke risk factors.',
    ]

    const list = level === 'high' ? [...high, ...medium, ...base] : level === 'medium' ? [...medium, ...base] : base

    return (
        <ol style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '8px' }}>
            {list.map((t, i) => (
                <li key={i} className="subtle">
                    {t}
                </li>
            ))}
        </ol>
    )
}

export function RecommendationsPage() {
    const { state } = useApp()
    const level = state.lastResult?.level || 'low'

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Personalized recommendations</h1>
                <p className="subtle">Based on your most recent screening and profile selections.</p>
            </div>

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">Current risk</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <RiskBadge level={level} />
                        <span className="hint">Update profile for accuracy.</span>
                    </div>
                    <div className="heroActions" style={{ marginTop: '12px' }}>
                        <Button to={PATHS.profile} variant="secondary">
                            Edit medical profile
                        </Button>
                        <Button to={PATHS.scan} variant="primary">
                            New scan
                        </Button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Suggested actions</h2>
                    <RecommendationList level={level} />
                    <div className="heroActions" style={{ marginTop: '16px' }}>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                        <Button to={PATHS.hospitals} variant="secondary">
                            Hospital finder
                        </Button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
                <h2 className="sectionTitle">Note</h2>
                <p className="subtle" style={{ marginTop: 0 }}>
                    This is educational guidance. For diagnosis and treatment decisions, consult a licensed clinician.
                </p>
            </div>
        </div>
    )
}
