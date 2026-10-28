const WEEKDAYS = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];

/** "2026-01-03" -> Date (giờ địa phương, tránh lệch múi giờ) */
export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function dateParts(iso) {
  const d = parseDate(iso);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    year: d.getFullYear(),
    weekday: WEEKDAYS[d.getDay()],
  };
}

/** Lưới lịch tháng, tuần bắt đầu từ Thứ 2; ô trống = null */
export function monthGrid(iso) {
  const d = parseDate(iso);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  return [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
}

/** Link Google Calendar; giờ Việt Nam (UTC+7) -> UTC */
export function googleCalendarUrl({ title, date, time, hours = 4, location }) {
  const [h, m] = time.split(':').map(Number);
  const start = new Date(Date.UTC(...date.split('-').map((v, i) => (i === 1 ? v - 1 : +v)), h - 7, m));
  const end = new Date(start.getTime() + hours * 3600_000);
  const fmt = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
  });
  return `https://www.google.com/calendar/render?${params}`;
}

/** Giờ hiển thị trên thiệp luôn dạng 24h: "2:00 PM" / "02:00 PM" / "14:00" -> "14:00" */
export function formatTime(value) {
  const m = String(value ?? '').trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!m) return value ?? '';
  let h = Number(m[1]) % (m[3] ? 12 : 24);
  if (/p/i.test(m[3] ?? '')) h += 12;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('vi-VN');
}
