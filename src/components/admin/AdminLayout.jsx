import { NavLink } from 'react-router-dom';

const TABS = [
  { to: 'guests', label: 'Khách mời', icon: '👥' },
  { to: 'rsvps', label: 'Xác nhận tham dự', icon: '✅' },
  { to: 'wishes', label: 'Lời chúc', icon: '💌' },
  { to: 'settings', label: 'Cài đặt thiệp', icon: '⚙️' },
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
          <a href="/" target="_blank" rel="noreferrer" className="a-btn a-btn--ghost">
            Xem thiệp ↗
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
