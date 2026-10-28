# Thiệp cưới Minimalism – Đỏ đậm (React + Firebase)

Thiệp cưới online một trang (React + Vite), dữ liệu lưu trên **Firebase** gói miễn phí Spark (Hosting + Firestore + Authentication). Có trang **Admin** để quản lý khách mời. Mỗi khách có **link mời riêng**, mở link thì thiệp hiện tên khách đó.

Có **2 thiệp cùng giao diện**: nhà trai và nhà gái (khác lễ, tiệc, bản đồ, lịch trình).

| Đường dẫn | Nội dung |
|---|---|
| `/moi/<ten-khach>` | Link mời riêng, tự mở thiệp đúng nhà của khách |
| `/nha-trai`, `/nha-gai` | Link chung không kèm tên (`/` = nhà trai) |
| `/admin` | Trang quản lý |

## Deploy lên Firebase (miễn phí)

### 1. Tạo project Firebase (làm 1 lần trên web)
1. Vào https://console.firebase.google.com → **Add project** → đặt tên (vd `thiep-cuoi-chuyen-yen`). Tắt Google Analytics cho gọn.
2. **Build → Firestore Database → Create database** → chọn vùng `asia-southeast1 (Singapore)` → **Start in production mode**.
3. **Build → Authentication → Get started → Email/Password → Enable**.
   Sang tab **Users → Add user**: nhập email + mật khẩu admin của bạn.
4. **Project settings** (bánh răng) → **General** → mục *Your apps* bấm biểu tượng **`</>`** (Web) → đặt tên → **Register app**. Copy các giá trị trong `firebaseConfig`.

### 2. Cấu hình trong code
1. Copy `.env.example` thành `.env`, điền 4 giá trị vừa copy (`apiKey`, `authDomain`, `projectId`, `appId`).
2. Mở `firestore.rules`, thay `admin@example.com` bằng **email admin vừa tạo** (viết chữ thường).

### 3. Deploy
```bash
npm install
npx firebase login
npx firebase use --add          # chọn project vừa tạo, alias gõ: default
npm run deploy
```
Xong sẽ có link `https://<project-id>.web.app`.

### 4. Đưa dữ liệu cũ lên (nếu có `data/db.json`)
Vào `https://<project-id>.web.app/admin` → đăng nhập → **Cài đặt thiệp → 9. Chuyển dữ liệu cũ lên Firebase** → chọn file `data/db.json`.

Lần sau sửa code chỉ cần chạy lại `npm run deploy`. Sửa nội dung thiệp, khách mời thì làm trong trang admin, không cần deploy.

## Chạy trên máy

```bash
npm run dev       # dùng dữ liệu Firebase thật (cần file .env)
npm run dev:emu   # dùng Firebase Emulator trên máy, không đụng dữ liệu thật (cần Java)
```

Với `dev:emu`, tạo tài khoản admin thử trong emulator rồi đăng nhập bằng email trùng với email trong `firestore.rules`.

## Cấu trúc

```
firebase.json       cấu hình Hosting + Firestore + Emulator
firestore.rules     quyền truy cập dữ liệu (danh sách email admin nằm ở đây)
src/
  firebase.js       khởi tạo Firebase từ biến môi trường VITE_FIREBASE_*
  api.js            đọc / ghi Firestore cho trang thiệp và admin
  defaultConfig.js  nội dung thiệp mặc định, tách thiệp nhà trai / nhà gái
  pages/            InvitationPage, AdminPage
  components/
    common/         Modal, Reveal, hoa trang trí, lâu đài nền
    invitation/     từng phần của thiệp (Hero, CeremonySection, PhotoAlbum, ...)
    admin/          AdminLayout, LoginForm, RsvpList, WishList
      guests/       quản lý khách mời
      settings/     SettingsForm, LegacyImport và các editor con
  assets/           ảnh trang trí, nhạc nền
```

## Dữ liệu trên Firestore

| Collection | Nội dung | Ai đọc / ghi |
|---|---|---|
| `config/main` | Cài đặt thiệp | Ai cũng đọc, admin ghi |
| `guests` | Khách mời đầy đủ (SĐT, ghi chú) | Chỉ admin |
| `invites/{slug}` | Tên, xưng hô, bên của link mời riêng | Khách đọc đúng link của mình |
| `rsvps` | Xác nhận tham dự | Khách gửi, admin xem |
| `wishes` | Lời chúc | Khách gửi và đọc lời chúc không bị ẩn, admin ẩn / xoá |

## Lưu ý
- Gói Spark miễn phí: 50.000 lượt đọc + 20.000 lượt ghi Firestore mỗi ngày, 10GB Hosting. Thiệp vài trăm khách dùng không hết.
- Mã ngân hàng cho QR: VCB, TCB, MB, ACB, BIDV, ICB (VietinBank), VPB, TPB...
- Ảnh cưới nhập bằng link ảnh (Google Photos, Imgur...).
