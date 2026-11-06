import { saveSet } from '../database/db.js';
import { parseMemo, template } from '../utils/parser.js';
import { createElement } from '../components/template.js';
import { navigate } from '../router.js';

let timer;

export function renderSettings(app, state) {
  const set = state.set;
  if (!set) {
    navigate('home');
    return;
  }

  const screen = createElement('section', { className: 'screen' });
  const editor = createElement('textarea', {
    className: 'editor',
    value: set.memo,
    placeholder: 'Q：問題\nA：答え'
  });
  const error = createElement('div', { className: 'error-box hidden' });

  const update = () => {
    set.memo = editor.value;
    set.updatedAt = Date.now();
    const parsed = parseMemo(set.memo);
    error.replaceChildren(...parsed.errors.map(message => createElement('div', { textContent: message })));
    error.classList.toggle('hidden', !parsed.errors.length);
    clearTimeout(timer);
    timer = setTimeout(() => saveSet(set), 400);
  };

  const start = () => {
    update();
    const parsed = parseMemo(set.memo);
    if (parsed.errors.length || !parsed.cards.length) {
      error.classList.remove('hidden');
      if (!parsed.errors.length) error.textContent = 'カードを1枚以上入力してください。';
      return;
    }
    navigate('study', {
      set,
      cards: parsed.cards,
      shuffle: state.shuffle,
      remaining: [],
      known: [],
      unknown: [],
      lastUnknown: []
    });
  };

  const toggle = createElement('button', {
    className: 'secondary',
    textContent: `シャッフル: ${state.shuffle ? 'ON' : 'OFF'}`
  });
  toggle.addEventListener('click', () => {
    state.shuffle = !state.shuffle;
    toggle.textContent = `シャッフル: ${state.shuffle ? 'ON' : 'OFF'}`;
  });

  const header = createElement('header', { className: 'screen-header' }, [
    createElement('button', { className: 'secondary', textContent: '←', onclick: () => navigate('home') }),
    createElement('h1', { textContent: set.name }),
    createElement('div', { className: 'toolbar' }, [
      toggle,
      createElement('button', { className: 'primary', textContent: 'スタート', onclick: start })
    ])
  ]);
  const addButton = createElement('button', {
    className: 'secondary icon-button',
    textContent: '+',
    title: 'カードを追加'
  });
  addButton.addEventListener('click', () => {
    const pos = editor.selectionStart;
    editor.value = editor.value.slice(0, pos) + template + editor.value.slice(pos);
    update();
    editor.focus();
  });
  editor.addEventListener('input', update);
  screen.append(header, error, editor, createElement('div', { className: 'add-row' }, [addButton]));
  app.replaceChildren(screen);
  update();
}
