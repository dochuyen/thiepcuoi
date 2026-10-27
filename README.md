# Thiệp cưới Minimalism – Đỏ đậm (ReactJS)

Thiệp cưới online một trang (React + Vite), có trang **Admin** để quản lý khách mời. Mỗi khách có **link mời riêng**, khi mở link thì thiệp hiển thị tên khách đó.

## Chạy thử

```bash
npm install
npm run dev          # API :3001 + React :5173
```

- Thiệp: http://localhost:5173
- Admin: http://localhost:5173/admin (mật khẩu mặc định: `admin123`)

Chạy production:

```bash
npm run build
ADMIN_PASSWORD=matkhaucuaban PORT=3000 npm start   # phục vụ cả web + API
```

## Tính năng

**Thiệp** (`/` hoặc `/moi/<slug-khach>`)
- Màn hình mở thiệp: "Kính gửi <tên khách>", bấm vào để mở thiệp và bật nhạc
- Save The Date, phong bì có ảnh, tên cô dâu chú rể, lời mời theo tên khách
- Thông tin lễ cưới (bố mẹ hai bên, ngày dương/âm)
- Album ảnh xoay 3D, tự chạy, bấm vào để xem toàn màn hình (vuốt để chuyển ảnh)
- Thông tin tiệc cưới, lịch tháng có tim ở ngày cưới, nút thêm vào Google Calendar
- Xác nhận tham dự (RSVP), tự gắn với khách khi mở từ link mời riêng
- Bản đồ Google Maps và nút chỉ đường, dress code, lịch trình ngày cưới
- Sổ lưu bút, có nút 🪄 gợi ý lời chúc
- Hộp quà mừng với QR chuyển khoản (tạo tự động qua VietQR)
- Nhạc nền

**Admin** (`/admin`)
- **Khách mời**: thêm từng người hoặc thêm nhiều người (mỗi dòng `Anh | Nguyễn Văn A`), sửa, xoá, tìm kiếm, lọc; copy link mời; xem ai đã mở thiệp và ai đã phản hồi; xuất CSV
- **Xác nhận tham dự**: thống kê số người, xuất CSV
- **Lời chúc**: ẩn hoặc xoá lời chúc
- **Cài đặt thiệp**: sửa tên, ngày giờ, địa điểm, ảnh, lịch trình, tài khoản ngân hàng, nhạc

## Cấu trúc

```
server/
  index.js          API Express (public + admin)
  db.js             lưu dữ liệu vào data/db.json
  defaultData.js    nội dung thiệp mặc định
src/
  pages/            InvitationPage, AdminPage
  components/
    common/         Modal, Reveal (hiệu ứng cuộn), hoa trang trí
    invitation/     từng phần của thiệp (Hero, CeremonySection, PhotoAlbum, ...)
    admin/          AdminLayout, LoginForm, RsvpList, WishList
      guests/       GuestManager, GuestForm, BulkAddGuests, GuestTable, GuestRow, GuestFilters
      settings/     SettingsForm và các editor con
  hooks/            useAsync, useReveal
  utils/            date, csv, vietqr, inviteLink
  styles/           global.css, invitation.css, admin.css
```

## Lưu ý
- Ảnh mặc định là ảnh mẫu từ picsum.photos. Bạn thay bằng ảnh của mình trong Admin → Cài đặt thiệp.
- Hoa, phong bì, hộp quà đều vẽ bằng CSS/SVG, không dùng ảnh của mẫu gốc (ảnh đó có bản quyền).
- Mã ngân hàng cho QR: VCB, TCB, MB, ACB, BIDV, ICB (VietinBank), VPB, TPB...
- Đổi `ADMIN_PASSWORD` khi deploy thật.
