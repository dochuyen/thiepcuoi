import FlowerBouquet from '../common/FlowerBouquet.jsx';
import CastleBackdrop from '../common/CastleBackdrop.jsx';
import GuestGreeting from './GuestGreeting.jsx';
import { coupleOrder } from '../../utils/couple.js';

/** Phần đầu: Save The Date + phong bì có ảnh cưới + tên cô dâu chú rể */
export default function Hero({ config, guest }) {
  const [first, second] = coupleOrder(config);
  return (
    <header className="hero">
      <CastleBackdrop top="26%" width="170%" />
      <p className="hero__eyebrow">Save The Date</p>

      <div className="envelope">
        <div className="envelope__back" />
        <div className="envelope__photo float-anim" style={{ animationDuration: '6.5s' }}>
          <img src={config.coverPhoto} alt={`${config.groom.shortName} & ${config.bride.shortName}`} />
        </div>
        <span className="envelope__flower float-anim" aria-hidden="true">
          <FlowerBouquet flip />
        </span>
        <div className="envelope__front" />
        <span className="envelope__seal" aria-hidden="true">
          ♥
        </span>
      </div>

      <div className="hero__names">
        <p>{first.person.shortName}</p>
        <span>&amp;</span>
        <p>{second.person.shortName}</p>
      </div>

      {guest && <GuestGreeting guest={guest} />}
    </header>
  );
}
