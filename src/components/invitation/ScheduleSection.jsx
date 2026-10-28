import { formatTime } from '../../utils/date.js';
import DarkSection from './DarkSection.jsx';

/** LỊCH TRÌNH NGÀY CƯỚI dạng timeline */
export default function ScheduleSection({ schedule }) {
  return (
    <DarkSection title="LỊCH TRÌNH NGÀY CƯỚI" flowerSide="right" flowerDelay={0.9} flowerTop="30%">
      <ol className="timeline">
        {schedule.map((item, i) => (
          <li key={i} className="timeline__item">
            <span className="timeline__time">{formatTime(item.time)}</span>
            <span className="timeline__dot" aria-hidden="true" />
            <span className="timeline__label">{item.label}</span>
          </li>
        ))}
      </ol>
    </DarkSection>
  );
}
