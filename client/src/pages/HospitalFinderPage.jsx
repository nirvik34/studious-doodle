import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button.jsx'
import { PATHS } from '../routes/paths.js'
import { HOSPITALS, haversineKm } from '../utils/geo.js'

export function HospitalFinderPage() {
    const [pos, setPos] = useState(null)
    const [status, setStatus] = useState('Not requested')

    useEffect(() => {
        // do nothing on mount; explicit user action is clearer for consent.
    }, [])

    function requestLocation() {
        if (!navigator.geolocation) {
            setStatus('Geolocation not available on this device/browser.')
            return
        }

        setStatus('Requesting permission…')
        navigator.geolocation.getCurrentPosition(
            (p) => {
                setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
                setStatus('Location acquired.')
            },
            () => {
                setStatus('Location permission denied or unavailable. Showing general hospitals list.')
            },
            { enableHighAccuracy: false, timeout: 8000 }
        )
    }

    const list = useMemo(() => {
        return HOSPITALS.map((h) => {
            const dist = pos ? haversineKm(pos, { lat: h.lat, lng: h.lng }) : null
            return { ...h, dist }
        }).sort((a, b) => {
            if (a.dist == null && b.dist == null) return 0
            if (a.dist == null) return 1
            if (b.dist == null) return -1
            return a.dist - b.dist
        })
    }, [pos])

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Hospital finder</h1>
                <p className="subtle">Uses your location only if you choose to share it.</p>
            </div>

            <div className="grid2">
                <div className="card">
                    <h2 className="sectionTitle">Location</h2>
                    <div className="inlineNotice" aria-live="polite" role="status">
                        {status}
                    </div>
                    <div className="heroActions" style={{ marginTop: '12px' }}>
                        <Button variant="primary" onClick={requestLocation}>
                            Use my location
                        </Button>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                    </div>

                    {pos ? (
                        <p className="hint" style={{ marginTop: '12px' }}>
                            Approximate position: {pos.lat.toFixed(3)}, {pos.lng.toFixed(3)}
                        </p>
                    ) : null}
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Nearby options</h2>
                    <div className="hospList">
                        {list.map((h) => {
                            const distText = h.dist == null ? 'Distance unavailable' : `${h.dist.toFixed(1)} km`
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${h.lat},${h.lng}`
                            )}`

                            return (
                                <div key={h.id} className="hospItem">
                                    <strong>{h.name}</strong>
                                    <div className="hospMeta">{distText}</div>
                                    <div className="heroActions" style={{ marginTop: 0 }}>
                                        <a className="btn btnSecondary" href={mapsUrl} target="_blank" rel="noreferrer">
                                            Open in Maps
                                        </a>
                                        <a className="btn btnPrimary" href={`tel:${h.phone}`}>
                                            Call
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Back</h2>
                    <div className="heroActions" style={{ marginTop: 0 }}>
                        <Button to={PATHS.dashboard} variant="secondary">
                            Dashboard
                        </Button>
                        <Button to={PATHS.history} variant="secondary">
                            History
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
