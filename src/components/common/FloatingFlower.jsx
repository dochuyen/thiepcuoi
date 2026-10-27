import FlowerBouquet from './FlowerBouquet.jsx';

/** Bó hoa lơ lửng bên mép các khối đỏ */
export default function FloatingFlower({ side = 'right', delay = 0, top = '40%' }) {
  return (
    <span className={`floating-flower floating-flower--${side}`} style={{ top }} aria-hidden="true">
      <span className="float-anim" style={{ animationDelay: `${delay}s` }}>
        <FlowerBouquet flip={side === 'left'} />
      </span>
    </span>
  );
}
