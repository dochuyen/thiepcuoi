import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Xem ảnh toàn màn hình, vuốt / phím mũi tên để chuyển ảnh */
export default function Lightbox({ photos, index, onChange, onClose }) {
  const n = photos.length;
  const touchX = useRef(null);
  const go = (step) => onChange((index + step + n) % n);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((index - 1 + n) % n);
      if (e.key === 'ArrowRight') onChange((index + 1) % n);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, n, onChange, onClose]);

  return createPortal(
    <div className="lightbox" onClick={onClose}>
      <button type="button" className="lightbox__close" aria-label="Đóng">
        ✕
      </button>
      <div className="lightbox__counter">
        {index + 1} / {n}
      </div>
      <div
        className="lightbox__main"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <button type="button" className="lightbox__nav" onClick={() => go(-1)} aria-label="Ảnh trước">
          ‹
        </button>
        <img src={photos[index]} alt={`Ảnh cưới ${index + 1}`} />
        <button type="button" className="lightbox__nav" onClick={() => go(1)} aria-label="Ảnh sau">
          ›
        </button>
      </div>
      <div className="lightbox__thumbs" onClick={(e) => e.stopPropagation()}>
        {photos.map((src, i) => (
          <button key={i} type="button" className={i === index ? 'is-active' : ''} onClick={() => onChange(i)}>
            <img src={src} alt={`Thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
