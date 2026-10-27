import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

/** Nút nhạc nền nổi góc màn hình; cha gọi ref.play() khi khách mở thiệp */
const MusicPlayer = forwardRef(function MusicPlayer({ src }, ref) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () =>
    audio.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));

  useImperativeHandle(ref, () => ({ play }));

  if (!src) return null;

  const toggle = () => {
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else play();
  };

  return (
    <>
      <audio ref={audio} src={src} loop preload="auto" />
      <button
        type="button"
        className={`music-btn ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        <span className="music-btn__disc" />
        <span className="music-btn__bars">
          {[60, 100, 40, 80].map((h, i) => (
            <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      </button>
    </>
  );
});

export default MusicPlayer;
