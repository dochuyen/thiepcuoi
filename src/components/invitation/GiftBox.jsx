import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Reveal from '../common/Reveal.jsx';
import CastleBackdrop from '../common/CastleBackdrop.jsx';
import GiftAccount from './GiftAccount.jsx';
import RedEnvelope from './RedEnvelope.jsx';

const SPARKLES = [
  { top: '6%', left: '12%', size: 21 },
  { top: '14%', right: '8%', size: 15 },
  { top: '34%', left: '3%', size: 13 },
  { top: '24%', right: '3%', size: 13 },
];

/** Hộp quà mừng: 2 phong bao lì xì, bấm để mở popup QR chuyển khoản */
export default function GiftBox({ gifts }) {
  const [open, setOpen] = useState(false);
  if (!gifts?.length) return null;

  return (
    <section className="light-section gift">
      <CastleBackdrop top="6%" width="155%" />
      <Reveal>
        <h2 className="section-title">Hộp Quà Mừng</h2>
        <button type="button" className="gift__box" onClick={() => setOpen(true)} aria-label="Mở hộp mừng cưới">
          {SPARKLES.map((s, i) => (
            <span key={i} className="gift__sparkle" style={{ ...s, fontSize: s.size, animationDelay: `${i * 0.4}s` }}>
              ✦
            </span>
          ))}
          <span className="gift__envelopes">
            <RedEnvelope className="gift__envelope gift__envelope--back" />
            <RedEnvelope className="gift__envelope gift__envelope--front float-anim" />
          </span>
          <span className="gift__hint">Nhấn để mở</span>
        </button>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title="Hộp Quà Mừng" className="gift-modal">
        <div className="gift__accounts">
          {gifts.map((g, i) => (
            <GiftAccount key={i} gift={g} />
          ))}
        </div>
      </Modal>
    </section>
  );
}
