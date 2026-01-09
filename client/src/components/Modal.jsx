import { useEffect, useRef } from 'react'

export function Modal({ open, title, children, onClose, actions }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        if (!open) return
        const el = dialogRef.current
        if (!el) return

        const prev = document.activeElement
        const focusable = el.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable) focusable.focus()

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose?.()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            if (prev && prev.focus) prev.focus()
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="modalOverlay" role="presentation" onMouseDown={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                ref={dialogRef}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <h2 className="modalTitle">{title}</h2>
                    <button className="iconBtn" type="button" onClick={onClose} aria-label="Close dialog">
                        Close
                    </button>
                </div>
                <div>{children}</div>
                {actions ? <div className="modalActions">{actions}</div> : null}
            </div>
        </div>
    )
}
