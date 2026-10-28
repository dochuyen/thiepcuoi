import { useState } from 'react';
import { adminApi } from '../../../api.js';
import { useAsync } from '../../../hooks/useAsync.js';
import Section from './Section.jsx';
import Field from './Field.jsx';
import PersonFields from './PersonFields.jsx';
import GalleryEditor from './GalleryEditor.jsx';
import ScheduleEditor from './ScheduleEditor.jsx';
import GiftsEditor from './GiftsEditor.jsx';
import LegacyImport from './LegacyImport.jsx';

const SIDES = [
  { key: 'groom', label: 'Thiệp Nhà Trai' },
  { key: 'bride', label: 'Thiệp Nhà Gái' },
];

/** Đặt giá trị theo đường dẫn "a.b.c" mà không làm thay đổi object cũ */
function setIn(obj, path, value) {
  const [key, ...rest] = path.split('.');
  return { ...obj, [key]: rest.length ? setIn(obj[key] ?? {}, rest.join('.'), value) : value };
}

export default function SettingsForm() {
  const { data: config, loading, error, setData } = useAsync(adminApi.getConfig);
  const [status, setStatus] = useState('');
  const [side, setSide] = useState('groom');

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="admin-error">{error.message}</p>;

  const set = (path) => (value) => setData((c) => setIn(c, path, value));
  // props gọn cho <Field>: value + onChange theo đường dẫn
  const bind = (path) => ({ value: path.split('.').reduce((o, k) => o?.[k], config) ?? '', onChange: set(path) });

  const ev = `events.${side}`;
  const sideLabel = side === 'groom' ? 'nhà trai' : 'nhà gái';
  const otherSide = side === 'groom' ? 'bride' : 'groom';
  const otherLabel = side === 'groom' ? 'nhà gái' : 'nhà trai';
  const copyFromOther = () => {
    if (!confirm(`Ghi đè lễ, tiệc, lịch trình ${sideLabel} bằng thông tin của thiệp ${otherLabel}?`)) return;
    // giữ tên lễ và lời báo tin của bên này (thành hôn / vu quy)
    const { announcement, ceremony } = config.events[side];
    const copy = structuredClone(config.events[otherSide]);
    copy.announcement = announcement;
    copy.ceremony.name = ceremony?.name;
    set(ev)(copy);
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      setData(await adminApi.saveConfig(config));
      setStatus('saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus(`Lỗi: ${err.message}`);
    }
  };

  return (
    <form className="panel settings" onSubmit={save}>
      <div className="panel__head settings__head">
        <h2>Cài đặt thiệp</h2>
        <div className="panel__buttons">
          {status === 'saved' && <span className="saved-note">✓ Đã lưu</span>}
          {status.startsWith('Lỗi') && <span className="admin-error">{status}</span>}
          <button className="a-btn a-btn--primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <Section
        title="1. Chú rể · Nhà Trai"
        hint="Tên hiện ở bìa thiệp và mục THÔNG TIN LỄ CƯỚI. Tên bố, mẹ, địa chỉ hiện ở cột Nhà Trai — ô nào để trống thì ẩn."
      >
        <PersonFields prefix="groom" bind={bind} />
      </Section>

      <Section
        title="2. Cô dâu · Nhà Gái"
        hint="Tên hiện ở bìa thiệp và mục THÔNG TIN LỄ CƯỚI. Tên bố, mẹ, địa chỉ hiện ở cột Nhà Gái — ô nào để trống thì ẩn."
      >
        <PersonFields prefix="bride" bind={bind} />
      </Section>

      <div className="side-block">
        <div className="side-block__head">
          <div>
            <h3>Thông tin riêng từng thiệp</h3>
            <p className="settings-section__hint">
              Nhà trai và nhà gái tổ chức ở 2 nơi nên mục 3–5 nhập riêng cho từng thiệp. Các mục còn lại dùng chung.
              Khách nhà nào thì link mời riêng tự mở thiệp nhà đó; link chung: <code>/nha-trai</code>, <code>/nha-gai</code>.
            </p>
          </div>
          <div className="side-tabs" role="tablist">
            {SIDES.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={side === s.key}
                className={side === s.key ? 'is-active' : ''}
                onClick={() => setSide(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="a-btn a-btn--sm" onClick={copyFromOther}>
          Chép thông tin từ thiệp {otherLabel} sang
        </button>

        <Section title={`3. Lễ ${sideLabel}`} hint="Phần dưới tên cô dâu chú rể trong mục THÔNG TIN LỄ CƯỚI.">
          <Field label="Tên lễ" placeholder="LỄ THÀNH HÔN / LỄ VU QUY" {...bind(`${ev}.ceremony.name`)} />
          <Field label="Địa điểm làm lễ" {...bind(`${ev}.ceremony.place`)} />
          <Field label="Ngày" type="date" {...bind(`${ev}.ceremony.date`)} />
          <Field label="Giờ" type="time" {...bind(`${ev}.ceremony.time`)} />
          <Field label="Ngày âm lịch" {...bind(`${ev}.ceremony.lunarText`)} wide />
          <Field label="Lời báo tin" multiline {...bind(`${ev}.announcement`)} wide />
        </Section>

        <Section
          title={`4. Tiệc cưới ${sideLabel} & Google Map`}
          hint="Mục THÔNG TIN TIỆC CƯỚI và lịch tháng. Bản đồ Google Map và nút Chỉ đường tự lấy theo Tên nhà hàng + Địa chỉ bên dưới — chỉ cần gõ đúng địa chỉ."
        >
          <Field label="Ngày" type="date" {...bind(`${ev}.reception.date`)} />
          <Field label="Giờ khai tiệc" type="time" {...bind(`${ev}.reception.time`)} />
          <Field label="Giờ đón khách" type="time" {...bind(`${ev}.reception.welcomeTime`)} />
          <Field label="Ngày âm lịch" {...bind(`${ev}.reception.lunarText`)} wide />
          <Field label="Tên nhà hàng / trung tâm" {...bind(`${ev}.reception.venueName`)} wide />
          <Field label="Địa chỉ (dùng cho Google Map)" {...bind(`${ev}.reception.address`)} wide />
        </Section>

        <Section title={`5. Lịch trình ${sideLabel}`} hint="Mục LỊCH TRÌNH NGÀY CƯỚI: mỗi dòng gồm giờ và tên hoạt động.">
          <ScheduleEditor items={config.events[side].schedule ?? []} onChange={set(`${ev}.schedule`)} />
        </Section>
      </div>

      <Section
        title="6. Ảnh cưới"
        hint="Ảnh bìa = ảnh trong phong bì đầu thiệp. Album = các ảnh ở mục ALBUM ẢNH: dán link ảnh rồi bấm Thêm ảnh, dùng ← → để đổi thứ tự, ✕ để xoá."
      >
        <Field label="Ảnh bìa (URL)" {...bind('coverPhoto')} wide />
        <GalleryEditor photos={config.gallery} onChange={set('gallery')} />
      </Section>

      <Section
        title="7. Hộp quà mừng (QR chuyển khoản)"
        hint="Khách bấm vào bao lì xì ở cuối thiệp sẽ thấy các tài khoản này. Mã QR tự tạo từ Mã NH (VCB, TCB, MB...) + Số tài khoản."
      >
        <GiftsEditor gifts={config.gifts} onChange={set('gifts')} />
      </Section>

      <Section title="8. Khác" hint="Để trống link nhạc thì thiệp dùng bài nhạc mặc định.">
        <Field label="Nhạc nền (URL file .mp3)" {...bind('musicUrl')} wide />
        <Field label="Lời cảm ơn cuối thiệp" {...bind('footerText')} wide />
      </Section>

      <Section
        title="9. Chuyển dữ liệu cũ lên Firebase"
        hint="Chỉ cần làm 1 lần: chọn file data/db.json của bản chạy trên máy để đưa cài đặt thiệp, khách mời, xác nhận tham dự và lời chúc lên Firebase."
      >
        <LegacyImport />
      </Section>
    </form>
  );
}
