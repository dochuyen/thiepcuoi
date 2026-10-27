import FlowerBouquet from '../common/FlowerBouquet.jsx';

/** Phong bao lì xì đỏ có hoa (CSS + SVG) */
export default function RedEnvelope({ className = '' }) {
  return (
    <span className={`red-envelope ${className}`}>
      <span className="red-envelope__flap" />
      <FlowerBouquet className="red-envelope__flower" />
      <span className="red-envelope__seal">囍</span>
    </span>
  );
}
