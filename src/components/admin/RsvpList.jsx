import { adminApi } from '../../api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { formatDateTime } from '../../utils/date.js';
import { downloadCsv } from '../../utils/csv.js';
import StatCards from './StatCards.jsx';

export default function RsvpList() {
  const { data: rsvps, loading, error, setData } = useAsync(adminApi.getRsvps);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="admin-error">{error.message}</p>;

  const attending = rsvps.filter((r) => r.attending);
  const people = attending.reduce((sum, r) => sum + r.guestCount, 0);

  const remove = async (id) => {
    if (!confirm('Xoá phản hồi này?')) return;
    await adminApi.deleteRsvp(id);
    setData((list) => list.filter((r) => r.id !== id));
  };

  const exportCsv = () =>
    downloadCsv(
      'xac-nhan-tham-du.csv',
      ['Tên', 'Tham dự', 'Số người', 'Khách của', 'Lời nhắn', 'Thời gian'],
      rsvps.map((r) => [
        r.name,
        r.attending ? 'Có' : 'Không',
        r.attending ? r.guestCount : 0,
        r.side === 'bride' ? 'Nhà gái' : 'Nhà trai',
        r.message,
        formatDateTime(r.createdAt),
      ]),
    );

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Xác nhận tham dự</h2>
        <button type="button" className="a-btn" onClick={exportCsv} disabled={!rsvps.length}>
          ⤓ Xuất Excel (CSV)
        </button>
      </div>

      <StatCards
        items={[
          { label: 'Phản hồi', value: rsvps.length },
          { label: 'Sẽ tham dự', value: attending.length, tone: 'green' },
          { label: 'Tổng số người', value: people, tone: 'wine' },
          { label: 'Không tham dự', value: rsvps.length - attending.length, tone: 'grey' },
        ]}
      />

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Số người</th>
              <th>Khách của</th>
              <th>Lời nhắn</th>
              <th>Thời gian</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={7} className="table__empty">
                  Chưa có phản hồi nào
                </td>
              </tr>
            )}
            {rsvps.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.name}</strong>
                  {r.guestId && <span className="badge badge--soft">từ link mời</span>}
                </td>
                <td>
                  <span className={`badge ${r.attending ? 'badge--green' : 'badge--grey'}`}>
                    {r.attending ? 'Tham dự' : 'Không tham dự'}
                  </span>
                </td>
                <td>{r.attending ? r.guestCount : '-'}</td>
                <td>{r.side === 'bride' ? 'Nhà gái' : 'Nhà trai'}</td>
                <td className="table__msg">{r.message}</td>
                <td className="table__time">{formatDateTime(r.createdAt)}</td>
                <td>
                  <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(r.id)}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
