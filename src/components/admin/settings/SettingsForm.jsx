import { useState } from 'react';
import { adminApi } from '../../../api.js';
import { useAsync } from '../../../hooks/useAsync.js';
import Section from './Section.jsx';
import Field from './Field.jsx';
import PersonFields from './PersonFields.jsx';
import GalleryEditor from './GalleryEditor.jsx';
import ScheduleEditor from './ScheduleEditor.jsx';
import GiftsEditor from './GiftsEditor.jsx';

/** Đặt giá trị theo đường dẫn "a.b.c" mà không làm thay đổi object cũ */
function setIn(obj, path, value) {
  const [key, ...rest] = path.split('.');
  return { ...obj, [key]: rest.length ? setIn(obj[key] ?? {}, rest.join('.'), value) : value };
}

export default function SettingsForm() {
  const { data: config, loading, error, setData } = useAsync(adminApi.getConfig);
  const [status, setStatus] = useState('');

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="admin-error">{error.message}</p>;

  const set = (path) => (value) => setData((c) => setIn(c, path, value));
  // props gọn cho <Field>: value + onChange theo đường dẫn
  const bind = (path) => ({ value: path.split('.').reduce((o, k) => o?.[k], config) ?? '', onChange: set(path) });

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

      <Section title="Chú rể">
        <PersonFields prefix="groom" bind={bind} />
      </Section>

      <Section title="Cô dâu">
        <PersonFields prefix="bride" bind={bind} />
      </Section>

      <Section title="Lễ thành hôn">
        <Field label="Địa điểm làm lễ" {...bind('ceremony.place')} />
        <Field label="Ngày" type="date" {...bind('ceremony.date')} />
        <Field label="Giờ" type="time" {...bind('ceremony.time')} />
        <Field label="Ngày âm lịch" {...bind('ceremony.lunarText')} wide />
        <Field label="Lời báo tin" multiline {...bind('announcement')} wide />
      </Section>

      <Section title="Tiệc cưới">
        <Field label="Ngày" type="date" {...bind('reception.date')} />
        <Field label="Giờ khai tiệc" type="time" {...bind('reception.time')} />
        <Field label="Giờ đón khách" type="time" {...bind('reception.welcomeTime')} />
        <Field label="Ngày âm lịch" {...bind('reception.lunarText')} wide />
        <Field label="Tên nhà hàng / trung tâm" {...bind('reception.venueName')} wide />
        <Field label="Địa chỉ" {...bind('reception.address')} wide />
      </Section>

      <Section title="Ảnh">
        <Field label="Ảnh bìa (URL)" {...bind('coverPhoto')} wide />
        <GalleryEditor photos={config.gallery} onChange={set('gallery')} />
      </Section>

      <Section title="Lịch trình ngày cưới">
        <ScheduleEditor items={config.schedule} onChange={set('schedule')} />
      </Section>

      <Section title="Dress code">
        <Field label="Mô tả" {...bind('dressCode.note')} wide />
        <Field
          label="Màu (mã hex, cách nhau dấu phẩy)"
          value={config.dressCode.colors.join(', ')}
          onChange={(v) => set('dressCode.colors')(v.split(',').map((s) => s.trim()).filter(Boolean))}
          wide
        />
      </Section>

      <Section title="Hộp quà mừng (QR chuyển khoản)">
        <GiftsEditor gifts={config.gifts} onChange={set('gifts')} />
      </Section>

      <Section title="Khác">
        <Field label="Nhạc nền (URL file .mp3)" {...bind('musicUrl')} wide />
        <Field label="Lời cảm ơn cuối thiệp" {...bind('footerText')} wide />
      </Section>
    </form>
  );
}
