export function haversineKm(a, b) {
    const R = 6371
    const toRad = (d) => (d * Math.PI) / 180
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lng - a.lng)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)

    const s1 = Math.sin(dLat / 2) ** 2
    const s2 = Math.sin(dLon / 2) ** 2
    const c = 2 * Math.asin(Math.sqrt(s1 + Math.cos(lat1) * Math.cos(lat2) * s2))
    return R * c
}

export const HOSPITALS = [
    { id: 'h1', name: 'City General Hospital', lat: 28.6139, lng: 77.209, phone: '108' },
    { id: 'h2', name: 'Regional Stroke Care Center', lat: 19.076, lng: 72.8777, phone: '108' },
    { id: 'h3', name: 'District Emergency Hospital', lat: 12.9716, lng: 77.5946, phone: '108' },
]
