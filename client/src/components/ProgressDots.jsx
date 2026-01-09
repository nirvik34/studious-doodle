export function ProgressDots({ total, current, label = 'Progress' }) {
    const dots = Array.from({ length: total }, (_, i) => i)
    return (
        <div className="dots" role="img" aria-label={`${label}: step ${current} of ${total}`}
        >
            {dots.map((i) => (
                <span
                    key={i}
                    className={`dot ${i + 1 === current ? 'dotActive' : ''}`.trim()}
                    aria-hidden="true"
                />
            ))}
        </div>
    )
}
