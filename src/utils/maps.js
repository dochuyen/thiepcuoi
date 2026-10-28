/**
 * Lấy toạ độ điểm đến từ link Google Maps dán trong admin.
 * Hỗ trợ: link chỉ đường (.../data=...!1d<kinh độ>!2d<vĩ độ>), link địa điểm (@vĩ độ,kinh độ),
 * ?q= / ?query= / ?destination= dạng "vĩ độ,kinh độ". Không đọc được thì trả về null.
 */
export function coordsFromMapsLink(link) {
  if (!link) return null;
  let url;
  try {
    url = decodeURIComponent(link);
  } catch {
    url = link;
  }
  const num = '(-?\\d{1,3}\\.\\d+)';

  // !1d<lng>!2d<lat>: lấy cặp cuối cùng = điểm đến (điểm xuất phát nằm trước)
  const pairs = [...url.matchAll(new RegExp(`!1d${num}!2d${num}`, 'g'))];
  if (pairs.length) {
    const [, lng, lat] = pairs[pairs.length - 1];
    return { lat: +lat, lng: +lng };
  }
  // !3d<lat>!4d<lng>: ghim địa điểm
  const pin = url.match(new RegExp(`!3d${num}!4d${num}`));
  if (pin) return { lat: +pin[1], lng: +pin[2] };

  const param = url.match(new RegExp(`[?&](?:q|query|destination|daddr)=${num},\\s*${num}`));
  if (param) return { lat: +param[1], lng: +param[2] };

  const at = url.match(new RegExp(`@${num},${num}`));
  if (at) return { lat: +at[1], lng: +at[2] };
  return null;
}
