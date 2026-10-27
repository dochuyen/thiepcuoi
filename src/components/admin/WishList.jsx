import { adminApi } from '../../api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { formatDateTime } from '../../utils/date.js';

/** Duyệt lời chúc: ẩn / hiện / xoá */
export default function WishList() {
  const { data: wishes, loading, error, setData } = useAsync(adminApi.getWishes);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="admin-error">{error.message}</p>;

  const toggle = async (w) => {
    const updated = await adminApi.setWishHidden(w.id, !w.hidden);
    setData((list) => list.map((x) => (x.id === w.id ? updated : x)));
  };

  const remove = async (id) => {
    if (!confirm('Xoá vĩnh viễn lời chúc này?')) return;
    await adminApi.deleteWish(id);
    setData((list) => list.filter((x) => x.id !== id));
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Lời chúc ({wishes.length})</h2>
      </div>
      {wishes.length === 0 && <p className="table__empty">Chưa có lời chúc nào</p>}
      <div className="wish-grid">
        {wishes.map((w) => (
          <div key={w.id} className={`wish-card ${w.hidden ? 'is-hidden' : ''}`}>
            <div className="wish-card__head">
              <strong>{w.name}</strong>
              <span>{formatDateTime(w.createdAt)}</span>
            </div>
            <p>{w.message}</p>
            <div className="wish-card__actions">
              <button type="button" className="a-btn a-btn--sm" onClick={() => toggle(w)}>
                {w.hidden ? 'Hiện lại' : 'Ẩn khỏi thiệp'}
              </button>
              <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={() => remove(w.id)}>
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
