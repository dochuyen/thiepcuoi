/** Thông tin một bên gia đình; dòng Bố / Mẹ / địa chỉ để trống trong admin thì ẩn */
export default function FamilyInfo({ label, person }) {
  return (
    <div className="family">
      <span className="family__label">{label}</span>
      {person.father && (
        <span className="family__name">
          <span className="family__role">Bố:</span> {person.father}
        </span>
      )}
      {person.mother && (
        <span className="family__name">
          <span className="family__role">Mẹ:</span> {person.mother}
        </span>
      )}
      {person.address && <div className="family__address">{person.address}</div>}
    </div>
  );
}
