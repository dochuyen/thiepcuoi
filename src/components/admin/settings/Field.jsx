/** Ô nhập có nhãn; onChange nhận thẳng giá trị (không phải event) */
export default function Field({ label, value, onChange, type = 'text', multiline, wide, placeholder }) {
  const props = { value, placeholder, onChange: (e) => onChange(e.target.value) };
  return (
    <label className={`field ${wide ? 'field--wide' : ''}`}>
      <span>{label}</span>
      {multiline ? <textarea rows={3} {...props} /> : <input type={type} {...props} />}
    </label>
  );
}
