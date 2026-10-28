import { dateParts, formatTime } from '../../utils/date.js';

/** Khối ngày kiểu "03 | THÁNG 01 / 2026" */
export default function DateBlock({ date, time, lunarText, prefix }) {
  const p = dateParts(date);
  return (
    <div className="date-block">
      <div className="date-block__meta">
        {prefix && <span>{prefix} </span>}
        <span>{formatTime(time)}</span> <span>{p.weekday}</span>
      </div>
      <div className="date-block__main">
        <span className="date-block__day">{p.day}</span>
        <span className="date-block__divider" />
        <div className="date-block__month">
          <span>THÁNG {p.month}</span>
          <span>{p.year}</span>
        </div>
      </div>
      {lunarText && <div className="date-block__lunar">{lunarText}</div>}
    </div>
  );
}
