import { useState } from 'react';
import FlowerBouquet from '../common/FlowerBouquet.jsx';
import FloatingHearts from '../common/FloatingHearts.jsx';
import { parseDate } from '../../utils/date.js';

/** Màn hình mở thiệp: tên cô dâu chú rể, ngày cưới, "Thân Mời" + tên khách, nút Mở thiệp (bật nhạc) */
export default function EnvelopeIntro({ config, guest, onOpen }) {
  const [closing, setClosing] = useState(false);
  const d = parseDate(config.reception.date);

  const open = () => {
    setClosing(true);
    onOpen();
  };

  return (
    <div className={`intro ${closing ? 'intro--closing' : ''}`}>
      <FloatingHearts />
      <div className="intro__card">
        <FlowerBouquet className="intro__flower intro__flower--left" />
        <FlowerBouquet className="intro__flower intro__flower--right" flip />

        <div className="intro__heart" aria-hidden="true">
          ♥
        </div>
        <p className="intro__names">
          {config.groom.shortName}
          <span>&amp;</span>
          {config.bride.shortName}
        </p>
        <div className="intro__divider" aria-hidden="true">
          <span>❦</span>
        </div>
        <p className="intro__date">
          {d.getDate()} tháng {d.getMonth() + 1}, {d.getFullYear()}
        </p>

        <p className="intro__invite">Thân Mời</p>
        {guest && <p className="intro__guest">{[guest.salutation, guest.name].filter(Boolean).join(' ')}</p>}

        <button type="button" className="intro__btn" onClick={open}>
          Mở thiệp
        </button>
      </div>
    </div>
  );
}
