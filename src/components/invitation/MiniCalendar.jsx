import { monthGrid, parseDate } from '../../utils/date.js';

const HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Lịch tháng có đánh dấu trái tim vào ngày cưới */
export default function MiniCalendar({ date }) {
  const d = parseDate(date);
  const cells = monthGrid(date);
  return (
    <div className="calendar">
      <div className="calendar__title">
        Tháng {d.getMonth() + 1} / {d.getFullYear()}
      </div>
      <div className="calendar__grid calendar__grid--head">
        {HEADERS.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>
      <div className="calendar__grid">
        {cells.map((day, i) => (
          <div key={i} className={day === d.getDate() ? 'calendar__day is-wedding' : 'calendar__day'}>
            {day === d.getDate() && (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.8 4.3 7.3C19.5 16.4 12 21 12 21z" />
              </svg>
            )}
            <span>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
