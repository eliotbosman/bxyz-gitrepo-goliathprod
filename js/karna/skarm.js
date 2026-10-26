// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
export const fragor = Object.freeze({
  telefon: 'not (min-width: 40rem)',
  platta: '(min-width: 40rem) and (not (min-width: 64rem))',
  skrivbord: '(min-width: 64rem)',
});

const listor = Object.entries(fragor).map(([namn, fraga]) => ({ namn, lista: window.matchMedia(fraga) }));
const finPekare = window.matchMedia('(hover: hover) and (pointer: fine)');

let nuvarande = berakna();

function berakna() {
  return listor.find(({ lista }) => lista.matches)?.namn ?? 'skrivbord';
}

export const lasSkarm = () => nuvarande;

export const lasPekare = () => (finPekare.matches ? 'fin' : 'grov');

function uppdatera() {
  const forra = nuvarande;
  nuvarande = berakna();
  document.documentElement.dataset.skarm = nuvarande;
  document.documentElement.dataset.pekare = lasPekare();
  if (forra === nuvarande) return;
  document.dispatchEvent(new CustomEvent('skarm:byte', { detail: { skarm: nuvarande, forra } }));
}

export function startaSkarm() {
  listor.forEach(({ lista }) => lista.addEventListener('change', uppdatera));
  finPekare.addEventListener('change', uppdatera);
  uppdatera();
}
