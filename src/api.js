const TOKEN_KEY = 'admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(method, url, body, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401 && auth) {
    setToken(null);
    window.dispatchEvent(new Event('admin-logout'));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Lỗi ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  getConfig: () => request('GET', '/api/config'),
  getGuest: (slug, preview) =>
    request('GET', `/api/guests/${encodeURIComponent(slug)}${preview ? '?preview=1' : ''}`),
  sendRsvp: (data) => request('POST', '/api/rsvp', data),
  getWishes: () => request('GET', '/api/wishes'),
  sendWish: (data) => request('POST', '/api/wishes', data),
};

const a = (method, path, body) => request(method, `/api/admin${path}`, body, true);

export const adminApi = {
  login: (password) => request('POST', '/api/admin/login', { password }),
  getConfig: () => a('GET', '/config'),
  saveConfig: (config) => a('PUT', '/config', config),
  getGuests: () => a('GET', '/guests'),
  addGuests: (guests) => a('POST', '/guests', guests),
  updateGuest: (id, guest) => a('PUT', `/guests/${id}`, guest),
  deleteGuest: (id) => a('DELETE', `/guests/${id}`),
  getRsvps: () => a('GET', '/rsvps'),
  deleteRsvp: (id) => a('DELETE', `/rsvps/${id}`),
  getWishes: () => a('GET', '/wishes'),
  setWishHidden: (id, hidden) => a('PATCH', `/wishes/${id}`, { hidden }),
  deleteWish: (id) => a('DELETE', `/wishes/${id}`),
};
