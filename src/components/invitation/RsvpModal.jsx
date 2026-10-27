import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { api } from '../../api.js';

/** Form xác nhận tham dự; nếu mở từ link mời riêng thì tự điền tên và gắn với khách đó */
export default function RsvpModal({ open, onClose, guest }) {
  const [form, setForm] = useState({
    name: guest?.name ?? '',
    attending: true,
    guestCount: 1,
    side: 'groom',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.sendRsvp({ ...form, guestSlug: guest?.slug });
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Xác Nhận Tham Dự">
      {status === 'done' ? (
        <div className="rsvp-done">
          <p>Cảm ơn bạn đã phản hồi! ♡</p>
          <button type="button" className="btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <input placeholder="Họ và tên*" value={form.name} onChange={set('name')} required maxLength={120} />

          <div className="form__choices">
            <label className={form.attending ? 'is-checked' : ''}>
              <input
                type="radio"
                checked={form.attending}
                onChange={() => setForm((f) => ({ ...f, attending: true }))}
              />
              Tôi sẽ tham dự
            </label>
            <label className={!form.attending ? 'is-checked' : ''}>
              <input
                type="radio"
                checked={!form.attending}
                onChange={() => setForm((f) => ({ ...f, attending: false }))}
              />
              Rất tiếc, tôi không thể
            </label>
          </div>

          {form.attending && (
            <div className="form__row">
              <label>
                Số người
                <input type="number" min={1} max={20} value={form.guestCount} onChange={set('guestCount')} />
              </label>
              <label>
                Khách của
                <select value={form.side} onChange={set('side')}>
                  <option value="groom">Nhà trai</option>
                  <option value="bride">Nhà gái</option>
                </select>
              </label>
            </div>
          )}

          <textarea placeholder="Lời nhắn (không bắt buộc)" rows={3} value={form.message} onChange={set('message')} />
          {status === 'error' && <p className="form__error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Đang gửi...' : 'GỬI XÁC NHẬN'}
          </button>
        </form>
      )}
    </Modal>
  );
}
