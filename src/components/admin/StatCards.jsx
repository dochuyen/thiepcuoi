/** Hàng thẻ thống kê: items = [{ label, value, tone }] */
export default function StatCards({ items }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <div key={s.label} className={`stat stat--${s.tone ?? 'default'}`}>
          <span className="stat__value">{s.value}</span>
          <span className="stat__label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
