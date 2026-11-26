// Tombola di Arcangelo Clemente.
// Generatore di cartelle riproducibili: lo stesso codice dà sempre la stessa cartella.
// Usato dalla pagina di stampa (stampa.html) e dal controllo dei premi (index.html).
//
// Codici:   classica  -> C4821-3        (serie 4821, cartella 3 di 6)
//           bambini   -> B30-4821-3     (numeri fino a 30, 3 numeri per riga)
//                        B30X5-4821-3   (come sopra, ma 5 numeri per riga)
// Una serie classica ha 6 cartelle che insieme contengono ogni numero da 1 a 90 una sola volta.
(function (g) {
  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(a, r) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const asc = (a, b) => a - b;

  // Serie classica: 6 cartelle 3x9 che coprono 1..90.
  function classicSeries(serie) {
    const r = rng(serie * 2654435761 + 12345);
    const size = [9, 10, 10, 10, 10, 10, 10, 10, 11];      // numeri per colonna (1-9, 10-19, ..., 80-90)
    for (;;) {
      // quanti numeri per colonna ha ogni cartella (1..3), 15 in totale per cartella
      const cnt = Array.from({ length: 6 }, () => Array(9).fill(1));
      const cap = Array(6).fill(6);
      let ok = true;
      for (let c = 0; c < 9 && ok; c++) {
        let need = size[c] - 6;
        while (need > 0) {
          const cand = [0, 1, 2, 3, 4, 5].filter(k => cap[k] > 0 && cnt[k][c] < 3);
          if (!cand.length) { ok = false; break; }
          const k = cand[Math.floor(r() * cand.length)];
          cnt[k][c]++; cap[k]--; need--;
        }
      }
      if (!ok || cap.some(x => x !== 0)) continue;
      // in che righe cade ogni numero: 5 per riga
      const lay = []; let fail = false;
      for (let k = 0; k < 6 && !fail; k++) {
        let found = null;
        for (let t = 0; t < 300 && !found; t++) {
          const rows = [0, 0, 0], pick = [];
          for (let c = 0; c < 9; c++) {
            const rs = shuffle([0, 1, 2], r).slice(0, cnt[k][c]).sort(asc);
            pick.push(rs); rs.forEach(x => rows[x]++);
          }
          if (rows.every(x => x === 5)) found = pick;
        }
        if (!found) fail = true; else lay.push(found);
      }
      if (fail) continue;
      const grids = Array.from({ length: 6 }, () => [Array(9).fill(0), Array(9).fill(0), Array(9).fill(0)]);
      for (let c = 0; c < 9; c++) {
        const lo = c === 0 ? 1 : c * 10, hi = c === 8 ? 90 : c * 10 + 9;
        const pool = []; for (let n = lo; n <= hi; n++) pool.push(n);
        shuffle(pool, r);
        let idx = 0;
        for (let k = 0; k < 6; k++) {
          const rs = lay[k][c], nums = pool.slice(idx, idx + rs.length).sort(asc);
          idx += rs.length;
          rs.forEach((row, j) => { grids[k][row][c] = nums[j]; });
        }
      }
      return grids;
    }
  }

  // Cartella per bambini: 3 righe x `cols` colonne (3, 4 o 5 numeri per riga),
  // numeri diversi da 1..max, ordinati per colonna.
  function kidCard(max, serie, k, cols) {
    cols = cols || 3;
    const r = rng(serie * 977 + k * 131 + max * 7 + 5 + (cols - 3) * 100003);
    const pool = []; for (let n = 1; n <= max; n++) pool.push(n);
    const nums = shuffle(pool, r).slice(0, 3 * cols).sort(asc);
    return [0, 1, 2].map(row => Array.from({ length: cols }, (_, c) => nums[c * 3 + row]));
  }

  // Premi in palio: dipendono dai numeri per riga (ambo = 2, terno = 3, quaterna = 4, cinquina = 5).
  function prizes(mode, cols) {
    if (mode !== 'kids') return [{ n: 2, name: 'Ambo' }, { n: 3, name: 'Terno' }, { n: 4, name: 'Quaterna' }, { n: 5, name: 'Cinquina' }, { n: 15, name: 'Tombola!' }];
    const p = [{ n: 2, name: 'Ambo' }, { n: 3, name: 'Terno' }];
    if (cols >= 4) p.push({ n: 4, name: 'Quaterna' });
    if (cols >= 5) p.push({ n: 5, name: 'Cinquina' });
    p.push({ n: 3 * cols, name: 'Tombola!' });
    return p;
  }

  const idOf = (mode, max, serie, k, cols) => mode === 'kids'
    ? `B${max}${cols === 3 ? '' : 'X' + cols}-${serie}-${k}` : `C${serie}-${k}`;

  // 6 cartelle di una serie: [{ id, mode, max, cols, size, grid }]
  function series(mode, max, serie, cols) {
    cols = mode === 'kids' ? (cols || 3) : 9;
    const grids = mode === 'kids'
      ? [1, 2, 3, 4, 5, 6].map(k => kidCard(max, serie, k, cols))
      : classicSeries(serie);
    return grids.map((grid, i) => ({
      id: idOf(mode, max, serie, i + 1, cols), mode, max: mode === 'kids' ? max : 90,
      cols, size: mode === 'kids' ? 3 * cols : 15, grid
    }));
  }

  // Dal codice scritto a mano alla cartella (o null se non valido).
  function cardFromId(text) {
    const t = String(text || '').toUpperCase().replace(/\s+/g, '');
    let m = t.match(/^C(\d{1,5})-([1-6])$/);
    if (m) return series('classic', 90, +m[1])[+m[2] - 1];
    m = t.match(/^B(20|30|60|90)(?:X([345]))?-(\d{1,5})-([1-6])$/);
    if (m) return series('kids', +m[1], +m[3], +(m[2] || 3))[+m[4] - 1];
    return null;
  }

  // ---------- immagini: una fascia illustrata a tema per ogni cartella ----------
  const THEMES = [
    { key: 'animali',   name: 'Animali',   color: '#f59e0b', emoji: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🐸', '🐵', '🐯'] },
    { key: 'mare',      name: 'Mare',      color: '#0ea5e9', emoji: ['🐠', '🐙', '🐳', '🦀', '🐬', '🐚', '🐢', '🦈', '⚓', '🌊'] },
    { key: 'spazio',    name: 'Spazio',    color: '#6366f1', emoji: ['🚀', '🌙', '⭐', '🪐', '👽', '🛸', '☄️', '🌍', '🔭', '👩‍🚀'] },
    { key: 'fattoria',  name: 'Fattoria',  color: '#65a30d', emoji: ['🐄', '🐖', '🐓', '🐑', '🚜', '🌽', '🐴', '🦆', '🐐', '🥕'] },
    { key: 'giardino',  name: 'Giardino',  color: '#ec4899', emoji: ['🌸', '🦋', '🐝', '🌻', '🐞', '🍀', '🌷', '🐛', '🌼', '🌳'] },
    { key: 'frutta',    name: 'Frutta',    color: '#ef4444', emoji: ['🍎', '🍌', '🍓', '🍒', '🍇', '🍉', '🍐', '🍊', '🍍', '🥝'] },
    { key: 'sport',     name: 'Sport',     color: '#16a34a', emoji: ['⚽', '🏀', '🎾', '🏐', '🏈', '⚾', '🏓', '🏸', '🏉', '🏆'] },
    { key: 'dinosauri', name: 'Dinosauri', color: '#0d9488', emoji: ['🦕', '🦖', '🌋', '🥚', '🌴', '🦴', '🐊', '🦎', '🌿', '🪨'] },
    { key: 'natale',    name: 'Natale',    color: '#dc2626', emoji: ['🎄', '🎅', '⛄', '🎁', '🔔', '⭐', '🦌', '❄️', '🧦', '🍪'] }
  ];
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  // Piccola immagine per una cartella (un oggetto del tema, in un tondo colorato).
  // choice = 'none' | 'auto' (tema scelto dal codice) | chiave del tema (idx = n. progressivo della cartella:
  // cartelle consecutive mostrano oggetti diversi, es. pallone, canestro, racchetta...).
  function artEl(key, choice, size, idx) {
    if (choice === 'none') return null;
    let th = THEMES.find(t => t.key === choice), emo;
    if (th) emo = th.emoji[Math.abs(idx || 0) % th.emoji.length];
    else { th = THEMES[hash(String(key)) % THEMES.length]; emo = th.emoji[hash('e' + key) % th.emoji.length]; }
    const d = document.createElement('div');
    d.className = 'art'; d.title = th.name; d.textContent = emo; d.setAttribute('aria-hidden', 'true');
    Object.assign(d.style, {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      width: '1.6em', height: '1.6em', fontSize: size || '1.15rem', lineHeight: '1', borderRadius: '50%',
      border: '1.5px solid ' + th.color, background: th.color + '26',
      webkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'
    });
    return d;
  }

  const randomSerie = () => 1 + Math.floor(Math.random() * 9999);

  g.TombolaCards = { series, cardFromId, randomSerie, prizes, kidCard, themes: THEMES, artEl };
})(window);
