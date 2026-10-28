import TimeInput from './TimeInput.jsx';

/** Danh sách mốc giờ trong ngày cưới */
export default function ScheduleEditor({ items, onChange }) {
  const update = (i, key, value) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: value } : it)));

  return (
    <div className="field--wide list-editor">
      {items.map((item, i) => (
        <div key={i} className="list-editor__row">
          <TimeInput value={item.time} onChange={(v) => update(i, 'time', v)} />
          <input value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Hoạt động" />
          <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            Xoá
          </button>
        </div>
      ))}
      <button type="button" className="a-btn" onClick={() => onChange([...items, { time: '', label: '' }])}>
        + Thêm mốc
      </button>
    </div>
  );
}
