import DarkSection from './DarkSection.jsx';
import FamilyInfo from './FamilyInfo.jsx';
import DateBlock from './DateBlock.jsx';
import { coupleOrder } from '../../utils/couple.js';

/** THÔNG TIN LỄ CƯỚI: bố mẹ hai bên, tên cô dâu chú rể, giờ làm lễ */
export default function CeremonySection({ config }) {
  const { ceremony } = config;
  const [first, second] = coupleOrder(config);
  return (
    <DarkSection title="THÔNG TIN LỄ CƯỚI" flowerSide="right" flowerDelay={0.6} flowerTop="45%">
      <div className="families">
        <FamilyInfo label={first.familyLabel} person={first.person} />
        <span className="families__divider" />
        <FamilyInfo label={second.familyLabel} person={second.person} />
      </div>

      <p className="announcement">{config.announcement}</p>

      <div className="couple">
        <h3>{first.person.fullName}</h3>
        <div className="couple__title">{first.person.title}</div>
        <div className="couple__amp">&amp;</div>
        <h3>{second.person.fullName}</h3>
        <div className="couple__title">{second.person.title}</div>
      </div>

      <p className="muted-light">
        {ceremony.name || 'LỄ THÀNH HÔN'} ĐƯỢC CỬ HÀNH TẠI {ceremony.place}
      </p>
      <DateBlock date={ceremony.date} time={ceremony.time} lunarText={ceremony.lunarText} prefix="VÀO LÚC" />
    </DarkSection>
  );
}
