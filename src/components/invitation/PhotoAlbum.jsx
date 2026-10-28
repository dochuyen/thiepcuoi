import { useEffect, useState } from 'react';
import Reveal from '../common/Reveal.jsx';
import CastleBackdrop from '../common/CastleBackdrop.jsx';
import Lightbox from './Lightbox.jsx';

/** Vị trí 3D của ảnh theo khoảng cách tới ảnh đang xem (giống carousel của mẫu) */
function slideStyle(offset) {
  const abs = Math.abs(offset);
  return {
    transform: `translateX(${offset * 60}%) translateZ(${-abs * 150}px) rotateY(${offset * 45}deg) scale(${abs === 0 ? 1 : abs === 1 ? 0.85 : 0.7})`,
    opacity: Math.max(1 - abs * 0.25, 0),
    zIndex: 100 - abs,
  };
}

export default function PhotoAlbum({ photos }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const n = photos.length;

  // Tự chuyển ảnh mỗi 4 giây
  useEffect(() => {
    if (n < 2 || lightboxOpen) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n, lightboxOpen]);

  if (!n) return null;
  const go = (step) => setIndex((i) => (i + step + n) % n);

  return (
    <section className="light-section album">
      <CastleBackdrop top="-6%" width="150%" />
      <Reveal>
        {/* <h2 className="section-title">Album Ảnh</h2> */}
        <div className="album__stage">
          <button type="button" className="album__nav album__nav--prev" onClick={() => go(-1)} aria-label="Ảnh trước">
            ‹
          </button>
          <button type="button" className="album__nav album__nav--next" onClick={() => go(1)} aria-label="Ảnh sau">
            ›
          </button>
          <div className="album__track">
            {photos.map((src, i) => {
              // khoảng cách vòng tròn ngắn nhất từ ảnh hiện tại
              let offset = i - index;
              if (offset > n / 2) offset -= n;
              if (offset < -n / 2) offset += n;
              return (
                <div
                  key={src + i}
                  className="album__slide"
                  style={slideStyle(offset)}
                  onClick={() => (offset === 0 ? setLightboxOpen(true) : setIndex(i))}
                >
                  <img src={src} alt={`Ảnh cưới ${i + 1}`} loading="lazy" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="album__dots">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === index ? 'is-active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Xem ảnh ${i + 1}`}
            />
          ))}
        </div>
      </Reveal>

      {lightboxOpen && (
        <Lightbox photos={photos} index={index} onChange={setIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </section>
  );
}
