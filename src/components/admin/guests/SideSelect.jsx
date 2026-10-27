export default function SideSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="groom">Nhà trai</option>
      <option value="bride">Nhà gái</option>
    </select>
  );
}
