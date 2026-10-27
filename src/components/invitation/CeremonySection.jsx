import DarkSection from './DarkSection.jsx';
import FamilyInfo from './FamilyInfo.jsx';
import DateBlock from './DateBlock.jsx';

/** THÔNG TIN LỄ CƯỚI: bố mẹ hai bên, tên cô dâu chú rể, giờ làm lễ */
export default function CeremonySection({ config }) {
  const { groom, bride, ceremony } = config;
  return (
    <DarkSection title="THÔNG TIN LỄ CƯỚI" flowerSide="right" flowerDelay={0.6} flowerTop="45%">
      <div className="families">
        <FamilyInfo person={groom} />
        <span className="families__divider" />
        <FamilyInfo person={bride} />
      </div>

      <p className="announcement">{config.announcement}</p>

      <div className="couple">
        <h3>{groom.fullName}</h3>
        <div className="couple__title">{groom.title}</div>
        <div className="couple__amp">&amp;</div>
        <h3>{bride.fullName}</h3>
        <div className="couple__title">{bride.title}</div>
      </div>

      <p className="muted-light">LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI {ceremony.place}</p>
      <DateBlock date={ceremony.date} time={ceremony.time} lunarText={ceremony.lunarText} prefix="VÀO LÚC" />
    </DarkSection>
  );
}
