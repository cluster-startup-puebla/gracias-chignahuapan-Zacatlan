import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCANS_FILE = path.join(DATA_DIR, 'scans.json');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');

export interface ScanEntry {
  slug: string;
  timestamp: string;
  ip?: string;
}

export interface EmailEntry {
  email: string;
  slug: string;
  timestamp: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  ensureDataDir();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function writeJSON(filePath: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function recordScan(slug: string, ip?: string) {
  const scans = readJSON<ScanEntry[]>(SCANS_FILE, []);
  scans.push({
    slug,
    timestamp: new Date().toISOString(),
    ip,
  });
  writeJSON(SCANS_FILE, scans);
}

export function recordEmail(email: string, slug: string) {
  const emails = readJSON<EmailEntry[]>(EMAILS_FILE, []);
  emails.push({
    email,
    slug,
    timestamp: new Date().toISOString(),
  });
  writeJSON(EMAILS_FILE, emails);
}

export function getAllScans(): ScanEntry[] {
  return readJSON<ScanEntry[]>(SCANS_FILE, []);
}

export function getAllEmails(): EmailEntry[] {
  return readJSON<EmailEntry[]>(EMAILS_FILE, []);
}

export function getStatsByProduct() {
  const scans = getAllScans();
  const counts: Record<string, number> = {};
  for (const scan of scans) {
    counts[scan.slug] = (counts[scan.slug] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([slug, count]) => ({slug, scans: count}))
    .sort((a, b) => b.scans - a.scans);
}

export function getScansByDate() {
  const scans = getAllScans();
  const byDate: Record<string, number> = {};
  for (const scan of scans) {
    const date = scan.timestamp.split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  }
  return Object.entries(byDate)
    .map(([date, count]) => ({date, scans: count}))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayScans(): number {
  const today = new Date().toISOString().split('T')[0];
  return getAllScans().filter((s) => s.timestamp.startsWith(today)).length;
}
