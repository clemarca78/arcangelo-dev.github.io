// Statistiche anonime degli usi, con GoatCounter (https://www.goatcounter.com): senza cookie e senza dati personali.
// Tombola di Arcangelo Clemente.
//
// PER ATTIVARLE: crea un sito gratuito su goatcounter.com e scrivi qui sotto il suo codice (la parte prima di
// «.goatcounter.com», per esempio 'arcangelo-tombola'). Finché resta vuoto non viene caricato nulla e nulla viene inviato.
//
// Cosa viene contato: visite alle pagine e alcuni eventi anonimi (partita iniziata e modalità, stanza creata,
// stampa, tema pronto usato). Non viene MAI inviato: nomi dei giocatori, codici delle stanze, frasi dei temi personali.
// Non parte se il browser ha «Do Not Track» o «Global Privacy Control», né in locale.
(function (g) {
  const GOATCOUNTER_CODE = '';

  const q = new URLSearchParams(location.search);
  const doNotTrack = navigator.doNotTrack === '1' || g.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const local = location.protocol === 'file:' || /^(localhost|127\.|\[::1\])/.test(location.hostname);
  const enabled = !!GOATCOUNTER_CODE && !doNotTrack && !local;

  const queue = []; let ready = false;
  const send = item => { try { g.goatcounter.count(item); } catch (e) {} };
  if (enabled) {
    g.goatcounter = { no_onload: true, allow_local: false };   // le visite le inviamo noi, con un percorso ripulito
    const s = document.createElement('script');
    s.async = true; s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count';
    s.onload = () => { ready = true; queue.splice(0).forEach(send); };
    document.head.appendChild(s);
  }
  const clean = p => String(p).toLowerCase().replace(/[^a-z0-9/_-]+/g, '-').slice(0, 80);
  const push = item => { if (!enabled) return; if (ready) send(item); else queue.push(item); };
  const ref = q.get('ref') || q.get('utm_source') || '';   // es. ?ref=linkedin nel link del post

  g.TombolaStats = {
    enabled,
    // path senza parametri: così i codici delle stanze non finiscono mai nelle statistiche
    pageview(path, title) { push({ path: clean(path), title: title || '', referrer: ref || document.referrer }); },
    track(name) { push({ path: 'eventi/' + clean(name), title: String(name).slice(0, 80), event: true }); }
  };
})(window);
