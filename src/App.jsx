import { Routes, Route } from 'react-router-dom';
import InvitationPage from './pages/InvitationPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InvitationPage />} />
      <Route path="/moi/:slug" element={<InvitationPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  );
}
