import { vietQrUrl } from '../../../utils/vietqr.js';

const EMPTY = { label: '', bankCode: '', bankName: '', accountNumber: '', accountName: '' };

/** Tài khoản nhận mừng cưới; QR tạo tự động qua VietQR từ mã ngân hàng + STK */
export default function GiftsEditor({ gifts, onChange }) {
  const update = (i, key, value) => onChange(gifts.map((g, j) => (j === i ? { ...g, [key]: value } : g)));

  return (
    <div className="field--wide list-editor">
      {gifts.map((g, i) => (
        <div key={i} className="gift-editor">
          <div className="gift-editor__fields">
            <input placeholder="Nhãn (Chú Rể / Cô Dâu)" value={g.label} onChange={(e) => update(i, 'label', e.target.value)} />
            <input placeholder="Mã NH (VCB, TCB, MB...)" value={g.bankCode} onChange={(e) => update(i, 'bankCode', e.target.value)} />
            <input placeholder="Tên ngân hàng" value={g.bankName} onChange={(e) => update(i, 'bankName', e.target.value)} />
            <input placeholder="Số tài khoản" value={g.accountNumber} onChange={(e) => update(i, 'accountNumber', e.target.value)} />
            <input
              placeholder="Tên chủ TK (không dấu)"
              value={g.accountName}
              onChange={(e) => update(i, 'accountName', e.target.value.toUpperCase())}
            />
            <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={() => onChange(gifts.filter((_, j) => j !== i))}>
              Xoá tài khoản
            </button>
          </div>
          {g.bankCode && g.accountNumber && <img className="gift-editor__qr" src={vietQrUrl(g)} alt="QR" />}
        </div>
      ))}
      <button type="button" className="a-btn" onClick={() => onChange([...gifts, { ...EMPTY }])}>
        + Thêm tài khoản
      </button>
    </div>
  );
}
