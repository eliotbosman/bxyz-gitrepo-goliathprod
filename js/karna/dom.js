// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
export const element = (varde) => (varde instanceof HTMLElement ? varde : null);

export const alla = (rot, valjare) =>
  [...rot.querySelectorAll(valjare)].filter((el) => el instanceof HTMLElement);

export const en = (rot, valjare) => element(rot.querySelector(valjare));

export const narmast = (start, valjare) =>
  start instanceof Element ? element(start.closest(valjare)) : null;

export function skapa(tagg, egenskaper = {}, barn = []) {
  const el = document.createElement(tagg);
  Object.assign(el, egenskaper);
  el.append(...barn);
  return el;
}
