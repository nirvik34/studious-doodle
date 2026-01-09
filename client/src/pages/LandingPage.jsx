import { Button } from '../components/Button.jsx'
import { PATHS } from '../routes/paths.js'

function BrainScanHero() {
    return (
        <svg
            width="100%"
            viewBox="0 0 420 320"
            role="img"
            aria-labelledby="brainTitle brainDesc"
            style={{ maxWidth: 420, margin: '0 auto', display: 'block' }}
        >
            <title id="brainTitle">Animated brain scan hero</title>
            <desc id="brainDesc">A subtle animated scan line passes over a brain outline.</desc>

            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#1E3A8A" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0.9" />
                </linearGradient>
                <clipPath id="clip">
                    <rect x="40" y="40" width="340" height="240" rx="18" />
                </clipPath>
            </defs>

            <rect x="40" y="40" width="340" height="240" rx="18" fill="#0b1220" />
            <rect x="52" y="52" width="316" height="216" rx="14" fill="url(#g)" opacity="0.12" />

            {/* Brain outline */}
            <path
                d="M205 92c-28 0-50 22-50 50 0 8 2 15 5 22-12 6-20 19-20 34 0 22 18 40 40 40h8c7 18 23 30 41 30s34-12 41-30h8c22 0 40-18 40-40 0-15-8-28-20-34 3-7 5-14 5-22 0-28-22-50-50-50-12 0-22 4-30 10-8-6-18-10-30-10z"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
                opacity="0.95"
            />

            {/* Subtle nodes */}
            {[
                [170, 130],
                [245, 128],
                [150, 190],
                [270, 195],
                [210, 225],
            ].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={y} r="6" fill="#ffffff" opacity="0.9">
                    <animate
                        attributeName="opacity"
                        values="0.55;0.95;0.55"
                        dur="2.2s"
                        begin={`${idx * 0.2}s`}
                        repeatCount="indefinite"
                    />
                </circle>
            ))}

            {/* Scan line */}
            <g clipPath="url(#clip)">
                <rect x="50" y="60" width="320" height="10" fill="#93C5FD" opacity="0.55">
                    <animate attributeName="y" values="60;250;60" dur="3.6s" repeatCount="indefinite" />
                </rect>
            </g>

            <text x="210" y="292" textAnchor="middle" fill="#E2E8F0" fontSize="14">
                Early Check • Clinical Clarity
            </text>
        </svg>
    )
}

export function LandingPage() {
    return (
        <div className="container">
            <div className="hero">
                <div className="fadeUp">
                    <h1 className="heroTitle">Early Stroke Risk Check</h1>
                    <p className="heroLead">
                        A calm, accessible, step-by-step risk screening experience designed for older adults.
                        This is not a diagnosis. If symptoms are present, seek emergency help.
                    </p>
                    <div className="heroActions">
                        <Button to={PATHS.login} variant="primary">
                            Log in
                        </Button>
                        <Button to={PATHS.signup} variant="secondary">
                            Create account
                        </Button>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                    </div>
                    <p className="inlineNotice" style={{ marginTop: '16px' }}>
                        Emergency warning: If face drooping, arm weakness, or speech difficulty is present, do not wait.
                    </p>
                </div>
                <div className="fadeUp">
                    <BrainScanHero />
                </div>
            </div>

            <hr className="hr" style={{ margin: '24px 0' }} />

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">FAST symptoms (quick check)</h2>
                    <p className="subtle">
                        Face drooping • Arm weakness • Speech difficulty • Time to call emergency services.
                    </p>
                </div>
                <div className="card">
                    <h2 className="sectionTitle">Privacy-first</h2>
                    <p className="subtle">
                        This demo stores your inputs locally on this device for continuity.
                    </p>
                </div>
            </div>
        </div>
    )
}
