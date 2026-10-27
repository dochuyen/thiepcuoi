import { useMemo, useState } from 'react';
import { adminApi } from '../../../api.js';
import { useAsync } from '../../../hooks/useAsync.js';
import { downloadCsv } from '../../../utils/csv.js';
import { inviteLink } from '../../../utils/inviteLink.js';
import StatCards from '../StatCards.jsx';
import GuestForm from './GuestForm.jsx';
import BulkAddGuests from './BulkAddGuests.jsx';
import GuestFilters from './GuestFilters.jsx';
import GuestTable from './GuestTable.jsx';

/** Trang quản lý khách mời: thêm / sửa / xoá, copy link mời riêng theo tên */
export default function GuestManager() {
  const { data: guests, loading, error, setData } = useAsync(adminApi.getGuests);
  const [mode, setMode] = useState(null); // null | 'add' | 'bulk' | guest đang sửa
  const [filters, setFilters] = useState({ q: '', side: 'all', status: 'all' });

  const filtered = useMemo(() => {
    if (!guests) return [];
    const q = filters.q.trim().toLowerCase();
    return guests.filter((g) => {
      if (q && !`${g.salutation} ${g.name} ${g.group} ${g.phone}`.toLowerCase().includes(q)) return false;
      if (filters.side !== 'all' && g.side !== filters.side) return false;
      if (filters.status === 'opened' && !g.openedAt) return false;
      if (filters.status === 'not-opened' && g.openedAt) return false;
      if (filters.status === 'attending' && !g.rsvp?.attending) return false;
      if (filters.status === 'no-reply' && g.rsvp) return false;
      return true;
    });
  }, [guests, filters]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="admin-error">{error.message}</p>;

  const handleAdded = (created) => {
    setData((list) => [...created, ...list]);
    setMode(null);
  };

  const handleUpdated = (updated) => {
    setData((list) => list.map((g) => (g.id === updated.id ? updated : g)));
    setMode(null);
  };

  const handleDelete = async (guest) => {
    if (!confirm(`Xoá khách mời "${guest.name}"? Link mời của khách này sẽ không còn hiển thị tên.`)) return;
    await adminApi.deleteGuest(guest.id);
    setData((list) => list.filter((g) => g.id !== guest.id));
  };

  const exportCsv = () =>
    downloadCsv(
      'danh-sach-khach-moi.csv',
      ['Danh xưng', 'Tên', 'Khách của', 'Nhóm', 'SĐT', 'Link mời', 'Đã mở thiệp', 'Phản hồi'],
      guests.map((g) => [
        g.salutation,
        g.name,
        g.side === 'bride' ? 'Nhà gái' : 'Nhà trai',
        g.group,
        g.phone,
        inviteLink(g.slug),
        g.openedAt ? 'Rồi' : 'Chưa',
        g.rsvp ? (g.rsvp.attending ? `Tham dự (${g.rsvp.guestCount})` : 'Không tham dự') : 'Chưa phản hồi',
      ]),
    );

  const editing = mode && typeof mode === 'object' ? mode : null;

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Khách mời</h2>
        <div className="panel__buttons">
          <button type="button" className="a-btn" onClick={exportCsv} disabled={!guests.length}>
            ⤓ Xuất CSV
          </button>
          <button type="button" className="a-btn" onClick={() => setMode('bulk')}>
            ☰ Thêm nhiều
          </button>
          <button type="button" className="a-btn a-btn--primary" onClick={() => setMode('add')}>
            + Thêm khách
          </button>
        </div>
      </div>

      <StatCards
        items={[
          { label: 'Tổng khách mời', value: guests.length },
          { label: 'Nhà trai', value: guests.filter((g) => g.side === 'groom').length },
          { label: 'Nhà gái', value: guests.filter((g) => g.side === 'bride').length },
          { label: 'Đã mở thiệp', value: guests.filter((g) => g.openedAt).length, tone: 'wine' },
          { label: 'Xác nhận tham dự', value: guests.filter((g) => g.rsvp?.attending).length, tone: 'green' },
        ]}
      />

      {mode === 'add' && <GuestForm onSaved={handleAdded} onCancel={() => setMode(null)} />}
      {editing && (
        <GuestForm key={editing.id} guest={editing} onSaved={handleUpdated} onCancel={() => setMode(null)} />
      )}
      {mode === 'bulk' && <BulkAddGuests onSaved={handleAdded} onCancel={() => setMode(null)} />}

      <GuestFilters value={filters} onChange={setFilters} />
      <GuestTable guests={filtered} onEdit={setMode} onDelete={handleDelete} />
    </div>
  );
}
