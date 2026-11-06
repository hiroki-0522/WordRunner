import { createElement } from '../components/template.js';
import { navigate } from '../router.js';
export function renderResult(app, state) {
  const screen = createElement('section', { className: 'screen' }); const unknown = state.lastUnknown || state.unknown || [];
  const restart = () => navigate('study', { cards: [...state.cards], remaining: [], known: [], unknown: [], lastUnknown: [] });
  const retry = () => navigate('study', { cards: [...unknown], remaining: [], known: [], unknown: [], lastUnknown: [] });
  screen.append(createElement('header', { className: 'screen-header' }, [createElement('h1', { textContent: '結果' })]));
  screen.append(createElement('ul', { className: 'result-list' }, [createElement('li', { textContent: `覚えている: ${state.known.length}枚` }), createElement('li', { textContent: `覚えていない: ${unknown.length}枚` })]));
  const actions = createElement('div', { className: 'result-actions' }, [createElement('button', { className: 'primary', textContent: 'リスタート', onclick: restart })]); if (unknown.length) actions.append(createElement('button', { className: 'secondary', textContent: 'リトライ', onclick: retry }));
  actions.append(createElement('button', { className: 'secondary', textContent: 'セットへ戻る', onclick: () => navigate('settings', state) })); screen.append(actions); app.replaceChildren(screen);
}
