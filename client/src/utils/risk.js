/**
 * Compute stroke risk based on profile data
 */
export function computeRisk({ profile, fast }) {
    // Simple risk calculation based on profile factors
    let score = 0
    let level = 1

    // Age factor
    if (profile?.age > 65) score += 0.3
    else if (profile?.age > 55) score += 0.2
    else if (profile?.age > 45) score += 0.1

    // FAST symptoms
    if (fast) score += 0.4

    // Medical conditions
    if (profile?.hypertension) score += 0.15
    if (profile?.diabetes) score += 0.15
    if (profile?.heartDisease) score += 0.2
    if (profile?.smoking) score += 0.15
    if (profile?.previousStroke) score += 0.25

    // Determine level
    if (score > 0.7) level = 3
    else if (score > 0.4) level = 2
    else level = 1

    const risk = level === 3 ? 'high' : level === 2 ? 'medium' : 'low'

    return {
        score: Math.min(score, 1),
        level,
        risk,
        confidence: 0.75
    }
}

/**
 * Get color for risk level
 */
export function levelColor(level) {
    switch (level) {
        case 3: return '#DC2626' // red
        case 2: return '#F59E0B' // amber
        case 1: return '#10B981' // green
        default: return '#6B7280' // gray
    }
}

/**
 * Get fill color for risk level
 */
export function levelFill(level) {
    switch (level) {
        case 3: return '#FEE2E2' // red-100
        case 2: return '#FEF3C7' // amber-100
        case 1: return '#D1FAE5' // green-100
        default: return '#F3F4F6' // gray-100
    }
}

/**
 * Get label for risk level
 */
export function levelLabel(level) {
    switch (level) {
        case 3: return 'High Risk'
        case 2: return 'Medium Risk'
        case 1: return 'Low Risk'
        default: return 'Unknown'
    }
}
