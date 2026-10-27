import { useState } from 'react';
import { adminApi } from '../../../api.js';
import SideSelect from './SideSelect.jsx';

const SALUTATIONS = ['Anh', 'Chị', 'Em', 'Bạn', 'Anh Chị', 'Ông Bà', 'Cô Chú', 'Gia đình', 'Thầy', 'Cô'];
const EMPTY = { salutation: '', name: '', side: 'groom', group: '', phone: '', note: '' };

/** Form thêm mới hoặc sửa 1 khách mời (truyền `guest` để sửa) */
export default function GuestForm({ guest, onSaved, onCancel }) {
  const [form, setForm] = useState(guest ? { ...EMPTY, ...guest } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const result = guest ? await adminApi.updateGuest(guest.id, form) : await adminApi.addGuests(form);
      onSaved(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const preview = [form.salutation, form.name].filter(Boolean).join(' ');

  return (
    <form className="card-form" onSubmit={submit}>
      <h3>{guest ? `Sửa khách mời: ${guest.name}` : 'Thêm khách mời'}</h3>
      <div className="card-form__grid">
        <label>
          Danh xưng
          <input list="salutations" value={form.salutation} onChange={set('salutation')} placeholder="VD: Anh, Chị, Gia đình" />
          <datalist id="salutations">
            {SALUTATIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>
        <label className="span-2">
          Tên khách mời *
          <input value={form.name} onChange={set('name')} placeholder="VD: Nguyễn Minh Tuấn" required autoFocus />
        </label>
        <label>
          Khách của
          <SideSelect value={form.side} onChange={set('side')} />
        </label>
        <label>
          Nhóm
          <input value={form.group} onChange={set('group')} placeholder="VD: Bạn đại học, Đồng nghiệp" />
        </label>
        <label>
          Số điện thoại
          <input value={form.phone} onChange={set('phone')} placeholder="Không bắt buộc" />
        </label>
        <label className="span-3">
          Ghi chú
          <input value={form.note} onChange={set('note')} />
        </label>
      </div>

      {preview && (
        <div className="invite-preview">
          Thiệp sẽ hiển thị: <span>Trân trọng kính mời</span> <strong>{preview}</strong>
        </div>
      )}
      {error && <div className="admin-error">{error}</div>}

      <div className="card-form__actions">
        <button type="button" className="a-btn" onClick={onCancel}>
          Huỷ
        </button>
        <button className="a-btn a-btn--primary" disabled={saving}>
          {saving ? 'Đang lưu...' : guest ? 'Lưu thay đổi' : 'Thêm khách'}
        </button>
      </div>
    </form>
  );
}
