const pad = (n) => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5));

/**
 * Chọn giờ dạng 24h (14:00). Không dùng <input type="time"> vì trình duyệt tiếng Anh
 * hiện 02:00 PM, dễ nhầm. Giá trị luôn là "HH:mm".
 */
export default function TimeInput({ value, onChange }) {
  const [h = '', m = ''] = (value || '').split(':');
  const minutes = m && !MINUTES.includes(m) ? [...MINUTES, m].sort() : MINUTES;
  const set = (nh, nm) => onChange(`${nh || '00'}:${nm || '00'}`);

  return (
    <span className="time-input">
      <select value={h} onChange={(e) => set(e.target.value, m)} aria-label="Giờ">
        {!h && <option value="">--</option>}
        {HOURS.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <b>:</b>
      <select value={m} onChange={(e) => set(h, e.target.value)} aria-label="Phút">
        {!m && <option value="">--</option>}
        {minutes.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </span>
  );
}
