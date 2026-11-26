// Tombola di Arcangelo Clemente.
// Smorfia per la scuola: a ogni numero estratto corrisponde un'immagine e una frase a tema.
// Classi: asilo (scuola dell'infanzia) e 1ª-5ª elementare. Più i temi per adulti (livello 'adulti').
// Alcuni temi sono generati dal numero (calcoli sempre giusti), gli altri sono elenchi di curiosità:
// il numero estratto pesca una voce dell'elenco (un'associazione arbitraria, come nella smorfia vera).
(function (g) {
  const LEVELS = [
    { key: 'asilo', name: '🧸 Scuola dell\'infanzia', max: 20 },
    { key: '1', name: '1ª elementare', max: 30 },
    { key: '2', name: '2ª elementare', max: 60 },
    { key: '3', name: '3ª elementare', max: 90 },
    { key: '4', name: '4ª elementare', max: 90 },
    { key: '5', name: '5ª elementare', max: 90 }
  ];

  // numero pseudo-casuale ma sempre uguale per lo stesso numero (così tutti i dispositivi mostrano la stessa cosa)
  const hh = (n, k) => { let x = (Math.imul(n + 1, 2654435761) + Math.imul(k + 7, 40503)) >>> 0; x ^= x >>> 13; x = Math.imul(x, 1274126177) >>> 0; return (x ^ (x >>> 16)) >>> 0; };

  const U = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];

  const EN1 = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const EN10 = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const inglese = n => n < 20 ? EN1[n] : EN10[Math.floor(n / 10)] + (n % 10 ? '-' + EN1[n % 10] : '');

  function romano(n) {
    const t = [[90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
    return s;
  }
  const divisori = n => { const d = []; for (let i = 2; i < n; i++) if (n % i === 0) d.push(i); return d; };

  // ---------- temi generati dal numero ----------
  const GEN = {
    conta: {
      name: 'Conta con me', icon: '🧮', levels: ['asilo', '1'],
      f(n) {
        const E = ['🍎', '⭐', '🐟', '🎈', '🐞', '🌸', '🍪', '🚗'][n % 8];
        if (n <= 10) return { e: E.repeat(n), t: `Contiamo insieme: ${n}` };
        if (n <= 20) return { e: '🔟' + E.repeat(n - 10), t: `${n} è una decina e ${n - 10}` };
        return { e: '🧮', t: `${n} è ${Math.floor(n / 10)} ${Math.floor(n / 10) === 1 ? 'decina' : 'decine'}${n % 10 ? ' e ' + n % 10 : ''}` };
      }
    },
    decine: {
      name: 'Decine e unità', icon: '🧱', levels: ['1', '2'],
      f(n) {
        const d = Math.floor(n / 10), u = n % 10;
        if (!d) return { e: '🧱', t: `${n} ha solo unità: ${u}` };
        return { e: '🧱', t: `${n} = ${d} ${d === 1 ? 'decina' : 'decine'}${u ? ` + ${u} ${u === 1 ? 'unità' : 'unità'}` : ''}` };
      }
    },
    scomposizione: {
      name: 'Addizioni', icon: '➕', levels: ['1', '2'],
      f(n) {
        if (n < 2) return { e: '➕', t: '1 è il primo numero' };
        const a = 1 + hh(n, 1) % (n - 1);
        return { e: '➕', t: `${a} + ${n - a} = ${n}` };
      }
    },
    sottrazioni: {
      name: 'Sottrazioni', icon: '➖', levels: ['2'],
      f(n) { const k = 2 + hh(n, 2) % 9; return { e: '➖', t: `${n + k} − ${k} = ${n}` }; }
    },
    pari: {
      name: 'Pari, dispari, doppio e metà', icon: '👯', levels: ['2'],
      f(n) {
        return n % 2 === 0 ? { e: '👯', t: `${n} è pari: la sua metà è ${n / 2}` }
                           : { e: '☝️', t: `${n} è dispari: il suo doppio è ${2 * n}` };
      }
    },
    tabelline: {
      name: 'Tabelline', icon: '✖️', levels: ['3', '4', '5'],
      f(n) {
        const ok = [];
        for (let a = 2; a <= 10; a++) if (n % a === 0 && n / a >= 2 && n / a <= 10) ok.push(a);
        if (ok.length) { const a = ok[hh(n, 3) % ok.length]; return { e: '✖️', t: `${a} × ${n / a} = ${n}` }; }
        const d = divisori(n);
        if (!d.length) return { e: '☝️', t: n === 1 ? '1 si moltiplica per ogni numero e non lo cambia' : `${n} è un numero primo: si divide solo per 1 e per ${n}` };
        const a = d[0]; return { e: '✖️', t: `${a} × ${n / a} = ${n}` };
      }
    },
    divisioni: {
      name: 'Divisioni', icon: '➗', levels: ['3', '4'],
      f(n) { const k = 2 + hh(n, 4) % 4; return { e: '➗', t: `${n * k} ÷ ${k} = ${n}` }; }
    },
    frazioni: {
      name: 'Frazioni', icon: '🍕', levels: ['4', '5'],
      f(n) {
        const k = [2, 3, 4][hh(n, 5) % 3], nome = { 2: 'la metà', 3: 'un terzo', 4: 'un quarto' }[k];
        return { e: '🍕', t: `${nome[0].toUpperCase() + nome.slice(1)} di ${k * n} è ${n}` };
      }
    },
    percentuali: {
      name: 'Percentuali', icon: '💯', levels: ['5'],
      f(n) {
        const p = [[50, 2], [25, 4], [10, 10], [20, 5]][hh(n, 6) % 4];
        return { e: '💯', t: `Il ${p[0]}% di ${p[1] * n} è ${n}` };
      }
    },
    romani: {
      name: 'Numeri romani', icon: '🏛️', levels: ['3', '4', '5'],
      f(n) { return { e: '🏛️', t: `${n} in numeri romani si scrive ${romano(n)}` }; }
    },
    inglese: {
      name: 'I numeri in inglese', icon: '🇬🇧', levels: ['3', '4', '5'],
      f(n) {
        const w = inglese(n);
        return { e: '🇬🇧', t: `In inglese ${n} si dice «${w}»`, sp: 'In inglese si dice:', spk: [[w, 'en-GB']] };
      }
    }
  };

  // ---------- temi a elenco ----------
  const LISTE = {
    'animali-versi': { name: 'Animali e versi', icon: '🐄', levels: ['asilo', '1'], items: [
      ['🐄', 'La mucca fa «muuu»'], ['🐑', 'La pecora fa «beee»'], ['🐶', 'Il cane fa «bau bau»'], ['🐱', 'Il gatto fa «miao»'],
      ['🐷', 'Il maiale fa «grunf grunf»'], ['🐴', 'Il cavallo fa «iiihhh»'], ['🐓', 'Il gallo fa «chicchirichì»'], ['🐔', 'La gallina fa «coccodè»'],
      ['🦆', 'L\'anatra fa «qua qua»'], ['🐸', 'La rana fa «cra cra»'], ['🐝', 'L\'ape fa «bzzzz»'], ['🐦', 'L\'uccellino fa «cip cip»'],
      ['🦁', 'Il leone fa «roarrr»'], ['🐭', 'Il topo fa «squit squit»'], ['🐺', 'Il lupo fa «auuuu»'], ['🦉', 'Il gufo fa «uuh uuh»'],
      ['🐘', 'L\'elefante barrisce con la proboscide'], ['🐍', 'Il serpente fa «ssssss»'] ] },
    'colori': { name: 'I colori', icon: '🎨', levels: ['asilo'], items: [
      ['🍎', 'Rosso come la mela'], ['🍌', 'Giallo come la banana'], ['🌿', 'Verde come l\'erba'], ['🌊', 'Blu come il mare'],
      ['🍊', 'Arancione come l\'arancia'], ['🍇', 'Viola come l\'uva'], ['🍫', 'Marrone come il cioccolato'], ['🌸', 'Rosa come un fiore'],
      ['☁️', 'Bianco come una nuvola'], ['🐘', 'Grigio come l\'elefante'], ['🌑', 'Nero come la notte'], ['🌞', 'Giallo come il sole'] ] },
    'frutta': { name: 'Frutta e verdura', icon: '🍎', levels: ['asilo'], items: [
      ['🍎', 'La mela è croccante'], ['🍌', 'La banana è gialla'], ['🍐', 'La pera è dolce e succosa'], ['🍓', 'La fragola è rossa e profumata'],
      ['🍇', 'L\'uva cresce in grappoli'], ['🍊', 'L\'arancia ha tante vitamine'], ['🍉', 'L\'anguria è fresca d\'estate'], ['🥕', 'La carota è arancione e croccante'],
      ['🍅', 'Il pomodoro è rosso e rotondo'], ['🥔', 'La patata cresce sotto terra'], ['🌽', 'Il mais ha tanti chicchi gialli'], ['🍋', 'Il limone è giallo e aspro'],
      ['🍒', 'Le ciliegie hanno il nocciolo'], ['🥦', 'I broccoli sembrano alberelli'], ['🍍', 'L\'ananas ha il ciuffo'], ['🍑', 'La pesca è morbida e profumata'] ] },
    'trasporti': { name: 'I mezzi di trasporto', icon: '🚗', levels: ['asilo'], items: [
      ['🚗', 'L\'auto corre sulla strada'], ['🚌', 'L\'autobus porta tanti bambini'], ['🚲', 'La bicicletta ha due ruote'], ['✈️', 'L\'aereo vola nel cielo'],
      ['🚂', 'Il treno viaggia sui binari'], ['🚢', 'La nave naviga sul mare'], ['🚁', 'L\'elicottero ha le pale che girano'], ['🚒', 'Il camion dei pompieri spegne il fuoco'],
      ['🚑', 'L\'ambulanza corre ad aiutare chi sta male'], ['🚜', 'Il trattore lavora nei campi'], ['🛵', 'Il motorino ha due ruote e il motore'], ['🚀', 'Il razzo va nello spazio'],
      ['🚓', 'L\'auto della polizia ha la sirena'] ] },
    'corpo-asilo': { name: 'Il mio corpo', icon: '🧒', levels: ['asilo'], items: [
      ['👀', 'Con gli occhi vedo'], ['👂', 'Con le orecchie sento'], ['👃', 'Con il naso sento gli odori'], ['👅', 'Con la lingua sento i sapori'],
      ['✋', 'Con le mani tocco'], ['🦶', 'Con i piedi cammino'], ['🦷', 'Con i denti mordo'], ['🧠', 'Con il cervello penso'],
      ['💪', 'Le braccia mi fanno diventare forte'], ['❤️', 'Il cuore batte forte quando corro'], ['🦵', 'Con le gambe salto e corro'], ['🗣️', 'Con la bocca parlo e canto'] ] },
    'forme': { name: 'Le forme', icon: '🔺', levels: ['asilo'], items: [
      ['⚪', 'Il cerchio è tondo come una palla'], ['🟦', 'Il quadrato ha 4 lati uguali'], ['🔺', 'Il triangolo ha 3 lati'], ['🚪', 'Il rettangolo è come una porta'],
      ['⭐', 'La stella ha 5 punte'], ['❤️', 'Il cuore è una forma d\'amore'], ['🌙', 'La luna a spicchio'], ['🔷', 'Il rombo sembra un quadrato inclinato'],
      ['🥚', 'L\'uovo è ovale'], ['🍕', 'La fetta di pizza è un triangolo'] ] },
    'emozioni': { name: 'Le emozioni', icon: '😀', levels: ['asilo'], items: [
      ['😀', 'Sono felice: sorrido!'], ['😢', 'Sono triste: ho bisogno di un abbraccio'], ['😠', 'Sono arrabbiato: respiro piano'], ['😨', 'Ho paura: chiedo aiuto'],
      ['😴', 'Ho sonno: è ora di dormire'], ['😮', 'Che sorpresa!'], ['🤗', 'Abbraccio un amico'], ['😋', 'Che buono! Ho fame'] ] },
    'regole': { name: 'Le buone regole', icon: '🧼', levels: ['asilo', '1', '2'], items: [
      ['🧼', 'Mi lavo le mani prima di mangiare'], ['🦷', 'Mi lavo i denti la mattina e la sera'], ['🚦', 'Con il semaforo rosso mi fermo'], ['🙋', 'Alzo la mano per parlare'],
      ['🤝', 'Condivido i giochi con gli amici'], ['🗑️', 'Butto la carta nel cestino'], ['🧸', 'Dopo aver giocato metto a posto'], ['🙏', 'Dico «per favore» e «grazie»'],
      ['👂', 'Ascolto quando parla un amico'], ['🚶', 'In classe cammino senza correre'], ['🛏️', 'Dormo bene per crescere forte'], ['🥛', 'La colazione mi dà energia'] ] },
    'alfabeto': { name: 'L\'alfabeto', icon: '🔤', levels: ['1'], items: [
      ['🐝', 'A come Ape'], ['⛵', 'B come Barca'], ['🏠', 'C come Casa'], ['🎲', 'D come Dado'], ['🐘', 'E come Elefante'], ['🌸', 'F come Fiore'],
      ['🐱', 'G come Gatto'], ['🏨', 'H come Hotel'], ['🏝️', 'I come Isola'], ['🌙', 'L come Luna'], ['🍎', 'M come Mela'], ['🚢', 'N come Nave'],
      ['🐻', 'O come Orso'], ['🐟', 'P come Pesce'], ['🖼️', 'Q come Quadro'], ['🐸', 'R come Rana'], ['☀️', 'S come Sole'], ['🐭', 'T come Topo'],
      ['🍇', 'U come Uva'], ['🦊', 'V come Volpe'], ['🦓', 'Z come Zebra'] ] },
    'sillabe': { name: 'Le sillabe', icon: '✂️', levels: ['1', '2'], items: [
      ['🏠', 'CA-SA ha 2 sillabe'], ['🐱', 'GAT-TO ha 2 sillabe'], ['🍎', 'ME-LA ha 2 sillabe'], ['🌙', 'LU-NA ha 2 sillabe'],
      ['🚂', 'TRE-NO ha 2 sillabe'], ['🍝', 'PA-STA ha 2 sillabe'], ['🐸', 'RA-NA ha 2 sillabe'], ['🌸', 'FIO-RE ha 2 sillabe'],
      ['🐝', 'A-PE ha 2 sillabe'], ['🦋', 'FAR-FAL-LA ha 3 sillabe'], ['🐘', 'E-LE-FAN-TE ha 4 sillabe'], ['🍞', 'PA-NE ha 2 sillabe'],
      ['🍅', 'PO-MO-DO-RO ha 4 sillabe'], ['☀️', 'SO-LE ha 2 sillabe'] ] },
    'stagioni': { name: 'Stagioni, giorni e mesi', icon: '📅', levels: ['1', '2'], items: [
      ['🌸', 'La primavera è la stagione dei fiori'], ['☀️', 'In estate fa caldo e si va al mare'], ['🍂', 'In autunno cadono le foglie'], ['❄️', 'In inverno fa freddo e può nevicare'],
      ['📅', 'Gennaio è il primo mese dell\'anno'], ['🎄', 'Dicembre è l\'ultimo mese dell\'anno'], ['🗓️', 'Una settimana ha 7 giorni'], ['1️⃣', 'Il lunedì è il primo giorno della settimana'],
      ['🎉', 'La domenica è il giorno di riposo'], ['🕐', 'Un giorno ha 24 ore'], ['⏱️', 'Un\'ora ha 60 minuti'], ['📆', 'Un anno ha 12 mesi'] ] },
    'contrari': { name: 'I contrari', icon: '↔️', levels: ['1'], items: [
      ['🐘', 'Il contrario di grande è piccolo'], ['⬆️', 'Il contrario di alto è basso'], ['🔥', 'Il contrario di caldo è freddo'], ['☀️', 'Il contrario di giorno è notte'],
      ['🚪', 'Il contrario di aperto è chiuso'], ['🥛', 'Il contrario di pieno è vuoto'], ['🐢', 'Il contrario di veloce è lento'], ['😀', 'Il contrario di allegro è triste'],
      ['🧱', 'Il contrario di duro è morbido'], ['🌞', 'Il contrario di chiaro è scuro'], ['👴', 'Il contrario di giovane è vecchio'], ['➕', 'Il contrario di più è meno'] ] },
    'animali-classi': { name: 'Gli animali: chi sono?', icon: '🐬', levels: ['2', '3'], items: [
      ['🐬', 'Il delfino è un mammifero'], ['🐧', 'Il pinguino è un uccello che non vola'], ['🦈', 'Lo squalo è un pesce'], ['🐍', 'Il serpente è un rettile'],
      ['🐸', 'La rana è un anfibio'], ['🦇', 'Il pipistrello è un mammifero che vola'], ['🐢', 'La tartaruga è un rettile'], ['🐋', 'La balena è un mammifero'],
      ['🦋', 'La farfalla è un insetto: ha 6 zampe'], ['🕷️', 'Il ragno ha 8 zampe'], ['🐝', 'L\'ape è un insetto'], ['🦅', 'L\'aquila è un uccello rapace'],
      ['🐟', 'I pesci respirano con le branchie'], ['🐄', 'La mucca è un mammifero: ci dà il latte'] ] },
    'soldi': { name: 'Euro e monete', icon: '💶', levels: ['2', '3'], items: [
      ['💶', 'Un euro vale 100 centesimi'], ['🪙', 'Cinquanta centesimi sono mezzo euro'], ['🛒', 'Al supermercato pago alla cassa'], ['🧾', 'Lo scontrino dice quanto ho pagato'],
      ['🐷', 'Il salvadanaio serve a risparmiare'], ['💰', 'Il resto è ciò che il negoziante mi ridà'], ['🏦', 'In banca si custodiscono i soldi'], ['🪙', 'Due monete da 1 euro fanno 2 euro'] ] },
    'regioni': { name: 'Le regioni d\'Italia', icon: '🗺️', levels: ['3', '4', '5'], items: [
      ['🏔️', 'Il capoluogo della Valle d\'Aosta è Aosta'], ['🏰', 'Il capoluogo del Piemonte è Torino'], ['🏙️', 'Il capoluogo della Lombardia è Milano'], ['⛰️', 'Il capoluogo del Trentino-Alto Adige è Trento'],
      ['🚤', 'Il capoluogo del Veneto è Venezia'], ['⚓', 'Il capoluogo del Friuli-Venezia Giulia è Trieste'], ['🌊', 'Il capoluogo della Liguria è Genova'], ['🍝', 'Il capoluogo dell\'Emilia-Romagna è Bologna'],
      ['🎨', 'Il capoluogo della Toscana è Firenze'], ['🍫', 'Il capoluogo dell\'Umbria è Perugia'], ['⛵', 'Il capoluogo delle Marche è Ancona'], ['🏛️', 'Il capoluogo del Lazio è Roma'],
      ['🏔️', 'Il capoluogo dell\'Abruzzo è L\'Aquila'], ['🌲', 'Il capoluogo del Molise è Campobasso'], ['🍕', 'Il capoluogo della Campania è Napoli'], ['🫒', 'Il capoluogo della Puglia è Bari'],
      ['⛰️', 'Il capoluogo della Basilicata è Potenza'], ['🌶️', 'Il capoluogo della Calabria è Catanzaro'], ['🌋', 'Il capoluogo della Sicilia è Palermo'], ['🏝️', 'Il capoluogo della Sardegna è Cagliari'] ] },
    'grammatica': { name: 'Nomi, verbi, aggettivi', icon: '📖', levels: ['3'], items: [
      ['🐶', '«Cane» è un nome comune'], ['👧', '«Maria» è un nome proprio'], ['🏃', '«Correre» è un verbo'], ['📖', '«Leggere» è un verbo'],
      ['🌈', '«Colorato» è un aggettivo'], ['🐘', '«Grande» è un aggettivo'], ['🏠', '«Casa» è un nome'], ['🎵', '«Cantare» è un verbo'],
      ['🍰', '«Dolce» è un aggettivo'], ['🌳', '«Albero» è un nome'], ['😴', '«Dormire» è un verbo'], ['🔥', '«Caldo» è un aggettivo'] ] },
    'preistoria': { name: 'La preistoria', icon: '🦴', levels: ['3'], items: [
      ['🦴', 'Gli uomini primitivi vivevano nelle caverne'], ['🔥', 'Il fuoco serviva per scaldarsi e cucinare'], ['🏹', 'Cacciavano con l\'arco e con le lance'], ['🎨', 'Dipingevano sulle pareti delle grotte'],
      ['🌾', 'Con l\'agricoltura nacquero i villaggi'], ['🏺', 'Con l\'argilla facevano i vasi'], ['🐑', 'Hanno imparato ad allevare gli animali'], ['⚙️', 'Poi hanno imparato a lavorare i metalli'] ] },
    'acqua': { name: 'L\'acqua e il suo ciclo', icon: '💧', levels: ['3', '4'], items: [
      ['🧊', 'A 0 gradi l\'acqua diventa ghiaccio'], ['💨', 'A 100 gradi l\'acqua bolle e diventa vapore'], ['☁️', 'Il vapore sale e forma le nuvole'], ['🌧️', 'Dalle nuvole cade la pioggia'],
      ['❄️', 'Quando fa molto freddo la pioggia diventa neve'], ['🏞️', 'I fiumi portano l\'acqua al mare'], ['🌊', 'L\'acqua del mare è salata'], ['🚰', 'L\'acqua potabile è preziosa: non sprechiamola'] ] },
    'italia-geo': { name: 'Italia: monti, fiumi e mari', icon: '🏔️', levels: ['4', '5'], items: [
      ['🏔️', 'Il Monte Bianco è la vetta più alta delle Alpi'], ['🌊', 'Il Po è il fiume più lungo d\'Italia'], ['🌋', 'L\'Etna è un vulcano della Sicilia'], ['🌋', 'Il Vesuvio è il vulcano vicino a Napoli'],
      ['🏝️', 'La Sicilia è la più grande isola del Mediterraneo'], ['⛰️', 'Gli Appennini attraversano l\'Italia da nord a sud'], ['🏞️', 'Il lago di Garda è il più grande d\'Italia'], ['🌉', 'Il Tevere attraversa Roma'],
      ['🌉', 'L\'Arno attraversa Firenze'], ['🌊', 'Il mare Adriatico è a est dell\'Italia'], ['🌊', 'Il mar Tirreno è a ovest dell\'Italia'], ['🌊', 'Il mar Ionio è a sud dell\'Italia'] ] },
    'civilta': { name: 'Le civiltà antiche', icon: '🔺', levels: ['4', '5'], items: [
      ['🔺', 'Gli Egizi costruirono le piramidi'], ['📜', 'I Sumeri inventarono la scrittura'], ['⛵', 'I Fenici erano grandi navigatori e commercianti'], ['🏛️', 'I Greci inventarono le prime Olimpiadi'],
      ['🏺', 'Gli Etruschi vivevano nell\'Italia centrale'], ['🌊', 'Il Nilo rendeva fertile l\'Egitto'], ['🌾', 'La Mesopotamia era la terra tra i fiumi Tigri ed Eufrate'], ['✍️', 'Gli Egizi scrivevano con i geroglifici'],
      ['🧭', 'I Cinesi inventarono la carta'], ['🗳️', 'In Grecia nacque la democrazia'] ] },
    'storia-romana': { name: 'I Romani', icon: '🦅', levels: ['4', '5'], items: [
      ['🐺', 'Secondo la tradizione, Roma fu fondata nel 753 a.C.'], ['👑', 'Roma ebbe sette re, secondo la tradizione'], ['🏛️', 'Dopo i re nacque la Repubblica'], ['⚔️', 'Giulio Cesare conquistò la Gallia'],
      ['🦅', 'Augusto fu il primo imperatore di Roma'], ['🏟️', 'Nel Colosseo si facevano i giochi dei gladiatori'], ['🛣️', 'I Romani costruirono strade in tutto l\'impero'], ['💧', 'I Romani costruivano acquedotti'],
      ['📜', 'Il latino era la lingua dei Romani'], ['🏛️', 'L\'Impero romano d\'Occidente finì nel 476 d.C.'] ] },
    'sistema-solare': { name: 'Il sistema solare', icon: '🪐', levels: ['4', '5'], items: [
      ['☀️', 'Il Sole è una stella'], ['🌑', 'Mercurio è il pianeta più vicino al Sole'], ['🌕', 'Venere è il pianeta più caldo'], ['🌍', 'La Terra è il terzo pianeta dal Sole'],
      ['🔴', 'Marte è il pianeta rosso'], ['🪐', 'Giove è il pianeta più grande'], ['🪐', 'Saturno ha gli anelli'], ['🔵', 'Urano ruota quasi sdraiato su un fianco'],
      ['🌀', 'Nettuno è il pianeta più lontano dal Sole'], ['🌙', 'La Luna è il satellite della Terra'], ['☄️', 'Le comete hanno una lunga coda'], ['🔭', 'Con il telescopio si osservano le stelle'] ] },
    'corpo': { name: 'Il corpo umano', icon: '🫀', levels: ['4', '5'], items: [
      ['🫀', 'Il cuore pompa il sangue'], ['🫁', 'I polmoni ci fanno respirare'], ['🦴', 'Lo scheletro di un adulto ha 206 ossa'], ['🧠', 'Il cervello comanda tutto il corpo'],
      ['🍽️', 'Lo stomaco digerisce il cibo'], ['🩸', 'Il sangue trasporta l\'ossigeno'], ['💪', 'I muscoli ci permettono di muoverci'], ['🦷', 'Gli adulti hanno 32 denti'],
      ['👁️', 'L\'occhio vede grazie alla luce'], ['🦵', 'Il femore è l\'osso più lungo del corpo'], ['👂', 'L\'orecchio ci fa sentire i suoni'], ['🫘', 'I reni puliscono il sangue'] ] },
    'cittadini': { name: 'Cittadini del mondo', icon: '🌍', levels: ['3', '4', '5'], items: [
      ['🇮🇹', 'L\'Italia è una Repubblica dal 1946'], ['📜', 'La Costituzione italiana è in vigore dal 1948'], ['🗳️', 'Per votare alla Camera servono 18 anni'], ['♻️', 'Differenziare i rifiuti aiuta il pianeta'],
      ['🌳', 'Gli alberi puliscono l\'aria'], ['🤝', 'Tutti hanno gli stessi diritti'], ['💧', 'Chiudere il rubinetto risparmia l\'acqua'], ['🚲', 'Andare in bici inquina meno dell\'auto'],
      ['🌍', 'La Terra è la casa di tutti'], ['📚', 'Studiare è un diritto di tutti i bambini'] ] }
  };

  // ---------- temi per adulti (tombola classica) ----------
  const ADULTI = {
    'verita': { name: "Verità universali", icon: '😂', levels: ['adulti'], items: [
      ["🛒", "Vai a comprare il latte, esci con 12 cose e senza il latte"], ["📱", "Hai 5.000 foto sul telefono e non trovi mai quella che cerchi"], ["🍕", "La dieta inizia sempre lunedì"],
      ["⏰", "Cinque minuti di sonno in più valgono più di un'ora di notte"], ["🔌", "Il caricabatterie giusto non c'è mai quando serve"], ["🧦", "In lavatrice entrano due calzini e ne esce uno solo"],
      ["🚦", "Il semaforo diventa rosso solo quando hai fretta"], ["📶", "Il Wi-Fi funziona in tutta la casa tranne dove sei tu"], ["🍝", "La pasta della nonna è sempre più buona"],
      ["☕", "Il primo caffè della giornata è un diritto"], ["📺", "Cerchi un film per due ore e poi riguardi sempre lo stesso"], ["🛒", "Il carrello del supermercato ha sempre la ruota storta"],
      ["💤", "Hai sonno tutto il giorno e, appena sei a letto, ti svegli del tutto"], ["🔑", "Le chiavi sono sempre nell'ultimo posto in cui guardi"], ["📦", "Il pacco arriva sempre quando non sei a casa"],
      ["🌧️", "Piove sempre il giorno in cui lavi la macchina"], ["🎂", "Il compleanno è bello, finché non fai il conto degli anni"], ["🏖️", "Le ferie volano, il lunedì dopo dura una settimana"],
      ["🐱", "Il gatto vuole entrare, poi uscire, poi entrare, poi uscire"], ["🛋️", "Il divano ti chiama nel momento sbagliato"], ["🧠", "La risposta perfetta ti viene tre ore dopo la discussione"],
      ["🍫", "Un quadretto di cioccolato e la tavoletta è finita"], ["📞", "La telefonata importante arriva dove non c'è segnale"], ["🧹", "La casa è in ordine solo quando arrivano gli ospiti"],
      ["🖨️", "La stampante si inceppa solo quando hai fretta"], ["🪑", "Dopo aver montato il mobile, avanza sempre una vite"], ["🥶", "Il condizionatore: sempre troppo caldo o troppo freddo"],
      ["🚿", "La doccia perfetta finisce con l'acqua calda"], ["🧾", "Entri in negozio per guardare e esci con un sacchetto"], ["🔋", "Il telefono si scarica al momento più importante"] ] },
    'mamma': { name: "Frasi da mamma italiana", icon: '👩', levels: ['adulti'], items: [
      ["🧥", "Mettiti la maglia della salute!"], ["🍽️", "Hai mangiato? Allora mangia qualcosa!"], ["💇", "Non uscire con i capelli bagnati: ti viene il torcicollo"], ["🚗", "Vai piano, mi raccomando!"],
      ["📞", "Chiamami quando arrivi"], ["💨", "Stai attento al colpo d'aria"], ["🥪", "Ti ho fatto un panino, non si sa mai"], ["🧣", "Con questo freddo? Copriti!"],
      ["📵", "Ai miei tempi non c'erano i telefonini"], ["💡", "Spegni la luce, non siamo mica ricchi!"], ["🏊", "Dopo mangiato non fare il bagno per tre ore"], ["🍝", "Ci sono le lasagne, ne ho fatte troppe"],
      ["🪑", "Stai dritto con la schiena!"], ["👵", "Fatti vedere più spesso!"], ["🍞", "Mangia, che sei magro!"], ["🍰", "Non toccare, è per domenica!"],
      ["☕", "Il caffè? Te lo faccio io"], ["🥫", "Ti ho messo da parte un po' di sugo"], ["👟", "Metti le scarpe, non andare in giro scalzo!"], ["🧦", "Hai messo i calzini puliti?"],
      ["🏠", "Questa è casa tua, quando vuoi puoi tornare"], ["🚪", "Chiudi la porta, non siamo nati in una stalla!"] ] },
    'proverbi': { name: "Proverbi", icon: '📜', levels: ['adulti'], items: [
      ["🐟", "Chi dorme non piglia pesci"], ["🐢", "Chi va piano va sano e va lontano"], ["🥚", "Meglio un uovo oggi che una gallina domani"], ["🍝", "L'appetito vien mangiando"],
      ["🐕", "Can che abbaia non morde"], ["💍", "Tra moglie e marito non mettere il dito"], ["🤝", "Chi trova un amico trova un tesoro"], ["🏁", "Chi ben comincia è a metà dell'opera"],
      ["🐴", "A caval donato non si guarda in bocca"], ["🎨", "Non è bello ciò che è bello, ma è bello ciò che piace"], ["🐺", "Il lupo perde il pelo ma non il vizio"], ["🐦", "Una rondine non fa primavera"],
      ["🌅", "Rosso di sera, bel tempo si spera"], ["💪", "Chi la dura la vince"], ["😄", "Ride bene chi ride ultimo"], ["🌍", "Paese che vai, usanza che trovi"],
      ["🛣️", "Tutte le strade portano a Roma"], ["🎄", "Natale con i tuoi, Pasqua con chi vuoi"], ["🐔", "Gallina vecchia fa buon brodo"], ["🛠️", "Chi fa da sé fa per tre"],
      ["🌱", "L'erba del vicino è sempre più verde"], ["🌪️", "Chi semina vento raccoglie tempesta"], ["🌅", "Il mattino ha l'oro in bocca"], ["🍎", "Una mela al giorno toglie il medico di torno"],
      ["⏳", "Chi tardi arriva male alloggia"], ["🌊", "Dal dire al fare c'è di mezzo il mare"], ["🕊️", "Chi si somiglia si piglia"], ["🗣️", "A buon intenditor poche parole"],
      ["☀️", "Il buongiorno si vede dal mattino"], ["💰", "Il tempo è denaro"] ] },
    'modi-di-dire': { name: "Modi di dire", icon: '💬', levels: ['adulti'], items: [
      ["🕊️", "Prendere due piccioni con una fava: ottenere due risultati con una sola azione"], ["🌧️", "Piove sul bagnato: capita ancora a chi ne ha già tanto"], ["🐺", "In bocca al lupo! Buona fortuna (e si risponde «crepi»)"],
      ["💰", "Costare un occhio della testa: costare moltissimo"], ["💸", "Essere al verde: non avere più soldi"], ["🥣", "Avere le mani in pasta: essere dentro a una faccenda"],
      ["🐕", "Menare il can per l'aia: girarci intorno senza decidere"], ["🗣️", "Non avere peli sulla lingua: dire sempre ciò che si pensa"], ["💧", "Una goccia nel mare: una cosa piccolissima rispetto al tutto"],
      ["🏳️", "Gettare la spugna: arrendersi"], ["🧊", "Rompere il ghiaccio: iniziare a conversare"], ["🦵", "Fare il passo più lungo della gamba: osare più del possibile"],
      ["🐐", "Salvare capra e cavoli: risolvere senza perdere nulla"], ["🛏️", "Dormire tra due guanciali: stare tranquilli"], ["☁️", "Cadere dalle nuvole: stupirsi"],
      ["🌊", "Essere in alto mare: essere lontano dalla soluzione"], ["🙉", "Fare orecchie da mercante: far finta di non sentire"], ["🐂", "Mettere il carro davanti ai buoi: fare le cose nell'ordine sbagliato"],
      ["🐮", "Prendere il toro per le corna: affrontare un problema"], ["🔩", "Chiodo scaccia chiodo: un nuovo amore fa dimenticare il vecchio"], ["⚔️", "Essere sul piede di guerra: pronto allo scontro"],
      ["🌾", "Avere la coda di paglia: sentirsi in colpa"], ["🪓", "Tagliare la testa al toro: decidere in fretta"] ] },
    'musica': { name: "Musica", icon: '🎵', levels: ['adulti'], items: [
      ["🎹", "Il pianoforte ha 88 tasti"], ["🎻", "Il violino ha 4 corde"], ["🎸", "La chitarra classica ha 6 corde"], ["🎼", "Il pentagramma ha 5 righe"],
      ["🎵", "Le note sono sette: do, re, mi, fa, sol, la, si"], ["⏱️", "Il metronomo serve a battere il tempo"], ["🎭", "Giuseppe Verdi compose La traviata"], ["🎭", "Giacomo Puccini compose Tosca"],
      ["🎭", "Gioachino Rossini compose Il barbiere di Siviglia"], ["🎻", "Antonio Vivaldi compose Le quattro stagioni"], ["🎹", "Mozart nacque a Salisburgo"], ["🎼", "Beethoven compose la Nona sinfonia quando era già sordo"],
      ["🎤", "Luciano Pavarotti era un tenore di Modena"], ["🎤", "Domenico Modugno cantò «Nel blu dipinto di blu»"], ["🎙️", "Il Festival di Sanremo nasce nel 1951"], ["🇮🇹", "I Måneskin hanno vinto l'Eurovision nel 2021"],
      ["🎤", "Gigliola Cinquetti vinse l'Eurovision nel 1964 con «Non ho l'età»"], ["🎤", "Toto Cutugno vinse l'Eurovision nel 1990 con «Insieme: 1992»"], ["🎙️", "Mina è soprannominata «la Tigre di Cremona»"], ["🎤", "Adriano Celentano canta «Azzurro»"],
      ["🎤", "Lucio Battisti cantò «Emozioni»"], ["🎸", "Vasco Rossi cantò «Vita spericolata»"], ["🎤", "Lucio Dalla cantò «Caruso»"], ["🎤", "Fabrizio De André cantò «La canzone di Marinella»"],
      ["🎤", "Laura Pausini vinse Sanremo Giovani nel 1993 con «La solitudine»"], ["🎸", "I Beatles erano di Liverpool"], ["🎤", "Freddie Mercury era la voce dei Queen"], ["🕺", "Michael Jackson pubblicò l'album Thriller nel 1982"],
      ["👑", "Elvis Presley è chiamato «il Re del rock and roll»"], ["🎶", "Gli ABBA cantavano «Dancing Queen»"], ["🌈", "«The Dark Side of the Moon» dei Pink Floyd è tra gli album più venduti"], ["🎷", "Il sassofono è uno strumento a fiato"],
      ["🥁", "La batteria si suona con le bacchette"], ["🪕", "Il mandolino è uno strumento tipico napoletano"], ["💃", "La pizzica è la danza tradizionale del Salento"], ["☀️", "«O sole mio» è una canzone napoletana"],
      ["🎤", "Eros Ramazzotti cantò «Terra promessa»"], ["🎙️", "Zucchero cantò «Senza una donna»"] ] },
    'sport': { name: "Sport", icon: '⚽', levels: ['adulti'], items: [
      ["⚽", "L'Italia ha vinto 4 Mondiali di calcio: 1934, 1938, 1982 e 2006"], ["🏆", "Nel 2006 l'Italia vinse il Mondiale ai rigori contro la Francia"], ["🇮🇹", "Nel 2021 l'Italia vinse gli Europei a Wembley, ai rigori"], ["⚽", "In campo una squadra di calcio ha 11 giocatori"],
      ["🏀", "In campo una squadra di basket ha 5 giocatori"], ["🏐", "Nella pallavolo si gioca in 6 per squadra"], ["🏉", "Nel rugby ogni squadra ha 15 giocatori"], ["🏃", "La maratona è lunga 42,195 chilometri"],
      ["🥇", "Le Olimpiadi si svolgono ogni 4 anni"], ["🏔️", "Milano e Cortina hanno ospitato le Olimpiadi invernali del 2026"], ["🚴", "Al Giro d'Italia il leader indossa la maglia rosa"], ["🚴", "Al Tour de France il leader indossa la maglia gialla"],
      ["🚴", "Marco Pantani nel 1998 vinse Giro d'Italia e Tour de France"], ["🚴", "Fausto Coppi era detto «il Campionissimo»"], ["🏍️", "Valentino Rossi ha vinto 9 titoli mondiali"], ["🏎️", "La Ferrari è l'unica scuderia presente in tutte le stagioni di Formula 1"],
      ["🏎️", "Michael Schumacher ha vinto 7 titoli mondiali di Formula 1"], ["🎾", "Jannik Sinner ha vinto l'Australian Open"], ["🎾", "Il torneo di Wimbledon si gioca sull'erba"], ["🎾", "Il Roland Garros si gioca sulla terra rossa"],
      ["🎾", "I tornei del Grande Slam nel tennis sono 4"], ["⛳", "Il campo da golf ha di solito 18 buche"], ["🏊", "Gli stili del nuoto sono 4: libero, dorso, rana e farfalla"], ["🏃", "Marcell Jacobs ha vinto i 100 metri alle Olimpiadi di Tokyo"],
      ["🦘", "A Tokyo Tamberi e Barshim hanno diviso l'oro nel salto in alto"], ["🏃", "Pietro Mennea detenne il record dei 200 metri per 17 anni"], ["🏊", "Federica Pellegrini vinse l'oro olimpico nei 200 stile libero nel 2008"], ["⛷️", "Alberto Tomba era soprannominato «la Bomba»"],
      ["⚽", "Roberto Baggio vinse il Pallone d'Oro nel 1993"], ["⚽", "Maradona con il Napoli vinse due scudetti"], ["⚽", "Il Milan ha vinto 7 Champions League"], ["⚽", "L'Inter ha vinto 3 Champions League"],
      ["⚽", "La Juventus ha vinto 2 Champions League"], ["🏀", "Michael Jordan ha vinto 6 titoli NBA"], ["⚽", "Pelé ha vinto 3 Mondiali con il Brasile"], ["🏐", "Nel 2024 la nazionale femminile di pallavolo ha vinto l'oro olimpico a Parigi"] ] },
    'cinema': { name: "Cinema e TV", icon: '🎬', levels: ['adulti'], items: [
      ["🎬", "Federico Fellini diresse «La dolce vita»"], ["🎬", "Roberto Benigni vinse l'Oscar nel 1999 con «La vita è bella»"], ["🎬", "Paolo Sorrentino vinse l'Oscar con «La grande bellezza»"], ["🎬", "Giuseppe Tornatore diresse «Nuovo Cinema Paradiso»"],
      ["🎬", "Sergio Leone diresse «C'era una volta il West»"], ["🎭", "Totò era detto «il principe della risata»"], ["🚗", "Alberto Sordi interpretò «Un americano a Roma»"], ["💃", "Sophia Loren vinse l'Oscar per «La ciociara»"],
      ["🎬", "Checco Zalone interpretò «Quo vado?»"], ["🌹", "Nanni Moretti diresse «Caro diario»"], ["🕵️", "Luca Zingaretti è il commissario Montalbano"], ["⛪", "Terence Hill è Don Matteo in TV"],
      ["🎤", "Mike Bongiorno apriva i quiz con «Allegria!»"], ["🎙️", "Pippo Baudo ha condotto il Festival di Sanremo 13 volte"], ["👔", "«Il padrino» è di Francis Ford Coppola"], ["🚢", "«Titanic» vinse 11 Oscar"],
      ["⚔️", "Il protagonista de «Il gladiatore» è Massimo Decimo Meridio"], ["🚗", "In «Ritorno al futuro» la macchina del tempo è una DeLorean"], ["🍫", "«La vita è come una scatola di cioccolatini» è in «Forrest Gump»"], ["🌌", "«Che la Forza sia con te» è di «Guerre stellari»"],
      ["🧙", "La saga di Harry Potter ha 7 libri"], ["💍", "«Il signore degli anelli» ha 3 film"], ["👑", "«Game of Thrones» ha 8 stagioni"], ["🟡", "I Simpson vivono a Springfield"],
      ["🛋️", "La serie «Friends» è ambientata a New York"], ["🦈", "«Lo squalo» è di Steven Spielberg"], ["👽", "«E.T.» è di Steven Spielberg"], ["📚", "«Il nome della rosa» è tratto dal romanzo di Umberto Eco"],
      ["🦁", "Il Leone d'oro è il premio della Mostra del cinema di Venezia"], ["🏆", "Gli Oscar si assegnano a Hollywood"] ] },
    'sapori': { name: "Sapori d'Italia", icon: '🍝', levels: ['adulti'], items: [
      ["🍝", "La carbonara si fa con guanciale, uova e pecorino: niente panna!"], ["🍰", "Il tiramisù si fa con mascarpone e caffè"], ["🍕", "L'arte dei pizzaiuoli napoletani è patrimonio UNESCO"], ["🧀", "Il Parmigiano Reggiano stagiona almeno 12 mesi"],
      ["🌿", "Il pesto alla genovese si fa con basilico, pinoli e olio"], ["🍚", "Il risotto alla milanese si colora con lo zafferano"], ["🥣", "Le orecchiette sono una pasta pugliese"], ["🧀", "La burrata nasce in Puglia"],
      ["🎄", "Il panettone è un dolce di Milano"], ["🎄", "Il pandoro è un dolce di Verona"], ["🥘", "La lasagna è un piatto tipico dell'Emilia-Romagna"], ["🍝", "L'amatriciana prende il nome da Amatrice"],
      ["🧀", "La cacio e pepe è un piatto romano"], ["🍷", "Il Primitivo di Manduria è un vino pugliese"], ["🧀", "La mozzarella di bufala è della Campania"], ["🍋", "Il limoncello è un liquore al limone tipico della Campania"],
      ["🥮", "I cannoli sono un dolce siciliano"], ["🍰", "La cassata è un dolce siciliano"], ["🍙", "Gli arancini sono un piatto siciliano"], ["🍲", "La ribollita è una zuppa toscana"],
      ["🍷", "Il Chianti è un vino toscano"], ["🍷", "Il Barolo è un vino piemontese"], ["🥂", "Il Prosecco è uno spumante veneto"], ["🫒", "La Puglia è la prima regione italiana per la produzione di olio"],
      ["🍞", "La focaccia barese si fa con pomodorini e olive"], ["☕", "L'espresso si beve al banco, in piedi"], ["🥟", "I tortellini sono un piatto emiliano"], ["🌶️", "La 'nduja è un salume calabrese piccante"],
      ["🍨", "Il gelato italiano è famoso in tutto il mondo"], ["🥔", "Gli gnocchi si fanno con le patate"] ] },
    'capitali': { name: "Capitali e curiosità del mondo", icon: '🌍', levels: ['adulti'], items: [
      ["🗼", "La capitale della Francia è Parigi"], ["🇬🇧", "La capitale del Regno Unito è Londra"], ["🇩🇪", "La capitale della Germania è Berlino"], ["🇪🇸", "La capitale della Spagna è Madrid"],
      ["🇵🇹", "La capitale del Portogallo è Lisbona"], ["🇬🇷", "La capitale della Grecia è Atene"], ["🇦🇹", "La capitale dell'Austria è Vienna"], ["🇨🇭", "La capitale della Svizzera è Berna"],
      ["🇧🇪", "La capitale del Belgio è Bruxelles"], ["🇳🇱", "La capitale dei Paesi Bassi è Amsterdam"], ["🇸🇪", "La capitale della Svezia è Stoccolma"], ["🇳🇴", "La capitale della Norvegia è Oslo"],
      ["🇵🇱", "La capitale della Polonia è Varsavia"], ["🇭🇺", "La capitale dell'Ungheria è Budapest"], ["🇨🇿", "La capitale della Repubblica Ceca è Praga"], ["🇹🇷", "La capitale della Turchia è Ankara"],
      ["🇪🇬", "La capitale dell'Egitto è Il Cairo"], ["🇯🇵", "La capitale del Giappone è Tokyo"], ["🇨🇦", "La capitale del Canada è Ottawa"], ["🇦🇺", "La capitale dell'Australia è Canberra"],
      ["🇧🇷", "La capitale del Brasile è Brasilia"], ["🇺🇸", "La capitale degli Stati Uniti è Washington"], ["🇷🇺", "La capitale della Russia è Mosca"], ["🇮🇳", "La capitale dell'India è Nuova Delhi"],
      ["🇨🇳", "La capitale della Cina è Pechino"], ["🏔️", "Il Monte Everest supera gli 8.800 metri"], ["🏜️", "Il Sahara è il più grande deserto caldo del mondo"], ["🏛️", "Il Vaticano è lo Stato più piccolo del mondo"],
      ["🏰", "San Marino è una delle repubbliche più antiche del mondo"], ["🚤", "Venezia è costruita su oltre cento isolette"], ["🗼", "La Torre di Pisa è pendente"], ["🌍", "L'Africa ha 54 Stati"],
      ["🌎", "Il Rio delle Amazzoni attraversa il Brasile"], ["🌊", "L'oceano più grande è il Pacifico"], ["🗽", "La Statua della Libertà è a New York"], ["🌉", "Il Golden Gate è a San Francisco"] ] },
    'cultura': { name: "Storia, arte e scienza", icon: '🏛️', levels: ['adulti'], items: [
      ["🌎", "Cristoforo Colombo arrivò in America nel 1492"], ["🇫🇷", "La Rivoluzione francese iniziò nel 1789"], ["🇮🇹", "L'Italia fu unita nel 1861"], ["🧱", "Il muro di Berlino cadde nel 1989"],
      ["🌙", "Il primo uomo sulla Luna arrivò nel 1969"], ["🖼️", "Leonardo da Vinci dipinse la Gioconda"], ["🗿", "Michelangelo scolpì il David"], ["📖", "Dante scrisse la Divina Commedia"],
      ["🔭", "Galileo Galilei perfezionò il telescopio"], ["📡", "Guglielmo Marconi ricevette il Nobel per la fisica nel 1909"], ["💶", "L'euro circola dal 2002"], ["🇪🇺", "L'Unione europea ha 27 Stati"],
      ["🗳️", "Il 2 giugno 1946 gli italiani scelsero la Repubblica"], ["🧬", "Il DNA ha la forma di una doppia elica"], ["🧠", "Einstein formulò la teoria della relatività"], ["🚢", "Il Titanic affondò nel 1912"],
      ["👑", "Napoleone fu sconfitto a Waterloo nel 1815"], ["⚔️", "La Prima guerra mondiale durò dal 1914 al 1918"], ["🕊️", "La Seconda guerra mondiale finì nel 1945"], ["📚", "Gutenberg inventò la stampa a caratteri mobili"],
      ["🎨", "Caravaggio è famoso per i forti contrasti di luce"], ["🌅", "Il Rinascimento nacque in Italia"], ["🎭", "Shakespeare scrisse «Romeo e Giulietta»"], ["📜", "Alessandro Manzoni scrisse «I promessi sposi»"],
      ["🍎", "Isaac Newton formulò la legge di gravitazione"], ["🧪", "Marie Curie vinse due premi Nobel"], ["🏛️", "Il Pantheon è a Roma"], ["🌋", "Pompei fu distrutta dall'eruzione del Vesuvio nel 79 d.C."],
      ["🐺", "Secondo la leggenda Roma fu fondata nel 753 a.C."], ["🔋", "Alessandro Volta inventò la pila"] ] },
    'puglia': { name: "Puglia e dintorni", icon: '🫒', levels: ['adulti'], items: [
      ["🏠", "Ad Alberobello ci sono i trulli, patrimonio UNESCO"], ["🏰", "Castel del Monte fu voluto da Federico II"], ["⛪", "Lecce è chiamata la «Firenze del Sud»"], ["🤍", "Ostuni è la «città bianca»"],
      ["🎤", "Domenico Modugno era di Polignano a Mare"], ["🌊", "Polignano a Mare è famosa per le scogliere e le grotte"], ["🍞", "Bari è la città di San Nicola e della focaccia"], ["🌅", "Il Gargano è lo sperone dello stivale"],
      ["💃", "La pizzica è la danza del Salento"], ["🌳", "In Puglia ci sono milioni di ulivi"], ["🍷", "Il Primitivo è un vino di Manduria"], ["🥣", "Le orecchiette con le cime di rapa sono il piatto simbolo pugliese"],
      ["🌉", "Taranto è chiamata la «città dei due mari»"], ["🏞️", "Ginosa è conosciuta per le sue gravine"], ["🎬", "Rodolfo Valentino nacque a Castellaneta"], ["🏖️", "Il Salento ha spiagge bianche e mare cristallino"],
      ["🕳️", "Le grotte di Castellana sono tra le più belle d'Italia"], ["🏛️", "Matera, vicina alla Puglia, è famosa per i Sassi"], ["🧀", "La burrata è nata nelle campagne di Andria"] ] }
  };

  // ---------- API ----------
  const ALL = Object.assign({}, GEN, LISTE, ADULTI);
  Object.keys(ALL).forEach(k => { ALL[k].key = k; });

  const themesFor = level => Object.keys(ALL).filter(k => ALL[k].levels.includes(level)).map(k => ({ key: k, name: ALL[k].name, icon: ALL[k].icon }));

  // Voce per il numero n del tema: { e: emoji, t: frase, sp?: testo da leggere, spk?: [[testo, lingua]] }
  function entry(key, n) {
    const th = ALL[key]; if (!th) return null;
    if (th.f) return th.f(n);
    const it = th.items[(n - 1) % th.items.length];
    return { e: it[0], t: it[1] };
  }

  // Tema a caso per la classe, diverso dal precedente se possibile.
  function pick(level, avoid) {
    let l = themesFor(level).map(t => t.key);
    if (l.length > 1) l = l.filter(k => k !== avoid);
    return l[Math.floor(Math.random() * l.length)];
  }

  g.TombolaTemi = { LEVELS, themesFor, entry, pick, name: k => ALL[k] ? ALL[k].icon + ' ' + ALL[k].name : '' };
})(window);
