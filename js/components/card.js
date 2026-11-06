import { createElement } from './template.js';
export const cardView = card => createElement('article', { className: 'study-card' }, [createElement('div', { className: 'question', textContent: card.question }), createElement('div', { className: 'answer', textContent: card.answer })]);
