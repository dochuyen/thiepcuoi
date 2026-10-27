// Dữ liệu mặc định khi chưa có data/db.json — sửa trong trang Admin.
export const defaultConfig = {
  groom: {
    shortName: 'Hoàng Long',
    fullName: 'Đặng Hoàng Long',
    title: 'Trưởng Nam',
    father: 'Đặng Văn Thắng',
    mother: 'Bùi Thị Mai',
    address: 'Quận 1, TP. Hồ Chí Minh',
  },
  bride: {
    shortName: 'Bảo Ngọc',
    fullName: 'Vũ Bảo Ngọc',
    title: 'Út Nữ',
    father: 'Vũ Đức Trung',
    mother: 'Ngô Thị Hạnh',
    address: 'Quận 3, TP. Hồ Chí Minh',
  },
  coverPhoto: 'https://picsum.photos/seed/wedding-cover/600/800',
  announcement: 'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI',
  ceremony: {
    place: 'TƯ GIA',
    date: '2026-01-03',
    time: '09:00',
    lunarText: '(Tức ngày 15 tháng 11 năm Ất Tỵ)',
  },
  reception: {
    date: '2026-01-03',
    time: '18:00',
    welcomeTime: '17:30',
    lunarText: '(Tức ngày 15 tháng 11 năm Ất Tỵ)',
    venueName: 'Trung Tâm Hội Nghị White Palace',
    address: '194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh',
  },
  gallery: [1, 2, 3, 4, 5, 6, 7].map((i) => `https://picsum.photos/seed/wedding-${i}/600/900`),
  dressCode: {
    note: 'Trang phục dự tiệc',
    colors: ['#511419', '#8c3a3f', '#c9a24a', '#ece4d8'],
  },
  schedule: [
    { time: '17:00', label: 'Đón khách' },
    { time: '18:00', label: 'Khai tiệc' },
    { time: '18:30', label: 'Nghi thức cưới' },
    { time: '19:00', label: 'Cắt bánh & nâng ly' },
    { time: '20:30', label: 'Kết thúc tiệc' },
  ],
  gifts: [
    { label: 'Chú Rể', bankCode: 'VCB', bankName: 'Vietcombank', accountNumber: '1023456789', accountName: 'DANG HOANG LONG' },
    { label: 'Cô Dâu', bankCode: 'TCB', bankName: 'Techcombank', accountNumber: '9988776655', accountName: 'VU BAO NGOC' },
  ],
  musicUrl: '',
  footerText: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!',
};

export const defaultData = {
  config: defaultConfig,
  guests: [],
  rsvps: [],
  wishes: [],
};
