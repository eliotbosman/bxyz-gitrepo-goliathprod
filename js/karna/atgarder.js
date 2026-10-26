// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
import { lasAtgard } from './register.js';
import { narmast } from './dom.js';

const falt = 'input, select, textarea';

function hantera(handelse) {
  const mal = narmast(handelse.target, '[data-atgard]');
  if (!mal) return;
  const arFalt = mal.matches(falt);
  if ((handelse.type === 'input') !== arFalt) return;
  const atgard = lasAtgard(mal.dataset.atgard ?? '');
  if (!atgard) return;
  atgard(mal, handelse);
}

export function startaAtgarder() {
  document.addEventListener('click', hantera);
  document.addEventListener('input', hantera);
}
