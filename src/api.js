import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { configForSide, defaultConfig, migrateEvents } from './defaultConfig.js';

/*
 * Dữ liệu trên Firestore:
 *   config/main      cấu hình thiệp (công khai đọc, admin ghi)
 *   guests/{id}      khách mời đầy đủ: SĐT, ghi chú... (chỉ admin)
 *   invites/{slug}   phần công khai của link mời riêng: tên, xưng hô, bên, lúc mở thiệp
 *   rsvps/{id}       xác nhận tham dự (khách tạo, admin đọc)
 *   wishes/{id}      lời chúc (khách tạo, ai cũng đọc được lời chúc không bị ẩn)
 * Quyền truy cập nằm trong firestore.rules.
 */

const configRef = doc(db, 'config', 'main');
const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const toIso = (v) => (v instanceof Timestamp ? v.toDate().toISOString() : v ?? null);
const withId = (snap) => {
  const data = snap.data();
  for (const k of ['createdAt', 'openedAt']) if (k in data) data[k] = toIso(data[k]);
  return { id: snap.id, ...data };
};
// Firestore không nhận undefined
const plain = (obj) => JSON.parse(JSON.stringify(obj));

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueSlug(name, taken) {
  const base = slugify(name) || 'khach';
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

function buildGuest(body) {
  return {
    name: clean(body.name, 120),
    salutation: clean(body.salutation, 40),
    side: body.side === 'bride' ? 'bride' : 'groom',
    group: clean(body.group, 60),
    phone: clean(body.phone, 20),
    note: clean(body.note, 300),
  };
}

async function loadConfig() {
  const snap = await getDoc(configRef);
  return snap.exists() ? migrateEvents(snap.data()) : structuredClone(defaultConfig);
}

// ---------- Trang thiệp (khách) ----------
export const api = {
  getConfig: async (side) => configForSide(await loadConfig(), side),

  getGuest: async (slug, preview) => {
    const ref = doc(db, 'invites', slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Không tìm thấy khách mời');
    const g = snap.data();
    // ?preview=1: admin xem thử, không tính là khách đã mở thiệp
    if (!g.openedAt && !preview) updateDoc(ref, { openedAt: serverTimestamp() }).catch(() => {});
    return { name: g.name, salutation: g.salutation, slug, side: g.side };
  },

  sendRsvp: async (data) => {
    const name = clean(data.name, 120);
    if (!name) throw new Error('Vui lòng nhập tên');
    await setDoc(doc(collection(db, 'rsvps')), {
      guestSlug: data.guestSlug ? clean(data.guestSlug, 200) : null,
      name,
      attending: Boolean(data.attending),
      guestCount: Math.min(Math.max(Math.round(Number(data.guestCount)) || 1, 1), 20),
      side: data.side === 'bride' ? 'bride' : 'groom',
      message: clean(data.message, 1000),
      createdAt: serverTimestamp(),
    });
  },

  getWishes: async () => {
    const snaps = await getDocs(query(collection(db, 'wishes'), where('hidden', '==', false)));
    return snaps.docs.map(withId).sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  },

  sendWish: async (data) => {
    const name = clean(data.name, 120);
    const message = clean(data.message, 2000);
    if (!name || !message) throw new Error('Vui lòng nhập tên và lời chúc');
    const ref = doc(collection(db, 'wishes'));
    await setDoc(ref, { name, message, hidden: false, createdAt: serverTimestamp() });
    return { id: ref.id, name, message, hidden: false, createdAt: new Date().toISOString() };
  },
};

// ---------- Admin ----------
/** Báo trạng thái đăng nhập admin: cb(true | false) */
export const watchAdmin = (cb) => onAuthStateChanged(auth, (user) => cb(Boolean(user)));

const publicInvite = (guestId, g, openedAt = null) => ({
  guestId,
  name: g.name,
  salutation: g.salutation,
  side: g.side,
  openedAt,
});

/** Phản hồi mới nhất của từng link mời → { [slug]: { attending, guestCount, at } } */
async function latestRsvpBySlug() {
  const snaps = await getDocs(query(collection(db, 'rsvps'), orderBy('createdAt', 'asc')));
  const map = {};
  for (const r of snaps.docs.map(withId)) {
    if (r.guestSlug) map[r.guestSlug] = { attending: r.attending, guestCount: r.guestCount, at: r.createdAt };
  }
  return map;
}

export const adminApi = {
  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      throw new Error('Sai email hoặc mật khẩu');
    }
    // tài khoản đăng nhập được nhưng không nằm trong danh sách admin của firestore.rules
    try {
      await getDocs(query(collection(db, 'guests'), orderBy('createdAt', 'desc')));
    } catch {
      await signOut(auth);
      throw new Error('Tài khoản này không có quyền quản trị');
    }
  },
  logout: () => signOut(auth),

  getConfig: loadConfig,
  saveConfig: async (config) => {
    const data = plain(config);
    await setDoc(configRef, data);
    return data;
  },

  getGuests: async () => {
    const [guests, invites, rsvps] = await Promise.all([
      getDocs(query(collection(db, 'guests'), orderBy('createdAt', 'desc'))),
      getDocs(collection(db, 'invites')),
      latestRsvpBySlug(),
    ]);
    const opened = Object.fromEntries(invites.docs.map((d) => [d.id, toIso(d.data().openedAt)]));
    return guests.docs.map(withId).map((g) => ({ ...g, openedAt: opened[g.slug] ?? null, rsvp: rsvps[g.slug] }));
  },

  addGuests: async (input) => {
    const list = (Array.isArray(input) ? input : [input]).map(buildGuest).filter((g) => g.name);
    if (!list.length) throw new Error('Tên khách mời không được để trống');
    const taken = new Set((await getDocs(collection(db, 'invites'))).docs.map((d) => d.id));
    const batch = writeBatch(db);
    const created = list.map((g) => {
      const slug = uniqueSlug(g.name, taken);
      taken.add(slug);
      const ref = doc(collection(db, 'guests'));
      batch.set(ref, { ...g, slug, createdAt: serverTimestamp() });
      batch.set(doc(db, 'invites', slug), publicInvite(ref.id, g));
      return { id: ref.id, ...g, slug, createdAt: new Date().toISOString(), openedAt: null };
    });
    await batch.commit();
    return created;
  },

  updateGuest: async (id, input) => {
    const ref = doc(db, 'guests', id);
    const old = withId(await getDoc(ref));
    const fields = buildGuest(input);
    if (!fields.name) return old;
    const oldInvite = await getDoc(doc(db, 'invites', old.slug));
    const openedAt = oldInvite.exists() ? oldInvite.data().openedAt ?? null : null;
    let slug = old.slug;
    const batch = writeBatch(db);
    // đổi tên thì đổi link mời theo tên mới
    if (fields.name !== old.name) {
      const taken = new Set((await getDocs(collection(db, 'invites'))).docs.map((d) => d.id));
      taken.delete(old.slug);
      slug = uniqueSlug(fields.name, taken);
      batch.delete(doc(db, 'invites', old.slug));
    }
    batch.update(ref, { ...fields, slug });
    batch.set(doc(db, 'invites', slug), publicInvite(id, fields, openedAt));
    await batch.commit();
    return { ...old, ...fields, slug, openedAt: toIso(openedAt), rsvp: input.rsvp ?? old.rsvp };
  },

  deleteGuest: async (id) => {
    const ref = doc(db, 'guests', id);
    const snap = await getDoc(ref);
    const batch = writeBatch(db);
    if (snap.exists()) batch.delete(doc(db, 'invites', snap.data().slug));
    batch.delete(ref);
    await batch.commit();
  },

  getRsvps: async () =>
    (await getDocs(query(collection(db, 'rsvps'), orderBy('createdAt', 'desc')))).docs.map(withId),
  deleteRsvp: (id) => deleteDoc(doc(db, 'rsvps', id)),

  getWishes: async () =>
    (await getDocs(query(collection(db, 'wishes'), orderBy('createdAt', 'desc')))).docs.map(withId),
  setWishHidden: async (id, hidden) => {
    const ref = doc(db, 'wishes', id);
    await updateDoc(ref, { hidden });
    return withId(await getDoc(ref));
  },
  deleteWish: (id) => deleteDoc(doc(db, 'wishes', id)),

  /** Nhập toàn bộ dữ liệu từ file data/db.json của bản chạy Express cũ */
  importLegacy: async (json) => {
    const ts = (iso) => (iso ? Timestamp.fromDate(new Date(iso)) : null);
    const ops = [];
    if (json.config) ops.push((b) => b.set(configRef, plain(migrateEvents(json.config))));
    for (const g of json.guests ?? []) {
      const fields = buildGuest(g);
      ops.push((b) => b.set(doc(db, 'guests', g.id), { ...fields, slug: g.slug, createdAt: ts(g.createdAt) }));
      ops.push((b) => b.set(doc(db, 'invites', g.slug), publicInvite(g.id, fields, ts(g.openedAt))));
    }
    for (const r of json.rsvps ?? []) {
      const guestSlug = (json.guests ?? []).find((g) => g.id === r.guestId)?.slug ?? null;
      const { id, guestId, ...rest } = r;
      ops.push((b) => b.set(doc(db, 'rsvps', id), { ...plain(rest), guestSlug, createdAt: ts(r.createdAt) }));
    }
    for (const w of json.wishes ?? []) {
      const { id, ...rest } = w;
      ops.push((b) => b.set(doc(db, 'wishes', id), { ...plain(rest), hidden: Boolean(w.hidden), createdAt: ts(w.createdAt) }));
    }
    // mỗi batch tối đa 500 thao tác
    for (let i = 0; i < ops.length; i += 450) {
      const batch = writeBatch(db);
      ops.slice(i, i + 450).forEach((op) => op(batch));
      await batch.commit();
    }
    return {
      guests: json.guests?.length ?? 0,
      rsvps: json.rsvps?.length ?? 0,
      wishes: json.wishes?.length ?? 0,
    };
  },
};
