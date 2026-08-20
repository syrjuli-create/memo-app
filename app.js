'use strict';

/* ---------------------------------------------------------------
 * 작은 hyperscript 헬퍼 — innerHTML 조립 대신 DOM 노드를 직접 생성한다.
 * (사용자 입력 텍스트는 항상 텍스트 노드로 들어가므로 XSS에 안전하다)
 * ------------------------------------------------------------- */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  attrs = attrs || {};
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v; // 신뢰된 정적 SVG 문자열 전용
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

const ICONS = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15.5" y2="15.5"/></svg>',
  hamburger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  notebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9a3 3 0 0 1 3 3v15H9a3 3 0 0 1-3-3V3z"/><line x1="9" y1="7" x2="14" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/><line x1="4" y1="6" x2="4" y2="21"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="14" r="3.5"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3"/><path d="M20 8V5a1 1 0 0 0-1-1h-3"/><path d="M4 16v3a1 1 0 0 0 1 1h3"/><path d="M20 16v3a1 1 0 0 0-1 1h-3"/><line x1="7" y1="12" x2="17" y2="12"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
};
function icon(name) { return el('span', { class: 'icon', html: ICONS[name] }); }

/* ---------------------------------------------------------------
 * 상태 저장/로드
 * ------------------------------------------------------------- */
const STORAGE_KEY = 'memoapp_v1';
const EMOJI_CHOICES = ['📚', '👥', '💡', '✅', '📝', '🧪', '🌍', '📅', '🎤', '📔', '⭐', '🎯'];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function formatDate(iso) {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  return `${m}.${d}`;
}

function defaultData() {
  const studyFolder = { id: uid(), name: '공부', emoji: '📚' };
  const ideaFolder = { id: uid(), name: '아이디어', emoji: '💡' };
  return {
    profile: { name: '나' },
    settingsData: { theme: 'light', dimDone: true },
    folders: [studyFolder, ideaFolder],
    notes: [
      {
        id: uid(),
        title: '앱 사용법',
        date: todayISO(),
        folderId: ideaFolder.id,
        emoji: '📝',
        done: false,
        body: '왼쪽 아래 + 버튼을 누르면 새 노트가 만들어져요.\n목록에서 동그라미를 누르면 완료 표시를 할 수 있어요.\n체크리스트 항목은 아래 "+ 항목 추가"로 늘릴 수 있어요.\n사진 추가로 이미지를 첨부하거나, 글자 인식으로 사진 속 글자를 본문에 넣을 수도 있어요.',
        checklist: [{ id: uid(), text: '첫 노트 만들어보기', done: false }],
        images: [],
      },
    ],
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    const base = defaultData();
    return {
      profile: parsed.profile && typeof parsed.profile.name === 'string' ? parsed.profile : base.profile,
      settingsData: Object.assign({}, base.settingsData, parsed.settingsData || {}),
      folders: Array.isArray(parsed.folders) ? parsed.folders : base.folders,
      notes: (Array.isArray(parsed.notes) ? parsed.notes : base.notes).map(n => ({
        ...n,
        checklist: Array.isArray(n.checklist) ? n.checklist : [],
        images: Array.isArray(n.images) ? n.images : [],
      })),
    };
  } catch (err) {
    console.warn('저장된 데이터를 읽지 못해 기본값으로 시작합니다.', err);
    return defaultData();
  }
}

function persistNow() {
  try {
    const { profile, settingsData, folders, notes } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, settingsData, folders, notes }));
    return true;
  } catch (err) {
    console.warn('저장 실패', err);
    return false;
  }
}

let saveTimer = null;
function saveData() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistNow, 150);
}

const state = Object.assign(
  { route: 'list', editingNoteId: null, activeFolderId: 'all', filter: 'all', searchQuery: '' },
  loadData()
);

/* ---------------------------------------------------------------
 * 파생 데이터 헬퍼
 * ------------------------------------------------------------- */
function findFolder(id) { return state.folders.find(f => f.id === id) || null; }
function findNote(id) { return state.notes.find(n => n.id === id) || null; }
function noteCountInFolder(id) { return state.notes.filter(n => n.folderId === id).length; }

function visibleNotes() {
  return state.notes.filter(n => {
    if (state.activeFolderId !== 'all' && n.folderId !== state.activeFolderId) return false;
    if (state.filter === 'done' && !n.done) return false;
    if (state.filter === 'active' && n.done) return false;
    return true;
  });
}

function isNoteEmpty(n) {
  return !n.title.trim() && !n.body.trim() && n.checklist.length === 0 && n.images.length === 0;
}

function highlightNodes(text, query) {
  if (!query) return [text];
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return [text];
  return [text.slice(0, idx), el('mark', {}, text.slice(idx, idx + query.length)), text.slice(idx + query.length)];
}

/* ---------------------------------------------------------------
 * 이미지 첨부 / OCR
 * ------------------------------------------------------------- */
function compressImageFile(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('파일을 읽지 못했습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const TESSERACT_SRC = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
let tesseractLoadPromise = null;
function ensureTesseractLoaded() {
  if (window.Tesseract) return Promise.resolve();
  if (tesseractLoadPromise) return tesseractLoadPromise;
  tesseractLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TESSERACT_SRC;
    script.onload = () => resolve();
    script.onerror = () => { tesseractLoadPromise = null; reject(new Error('OCR 엔진을 불러오지 못했어요. 인터넷 연결을 확인해주세요.')); };
    document.head.appendChild(script);
  });
  return tesseractLoadPromise;
}

function runOCR(file, onProgress) {
  return ensureTesseractLoaded().then(() =>
    window.Tesseract.recognize(file, 'kor+eng', {
      logger: (m) => {
        if (!onProgress) return;
        if (m.status === 'recognizing text' && typeof m.progress === 'number') onProgress(Math.round(m.progress * 100));
        else onProgress(null, m.status);
      },
    }).then((result) => result.data.text.trim())
  );
}

let toastTimer = null;
function showToast(message) {
  clearTimeout(toastTimer);
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = el('div', { class: 'toast' }, message);
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 1400);
}

function openLightbox(src) {
  const overlay = el(
    'div', { class: 'lightbox', onclick: () => overlay.remove() },
    el('img', { src, alt: '첨부 이미지 원본' }),
    el('button', { class: 'lightbox-close', 'aria-label': '닫기', onclick: () => overlay.remove() }, icon('close'))
  );
  document.body.appendChild(overlay);
}

/* ---------------------------------------------------------------
 * 렌더링
 * ------------------------------------------------------------- */
function render() {
  const app = document.getElementById('app');
  document.documentElement.dataset.theme = state.settingsData.theme === 'dark' ? 'dark' : 'light';
  app.innerHTML = '';
  const views = { list: renderList, editor: renderEditor, search: renderSearch, folders: renderFolders, settings: renderSettings };
  app.appendChild(views[state.route]());
}

function go(route) {
  state.route = route;
  render();
}

/* ---- 목록 화면 ---- */
function renderList() {
  const activeFolder = state.activeFolderId === 'all' ? null : findFolder(state.activeFolderId);
  const header = el(
    'header', { class: 'hdr' },
    el('div', { class: 'hdr-title' }, activeFolder ? `${activeFolder.emoji} ${activeFolder.name}` : '공부 노트'),
    el('button', { class: 'icon-btn', 'aria-label': '검색', onclick: () => go('search') }, icon('search'))
  );

  const chipRow = el(
    'div', { class: 'folder-chip-row' },
    el('button', {
      class: 'folder-chip' + (state.activeFolderId === 'all' ? ' active' : ''),
      onclick: () => { state.activeFolderId = 'all'; render(); },
    }, '전체'),
    ...state.folders.map(f => el('button', {
      class: 'folder-chip' + (state.activeFolderId === f.id ? ' active' : ''),
      onclick: () => { state.activeFolderId = f.id; render(); },
    }, `${f.emoji} ${f.name}`))
  );

  const notes = visibleNotes();
  const list = el('div', { class: 'list-scroll' });
  if (notes.length === 0) {
    list.appendChild(el('div', { class: 'empty-state' }, '표시할 노트가 없어요.\n오른쪽 아래 + 버튼으로 새 노트를 만들어 보세요.'));
  } else {
    notes.forEach(n => {
      const folder = findFolder(n.folderId);
      const check = el(
        'button', {
          class: 'note-check' + (n.done ? ' done' : ''),
          'aria-label': n.done ? '완료 해제' : '완료로 표시',
          onclick: (e) => { e.stopPropagation(); n.done = !n.done; saveData(); render(); },
        },
        icon('check')
      );
      const row = el(
        'div', { class: 'note-row' + (n.done ? ' done' : ''), onclick: () => { state.editingNoteId = n.id; go('editor'); } },
        check,
        el('div', { class: 'note-text' },
          el('span', { class: 'note-title' }, `${n.emoji || ''} ${n.title || '제목 없음'}`.trim()),
          n.date ? el('span', { class: 'note-date' }, `· ${formatDate(n.date)}`) : null,
          folder ? el('span', { class: 'note-date' }, ` · ${folder.name}`) : null
        )
      );
      if (n.done && state.settingsData.dimDone) row.style.opacity = '0.55';
      list.appendChild(row);
    });
  }

  const toolbar = el(
    'nav', { class: 'toolbar' },
    el('button', { 'aria-label': '폴더', onclick: () => go('folders') }, icon('hamburger')),
    el('button', {
      class: state.filter === 'done' ? 'active' : '',
      'aria-label': '완료된 노트만 보기',
      onclick: () => { state.filter = state.filter === 'done' ? 'all' : 'done'; render(); },
    }, icon('check')),
    el('button', {
      class: state.filter === 'active' ? 'active' : '',
      'aria-label': '미완료 노트만 보기',
      onclick: () => { state.filter = state.filter === 'active' ? 'all' : 'active'; render(); },
    }, icon('circle')),
    el('button', { class: 'fab', 'aria-label': '새 노트', onclick: createNote }, icon('plus'))
  );

  return el('section', { class: 'view' }, header, chipRow, list, toolbar);
}

function createNote() {
  const note = {
    id: uid(),
    title: '',
    date: todayISO(),
    folderId: state.activeFolderId === 'all' ? (state.folders[0] ? state.folders[0].id : null) : state.activeFolderId,
    emoji: '📝',
    done: false,
    body: '',
    checklist: [],
    images: [],
  };
  state.notes.unshift(note);
  state.editingNoteId = note.id;
  go('editor');
  requestAnimationFrame(() => {
    const input = document.querySelector('.editor-title input');
    if (input) input.focus();
  });
}

/* ---- 편집 화면 ---- */
function renderEditor() {
  const note = findNote(state.editingNoteId);
  if (!note) { state.route = 'list'; return renderList(); }

  const closeEditor = () => {
    if (isNoteEmpty(note)) {
      state.notes = state.notes.filter(n => n.id !== note.id);
    }
    saveData();
    state.editingNoteId = null;
    go('list');
  };

  const header = el(
    'header', { class: 'hdr' },
    el('button', { class: 'icon-btn', 'aria-label': '뒤로', onclick: closeEditor }, icon('back')),
    el('div', { class: 'hdr-title' }, '노트'),
    el('button', {
      class: 'icon-btn danger', 'aria-label': '삭제',
      onclick: () => {
        if (confirm('이 노트를 삭제할까요?')) {
          state.notes = state.notes.filter(n => n.id !== note.id);
          saveData();
          state.editingNoteId = null;
          go('list');
        }
      },
    }, icon('trash'))
  );

  const folderSelect = el('select', { name: 'folder', onchange: (e) => { note.folderId = e.target.value || null; saveData(); } },
    el('option', { value: '' }, '폴더 없음'),
    ...state.folders.map(f => el('option', { value: f.id, selected: f.id === note.folderId }, `${f.emoji} ${f.name}`))
  );
  folderSelect.style.cssText = 'border:none;background:transparent;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;outline:none;flex:1;';
  const dateInput = el('input', { type: 'date', name: 'date', value: note.date, onchange: (e) => { note.date = e.target.value; saveData(); } });

  const titleInput = el('input', { type: 'text', placeholder: '제목 (SUBJECT)', value: note.title });
  titleInput.addEventListener('input', (e) => { note.title = e.target.value; saveData(); });

  const checklistBox = el('div', { class: 'editor-checklist' });
  note.checklist.forEach(item => {
    const box = el('button', {
      class: 'chk-box' + (item.done ? ' done' : ''),
      onclick: () => { item.done = !item.done; saveData(); render(); },
    }, icon('check'));
    const text = el('input', { type: 'text', value: item.text, placeholder: '항목' });
    text.addEventListener('input', (e) => { item.text = e.target.value; saveData(); });
    const del = el('button', { class: 'chk-del', 'aria-label': '항목 삭제', onclick: () => { note.checklist = note.checklist.filter(c => c.id !== item.id); saveData(); render(); } }, '×');
    checklistBox.appendChild(el('div', { class: 'chk-row' + (item.done ? ' done' : '') }, box, text, del));
  });
  const addRow = el('button', {
    class: 'chk-add',
    onclick: () => {
      note.checklist.push({ id: uid(), text: '', done: false });
      saveData();
      render();
      requestAnimationFrame(() => {
        const inputs = document.querySelectorAll('.chk-row input[type="text"]');
        if (inputs.length) inputs[inputs.length - 1].focus();
      });
    },
  }, el('span', { class: 'chk-box' }), '항목 추가');
  checklistBox.appendChild(addRow);

  const bodyTextarea = el('textarea', { rows: 8, placeholder: '내용을 적어보세요…' }, note.body);
  bodyTextarea.value = note.body;
  bodyTextarea.addEventListener('input', (e) => {
    note.body = e.target.value;
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    saveData();
  });

  const paper = el(
    'div', { class: 'editor-paper' },
    el('div', { class: 'editor-cover' },
      icon('notebook'),
      el('div', { class: 'editor-meta' }, folderSelect, dateInput)
    ),
    el('div', { class: 'editor-title' }, titleInput),
    checklistBox,
    el('div', { class: 'editor-body' }, bodyTextarea)
  );

  const scroll = el('div', { class: 'editor-scroll' }, paper, renderImagesSection(note));
  return el('section', { class: 'view' }, header, scroll);
}

function renderImagesSection(note) {
  const box = el('div', { class: 'editor-images' });

  if (note.images.length) {
    const grid = el('div', { class: 'image-grid' });
    note.images.forEach((img) => {
      grid.appendChild(el(
        'div', { class: 'image-thumb' },
        el('img', { src: img.dataUrl, alt: '첨부 이미지', onclick: () => openLightbox(img.dataUrl) }),
        el('button', {
          class: 'image-del', 'aria-label': '이미지 삭제',
          onclick: (e) => {
            e.stopPropagation();
            note.images = note.images.filter(x => x.id !== img.id);
            saveData();
            render();
            showToast('사진을 삭제했어요');
          },
        }, '×')
      ));
    });
    box.appendChild(grid);
  }

  const photoInput = el('input', { type: 'file', accept: 'image/*', multiple: true, class: 'hidden-file-input' });
  photoInput.addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    let added = 0;
    for (const file of files) {
      try {
        const dataUrl = await compressImageFile(file);
        note.images.push({ id: uid(), dataUrl });
        if (!persistNow()) {
          note.images.pop();
          alert('저장 공간이 부족해요. 사진 몇 개를 지우고 다시 시도해주세요.');
          break;
        }
        added += 1;
      } catch (err) {
        alert('이미지를 불러오지 못했습니다: ' + (err && err.message ? err.message : err));
      }
    }
    render();
    if (added > 0) showToast(added > 1 ? `사진 ${added}장을 저장했어요` : '사진을 저장했어요');
  });

  const ocrStatus = el('span', { class: 'ocr-status' });
  const ocrInput = el('input', { type: 'file', accept: 'image/*', class: 'hidden-file-input' });
  ocrInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    ocrStatus.textContent = 'OCR 엔진 준비 중…';
    runOCR(file, (pct, status) => {
      if (typeof pct === 'number') ocrStatus.textContent = `글자 인식 중… ${pct}%`;
      else if (status) ocrStatus.textContent = status;
    }).then((text) => {
      ocrStatus.textContent = '';
      if (!text) { alert('사진에서 글자를 찾지 못했어요.'); return; }
      note.body = note.body ? note.body + '\n' + text : text;
      saveData();
      render();
    }).catch((err) => {
      ocrStatus.textContent = '';
      alert((err && err.message) || '글자 인식에 실패했습니다.');
    });
  });

  box.appendChild(el(
    'div', { class: 'image-actions' },
    el('button', { class: 'image-action-btn', onclick: () => photoInput.click() }, icon('camera'), '사진 추가'),
    el('button', { class: 'image-action-btn', onclick: () => ocrInput.click() }, icon('scan'), '글자 인식'),
    ocrStatus,
    photoInput,
    ocrInput
  ));
  return box;
}

/* ---- 검색 화면 ---- */
function renderSearch() {
  const header = el(
    'header', { class: 'hdr' },
    el('button', { class: 'icon-btn', 'aria-label': '뒤로', onclick: () => go('list') }, icon('back')),
    el('div', { class: 'hdr-title' }, '검색')
  );

  const input = el('input', { type: 'search', placeholder: '노트 검색', value: state.searchQuery });
  input.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    resultsBox.replaceChildren(...buildResults());
    countLabel.textContent = countText();
  });
  const searchBar = el('div', { class: 'search-bar' }, icon('search'), input);

  const query = () => state.searchQuery.trim();
  function matches(n) {
    const q = query().toLowerCase();
    if (!q) return false;
    if (n.title.toLowerCase().includes(q)) return true;
    if (n.body.toLowerCase().includes(q)) return true;
    return n.checklist.some(c => c.text.toLowerCase().includes(q));
  }
  function countText() {
    const q = query();
    if (!q) return '검색어를 입력하세요';
    const n = state.notes.filter(matches).length;
    return `결과 ${n}건`;
  }
  function buildResults() {
    const q = query();
    if (!q) return [];
    const results = state.notes.filter(matches);
    if (results.length === 0) return [el('div', { class: 'empty-state' }, '일치하는 노트가 없어요.')];
    return results.map(n => {
      const folder = findFolder(n.folderId);
      return el(
        'div', { class: 'search-result', onclick: () => { state.editingNoteId = n.id; go('editor'); } },
        el('div', { class: 'note-title' }, ...highlightNodes(`${n.emoji || ''} ${n.title || '제목 없음'}`.trim(), q)),
        el('div', { class: 'note-body-preview' }, ...highlightNodes(n.body || (folder ? folder.name : ''), q))
      );
    });
  }

  const countLabel = el('div', { class: 'search-count' }, countText());
  const resultsBox = el('div', { class: 'search-results' }, ...buildResults());

  const section = el('section', { class: 'view' }, header, el('div', { class: 'search-bar-wrap' }, searchBar), countLabel, resultsBox);
  requestAnimationFrame(() => input.focus());
  return section;
}

/* ---- 폴더 화면 ---- */
let folderDraft = null;
function renderFolders() {
  const header = el(
    'header', { class: 'hdr' },
    el('button', { class: 'icon-btn', 'aria-label': '뒤로', onclick: () => go('list') }, icon('back')),
    el('div', { class: 'hdr-title' }, '폴더'),
    el('button', { class: 'icon-btn', 'aria-label': '설정', onclick: () => go('settings') }, icon('gear'))
  );

  const scroll = el('div', { class: 'folders-scroll' });
  state.folders.forEach(f => {
    scroll.appendChild(el(
      'div', { class: 'folder-row', onclick: () => { state.activeFolderId = f.id; go('list'); } },
      el('span', { class: 'emoji' }, f.emoji),
      el('span', { class: 'name' }, f.name),
      el('span', { class: 'count' }, String(noteCountInFolder(f.id))),
      el('button', {
        class: 'del', 'aria-label': '폴더 삭제',
        onclick: (e) => {
          e.stopPropagation();
          if (confirm(`"${f.name}" 폴더를 삭제할까요? 안의 노트는 "폴더 없음"으로 이동해요.`)) {
            state.notes.forEach(n => { if (n.folderId === f.id) n.folderId = null; });
            state.folders = state.folders.filter(x => x.id !== f.id);
            if (state.activeFolderId === f.id) state.activeFolderId = 'all';
            saveData();
            render();
          }
        },
      }, '×')
    ));
  });

  if (folderDraft) {
    const nameInput = el('input', { type: 'text', placeholder: '폴더 이름', value: folderDraft.name });
    nameInput.addEventListener('input', (e) => { folderDraft.name = e.target.value; });
    const picker = el('div', { class: 'emoji-picker' },
      ...EMOJI_CHOICES.map(em => el('button', {
        class: em === folderDraft.emoji ? 'active' : '',
        onclick: () => { folderDraft.emoji = em; render(); },
      }, em))
    );
    const addBtn = el('button', {
      onclick: () => {
        const name = folderDraft.name.trim();
        if (!name) { nameInput.focus(); return; }
        state.folders.push({ id: uid(), name, emoji: folderDraft.emoji });
        folderDraft = null;
        saveData();
        render();
      },
    }, '추가');
    scroll.appendChild(el('div', { class: 'settings-section-title' }, '새 폴더'));
    scroll.appendChild(picker);
    scroll.appendChild(el('div', { class: 'new-folder-form' }, nameInput, addBtn));
  } else {
    scroll.appendChild(el('button', {
      class: 'add-folder-row',
      onclick: () => { folderDraft = { name: '', emoji: EMOJI_CHOICES[0] }; render(); },
    }, icon('plus'), '새 폴더'));
  }

  return el('section', { class: 'view' }, header, scroll);
}

/* ---- 설정 화면 ---- */
function renderSettings() {
  const header = el(
    'header', { class: 'hdr' },
    el('button', { class: 'icon-btn', 'aria-label': '뒤로', onclick: () => go('folders') }, icon('back')),
    el('div', { class: 'hdr-title' }, '설정')
  );

  const nameInput = el('input', { type: 'text', value: state.profile.name });
  nameInput.addEventListener('input', (e) => { state.profile.name = e.target.value; saveData(); });

  const themeSwitch = el('button', {
    class: 'switch' + (state.settingsData.theme === 'dark' ? ' on' : ''),
    onclick: () => {
      state.settingsData.theme = state.settingsData.theme === 'dark' ? 'light' : 'dark';
      saveData();
      render();
    },
  }, el('span', { class: 'knob' }));

  const dimSwitch = el('button', {
    class: 'switch' + (state.settingsData.dimDone ? ' on' : ''),
    onclick: () => { state.settingsData.dimDone = !state.settingsData.dimDone; saveData(); render(); },
  }, el('span', { class: 'knob' }));

  const card = el(
    'div', { class: 'settings-card' },
    el('div', { class: 'settings-row' }, el('span', {}, '프로필 이름'), nameInput),
    el('div', { class: 'settings-row' }, el('span', {}, '다크 모드'), themeSwitch),
    el('div', { class: 'settings-row' }, el('span', {}, '완료된 노트 흐리게 표시'), dimSwitch)
  );

  const scroll = el('div', { class: 'settings-scroll' }, card);
  return el('section', { class: 'view' }, header, scroll);
}

/* ---------------------------------------------------------------
 * 시작
 * ------------------------------------------------------------- */
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}
