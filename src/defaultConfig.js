// Cấu hình mặc định khi Firestore chưa có config/main — sửa trong trang Admin.
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
  gallery: [1, 2, 3, 4, 5, 6, 7].map((i) => `https://picsum.photos/seed/wedding-${i}/600/900`),
  gifts: [
    { label: 'Chú Rể', bankCode: 'VCB', bankName: 'Vietcombank', accountNumber: '1023456789', accountName: 'DANG HOANG LONG' },
    { label: 'Cô Dâu', bankCode: 'TCB', bankName: 'Techcombank', accountNumber: '9988776655', accountName: 'VU BAO NGOC' },
  ],
  // Thông tin riêng của từng thiệp: nhà trai (groom) và nhà gái (bride) tổ chức ở 2 nơi khác nhau
  events: {
    groom: {
      announcement: 'TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI',
      ceremony: {
        name: 'LỄ THÀNH HÔN',
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
      schedule: [
        { time: '17:00', label: 'Đón khách' },
        { time: '18:00', label: 'Khai tiệc' },
        { time: '18:30', label: 'Nghi thức cưới' },
        { time: '19:00', label: 'Cắt bánh & nâng ly' },
        { time: '20:30', label: 'Kết thúc tiệc' },
      ],
    },
    bride: {
      announcement: 'TRÂN TRỌNG BÁO TIN\nLỄ VU QUY CỦA CON CHÚNG TÔI',
      ceremony: {
        name: 'LỄ VU QUY',
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
      schedule: [
        { time: '17:00', label: 'Đón khách' },
        { time: '18:00', label: 'Khai tiệc' },
        { time: '18:30', label: 'Nghi thức cưới' },
        { time: '19:00', label: 'Cắt bánh & nâng ly' },
        { time: '20:30', label: 'Kết thúc tiệc' },
      ],
    },
  },
  musicUrl: '',
  footerText: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!',
};

const EVENT_KEYS = ['announcement', 'ceremony', 'reception', 'schedule'];

/** Dữ liệu cũ (1 thiệp) → tách lễ / tiệc / lịch trình thành 2 bản: nhà trai và nhà gái */
export function migrateEvents(config) {
  if (config.events) return config;
  const groom = Object.fromEntries(EVENT_KEYS.map((k) => [k, config[k]]));
  groom.ceremony = { name: 'LỄ THÀNH HÔN', ...groom.ceremony };
  const bride = structuredClone(groom);
  bride.ceremony.name = 'LỄ VU QUY';
  bride.announcement = String(bride.announcement ?? '').replace('LỄ THÀNH HÔN', 'LỄ VU QUY');
  const rest = Object.fromEntries(Object.entries(config).filter(([k]) => !EVENT_KEYS.includes(k)));
  return { ...rest, events: { groom, bride } };
}

/** Cấu hình cho 1 thiệp: thông tin chung + lễ / tiệc / lịch trình của bên đó */
export function configForSide(config, side) {
  const s = side === 'bride' ? 'bride' : 'groom';
  const { events, ...rest } = config;
  return { ...rest, ...events?.[s], side: s };
}
