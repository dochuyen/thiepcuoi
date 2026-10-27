/** Dòng "Trân trọng kính mời ..." hiển thị tên khách lấy từ link mời riêng */
export default function GuestGreeting({ guest }) {
  return (
    <div className="guest-greeting">
      <p className="guest-greeting__label">Trân trọng kính mời</p>
      <p className="guest-greeting__name">{[guest.salutation, guest.name].filter(Boolean).join(' ')}</p>
      <p className="guest-greeting__label">tới dự buổi tiệc chung vui cùng gia đình chúng tôi</p>
    </div>
  );
}
