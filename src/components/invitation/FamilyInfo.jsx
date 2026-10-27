export default function FamilyInfo({ person }) {
  return (
    <div className="family">
      <span className="family__label">Ông Bà</span>
      <span className="family__name">{person.father}</span>
      <span className="family__name">{person.mother}</span>
      <div className="family__address">{person.address}</div>
    </div>
  );
}
