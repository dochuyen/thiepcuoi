import Reveal from '../common/Reveal.jsx';

/** Địa điểm tổ chức + Google Maps nhúng + nút chỉ đường */
export default function VenueMap({ reception }) {
  const full = `${reception.venueName}, ${reception.address}`;
  const q = encodeURIComponent(full);
  return (
    <section className="light-section venue">
      <Reveal>
        <h3 className="section-title">Tiệc cưới sẽ tổ chức tại</h3>
        <p className="venue__address">{full}</p>
        <iframe
          className="venue__map"
          title="Bản đồ"
          src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className="btn-primary venue__btn"
          href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
          target="_blank"
          rel="noreferrer"
        >
          Chỉ đường
        </a>
      </Reveal>
    </section>
  );
}
