import { useState } from 'react';
import DarkSection from './DarkSection.jsx';
import DateBlock from './DateBlock.jsx';
import MiniCalendar from './MiniCalendar.jsx';
import RsvpModal from './RsvpModal.jsx';
import { googleCalendarUrl } from '../../utils/date.js';

/** THÔNG TIN TIỆC CƯỚI: giờ đón khách, lịch tháng, thêm vào lịch, nút xác nhận tham dự */
export default function ReceptionSection({ config, guest }) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const { reception, groom, bride } = config;

  const calendarUrl = googleCalendarUrl({
    title: `Đám cưới ${groom.fullName} & ${bride.fullName}`,
    date: reception.date,
    time: reception.welcomeTime || reception.time,
    location: `${reception.venueName}, ${reception.address}`,
  });

  return (
    <DarkSection title="THÔNG TIN TIỆC CƯỚI" flowerSide="left" flowerDelay={0.3} flowerTop="8%">
      <h3 className="reception__heading">Tiệc cưới sẽ diễn ra vào lúc:</h3>
      <DateBlock date={reception.date} time={reception.time} lunarText={reception.lunarText} />

      <div className="reception__times">
        <div>
          <span>Đón khách</span>
          <strong>{reception.welcomeTime}</strong>
        </div>
        <div>
          <span>Khai tiệc</span>
          <strong>{reception.time}</strong>
        </div>
      </div>

      <MiniCalendar date={reception.date} />

      <a className="btn-outline-light" href={calendarUrl} target="_blank" rel="noreferrer">
        Thêm vào lịch
      </a>
      <button type="button" className="btn-cream" onClick={() => setRsvpOpen(true)}>
        XÁC NHẬN THAM DỰ
      </button>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} guest={guest} />
    </DarkSection>
  );
}
