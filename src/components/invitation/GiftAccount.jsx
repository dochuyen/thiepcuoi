import { useState } from 'react';
import { vietQrUrl } from '../../utils/vietqr.js';

/** Một tài khoản nhận mừng cưới: QR + thông tin + nút lưu QR / sao chép STK */
export default function GiftAccount({ gift }) {
  const [copied, setCopied] = useState(false);
  const qr = vietQrUrl(gift);

  const copy = async () => {
    await navigator.clipboard.writeText(gift.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = async () => {
    try {
      const blob = await fetch(qr).then((r) => r.blob());
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `QR-${gift.label}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(qr, '_blank');
    }
  };

  return (
    <div className="gift-account">
      <h3>
        {gift.label} - {gift.accountName}
      </h3>
      <div className="gift-account__qr">
        <img src={qr} alt={`QR - ${gift.label}`} />
      </div>
      <p className="gift-account__bank">{gift.bankName}</p>
      <p className="gift-account__number" onClick={copy} title="Bấm để sao chép">
        {gift.accountNumber} {copied ? '✓' : '⧉'}
      </p>
      <p>{gift.accountName}</p>
      <button type="button" className="btn-soft" onClick={download}>
        ⤓ Lưu QR
      </button>
    </div>
  );
}
