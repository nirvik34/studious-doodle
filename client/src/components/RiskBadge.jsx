import { levelLabel } from '../utils/risk.js'

export function RiskBadge({ level }) {
    const cls =
        level === 'high'
            ? 'badge badgeHigh'
            : level === 'medium'
                ? 'badge badgeMed'
                : 'badge badgeLow'

    return <span className={cls}>{levelLabel(level)} Risk</span>
}
