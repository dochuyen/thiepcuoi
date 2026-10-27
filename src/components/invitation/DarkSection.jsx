import FloatingFlower from '../common/FloatingFlower.jsx';
import Reveal from '../common/Reveal.jsx';

/** Khối nền đỏ đậm dùng chung cho các phần Lễ cưới / Tiệc cưới / Lịch trình */
export default function DarkSection({ title, flowerSide = 'right', flowerDelay = 0, flowerTop, children, ...rest }) {
  return (
    <section className="dark-section" {...rest}>
      <FloatingFlower side={flowerSide} delay={flowerDelay} top={flowerTop} />
      <Reveal className="dark-section__card">
        {title && <h2 className="section-title section-title--light">{title}</h2>}
        {children}
      </Reveal>
    </section>
  );
}
