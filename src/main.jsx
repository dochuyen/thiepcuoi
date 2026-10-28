import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';

const root = createRoot(document.getElementById('root'));

// Chưa có file .env (cấu hình Firebase) thì báo cách sửa thay vì màn hình trắng
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  root.render(
    <div style={{ maxWidth: 560, margin: '60px auto', padding: 16, fontFamily: 'system-ui', lineHeight: 1.6 }}>
      <h2>Chưa cấu hình Firebase</h2>
      <p>
        Copy file <code>.env.example</code> thành <code>.env</code> rồi điền <code>VITE_FIREBASE_API_KEY</code>,{' '}
        <code>VITE_FIREBASE_AUTH_DOMAIN</code>, <code>VITE_FIREBASE_PROJECT_ID</code>, <code>VITE_FIREBASE_APP_ID</code>{' '}
        (lấy ở Firebase Console → Project settings → Your apps). Sau đó tắt và chạy lại <code>npm run dev</code>.
      </p>
      <p>
        Muốn chạy thử không cần Firebase thật: <code>npm run dev:emu</code>.
      </p>
    </div>,
  );
} else {
  import('./App.jsx').then(({ default: App }) =>
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    ),
  );
}
