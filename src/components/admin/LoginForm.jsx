import { useState } from 'react';
import { adminApi } from '../../api.js';

/** Đăng nhập bằng tài khoản Firebase Auth có email nằm trong danh sách admin của firestore.rules */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // AdminPage tự chuyển sang trang quản lý khi trạng thái đăng nhập đổi
      await adminApi.login(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <h1>Quản lý thiệp cưới</h1>
        <p>Đăng nhập bằng tài khoản quản trị</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          autoFocus
          required
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="admin-error">{error}</div>}
        <button className="a-btn a-btn--primary" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
