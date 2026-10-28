import Reveal from '../common/Reveal.jsx';
import CastleBackdrop from '../common/CastleBackdrop.jsx';
import { coordsFromMapsLink } from '../../utils/maps.js';

/**
 * Địa điểm tổ chức + Google Maps nhúng + nút chỉ đường.
 * Có link Google Maps trong admin thì dùng đúng toạ độ trong link; không thì tìm theo tên + địa chỉ.
 */
export default function VenueMap({ reception }) {
  const full = `${reception.venueName}, ${reception.address}`;
  const link = reception.mapsUrl?.trim();
  const coords = coordsFromMapsLink(link);
  const q = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(full);
  // link rút gọn (maps.app.goo.gl) không đọc được toạ độ: nút Chỉ đường mở thẳng link đó
  const directions =
    link && !coords ? link : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  return (
    <section className="light-section venue">
      <CastleBackdrop top="-1%" width="158%" />
      <Reveal>
        <h3 className="section-title">Tiệc cưới sẽ tổ chức tại</h3>
        <p className="venue__address">{full}</p>
        <iframe
          className="venue__map"
          title="Bản đồ"
          src={`https://maps.google.com/maps?q=${q}&z=${coords ? 17 : 15}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className="btn-primary venue__btn"
          href={directions}
          target="_blank"
          rel="noreferrer"
        >
          Chỉ đường
        </a>
      </Reveal>
    </section>
  );
}
