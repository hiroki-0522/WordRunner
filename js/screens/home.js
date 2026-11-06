import { getSets, createSet, saveSet, deleteSet } from '../database/db.js';
import { createElement } from '../components/template.js';
import { navigate } from '../router.js';
export async function renderHome(app) {
  const screen = createElement('section', { className: 'screen' });
  const add = async () => { const name = prompt('セット名を入力してください'); if (!name?.trim()) return; const set = createSet(name.trim()); await saveSet(set); renderHome(app); };
  screen.append(createElement('header', { className: 'screen-header' }, [createElement('h1', { textContent: 'WordRunner' })]));
  const list = createElement('div', { className: 'set-list' }); const sets = await getSets();
  if (!sets.length) list.append(createElement('div', { className: 'add-row' }, [createElement('button', { className: 'primary icon-button', textContent: '+', onclick: add, title: 'セットを追加' })]));
  sets.forEach(set => { const row = createElement('div', { className: 'set-row' }); row.append(createElement('button', { className: 'set-open', textContent: set.name, onclick: () => navigate('settings', { set }) })); row.append(createElement('button', { className: 'delete-button', textContent: '削除', onclick: async () => { if (confirm(`「${set.name}」を削除しますか？`)) { await deleteSet(set.id); renderHome(app); } } })); list.append(row); });
  if (sets.length) list.append(createElement('div', { className: 'add-row' }, [createElement('button', { className: 'primary icon-button', textContent: '+', onclick: add, title: 'セットを追加' })]));
  screen.append(list); app.replaceChildren(screen);
}
