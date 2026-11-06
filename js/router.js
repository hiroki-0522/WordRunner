import { renderHome } from './screens/home.js';
import { renderSettings } from './screens/settings.js';
import { renderStudy } from './screens/study.js';
import { renderResult } from './screens/result.js';
export const state = { set: null, shuffle: false, cards: [], remaining: [], known: [], unknown: [], lastUnknown: [] };
const screens = { home: renderHome, settings: renderSettings, study: renderStudy, result: renderResult };
export function navigate(screen, params = {}) { state.screen = screen; Object.assign(state, params); location.hash = screen; screens[screen](document.querySelector('#app'), state); }
export function startRouter() { const screen = location.hash.slice(1) || 'home'; navigate(screens[screen] ? screen : 'home'); }
