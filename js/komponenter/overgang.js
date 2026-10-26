// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
import { alla } from '../karna/dom.js';

const tillstand = Object.freeze({
  fore: 'fore',
  aktiv: 'aktiv',
  efter: 'efter',
});

function aktivIndex(sektioner) {
  const mitt = window.innerHeight * 0.5;
  let index = 0;
  sektioner.forEach((sektion, i) => {
    if (sektion.getBoundingClientRect().top <= mitt) index = i;
  });
  return index;
}

function mala(sektioner, index) {
  sektioner.forEach((sektion, i) => {
    const nasta = i === index ? tillstand.aktiv : i < index ? tillstand.efter : tillstand.fore;
    if (sektion.dataset.tillstand !== nasta) sektion.dataset.tillstand = nasta;
  });
}

export default {
  namn: 'overgang',
  starta(rot) {
    const sektioner = alla(rot, ':scope > .vy, :scope > .avsnitt');
    if (!sektioner.length) return () => {};

    let schemalagd = false;
    const uppdatera = () => {
      schemalagd = false;
      mala(sektioner, aktivIndex(sektioner));
    };
    const schemalagg = () => {
      if (schemalagd) return;
      schemalagd = true;
      window.requestAnimationFrame(uppdatera);
    };

    const observator = new IntersectionObserver(schemalagg, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });
    sektioner.forEach((sektion) => observator.observe(sektion));

    uppdatera();
    window.requestAnimationFrame(schemalagg);
    rot.addEventListener('scroll', schemalagg, { passive: true });
    rot.addEventListener('scrollend', schemalagg);
    window.addEventListener('resize', schemalagg);
    window.addEventListener('hashchange', schemalagg);

    return () => {
      observator.disconnect();
      rot.removeEventListener('scroll', schemalagg);
      rot.removeEventListener('scrollend', schemalagg);
      window.removeEventListener('resize', schemalagg);
      window.removeEventListener('hashchange', schemalagg);
      sektioner.forEach((sektion) => delete sektion.dataset.tillstand);
    };
  },
};
