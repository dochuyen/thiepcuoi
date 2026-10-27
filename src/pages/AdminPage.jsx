import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken, setToken } from '../api.js';
import LoginForm from '../components/admin/LoginForm.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import GuestManager from '../components/admin/guests/GuestManager.jsx';
import RsvpList from '../components/admin/RsvpList.jsx';
import WishList from '../components/admin/WishList.jsx';
import SettingsForm from '../components/admin/settings/SettingsForm.jsx';
import '../styles/admin.css';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(Boolean(getToken()));

  // api.js phát sự kiện này khi token hết hạn (server khởi động lại)
  useEffect(() => {
    const onLogout = () => setLoggedIn(false);
    window.addEventListener('admin-logout', onLogout);
    return () => window.removeEventListener('admin-logout', onLogout);
  }, []);

  if (!loggedIn) return <LoginForm onSuccess={() => setLoggedIn(true)} />;

  const logout = () => {
    setToken(null);
    setLoggedIn(false);
  };

  return (
    <AdminLayout onLogout={logout}>
      <Routes>
        <Route index element={<Navigate to="guests" replace />} />
        <Route path="guests" element={<GuestManager />} />
        <Route path="rsvps" element={<RsvpList />} />
        <Route path="wishes" element={<WishList />} />
        <Route path="settings" element={<SettingsForm />} />
      </Routes>
    </AdminLayout>
  );
}
