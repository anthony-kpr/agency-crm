import './styles.css';
import {
  DEFAULT_VISIBLE_COLUMNS,
  FIELDS,
  getLabel,
  CITY_OPTIONS,
  GENDER_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  TYPE_OPTIONS
} from './data.js';
import {
  getAllCandidates,
  saveCandidate,
  saveManyCandidates,
  deleteCandidate,
  replaceAllCandidates
} from './storage.js';
import { csvToCandidates, downloadCsv } from './csv.js';

const app = document.querySelector('#app');

const SETTINGS_KEY = 'aday-takip-settings-v1';

const defaultFilters = {
  search: '',
  cinsiyet: '',
  sehir: '',
  sacRengi: '',
  gozRengi: '',
  tur: '',
  yasMin: '',
  yasMax: '',
  boyMin: '',
  boyMax: '',
  kiloMin: '',
  kiloMax: ''
};

const state = {
  candidates: [],
  filters: { ...defaultFilters },
  visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
  sort: { key: 'updatedAt', direction: 'desc' },
  editingId: null,
  isFormOpen: false,
  isFilterPanelOpen: false,
  isColumnPanelOpen: false,
  importMode: 'merge',
  lastSavedMessage: ''
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.visibleColumns)) state.visibleColumns = parsed.visibleColumns;
    if (parsed.sort?.key) state.sort = parsed.sort;
  } catch (error) {
    console.warn('Ayarlar okunamadı:', error);
  }
}

function saveSettings() {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ visibleColumns: state.visibleColumns, sort: state.sort })
  );
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatValue(candidate, key) {
  const value = candidate[key];
  if (value === undefined || value === null || value === '') return '-';
  if (key === 'createdAt' || key === 'updatedAt') return formatDate(value);
  return value;
}

function normalizeText(value) {
  return String(value ?? '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function getFilteredCandidates() {
  const f = state.filters;
  const searchWords = normalizeText(f.search).split(/\s+/).filter(Boolean);

  return state.candidates.filter((candidate) => {
    if (f.cinsiyet && candidate.cinsiyet !== f.cinsiyet) return false;
    if (f.sehir && candidate.sehir !== f.sehir) return false;
    if (f.sacRengi && candidate.sacRengi !== f.sacRengi) return false;
    if (f.gozRengi && candidate.gozRengi !== f.gozRengi) return false;
    if (f.tur && candidate.tur !== f.tur) return false;

    if (!isInRange(candidate.yas, f.yasMin, f.yasMax)) return false;
    if (!isInRange(candidate.boyCm, f.boyMin, f.boyMax)) return false;
    if (!isInRange(candidate.kiloKg, f.kiloMin, f.kiloMax)) return false;

    if (searchWords.length > 0) {
      const haystack = normalizeText(
        FIELDS.map((field) => candidate[field.key]).join(' ')
      );
      if (!searchWords.every((word) => haystack.includes(word))) return false;
    }

    return true;
  });
}

function isInRange(value, min, max) {
  const number = Number(value);
  if ((min === '' || min == null) && (max === '' || max == null)) return true;
  if (!Number.isFinite(number)) return false;
  if (min !== '' && min != null && number < Number(min)) return false;
  if (max !== '' && max != null && number > Number(max)) return false;
  return true;
}

function getSortedCandidates(candidates) {
  const { key, direction } = state.sort;
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...candidates].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    const aNumber = Number(aValue);
    const bNumber = Number(bValue);

    if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
      return (aNumber - bNumber) * multiplier;
    }

    return String(aValue ?? '').localeCompare(String(bValue ?? ''), 'tr-TR', {
      numeric: true,
      sensitivity: 'base'
    }) * multiplier;
  });
}

function getDisplayedCandidates() {
  return getSortedCandidates(getFilteredCandidates());
}

function fieldByKey(key) {
  return FIELDS.find((field) => field.key === key);
}

function getOptionsForField(key) {
  if (key === 'cinsiyet') return GENDER_OPTIONS;
  if (key === 'sehir') return CITY_OPTIONS;
  if (key === 'sacRengi') return HAIR_COLOR_OPTIONS;
  if (key === 'gozRengi') return EYE_COLOR_OPTIONS;
  if (key === 'tur') return TYPE_OPTIONS;
  return [];
}

function renderOptionList(options, selectedValue = '', includeEmpty = false, emptyLabel = 'Seçiniz') {
  const normalizedOptions = [...options];
  if (selectedValue && !normalizedOptions.includes(selectedValue)) {
    normalizedOptions.unshift(selectedValue);
  }
  const empty = includeEmpty ? `<option value="">${escapeHtml(emptyLabel)}</option>` : '';
  return empty + normalizedOptions.map((option) => {
    const label = options.includes(option) ? option : `${option} (CSV'den gelen)`;
    return `<option value="${escapeHtml(option)}" ${option === selectedValue ? 'selected' : ''}>${escapeHtml(label)}</option>`;
  }).join('');
}

function render() {
  const displayed = getDisplayedCandidates();
  app.innerHTML = `
    <div class="app-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Offline PWA</p>
          <h1>Aday Takip Sistemi</h1>
          <p class="hero-text">Adayları ekle, filtrele, CSV olarak dışa aktar ve başka cihazda içe aktar. Tüm veri cihazda lokal tutulur.</p>
        </div>
        <div class="hero-actions">
          <button class="primary" data-action="open-form">+ Aday Ekle</button>
          <button data-action="export-csv">CSV Dışa Aktar</button>
          <label class="file-button">
            CSV İçe Aktar
            <input type="file" accept=".csv,text/csv" data-action="import-csv" />
          </label>
        </div>
      </header>

      <section class="status-row">
        <div class="stat"><strong>${state.candidates.length}</strong><span>Toplam aday</span></div>
        <div class="stat"><strong>${displayed.length}</strong><span>Görünen sonuç</span></div>
        <div class="stat wide"><strong>${state.lastSavedMessage || 'Hazır'}</strong><span>Durum</span></div>
      </section>

      <section class="panel controls-panel">
        <div class="control-actions">
          <button data-action="toggle-filters">${state.isFilterPanelOpen ? 'Filtreleri Gizle' : 'Filtreleri Aç'}</button>
          <button data-action="clear-filters">Filtreleri Temizle</button>
          <button data-action="toggle-columns">Sütunları Düzenle</button>
          <label class="inline-check">
            <span>İçe aktarma modu</span>
            <select data-action="import-mode">
              <option value="merge" ${state.importMode === 'merge' ? 'selected' : ''}>Birleştir / güncelle</option>
              <option value="replace" ${state.importMode === 'replace' ? 'selected' : ''}>Tüm veriyi değiştir</option>
            </select>
          </label>
        </div>
        ${state.isFilterPanelOpen ? `
          <div class="control-grid collapsible-filters">
            <label class="field full">
              <span>Genel Arama</span>
              <input type="search" value="${escapeHtml(state.filters.search)}" data-filter="search" placeholder="Ad, şehir, telefon, not vb. ara" />
            </label>
            ${renderSelectFilter('cinsiyet', 'Cinsiyet', GENDER_OPTIONS)}
            ${renderSelectFilter('sehir', 'Şehir', CITY_OPTIONS)}
            ${renderSelectFilter('sacRengi', 'Saç Rengi', HAIR_COLOR_OPTIONS)}
            ${renderSelectFilter('gozRengi', 'Göz Rengi', EYE_COLOR_OPTIONS)}
            ${renderSelectFilter('tur', 'Tür', TYPE_OPTIONS)}
            ${renderRangeFilter('yas', 'Yaş')}
            ${renderRangeFilter('boy', 'Boy')}
            ${renderRangeFilter('kilo', 'Kilo')}
          </div>
        ` : ''}
        ${state.isColumnPanelOpen ? renderColumnPanel() : ''}
      </section>

      <section class="panel list-panel">
        <div class="table-wrap">
          ${renderTable(displayed)}
        </div>
        <div class="card-list">
          ${displayed.map(renderCandidateCard).join('') || renderEmptyState()}
        </div>
      </section>

      ${state.isFormOpen ? renderFormModal() : ''}
    </div>
  `;
}

function renderSelectFilter(key, label, options) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <select data-filter="${key}">
        ${renderOptionList(options, state.filters[key], true, 'Tümü')}
      </select>
    </label>
  `;
}

function renderRangeFilter(prefix, label) {
  const minKey = `${prefix}Min`;
  const maxKey = `${prefix}Max`;
  return `
    <div class="range-pair">
      <label class="field">
        <span>${escapeHtml(label)} Min</span>
        <input type="number" value="${escapeHtml(state.filters[minKey])}" data-filter="${minKey}" />
      </label>
      <label class="field">
        <span>${escapeHtml(label)} Max</span>
        <input type="number" value="${escapeHtml(state.filters[maxKey])}" data-filter="${maxKey}" />
      </label>
    </div>
  `;
}

function renderColumnPanel() {
  return `
    <div class="column-panel">
      <div class="column-panel-header">
        <strong>Görünen Sütunlar</strong>
        <span>Tablodaki alanları aç/kapat. Mobil kartlarda temel bilgiler yine görünür.</span>
      </div>
      <div class="column-list">
        ${FIELDS.map((field) => `
          <label class="column-check">
            <input type="checkbox" data-column="${field.key}" ${state.visibleColumns.includes(field.key) ? 'checked' : ''} />
            <span>${escapeHtml(field.label)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTable(candidates) {
  if (candidates.length === 0) return renderEmptyState();
  const columns = state.visibleColumns.filter((key) => fieldByKey(key));
  return `
    <table>
      <thead>
        <tr>
          ${columns.map((key) => `
            <th>
              <button class="sort-button" data-sort="${key}">
                ${escapeHtml(getLabel(key))}
                ${state.sort.key === key ? (state.sort.direction === 'asc' ? '↑' : '↓') : ''}
              </button>
            </th>
          `).join('')}
          <th class="actions-col">İşlem</th>
        </tr>
      </thead>
      <tbody>
        ${candidates.map((candidate) => `
          <tr>
            ${columns.map((key) => `<td>${escapeHtml(formatValue(candidate, key))}</td>`).join('')}
            <td class="actions-cell">
              <button data-action="edit" data-id="${candidate.id}">Düzenle</button>
              <button class="danger" data-action="delete" data-id="${candidate.id}">Sil</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCandidateCard(candidate) {
  return `
    <article class="candidate-card">
      <div class="card-header">
        <div>
          <h3>${escapeHtml(candidate.adSoyad || 'İsimsiz Aday')}</h3>
          <p>${escapeHtml([candidate.cinsiyet, candidate.yas ? `${candidate.yas} yaş` : '', candidate.sehir].filter(Boolean).join(' · ') || 'Bilgi yok')}</p>
        </div>
        <div class="card-actions">
          <button data-action="edit" data-id="${candidate.id}">Düzenle</button>
          <button class="danger" data-action="delete" data-id="${candidate.id}">Sil</button>
        </div>
      </div>
      <dl>
        <div><dt>Boy</dt><dd>${escapeHtml(formatValue(candidate, 'boyCm'))}</dd></div>
        <div><dt>Kilo</dt><dd>${escapeHtml(formatValue(candidate, 'kiloKg'))}</dd></div>
        <div><dt>Saç</dt><dd>${escapeHtml(formatValue(candidate, 'sacRengi'))}</dd></div>
        <div><dt>Göz</dt><dd>${escapeHtml(formatValue(candidate, 'gozRengi'))}</dd></div>
        <div><dt>Tür</dt><dd>${escapeHtml(formatValue(candidate, 'tur'))}</dd></div>
        <div><dt>Telefon</dt><dd>${escapeHtml(formatValue(candidate, 'telefonNo'))}</dd></div>
      </dl>
      ${candidate.notlar ? `<p class="notes">${escapeHtml(candidate.notlar)}</p>` : ''}
    </article>
  `;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <strong>Kayıt bulunamadı.</strong>
      <p>Filtreleri temizleyebilir veya yeni aday ekleyebilirsin.</p>
    </div>
  `;
}

function renderFormModal() {
  const editing = state.candidates.find((candidate) => candidate.id === state.editingId);
  const title = editing ? 'Adayı Düzenle' : 'Yeni Aday Ekle';
  const values = editing || {};

  return `
    <div class="modal-backdrop" data-action="close-form">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" data-modal>
        <div class="modal-header">
          <h2 id="form-title">${title}</h2>
          <button class="icon-button" data-action="close-form" aria-label="Kapat">×</button>
        </div>
        <form id="candidate-form" class="candidate-form">
          <div class="form-grid">
            ${FIELDS.map((field) => renderFormField(field, values[field.key])).join('')}
          </div>
          <div class="form-actions">
            <button type="button" data-action="close-form">Vazgeç</button>
            <button type="submit" class="primary">Kaydet</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderFormField(field, value = '') {
  const common = `name="${field.key}" id="field-${field.key}" ${field.required ? 'required' : ''}`;
  const label = `<span>${escapeHtml(field.label)}${field.required ? ' *' : ''}</span>`;

  if (field.type === 'select') {
    return `
      <label class="field">
        ${label}
        <select ${common}>
          ${renderOptionList(getOptionsForField(field.key), value, true, 'Seçiniz')}
        </select>
      </label>
    `;
  }

  if (field.type === 'textarea') {
    return `
      <label class="field full">
        ${label}
        <textarea ${common} placeholder="${escapeHtml(field.placeholder || '')}">${escapeHtml(value)}</textarea>
      </label>
    `;
  }

  return `
    <label class="field">
      ${label}
      <input ${common} type="${field.type || 'text'}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || '')}" ${field.min != null ? `min="${field.min}"` : ''} ${field.max != null ? `max="${field.max}"` : ''} />
    </label>
  `;
}

async function refreshCandidates() {
  state.candidates = await getAllCandidates();
  render();
}

function setStatus(message) {
  state.lastSavedMessage = message;
}

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const now = new Date().toISOString();
  const existing = state.candidates.find((candidate) => candidate.id === state.editingId);
  const candidate = {
    id: existing?.id || crypto.randomUUID(),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  for (const field of FIELDS) {
    const rawValue = formData.get(field.key);
    if (field.type === 'number') {
      candidate[field.key] = rawValue === '' || rawValue == null ? '' : Number(rawValue);
    } else {
      candidate[field.key] = String(rawValue ?? '').trim();
    }
  }

  await saveCandidate(candidate);
  state.isFormOpen = false;
  state.editingId = null;
  setStatus('Kaydedildi');
  await refreshCandidates();
}

function openForm(id = null) {
  state.editingId = id;
  state.isFormOpen = true;
  render();
  setTimeout(() => document.querySelector('#field-adSoyad')?.focus(), 0);
}

function closeForm() {
  state.isFormOpen = false;
  state.editingId = null;
  render();
}

async function handleDelete(id) {
  const candidate = state.candidates.find((item) => item.id === id);
  const label = candidate?.adSoyad || 'bu aday';
  if (!confirm(`${label} silinsin mi? Bu işlem geri alınamaz.`)) return;
  await deleteCandidate(id);
  setStatus('Silindi');
  await refreshCandidates();
}

function handleSort(key) {
  if (state.sort.key === key) {
    state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.sort = { key, direction: 'asc' };
  }
  saveSettings();
  render();
}

async function handleImport(file) {
  if (!file) return;
  const text = await file.text();
  const incoming = csvToCandidates(text);
  if (incoming.length === 0) {
    alert('CSV içinde aktarılacak aday bulunamadı.');
    return;
  }

  if (state.importMode === 'replace') {
    const ok = confirm(`${incoming.length} aday içe aktarılacak ve mevcut tüm lokal veri değiştirilecek. Emin misin?`);
    if (!ok) return;
    await replaceAllCandidates(incoming);
    setStatus(`${incoming.length} aday içe aktarıldı`);
    await refreshCandidates();
    return;
  }

  const byId = new Map(state.candidates.map((candidate) => [candidate.id, candidate]));
  const merged = incoming.map((candidate) => {
    const existing = byId.get(candidate.id);
    if (!existing) return candidate;
    const incomingTime = Date.parse(candidate.updatedAt || '');
    const existingTime = Date.parse(existing.updatedAt || '');
    return incomingTime >= existingTime ? { ...existing, ...candidate } : existing;
  });

  await saveManyCandidates(merged);
  setStatus(`${incoming.length} aday birleştirildi`);
  await refreshCandidates();
}

function clearFilters() {
  state.filters = { ...defaultFilters };
  render();
}

function handleColumnToggle(key, checked) {
  if (checked && !state.visibleColumns.includes(key)) state.visibleColumns.push(key);
  if (!checked) state.visibleColumns = state.visibleColumns.filter((column) => column !== key);
  if (state.visibleColumns.length === 0) state.visibleColumns = ['adSoyad'];
  saveSettings();
  render();
}

function registerEvents() {
  app.addEventListener('click', async (event) => {
    const target = event.target;
    const actionTarget = target.closest('[data-action]');
    const sortTarget = target.closest('[data-sort]');

    if (sortTarget) {
      handleSort(sortTarget.dataset.sort);
      return;
    }

    if (!actionTarget) return;
    const action = actionTarget.dataset.action;
    const id = actionTarget.dataset.id;

    if (action === 'open-form') openForm();
    if (action === 'close-form') {
      if (target.closest('[data-modal]') && target.dataset.action !== 'close-form') return;
      closeForm();
    }
    if (action === 'edit') openForm(id);
    if (action === 'delete') await handleDelete(id);
    if (action === 'export-csv') downloadCsv(getDisplayedCandidates());
    if (action === 'clear-filters') clearFilters();
    if (action === 'toggle-filters') {
      state.isFilterPanelOpen = !state.isFilterPanelOpen;
      render();
    }
    if (action === 'toggle-columns') {
      state.isColumnPanelOpen = !state.isColumnPanelOpen;
      render();
    }
  });

  app.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-filter]')) {
      state.filters[target.dataset.filter] = target.value;
      render();
    }
  });

  app.addEventListener('change', async (event) => {
    const target = event.target;
    if (target.matches('[data-filter]')) {
      state.filters[target.dataset.filter] = target.value;
      render();
    }
    if (target.matches('[data-column]')) {
      handleColumnToggle(target.dataset.column, target.checked);
    }
    if (target.matches('[data-action="import-mode"]')) {
      state.importMode = target.value;
    }
    if (target.matches('[data-action="import-csv"]')) {
      await handleImport(target.files?.[0]);
      target.value = '';
    }
  });

  app.addEventListener('submit', async (event) => {
    if (event.target.matches('#candidate-form')) {
      await handleSubmit(event);
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((error) => {
        console.warn('Service worker kaydı başarısız:', error);
      });
    });
  }
}

async function init() {
  loadSettings();
  registerEvents();
  registerServiceWorker();
  await refreshCandidates();
}

init().catch((error) => {
  console.error(error);
  app.innerHTML = `
    <main class="fatal-error">
      <h1>Uygulama başlatılamadı</h1>
      <p>${escapeHtml(error.message || error)}</p>
    </main>
  `;
});
