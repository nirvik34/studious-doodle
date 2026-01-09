import { Button } from '../components/Button.jsx'
import { RiskBadge } from '../components/RiskBadge.jsx'
import { Timeline } from '../components/Timeline.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'
import { levelFill } from '../utils/risk.js'

function Sparkline({ points, label }) {
    if (!points.length) return null
    const w = 220
    const h = 60
    const pad = 6
    const xs = points.map((_, i) => (i / Math.max(1, points.length - 1)) * (w - pad * 2) + pad)
    const ys = points.map((p) => {
        const v = p.score
        const y = h - pad - (v / 100) * (h - pad * 2)
        return Math.max(pad, Math.min(h - pad, y))
    })
    const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')

    return (
        <div className="sparkWrap">
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-labelledby="sparkTitle">
                <title id="sparkTitle">{label}</title>
                <rect x="0" y="0" width={w} height={h} fill="#ffffff" />
                <path d={d} fill="none" stroke="#1e3a8a" strokeWidth="3" />
                {xs.map((x, i) => (
                    <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#3b82f6" />
                ))}
            </svg>
            <div className="hint">Recent trend (newest first)</div>
        </div>
    )
}

export function HistoryPage() {
    const { state } = useApp()

    const items = state.history.map((h) => {
        const dt = new Date(h.ts)
        const when = dt.toLocaleString()
        return {
            id: h.id,
            title: `${when}`,
            meta: `Score ${h.score}/100`,
            detail: `Risk: ${h.level}`,
        }
    })

    const points = state.history.slice(0, 8)

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Scan history</h1>
                <p className="subtle">Timeline view with a small trend visualization.</p>
            </div>

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">Trend</h2>
                    {points.length ? (
                        <Sparkline points={points} label="Risk score trend" />
                    ) : (
                        <p className="subtle">No scans yet. Start a scan to build history.</p>
                    )}

                    {state.lastResult ? (
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <RiskBadge level={state.lastResult.level} />
                            <span className="hint">Last score: {state.lastResult.score}/100</span>
                        </div>
                    ) : null}

                    <div className="heroActions" style={{ marginTop: '12px' }}>
                        <Button to={PATHS.scan} variant="primary">
                            New scan
                        </Button>
                        <Button to={PATHS.dashboard} variant="secondary">
                            Back
                        </Button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Timeline</h2>
                    {items.length ? <Timeline items={items} /> : <p className="subtle">No entries yet.</p>}
                </div>
            </div>
        </div>
    )
}
