import { NavLink } from 'react-router-dom';

// Đường dẫn tuyệt đối: layout nằm trong route "/admin/*" nên link tương đối bị nối thêm vào URL hiện tại
const TABS = [
  { to: '/admin/guests', label: 'Khách mời', icon: '👥' },
  { to: '/admin/rsvps', label: 'Xác nhận tham dự', icon: '✅' },
  { to: '/admin/wishes', label: 'Lời chúc', icon: '💌' },
  { to: '/admin/settings', label: 'Cài đặt thiệp', icon: '⚙️' },
];

export default function AdminLayout({ onLogout, children }) {
  return (
    <div className="admin">
      <header className="admin__topbar">
        <strong className="admin__brand">♡ Thiệp Cưới · Admin</strong>
        <nav className="admin__tabs">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__actions">
          <a href="/nha-trai" target="_blank" rel="noreferrer" className="a-btn a-btn--ghost">
            Thiệp nhà trai ↗
          </a>
          <a href="/nha-gai" target="_blank" rel="noreferrer" className="a-btn a-btn--ghost">
            Thiệp nhà gái ↗
          </a>
          <button type="button" className="a-btn a-btn--ghost" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="admin__content">{children}</main>
    </div>
  );
}
