import { useState } from 'react';
import { adminApi } from '../../../api.js';

/** Đưa dữ liệu của bản chạy trên máy (file data/db.json) lên Firestore */
export default function LegacyImport() {
  const [status, setStatus] = useState('');

  const importFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!confirm('Nhập dữ liệu từ file này? Cài đặt thiệp hiện tại sẽ bị thay bằng cài đặt trong file.')) return;
    setStatus('Đang nhập...');
    try {
      const n = await adminApi.importLegacy(JSON.parse(await file.text()));
      setStatus(`✓ Đã nhập cài đặt thiệp, ${n.guests} khách mời, ${n.rsvps} xác nhận, ${n.wishes} lời chúc. Tải lại trang để xem.`);
    } catch (err) {
      setStatus(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="field--wide">
      <label className="a-btn">
        Chọn file db.json…
        <input type="file" accept=".json,application/json" hidden onChange={importFile} />
      </label>
      {status && <p className={status.startsWith('Lỗi') ? 'admin-error' : 'saved-note'}>{status}</p>}
    </div>
  );
}
