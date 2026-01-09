import { Link } from 'react-router-dom'

export function Button({
    children,
    variant = 'primary',
    type = 'button',
    to,
    onClick,
    disabled,
    ariaDisabled,
    className = '',
    ...rest
}) {
    const variantClass =
        variant === 'secondary'
            ? 'btnSecondary'
            : variant === 'danger'
                ? 'btnDanger'
                : variant === 'link'
                    ? 'btnLink'
                    : 'btnPrimary'

    const cls = `btn ${variantClass} ${className}`.trim()

    if (to) {
        return (
            <Link
                className={cls}
                to={to}
                aria-disabled={ariaDisabled || disabled ? 'true' : undefined}
                {...rest}
            >
                {children}
            </Link>
        )
    }

    return (
        <button
            className={cls}
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={ariaDisabled}
            {...rest}
        >
            {children}
        </button>
    )
}
