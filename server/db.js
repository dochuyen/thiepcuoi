import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultData } from './defaultData.js';

const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function load() {
  if (!fs.existsSync(DB_FILE)) return structuredClone(defaultData);
  const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  return { ...structuredClone(defaultData), ...saved };
}

let data = load();

export function getData() {
  return data;
}

/** Thay đổi dữ liệu rồi ghi file (ghi ra file tạm rồi rename để không hỏng file khi crash). */
export function update(mutator) {
  const result = mutator(data);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
  return result;
}
