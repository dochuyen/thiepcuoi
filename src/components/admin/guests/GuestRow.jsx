import { useState } from 'react';
import { inviteLink } from '../../../utils/inviteLink.js';
import { formatDateTime } from '../../../utils/date.js';

function RsvpBadge({ rsvp }) {
  if (!rsvp) return <span className="badge badge--grey">Chưa phản hồi</span>;
  return rsvp.attending ? (
    <span className="badge badge--green">Tham dự · {rsvp.guestCount} người</span>
  ) : (
    <span className="badge badge--red">Không tham dự</span>
  );
}

export default function GuestRow({ guest, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const link = inviteLink(guest.slug);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <tr>
      <td>
        <div className="guest-name">
          {guest.salutation && <span className="guest-name__salutation">{guest.salutation}</span>}
          <strong>{guest.name}</strong>
        </div>
        {(guest.group || guest.phone) && (
          <div className="guest-sub">{[guest.group, guest.phone].filter(Boolean).join(' · ')}</div>
        )}
      </td>
      <td>
        <span className={`badge ${guest.side === 'bride' ? 'badge--pink' : 'badge--blue'}`}>
          {guest.side === 'bride' ? 'Nhà gái' : 'Nhà trai'}
        </span>
      </td>
      <td>
        <div className="link-cell">
          <code title={link}>/moi/{guest.slug}</code>
          <button type="button" className="a-btn a-btn--sm" onClick={copy}>
            {copied ? '✓ Đã copy' : 'Copy'}
          </button>
          <a className="a-btn a-btn--sm" href={`${link}?preview=1`} target="_blank" rel="noreferrer">
            Xem
          </a>
        </div>
      </td>
      <td title={guest.openedAt ? formatDateTime(guest.openedAt) : ''}>{guest.openedAt ? '👁️ Rồi' : '—'}</td>
      <td>
        <RsvpBadge rsvp={guest.rsvp} />
      </td>
      <td className="row-actions">
        <button type="button" className="a-btn a-btn--sm" onClick={onEdit}>
          Sửa
        </button>
        <button type="button" className="a-btn a-btn--sm a-btn--danger" onClick={onDelete}>
          Xoá
        </button>
      </td>
    </tr>
  );
}
