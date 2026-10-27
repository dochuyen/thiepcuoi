/** Một bông hoa mẫu đơn: các lớp cánh tròn chồng lên nhau */
function Peony({ x, y, r, color, dark }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="0" cy={-r * 0.55} rx={r * 0.55} ry={r * 0.6} fill={color} transform={`rotate(${deg})`} />
      ))}
      {[30, 110, 190, 270].map((deg) => (
        <ellipse key={deg} cx="0" cy={-r * 0.3} rx={r * 0.38} ry={r * 0.42} fill={dark} transform={`rotate(${deg})`} />
      ))}
      <circle r={r * 0.28} fill={dark} />
      <circle r={r * 0.12} fill="#c9a24a" opacity=".8" />
    </g>
  );
}

function Leaf({ x, y, rotate, size = 1, color = '#8a9a6e' }) {
  return (
    <path
      d="M0 0 C6 -10 18 -12 26 -6 C18 0 8 4 0 0Z"
      fill={color}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size})`}
    />
  );
}

function Berries({ x, y, rotate }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0 C2 -14 4 -26 10 -40" stroke="#6b3a3a" strokeWidth="1" fill="none" />
      {[
        [3, -12],
        [5, -22],
        [8, -32],
        [11, -40],
        [-2, -18],
        [12, -27],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="#6b1e25" />
      ))}
    </g>
  );
}

/** Bó hoa đỏ đô + kem vẽ bằng SVG (thay cho ảnh hoa của mẫu gốc) */
export default function FlowerBouquet({ className = '', flip = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 220"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <Berries x={70} y={70} rotate={-10} />
      <Berries x={95} y={60} rotate={20} />
      <Berries x={40} y={90} rotate={-35} />
      <Leaf x={30} y={120} rotate={-150} size={1.4} />
      <Leaf x={120} y={110} rotate={-30} size={1.3} />
      <Leaf x={60} y={190} rotate={110} size={1.3} color="#a3ad85" />
      <Leaf x={110} y={175} rotate={40} size={1.2} />
      <Leaf x={80} y={90} rotate={-80} size={1.1} color="#a3ad85" />
      <Leaf x={20} y={170} rotate={160} size={1.1} color="#a3ad85" />
      <Peony x={70} y={125} r={30} color="#7a1f2a" dark="#5a1219" />
      <Peony x={105} y={160} r={22} color="#e9dcc6" dark="#cdb898" />
      <Peony x={45} y={170} r={24} color="#6b1e25" dark="#4a0f15" />
      <Peony x={108} y={105} r={16} color="#8c3a3f" dark="#6b1e25" />
      <circle cx="35" cy="135" r="6" fill="#e9dcc6" />
      <circle cx="128" cy="140" r="5" fill="#e9dcc6" />
    </svg>
  );
}
