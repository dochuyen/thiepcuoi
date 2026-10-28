import castleImg from '../../assets/background.webp';

/** Ảnh lâu đài mờ phía sau nội dung một phần (khung cha cần position: relative) */
export default function CastleBackdrop({ top = '0%', width = '150%' }) {
  return <img className="castle-backdrop" src={castleImg} alt="" aria-hidden="true" style={{ top, width }} />;
}
