import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { adminApi, watchAdmin } from '../api.js';
import LoginForm from '../components/admin/LoginForm.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import GuestManager from '../components/admin/guests/GuestManager.jsx';
import RsvpList from '../components/admin/RsvpList.jsx';
import WishList from '../components/admin/WishList.jsx';
import SettingsForm from '../components/admin/settings/SettingsForm.jsx';
import '../styles/admin.css';

export default function AdminPage() {
  // null = đang kiểm tra phiên đăng nhập Firebase
  const [loggedIn, setLoggedIn] = useState(null);
  useEffect(() => watchAdmin(setLoggedIn), []);

  if (loggedIn === null) return <p className="login">Đang tải...</p>;
  if (!loggedIn) return <LoginForm />;

  const logout = () => adminApi.logout();

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
