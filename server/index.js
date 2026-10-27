import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getData, update } from './db.js';

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const sessions = new Set();

const app = express();
app.use(express.json({ limit: '1mb' }));

const newId = () => crypto.randomUUID();
const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);

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

function uniqueSlug(name, guests, ignoreId) {
  const base = slugify(name) || 'khach';
  let slug = base;
  for (let i = 2; guests.some((g) => g.slug === slug && g.id !== ignoreId); i++) slug = `${base}-${i}`;
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

// ---------- Public API ----------
app.get('/api/config', (_req, res) => res.json(getData().config));

app.get('/api/guests/:slug', (req, res) => {
  const guest = getData().guests.find((g) => g.slug === req.params.slug);
  if (!guest) return res.status(404).json({ error: 'Không tìm thấy khách mời' });
  // ?preview=1: admin xem thử, không tính là khách đã mở thiệp
  if (!guest.openedAt && !req.query.preview) update(() => (guest.openedAt = new Date().toISOString()));
  res.json({ name: guest.name, salutation: guest.salutation, slug: guest.slug });
});

app.post('/api/rsvp', (req, res) => {
  const { name, attending, guestCount, side, message, guestSlug } = req.body ?? {};
  if (!clean(name)) return res.status(400).json({ error: 'Vui lòng nhập tên' });
  const rsvp = update((db) => {
    const guest = guestSlug ? db.guests.find((g) => g.slug === guestSlug) : null;
    const item = {
      id: newId(),
      guestId: guest?.id ?? null,
      name: clean(name, 120),
      attending: Boolean(attending),
      guestCount: Math.min(Math.max(Number(guestCount) || 1, 1), 20),
      side: side === 'bride' ? 'bride' : 'groom',
      message: clean(message, 1000),
      createdAt: new Date().toISOString(),
    };
    db.rsvps.unshift(item);
    if (guest) guest.rsvp = { attending: item.attending, guestCount: item.guestCount, at: item.createdAt };
    return item;
  });
  res.status(201).json(rsvp);
});

app.get('/api/wishes', (_req, res) => res.json(getData().wishes.filter((w) => !w.hidden)));

app.post('/api/wishes', (req, res) => {
  const name = clean(req.body?.name, 120);
  const message = clean(req.body?.message, 2000);
  if (!name || !message) return res.status(400).json({ error: 'Vui lòng nhập tên và lời chúc' });
  const wish = update((db) => {
    const item = { id: newId(), name, message, hidden: false, createdAt: new Date().toISOString() };
    db.wishes.unshift(item);
    return item;
  });
  res.status(201).json(wish);
});

// ---------- Admin API ----------
app.post('/api/admin/login', (req, res) => {
  const a = Buffer.from(String(req.body?.password ?? ''));
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Sai mật khẩu' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  sessions.add(token);
  res.json({ token });
});

const admin = express.Router();
admin.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Chưa đăng nhập' });
  next();
});

admin.get('/config', (_req, res) => res.json(getData().config));
admin.put('/config', (req, res) => {
  update((db) => (db.config = req.body));
  res.json(getData().config);
});

admin.get('/guests', (_req, res) => res.json(getData().guests));

admin.post('/guests', (req, res) => {
  const list = Array.isArray(req.body) ? req.body : [req.body];
  const created = update((db) => {
    const items = [];
    for (const g of list.map(buildGuest).filter((x) => x.name)) {
      const taken = [...items, ...db.guests];
      items.push({ id: newId(), ...g, slug: uniqueSlug(g.name, taken), createdAt: new Date().toISOString() });
    }
    db.guests.unshift(...items);
    return items;
  });
  if (!created.length) return res.status(400).json({ error: 'Tên khách mời không được để trống' });
  res.status(201).json(created);
});

admin.put('/guests/:id', (req, res) => {
  const guest = update((db) => {
    const g = db.guests.find((x) => x.id === req.params.id);
    if (!g) return null;
    const fields = buildGuest(req.body);
    if (!fields.name) return g;
    if (fields.name !== g.name) g.slug = uniqueSlug(fields.name, db.guests, g.id);
    return Object.assign(g, fields);
  });
  if (!guest) return res.status(404).json({ error: 'Không tìm thấy khách mời' });
  res.json(guest);
});

admin.delete('/guests/:id', (req, res) => {
  update((db) => (db.guests = db.guests.filter((g) => g.id !== req.params.id)));
  res.status(204).end();
});

admin.get('/rsvps', (_req, res) => res.json(getData().rsvps));
admin.delete('/rsvps/:id', (req, res) => {
  update((db) => (db.rsvps = db.rsvps.filter((r) => r.id !== req.params.id)));
  res.status(204).end();
});

admin.get('/wishes', (_req, res) => res.json(getData().wishes));
admin.patch('/wishes/:id', (req, res) => {
  const wish = update((db) => {
    const w = db.wishes.find((x) => x.id === req.params.id);
    if (w) w.hidden = Boolean(req.body?.hidden);
    return w;
  });
  if (!wish) return res.status(404).json({ error: 'Không tìm thấy lời chúc' });
  res.json(wish);
});
admin.delete('/wishes/:id', (req, res) => {
  update((db) => (db.wishes = db.wishes.filter((w) => w.id !== req.params.id)));
  res.status(204).end();
});

app.use('/api/admin', admin);

// ---------- Production: phục vụ bản build React ----------
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => console.log(`API chạy tại http://localhost:${PORT}`));
