export default function GuestFilters({ value, onChange }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div className="filters">
      <input type="search" placeholder="🔍 Tìm theo tên, nhóm, SĐT..." value={value.q} onChange={set('q')} />
      <select value={value.side} onChange={set('side')}>
        <option value="all">Tất cả</option>
        <option value="groom">Nhà trai</option>
        <option value="bride">Nhà gái</option>
      </select>
      <select value={value.status} onChange={set('status')}>
        <option value="all">Mọi trạng thái</option>
        <option value="opened">Đã mở thiệp</option>
        <option value="not-opened">Chưa mở thiệp</option>
        <option value="attending">Sẽ tham dự</option>
        <option value="no-reply">Chưa phản hồi</option>
      </select>
    </div>
  );
}
