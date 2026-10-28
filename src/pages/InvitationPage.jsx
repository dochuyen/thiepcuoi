import { useCallback, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAsync } from '../hooks/useAsync.js';
import EnvelopeIntro from '../components/invitation/EnvelopeIntro.jsx';
import Hero from '../components/invitation/Hero.jsx';
import CeremonySection from '../components/invitation/CeremonySection.jsx';
import PhotoAlbum from '../components/invitation/PhotoAlbum.jsx';
import ReceptionSection from '../components/invitation/ReceptionSection.jsx';
import VenueMap from '../components/invitation/VenueMap.jsx';
import ScheduleSection from '../components/invitation/ScheduleSection.jsx';
import Guestbook from '../components/invitation/Guestbook.jsx';
import GiftBox from '../components/invitation/GiftBox.jsx';
import Footer from '../components/invitation/Footer.jsx';
import MusicPlayer from '../components/invitation/MusicPlayer.jsx';
import defaultMusic from '../assets/dam-cuoi-tren-duong-que.mp3';
import '../styles/invitation.css';

/**
 * Trang thiệp. Có 2 thiệp cùng giao diện: nhà trai và nhà gái (khác lễ, tiệc, lịch trình).
 * - /moi/:slug hoặc /?to=slug: hiện tên khách, thiệp theo bên của khách đó
 * - /nha-trai, /nha-gai (và /): thiệp chung không kèm tên
 */
export default function InvitationPage({ side = 'groom' }) {
  const { slug: pathSlug } = useParams();
  const [params] = useSearchParams();
  const slug = pathSlug || params.get('to');
  const preview = params.has('preview');

  const { data, loading, error } = useAsync(async () => {
    const guest = slug ? await api.getGuest(slug, preview).catch(() => null) : null;
    const config = await api.getConfig(guest?.side ?? side);
    document.title = `Thiệp cưới ${config.groom.shortName} & ${config.bride.shortName}`;
    return { config, guest };
  }, [slug, side]);

  const [opened, setOpened] = useState(false);
  const music = useRef(null);
  const handleOpen = useCallback(() => {
    music.current?.play();
    setTimeout(() => setOpened(true), 700);
  }, []);

  if (loading) return <div className="page-loading">♡</div>;
  if (error) return <div className="page-loading">Không tải được thiệp: {error.message}</div>;

  const { config, guest } = data;

  return (
    <div className="invitation">
      {!opened && <EnvelopeIntro config={config} guest={guest} onOpen={handleOpen} />}
      <main className="invitation__paper">
        <Hero config={config} guest={guest} />
        <CeremonySection config={config} />
        <PhotoAlbum photos={config.gallery} />
        <ReceptionSection config={config} guest={guest} />
        <VenueMap reception={config.reception} />
        <ScheduleSection schedule={config.schedule} />
        <Guestbook guest={guest} />
        <GiftBox gifts={config.gifts} />
        <Footer text={config.footerText} />
      </main>
      {/* chưa nhập link nhạc trong admin thì dùng bài mặc định */}
      <MusicPlayer ref={music} src={config.musicUrl || defaultMusic} />
    </div>
  );
}
