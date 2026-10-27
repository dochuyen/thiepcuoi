import GuestRow from './GuestRow.jsx';

export default function GuestTable({ guests, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Khách mời</th>
            <th>Khách của</th>
            <th>Link mời riêng</th>
            <th>Đã mở</th>
            <th>Phản hồi</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 && (
            <tr>
              <td colSpan={6} className="table__empty">
                Chưa có khách mời nào. Bấm “+ Thêm khách” để bắt đầu.
              </td>
            </tr>
          )}
          {guests.map((g) => (
            <GuestRow key={g.id} guest={g} onEdit={() => onEdit(g)} onDelete={() => onDelete(g)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
