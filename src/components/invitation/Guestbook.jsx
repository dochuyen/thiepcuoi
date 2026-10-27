import { useState } from 'react';
import Reveal from '../common/Reveal.jsx';
import FlowerBouquet from '../common/FlowerBouquet.jsx';
import { api } from '../../api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { formatDateTime } from '../../utils/date.js';

const SAMPLE_WISHES = [
  'Chúc mừng ngày vui của hai bạn, trăm năm hạnh phúc bền lâu!',
  'Chúc hai bạn sống bên nhau đầu bạc răng long.',
  'Mừng hạnh phúc hai bạn! Chúc gia đình nhỏ luôn đầy ắp tiếng cười.',
  'Chúc cô dâu chú rể luôn giữ được nụ cười này mãi mãi nhé!',
  'Chúc hai bạn trăm năm viên mãn, sớm có tin vui!',
];

/** Sổ lưu bút: form gửi lời chúc + danh sách lời chúc */
export default function Guestbook({ guest }) {
  const { data: wishes, setData } = useAsync(api.getWishes);
  const [form, setForm] = useState({ name: guest?.name ?? '', message: '' });
  const [sending, setSending] = useState(false);

  const suggest = () => setForm((f) => ({ ...f, message: SAMPLE_WISHES[Math.floor(Math.random() * SAMPLE_WISHES.length)] }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const wish = await api.sendWish(form);
      setData((list) => [wish, ...(list ?? [])]);
      setForm((f) => ({ ...f, message: '' }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="light-section guestbook">
      <Reveal>
        <form className="form guestbook__card" onSubmit={submit}>
          <FlowerBouquet className="guestbook__flower" />
          <h2 className="section-title">SỔ LƯU BÚT</h2>
          <input
            placeholder="Nhập tên*"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={120}
          />
          <textarea
            placeholder="Nhập lời chúc*"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            maxLength={2000}
          />
          <div className="guestbook__actions">
            <button type="button" className="btn-icon" title="Gợi ý lời chúc" onClick={suggest}>
              🪄
            </button>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC'}
            </button>
          </div>
        </form>

        <div className="wishes">
          {wishes?.length === 0 && <p className="muted">Hãy là người đầu tiên gửi lời chúc ♡</p>}
          {wishes?.map((w) => (
            <div key={w.id} className="wish">
              <div className="wish__head">
                <span className="wish__name">{w.name}</span>
                <span className="wish__time">{formatDateTime(w.createdAt)}</span>
              </div>
              <p>{w.message}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
