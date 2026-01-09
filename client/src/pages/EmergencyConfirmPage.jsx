import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { Modal } from '../components/Modal.jsx'
import { PATHS } from '../routes/paths.js'

export function EmergencyConfirmPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="container">
            <div className="pageHeader">
                <h1 className="h1">Emergency</h1>
                <p className="subtle">One-tap emergency call with confirmation.</p>
            </div>

            <div className="card">
                <p className="inlineNotice">
                    If you suspect a stroke (FAST symptoms), call emergency services immediately.
                </p>

                <div className="heroActions">
                    <Button variant="danger" onClick={() => setOpen(true)}>
                        CALL 108
                    </Button>
                    <Button to={PATHS.dashboard} variant="secondary">
                        Back to dashboard
                    </Button>
                </div>

                <p className="hint" style={{ marginTop: '12px' }}>
                    On phones, this will open the dialer. On desktop, it may not place a call.
                </p>
            </div>

            <Modal
                open={open}
                title="Confirm emergency call"
                onClose={() => setOpen(false)}
                actions={
                    <>
                        <a className="btn btnDanger" href="tel:108">
                            Confirm: Call 108
                        </a>
                        <button className="btn btnSecondary" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                    </>
                }
            >
                <p className="subtle" style={{ marginTop: 0 }}>
                    You are about to place an emergency call. If this is not an emergency, cancel and return.
                </p>
            </Modal>
        </div>
    )
}
