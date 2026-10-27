export default function Section({ title, children }) {
  return (
    <fieldset className="settings-section">
      <legend>{title}</legend>
      <div className="settings-section__grid">{children}</div>
    </fieldset>
  );
}
