import { ALL_EXPORT_FIELDS, FIELDS } from './data.js';

const headerAliases = new Map();
for (const field of ALL_EXPORT_FIELDS) {
  headerAliases.set(normalizeHeader(field.key), field.key);
  headerAliases.set(normalizeHeader(field.label), field.key);
}
headerAliases.set(normalizeHeader('Name / Surname'), 'adSoyad');
headerAliases.set(normalizeHeader('Name'), 'adSoyad');
headerAliases.set(normalizeHeader('Gender'), 'cinsiyet');
headerAliases.set(normalizeHeader('Age'), 'yas');
headerAliases.set(normalizeHeader('City'), 'sehir');
headerAliases.set(normalizeHeader('Height'), 'boyCm');
headerAliases.set(normalizeHeader('Height Cm'), 'boyCm');
headerAliases.set(normalizeHeader('Weight'), 'kiloKg');
headerAliases.set(normalizeHeader('Weight Kg'), 'kiloKg');
headerAliases.set(normalizeHeader('Hair Color'), 'sacRengi');
headerAliases.set(normalizeHeader('Eye Color'), 'gozRengi');
headerAliases.set(normalizeHeader('Type'), 'tur');
headerAliases.set(normalizeHeader('Phone'), 'telefonNo');
headerAliases.set(normalizeHeader('Phone No'), 'telefonNo');
headerAliases.set(normalizeHeader('Candidate ID'), 'adayNo');
headerAliases.set(normalizeHeader('Candidate Card No'), 'kartNo');
headerAliases.set(normalizeHeader('Notes'), 'notlar');

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '');
}

function escapeCsv(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n\r;]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function candidatesToCsv(candidates) {
  const headers = ALL_EXPORT_FIELDS.map((field) => field.label);
  const rows = candidates.map((candidate) =>
    ALL_EXPORT_FIELDS.map((field) => escapeCsv(candidate[field.key] ?? '')).join(',')
  );
  return '\ufeff' + [headers.map(escapeCsv).join(','), ...rows].join('\n');
}

export function downloadCsv(candidates) {
  const csv = candidatesToCsv(candidates);
  const date = new Date();
  const stamp = date.toISOString().slice(0, 16).replace('T', '-').replace(':', '-');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aday-takip-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function detectDelimiter(line) {
  const commaCount = (line.match(/,/g) || []).length;
  const semicolonCount = (line.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ';' : ',';
}

export function parseCsv(text) {
  const clean = text.replace(/^\ufeff/, '');
  const firstLine = clean.split(/\r?\n/)[0] || '';
  const delimiter = detectDelimiter(firstLine);
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    const next = clean[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
  }

  return rows;
}

export function csvToCandidates(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => headerAliases.get(normalizeHeader(header)) || null);
  const now = new Date().toISOString();

  return rows.slice(1).map((row) => {
    const candidate = {};
    headers.forEach((key, index) => {
      if (!key) return;
      candidate[key] = row[index] == null ? '' : String(row[index]).trim();
    });

    for (const field of FIELDS) {
      if (field.type === 'number' && candidate[field.key] !== '' && candidate[field.key] != null) {
        const numberValue = Number(String(candidate[field.key]).replace(',', '.'));
        candidate[field.key] = Number.isFinite(numberValue) ? numberValue : '';
      }
    }

    return {
      id: candidate.id || crypto.randomUUID(),
      createdAt: candidate.createdAt || now,
      updatedAt: candidate.updatedAt || now,
      ...candidate
    };
  });
}
