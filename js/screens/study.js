import { createElement } from '../components/template.js';
import { cardView } from '../components/card.js';
import { shuffle } from '../utils/shuffle.js';
import { navigate } from '../router.js';
export function renderStudy(app, state) {
  if (!state.cards?.length) return navigate('settings', state);
  if (!state.remaining?.length) { state.remaining = state.shuffle ? shuffle(state.cards) : [...state.cards]; state.known = []; state.unknown = []; }
  const screen = createElement('section', { className: 'screen' }); const current = state.remaining[0];
  const answer = createElement('div', { className: 'answer hidden', textContent: current.answer }); const card = cardView({ ...current, answer: '' }); card.append(answer);
  const mark = known => { state.remaining.shift(); (known ? state.known : state.unknown).push(current); if (state.remaining.length) renderStudy(app, state); else { state.lastUnknown = [...state.unknown]; navigate('result', state); } };
  screen.append(createElement('header', { className: 'screen-header' }, [createElement('button', { className: 'secondary', textContent: '中止', onclick: () => navigate('settings', state) }), createElement('span', { className: 'muted', textContent: `${state.cards.length - state.remaining.length + 1} / ${state.cards.length}` })]), card, createElement('div', { className: 'study-actions' }, [createElement('button', { className: 'secondary', textContent: '答えを見る', onclick: () => answer.classList.remove('hidden') }), createElement('button', { className: 'danger', textContent: 'NO', onclick: () => mark(false) }), createElement('button', { className: 'primary', textContent: 'YES', onclick: () => mark(true) })])); app.replaceChildren(screen);
}
