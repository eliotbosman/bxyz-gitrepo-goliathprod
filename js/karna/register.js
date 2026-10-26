// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
import { lasSkarm } from './skarm.js';
import { alla } from './dom.js';

const komponenter = new Map();
const monterade = new Map();
let schemalagd = false;

export function registrera(lista) {
  lista.forEach((komponent) => {
    if (komponenter.has(komponent.namn)) {
      throw new Error(`komponenten "${komponent.namn}" är redan registrerad`);
    }
    Object.keys(komponent.atgarder ?? {}).forEach((nyckel) => {
      if (!nyckel.startsWith(`${komponent.namn}/`)) {
        throw new Error(`åtgärden "${nyckel}" ska börja med "${komponent.namn}/"`);
      }
    });
    komponenter.set(komponent.namn, Object.freeze({ ...komponent }));
  });
}

export const arRegistrerad = (namn) => komponenter.has(namn);

export function arAktiv(namn) {
  const komponent = komponenter.get(namn);
  if (!komponent) return false;
  return !komponent.skarmar || komponent.skarmar.some((skarm) => skarm === lasSkarm());
}

export function lasAtgard(nyckel, { oavsettSkarm = false } = {}) {
  const namn = nyckel.split('/')[0];
  if (!oavsettSkarm && !arAktiv(namn)) return null;
  return komponenter.get(namn)?.atgarder?.[nyckel] ?? null;
}

const namnPa = (el) => (el.dataset.komponent ?? '').split(/\s+/).filter(Boolean);

function markera(el, aktiva) {
  if (aktiva.size) {
    el.dataset.monterad = [...aktiva.keys()].join(' ');
    return;
  }
  monterade.delete(el);
  delete el.dataset.monterad;
}

function montera(el, namn) {
  const aktiva = monterade.get(el) ?? new Map();
  if (aktiva.has(namn) || !arAktiv(namn)) return;
  aktiva.set(namn, komponenter.get(namn).starta(el));
  monterade.set(el, aktiva);
  markera(el, aktiva);
}

function avmontera(el, namn) {
  const aktiva = monterade.get(el);
  const stoppa = aktiva?.get(namn);
  if (!aktiva || !stoppa) return;
  stoppa();
  aktiva.delete(namn);
  markera(el, aktiva);
}

function synka() {
  schemalagd = false;
  [...monterade.entries()].forEach(([el, aktiva]) => {
    [...aktiva.keys()]
      .filter((namn) => !el.isConnected || !arAktiv(namn) || !namnPa(el).includes(namn))
      .forEach((namn) => avmontera(el, namn));
  });
  alla(document, '[data-komponent]').forEach((el) => {
    namnPa(el)
      .filter((namn) => komponenter.has(namn))
      .forEach((namn) => montera(el, namn));
  });
}

function schemalagg() {
  if (schemalagd) return;
  schemalagd = true;
  queueMicrotask(synka);
}

export function startaRegister() {
  synka();
  document.addEventListener('skarm:byte', schemalagg);
  new MutationObserver(schemalagg).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-komponent'],
  });
}

export function lasKarta() {
  return [...komponenter.values()].map((komponent) => {
    const instanser = alla(document, `[data-komponent~="${komponent.namn}"]`);
    return {
      namn: komponent.namn,
      skarmar: komponent.skarmar ?? [],
      aktiv: arAktiv(komponent.namn),
      instanser,
      monterade: instanser.filter((el) => monterade.get(el)?.has(komponent.namn)).length,
      atgarder: Object.keys(komponent.atgarder ?? {}),
    };
  });
}
