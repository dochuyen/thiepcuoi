import { useState } from 'react';

/** Quản lý album: thêm URL ảnh, đổi thứ tự, xoá */
export default function GalleryEditor({ photos, onChange }) {
  const [url, setUrl] = useState('');

  const add = () => {
    if (!url.trim()) return;
    onChange([...photos, url.trim()]);
    setUrl('');
  };

  const move = (i, step) => {
    const next = [...photos];
    [next[i], next[i + step]] = [next[i + step], next[i]];
    onChange(next);
  };

  return (
    <div className="field--wide">
      <span className="field-label">Album ảnh ({photos.length})</span>
      <div className="gallery-editor">
        {photos.map((src, i) => (
          <div key={src + i} className="gallery-editor__item">
            <img src={src} alt="" />
            <div className="gallery-editor__tools">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} title="Lên trước">
                ←
              </button>
              <button type="button" onClick={() => onChange(photos.filter((_, j) => j !== i))} title="Xoá">
                ✕
              </button>
              <button type="button" disabled={i === photos.length - 1} onClick={() => move(i, 1)} title="Ra sau">
                →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="inline-add">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Dán URL ảnh rồi bấm Thêm"
        />
        <button type="button" className="a-btn" onClick={add}>
          Thêm ảnh
        </button>
      </div>
    </div>
  );
}
