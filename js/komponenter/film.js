// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz

export default {
  namn: 'film',
  starta(film) {
    if (!(film instanceof HTMLVideoElement)) return () => {};

    film.muted = true;
    film.defaultMuted = true;
    film.playsInline = true;
    film.loop = true;

    const forsok = () => {
      const lov = film.play();
      if (lov && typeof lov.catch === 'function') lov.catch(() => {});
    };
    const vidSynlig = () => {
      if (document.visibilityState === 'visible') forsok();
    };

    forsok();
    film.addEventListener('loadeddata', forsok);
    film.addEventListener('canplay', forsok);
    document.addEventListener('visibilitychange', vidSynlig);
    window.addEventListener('pageshow', forsok);
    document.addEventListener('pointerdown', forsok);
    document.addEventListener('touchstart', forsok);

    return () => {
      film.removeEventListener('loadeddata', forsok);
      film.removeEventListener('canplay', forsok);
      document.removeEventListener('visibilitychange', vidSynlig);
      window.removeEventListener('pageshow', forsok);
      document.removeEventListener('pointerdown', forsok);
      document.removeEventListener('touchstart', forsok);
    };
  },
};
