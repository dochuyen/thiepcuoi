/** Nhóm cài đặt; hint = dòng giải thích phần này hiện ở đâu trên thiệp */
export default function Section({ title, hint, children }) {
  return (
    <fieldset className="settings-section">
      <legend>{title}</legend>
      {hint && <p className="settings-section__hint">{hint}</p>}
      <div className="settings-section__grid">{children}</div>
    </fieldset>
  );
}
