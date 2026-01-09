export function Timeline({ items }) {
    return (
        <div className="timeline" role="list">
            {items.map((it) => (
                <div key={it.id} className="timelineItem" role="listitem">
                    <div className="timelineDot" aria-hidden="true" />
                    <div className="timelineContent">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'baseline' }}>
                            <strong>{it.title}</strong>
                            <span className="hint">{it.meta}</span>
                        </div>
                        <div className="hint">{it.detail}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
