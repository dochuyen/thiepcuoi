import Field from './Field.jsx';

/** Bộ trường cho cô dâu / chú rể (prefix = "groom" | "bride") */
export default function PersonFields({ prefix, bind }) {
  return (
    <>
      <Field label="Tên gọi (trang bìa)" {...bind(`${prefix}.shortName`)} />
      <Field label="Họ tên đầy đủ" {...bind(`${prefix}.fullName`)} />
      <Field label="Thứ bậc" placeholder="Trưởng Nam / Út Nữ" {...bind(`${prefix}.title`)} />
      <Field label="Tên bố (để trống thì ẩn)" {...bind(`${prefix}.father`)} />
      <Field label="Tên mẹ (để trống thì ẩn)" {...bind(`${prefix}.mother`)} />
      <Field label="Địa chỉ" {...bind(`${prefix}.address`)} />
    </>
  );
}
