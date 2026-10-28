import flowerImg from '../../assets/flower2-decoration.webp';

/** Bó hoa đỏ đô + kem */
export default function FlowerBouquet({ className = '', flip = false }) {
  return (
    <img
      className={`flower-bouquet ${className}`}
      src={flowerImg}
      alt=""
      aria-hidden="true"
      draggable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    />
  );
}
