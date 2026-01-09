import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { PATHS } from '../routes/paths.js'
import { useApp } from '../state/AppContext.jsx'
import { computeRisk } from '../utils/risk.js'

function FaceOverlay() {
    return (
        <svg width="100%" viewBox="0 0 300 400" role="img" aria-labelledby="faceTitle" style={{ maxWidth: 360 }}>
            <title id="faceTitle">Face alignment overlay</title>
            <rect x="18" y="18" width="264" height="364" rx="18" fill="none" stroke="#94A3B8" strokeWidth="2" opacity="0.8" />
            <path
                d="M150 82c-56 0-92 44-92 98 0 80 44 132 92 132s92-52 92-132c0-54-36-98-92-98z"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
                opacity="0.85"
            />
            <circle cx="118" cy="182" r="10" fill="#E2E8F0" opacity="0.85" />
            <circle cx="182" cy="182" r="10" fill="#E2E8F0" opacity="0.85" />
            <path d="M118 250c16 16 48 16 64 0" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <line x1="40" y1="320" x2="260" y2="320" stroke="#3B82F6" strokeWidth="3" opacity="0.7">
                <animate attributeName="opacity" values="0.35;0.9;0.35" dur="1.8s" repeatCount="indefinite" />
            </line>
        </svg>
    )
}

export function ScanPage() {
    const { state, addHistory, setLastResult } = useApp()
    const nav = useNavigate()

    const videoRef = useRef(null)
    const streamRef = useRef(null)

    const [status, setStatus] = useState('Ready')
    const [progress, setProgress] = useState(0)
    const [running, setRunning] = useState(false)
    const [apiError, setApiError] = useState('')

    const [cameraState, setCameraState] = useState('Not enabled')
    const [cameraError, setCameraError] = useState('')
    const [cameraEnabled, setCameraEnabled] = useState(false)
    const [cameraDetail, setCameraDetail] = useState('')

    const computed = useMemo(() => {
        return computeRisk({ profile: state.profile, fast: state.profile.fast })
    }, [state.profile])

    async function enableCamera() {
        setCameraError('')
        setCameraDetail('')

        // Many mobile browsers block camera on non-HTTPS origins.
        if (!window.isSecureContext) {
            setCameraState('Blocked (insecure site)')
            setCameraError(
                `Camera requires a secure context (HTTPS or localhost). Current origin: ${window.location.origin}`
            )
            return
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraState('Camera not available in this browser.')
            setCameraError('Your browser or device does not support camera access.')
            return
        }

        try {
            // If a stream is already open, replace it cleanly.
            const prev = streamRef.current
            if (prev) prev.getTracks().forEach((t) => t.stop())
            streamRef.current = null

            setCameraState('Requesting permission…')
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 720 },
                    height: { ideal: 960 },
                },
                audio: false,
            })

            streamRef.current = stream
            const el = videoRef.current
            if (el) {
                el.srcObject = stream
                // Some browsers may reject play() despite autoplay; ignore and let it render when allowed.
                try {
                    await el.play()
                } catch {
                    // ignore
                }
            }
            setCameraEnabled(true)
            setCameraState('Camera enabled')
        } catch (e) {
            setCameraEnabled(false)
            setCameraState('Camera blocked')

            const name = e?.name ? String(e.name) : 'Error'
            const msg = e?.message ? String(e.message) : ''
            setCameraDetail(`${name}${msg ? `: ${msg}` : ''}`)

            if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
                setCameraError('Camera permission was denied. Allow camera access in your browser/site settings and try again.')
            } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
                setCameraError('No camera device was found. Connect a camera or try on a phone with a camera.')
            } else if (name === 'NotReadableError') {
                setCameraError('Camera is already in use by another app or browser tab. Close other apps and try again.')
            } else {
                setCameraError(
                    'Camera permission was denied or unavailable. Ensure you are using HTTPS (or localhost) and try again.'
                )
            }
        }
    }

    function disableCamera() {
        const s = streamRef.current
        if (s) {
            s.getTracks().forEach((t) => t.stop())
        }
        streamRef.current = null
        setCameraEnabled(false)
        setCameraState('Not enabled')
        const el = videoRef.current
        if (el) el.srcObject = null
    }

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            const s = streamRef.current
            if (s) s.getTracks().forEach((t) => t.stop())
        }
    }, [])

    useEffect(() => {
        if (!running) return

        const profileSnapshot = state.profile

        setStatus('Align face in frame')
        setProgress(12)

        const t1 = setTimeout(() => {
            setStatus('Scanning…')
            setProgress(52)
        }, 900)

        const t2 = setTimeout(() => {
            setStatus('Analyzing…')
            setProgress(82)
        }, 1800)

        const t3 = setTimeout(() => {
            setStatus('Complete')
            setProgress(100)
                ; (async () => {
                    try {
                        setApiError('')
                        
                        // Capture image from video if camera is enabled
                        let imageData = null
                        if (cameraEnabled && videoRef.current) {
                            const video = videoRef.current
                            const canvas = document.createElement('canvas')
                            canvas.width = video.videoWidth || 640
                            canvas.height = video.videoHeight || 480
                            const ctx = canvas.getContext('2d')
                            ctx.drawImage(video, 0, 0)
                            imageData = canvas.toDataURL('image/jpeg', 0.8)
                        }
                        
                        const res = await fetch('http://localhost:8081/api/scan', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                image: imageData,
                                profile: profileSnapshot, 
                                fast: profileSnapshot.fast 
                            }),
                        })
                        if (!res.ok) throw new Error('Scan API failed')
                        const data = await res.json()
                        
                        // Map the response to match expected format
                        const entry = {
                            id: String(Date.now()),
                            ts: data.ts || new Date().toISOString(),
                            score: data.asymmetryScore || data.score || 0,
                            level: data.riskLevel || data.level || 1,
                            confidence: data.detected ? 0.85 : 0.5,
                            risk: data.risk || 'low'
                        }
                        setLastResult(entry)
                        addHistory(entry)
                    } catch (err) {
                        console.error('Scan error:', err)
                        setApiError('Network unavailable. Showing an on-device estimate.')
                        const entry = {
                            id: String(Date.now()),
                            ts: new Date().toISOString(),
                            ...computed,
                        }
                        setLastResult(entry)
                        addHistory(entry)
                    } finally {
                        setRunning(false)
                        nav(PATHS.results)
                    }
                })()
        }, 2600)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [running, computed, addHistory, nav, setLastResult])

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Scan</h1>
                <p className="subtle">
                    Live camera preview (optional) with a face alignment overlay. Results are still a screening estimate.
                </p>
            </div>

            <div className="grid2">
                <div className="card scanPanel">
                    <div className="scanFrame" aria-label="Camera preview frame" role="group">
                        <video
                            ref={videoRef}
                            className="scanVideo"
                            muted
                            playsInline
                            autoPlay
                            aria-label="Live camera preview"
                        />
                        <div className="scanOverlay">
                            <FaceOverlay />
                        </div>
                    </div>

                    <div className="scanStatus" aria-live="polite" role="status">
                        <div className="statusRow">
                            <span className="statusKey">Camera</span>
                            <span className="statusVal">{cameraState}</span>
                        </div>
                    </div>

                    {cameraError ? (
                        <div className="inlineNotice" role="alert">
                            {cameraError}
                            {cameraDetail ? (
                                <div className="hint" style={{ marginTop: '8px' }}>
                                    Details: {cameraDetail}
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="heroActions" style={{ marginTop: 0 }}>
                        {!cameraEnabled ? (
                            <Button variant="primary" onClick={enableCamera}>
                                Enable camera
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={disableCamera}>
                                Turn off camera
                            </Button>
                        )}
                    </div>

                    <div className="hint">Tip: Keep the device steady. Reduced motion is supported.</div>
                </div>

                <div className="card">
                    <h2 className="sectionTitle">Status</h2>
                    <div className="scanStatus" aria-live="polite" role="status">
                        <div className="statusRow">
                            <span className="statusKey">State</span>
                            <span className="statusVal">{status}</span>
                        </div>
                        <div className="statusRow">
                            <span className="statusKey">Progress</span>
                            <span className="statusVal">{progress}%</span>
                        </div>
                        <div className="gauge">
                            <div className="gaugeBar" aria-label="Scan progress">
                                <div
                                    className="gaugeFill"
                                    style={{ width: `${progress}%`, background: 'var(--blue-500)' }}
                                />
                            </div>
                        </div>
                    </div>

                    {apiError ? (
                        <div className="inlineNotice" role="alert" style={{ marginTop: '12px' }}>
                            {apiError}
                        </div>
                    ) : null}

                    <div className="heroActions" style={{ marginTop: '16px' }}>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (running) return
                                setRunning(true)
                                setProgress(0)
                            }}
                            disabled={running}
                        >
                            {running ? 'Scanning…' : 'Begin scan'}
                        </Button>
                        <Button to={PATHS.dashboard} variant="secondary" ariaDisabled={running}>
                            Back
                        </Button>
                        <Button to={PATHS.emergency} variant="danger">
                            CALL 108
                        </Button>
                    </div>

                    <p className="inlineNotice" style={{ marginTop: '16px' }}>
                        If you have FAST symptoms right now, do not rely on this screening—call emergency services.
                    </p>
                </div>
            </div>
        </div>
    )
}
