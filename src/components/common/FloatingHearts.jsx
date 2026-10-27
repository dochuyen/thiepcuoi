const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 10 + ((i * 7) % 14),
  duration: 9 + ((i * 5) % 8),
  delay: (i * 1.3) % 10,
  color: i % 3 === 0 ? 'rgba(236, 228, 216, 0.55)' : 'rgba(201, 162, 74, 0.7)',
}));

/** Trái tim bay lên trên nền đỏ ở màn hình mở thiệp */
export default function FloatingHearts() {
  return (
    <div className="hearts" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            color: h.color,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
