import { useMemo, useState } from 'react';
import { adminApi } from '../../../api.js';
import SideSelect from './SideSelect.jsx';

/**
 * Thêm nhiều khách một lần, mỗi dòng 1 khách:
 *   "Anh | Nguyễn Minh Tuấn"   -> danh xưng + tên
 *   "Trần Thu Hà"              -> chỉ tên
 */
function parseLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, b] = line.split('|').map((s) => s.trim());
      return b !== undefined ? { salutation: a, name: b } : { salutation: '', name: a };
    })
    .filter((g) => g.name);
}

export default function BulkAddGuests({ onSaved, onCancel }) {
  const [text, setText] = useState('');
  const [side, setSide] = useState('groom');
  const [group, setGroup] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const parsed = useMemo(() => parseLines(text), [text]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      onSaved(await adminApi.addGuests(parsed.map((g) => ({ ...g, side, group }))));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card-form" onSubmit={submit}>
      <h3>Thêm nhiều khách mời</h3>
      <p className="hint">
        Mỗi dòng một khách. Có danh xưng thì dùng dấu <code>|</code> để ngăn cách, ví dụ <code>Anh | Nguyễn Minh Tuấn</code>.
      </p>
      <textarea
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'Anh | Nguyễn Minh Tuấn\nChị | Trần Thu Hà\nGia đình | Cô Lan\nLê Văn Nam'}
        autoFocus
      />
      <div className="card-form__grid">
        <label>
          Khách của
          <SideSelect value={side} onChange={(e) => setSide(e.target.value)} />
        </label>
        <label className="span-2">
          Nhóm (áp dụng cho tất cả)
          <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="VD: Bạn cấp 3" />
        </label>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="card-form__actions">
        <button type="button" className="a-btn" onClick={onCancel}>
          Huỷ
        </button>
        <button className="a-btn a-btn--primary" disabled={saving || !parsed.length}>
          {saving ? 'Đang thêm...' : `Thêm ${parsed.length} khách`}
        </button>
      </div>
    </form>
  );
}
