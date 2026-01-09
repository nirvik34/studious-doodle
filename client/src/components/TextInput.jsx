import { useId, useMemo, useState } from 'react'
import { Button } from './Button.jsx'

export function TextInput({
    label,
    value,
    onChange,
    type = 'text',
    inputMode,
    autoComplete,
    name,
    placeholder,
    hint,
    error,
    required,
    showPasswordToggle,
}) {
    const id = useId()
    const hintId = useMemo(() => `${id}-hint`, [id])
    const errId = useMemo(() => `${id}-err`, [id])

    const [pwVisible, setPwVisible] = useState(false)
    const actualType = type === 'password' && pwVisible ? 'text' : type

    const describedBy = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ')

    return (
        <div className="field">
            <div className="labelRow">
                <label className="label" htmlFor={id}>
                    {label} {required ? <span aria-hidden="true">*</span> : null}
                </label>
            </div>

            {showPasswordToggle && type === 'password' ? (
                <div className="inputGroup">
                    <input
                        id={id}
                        className="input"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        type={actualType}
                        name={name}
                        inputMode={inputMode}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={describedBy || undefined}
                        required={required}
                    />
                    <button
                        className="iconBtn"
                        type="button"
                        onClick={() => setPwVisible((v) => !v)}
                        aria-pressed={pwVisible ? 'true' : 'false'}
                        aria-label={pwVisible ? 'Hide password' : 'Show password'}
                    >
                        {pwVisible ? 'Hide' : 'Show'}
                    </button>
                </div>
            ) : (
                <input
                    id={id}
                    className="input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    type={type}
                    name={name}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={describedBy || undefined}
                    required={required}
                />
            )}

            {hint ? (
                <div id={hintId} className="hint">
                    {hint}
                </div>
            ) : null}

            {error ? (
                <div id={errId} className="error" role="alert">
                    {error}
                </div>
            ) : null}
        </div>
    )
}
