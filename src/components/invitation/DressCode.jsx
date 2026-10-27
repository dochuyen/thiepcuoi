import Reveal from '../common/Reveal.jsx';

export default function DressCode({ dressCode }) {
  return (
    <section className="light-section dress-code">
      <Reveal>
        <h2 className="section-title">DRESS CODE</h2>
        <p className="muted">{dressCode.note}</p>
        <div className="dress-code__swatches">
          {dressCode.colors.map((c) => (
            <span key={c} style={{ backgroundColor: c }} title={c} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
