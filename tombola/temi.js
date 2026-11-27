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
      f(n) { return { e: '🏛️', t: `${n} in numeri romani si scrive ${romano(n)}`, sp: `${n} in numeri romani si scrive ${romano(n).split('').join(' ')}` }; }
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

  // ---------- cartoni animati ----------
  const CARTONI = {
    'cartoni': { name: "Personaggi dei cartoni", icon: '📺', levels: ['asilo', '1', '2', '3', '4', '5', 'adulti'], items: [
      ["🐷", "Peppa Pig adora saltare nelle pozzanghere di fango"], ["👧", "Masha è la bambina vivace che vive vicino a Orso"], ["🐶", "La Pimpa è la cagnolina bianca a pois rossi"], ["🐕", "Bluey è una cagnolina blu che gioca con la sua famiglia"],
      ["🚒", "Nei Paw Patrol i cuccioli soccorrono chi è in difficoltà"], ["🐰", "Bing è un coniglietto che scopre il mondo con Flop"], ["⚡", "Pikachu è un Pokémon giallo che fa le scintille"], ["🧽", "SpongeBob vive in un ananas sotto il mare"],
      ["🍌", "I Minions sono gialli e parlano una lingua buffissima"], ["🐕", "Scooby-Doo ha paura di tutto ma risolve i misteri"], ["🐤", "Titti è un canarino giallo che sfugge a Gatto Silvestro"], ["🥕", "Bugs Bunny è un coniglio che adora le carote"],
      ["🐭", "Tom e Jerry: il gatto e il topo che si rincorrono sempre"], ["⛰️", "Heidi vive sulle montagne con il nonno"], ["🤖", "Doraemon è un gatto robot con una tasca magica"], ["🦆", "Paperino è lo zio di Qui, Quo e Qua"],
      ["🐶", "Pippo è l'amico distratto e simpatico di Topolino"], ["🎀", "Minni è la fidanzata di Topolino"], ["🟢", "Shrek è un orco verde che vive in una palude"], ["🐼", "Po è il panda di Kung Fu Panda"],
      ["🐉", "Sdentato è il drago amico di Hiccup"], ["🦁", "Alex è il leone di Madagascar"], ["🐿️", "Scrat insegue sempre la sua ghianda nell'era glaciale"], ["🔵", "I Puffi sono blu e vivono in un villaggio nel bosco"],
      ["🐥", "Calimero è un pulcino nero e piccolo"], ["📰", "Geronimo Stilton è un topo giornalista"], ["🧚", "Le Winx sono fate con le ali e i poteri magici"], ["🚂", "Thomas è un trenino blu con il numero 1"],
      ["🔵", "Pocoyo è un bimbo vestito di blu che scopre il mondo"], ["🫧", "I Barbapapà cambiano forma a piacere"], ["🐢", "Le Tartarughe Ninja amano la pizza"], ["🐝", "L'ape Maia vola nel prato con l'amico Willi"],
      ["🦸", "Gli Incredibili sono una famiglia di supereroi"], ["🐠", "Nemo è un pesciolino pagliaccio"], ["🧞", "Il Genio esce dalla lampada di Aladdin"], ["🧑‍🚀", "Buzz Lightyear dice «Verso l'infinito e oltre!»"] ] },
    'disney': { name: "Disney e Pixar", icon: '🏰', levels: ['asilo', '1', '2', '3', '4', '5', 'adulti'], items: [
      ["🐭", "Topolino è apparso per la prima volta nel 1928"], ["🍎", "Biancaneve e i sette nani è il primo lungometraggio Disney, del 1937"], ["🐘", "Dumbo è un elefantino con grandi orecchie che vola"], ["🦌", "Bambi è un cerbiatto che vive nel bosco"],
      ["🤥", "A Pinocchio cresce il naso quando dice le bugie"], ["👠", "Cenerentola perde una scarpetta di cristallo"], ["🐇", "Alice nel Paese delle Meraviglie insegue il Bianconiglio"], ["🧚", "Peter Pan vive nell'Isola che non c'è"],
      ["🐕", "La carica dei 101 ha tanti cuccioli dalmata"], ["🌹", "La Bella e la Bestia: Belle ama leggere i libri"], ["🧜", "Ariel è la Sirenetta che sogna il mondo di sopra"], ["🧞", "Aladdin trova una lampada con dentro il Genio"],
      ["🦁", "Il Re Leone: «Hakuna Matata» significa «nessun problema»"], ["🐻", "Baloo insegna a Mowgli «lo stretto indispensabile»"], ["🐈", "Gli Aristogatti sono gatti eleganti di Parigi"], ["⚔️", "Mulan si veste da soldato per aiutare suo padre"],
      ["🤠", "In Toy Story i giocattoli prendono vita: Woody e Buzz"], ["🐠", "Alla ricerca di Nemo: Dory dimentica sempre tutto"], ["🐀", "Ratatouille: Remy è un topo che sa cucinare"], ["🚗", "In Cars Saetta McQueen corre sulla pista"],
      ["🤖", "WALL-E è un piccolo robot spazzino"], ["🎈", "In Up una casa vola attaccata a tanti palloncini"], ["😀", "In Inside Out le emozioni sono Gioia, Tristezza, Rabbia, Paura e Disgusto"], ["❄️", "In Frozen Elsa ha il potere del ghiaccio"],
      ["⛄", "Olaf è un pupazzo di neve che sogna l'estate"], ["🌺", "Vaiana attraversa l'oceano insieme a Maui"], ["💀", "Coco si svolge durante il Día de Muertos in Messico"], ["💇", "Rapunzel ha capelli lunghissimi"],
      ["🧸", "Winnie the Pooh ama il miele"], ["🦸", "Gli Incredibili sono una famiglia di supereroi"], ["👾", "In Monsters & Co. gli amici sono Sulley e Mike"], ["🔮", "In Encanto la casa della famiglia Madrigal è magica"],
      ["🛏️", "La Bella Addormentata si punge con il fuso di un arcolaio"], ["🏔️", "Elsa canta «Libera sono» nella versione italiana di Frozen"] ] },
    'cartoni-80-90': { name: "Cartoni degli anni '80 e '90", icon: '📺', levels: ['adulti'], items: [
      ["🤖", "Goldrake arrivò in Italia nel 1978 con il grido «Alabarda spaziale!»"], ["🤖", "Mazinga Z è un robot gigante pilotato da Koji"], ["🎩", "Lupin III è un ladro gentiluomo, nipote di Arsenio Lupin"], ["🎀", "Candy Candy è un'orfana bionda con i codini"],
      ["⚽", "Holly e Benji sognano di diventare campioni di calcio"], ["🐉", "Goku è il protagonista di Dragon Ball"], ["🔵", "I Puffi sono blu e vivono in un villaggio nel bosco"], ["👑", "Lady Oscar è ambientata alla corte di Versailles"],
      ["🏴‍☠️", "Capitan Harlock è un pirata dello spazio"], ["⛰️", "Heidi vive sulle Alpi con il nonno"], ["🐕", "Remi viaggia con il cane Capi e la scimmietta Joli-Coeur"], ["🌙", "Sailor Moon dice «In nome della Luna ti punirò!»"],
      ["⭐", "I Cavalieri dello Zodiaco indossano armature d'oro"], ["👊", "Ken il guerriero vive in un mondo dopo l'apocalisse"], ["🦆", "Paperon de' Paperoni nuota in una piscina di monete"], ["🐢", "Le Tartarughe Ninja amano la pizza"],
      ["🗡️", "He-Man brandisce la Spada del Potere"], ["🦴", "Fred Flintstone grida «Yabba dabba doo!» ne «Gli Antenati»"], ["🌵", "Willy il Coyote non riesce mai ad acchiappare Beep Beep"], ["🐥", "Calimero è il pulcino nero di Carosello"],
      ["🎤", "Cristina D'Avena è la voce di tante sigle dei cartoni"], ["🩺", "«Siamo fatti così» racconta il corpo umano"], ["🐱", "Occhi di gatto: tre sorelle ladre d'arte"], ["🏐", "Mila e Shiro: la storia di una giovane pallavolista"],
      ["⚡", "Pokémon: Ash Ketchum e Pikachu"], ["🏴‍☠️", "Rufy, in One Piece, vuole diventare il Re dei Pirati"], ["🍥", "Naruto è un giovane ninja che sogna di diventare Hokage"], ["🟡", "I Simpson sono in onda dal 1989"],
      ["🧽", "SpongeBob vive a Bikini Bottom"], ["🧚", "Le Winx nascono in Italia, dall'idea di Iginio Straffi"], ["🐺", "Lupo Alberto è un cartone italiano creato da Silver"], ["🎩", "Il signor Rossi cerca la felicità nei cartoni di Bruno Bozzetto"],
      ["🐭", "Topo Gigio è un topolino nato in Italia negli anni Cinquanta"], ["🐱", "Gatto Silvestro insegue Titti senza successo"], ["📼", "Tom e Jerry: il gatto e il topo che si rincorrono"], ["🏀", "In «Slam Dunk» Hanamichi Sakuragi si innamora del basket"], ["🔍", "Detective Conan è un detective rimpicciolito in corpo di bambino"], ["🐉", "Dragon Ball Z: Goku diventa Super Saiyan"],
      ["🤖", "Jeeg Robot d'acciaio si forma con il giovane Hiroshi Shiba"], ["💃", "Gigi la trottola sogna di fare la ballerina"], ["✨", "L'incantevole Creamy si trasforma in una ragazza più grande"], ["🎩", "Magica Magica Emi è una giovane prestigiatrice"],
      ["🌊", "Gli Snorky vivono in un mondo sottomarino"], ["❤️", "Gli Orsetti del cuore hanno un simbolo sulla pancia"], ["👻", "I «Real Ghostbusters» danno la caccia ai fantasmi"], ["🦇", "La serie animata di Batman è del 1992"],
      ["🗿", "I Gargoyles di giorno sono di pietra e di notte prendono vita"], ["✈️", "In «TaleSpin» Baloo è un pilota di aerei"], ["🎬", "Yakko, Wakko e Dot sono gli Animaniacs"], ["🧠", "Pinky e Brain vogliono conquistare il mondo ogni notte"],
      ["🐧", "Pingu è un pinguino che parla il «pinguese»"], ["🧢", "Pippi Calzelunghe è la bambina più forte del mondo"] ] }
  };

  // Per i ragazzi (3ª-5ª): cartoni di ieri e di oggi, adatti alla loro età.
  const CARTONI_OGGI = {
    'cartoni-oggi': { name: "Cartoni di ieri e di oggi", icon: '🎞️', levels: ['3', '4', '5'], items: [
      ["⚡", "In Pokémon Ash vuole diventare Maestro Pokémon"], ["🏴‍☠️", "In One Piece Rufy ha il corpo di gomma"], ["🍥", "Naruto sogna di diventare Hokage"], ["🐉", "In Dragon Ball Goku cerca le sette sfere del drago"],
      ["🌙", "Le guerriere di Sailor Moon portano la divisa da marinaretta"], ["🤖", "Goldrake grida «Alabarda spaziale!»"], ["⚽", "In Holly e Benji i campioni giocano su campi lunghissimi"], ["🏀", "In «Slam Dunk» i protagonisti giocano a basket"],
      ["🔍", "Detective Conan è un detective con il corpo di un bambino"], ["🐞", "In Miraculous Ladybug e Chat Noir difendono Parigi"], ["🌊", "Aang, in Avatar, è l'ultimo Maestro dell'Aria"], ["🔟", "Ben 10 usa l'Omnitrix per trasformarsi in alieni"],
      ["🛠️", "Phineas e Ferb inventano qualcosa di incredibile ogni giorno d'estate"], ["🔦", "In Gravity Falls Dipper e Mabel scoprono misteri"], ["💥", "Le Superchicche sono tre sorelline supereroine"], ["🧪", "Dexter ha un laboratorio segreto"],
      ["🐢", "Le Tartarughe Ninja sono quattro e amano la pizza"], ["🦆", "In DuckTales Zio Paperone vive con i nipotini"], ["🐿️", "Chip e Chop sono due scoiattoli agenti speciali"], ["🦇", "La serie animata di Batman è del 1992"],
      ["🐭", "Pinky e Brain vogliono conquistare il mondo ogni notte"], ["🐧", "Pingu è un pinguino che parla il «pinguese»"], ["🔵", "I Puffi sono blu e vivono in un villaggio nel bosco"], ["🐥", "Calimero è un pulcino nero e piccolo"],
      ["🧽", "SpongeBob vive a Bikini Bottom"], ["🧚", "Le Winx sono fate nate in Italia"], ["🐕", "Scooby-Doo risolve i misteri insieme ai suoi amici"], ["❤️", "Gli Orsetti del cuore hanno un simbolo sulla pancia"],
      ["⭐", "I Cavalieri dello Zodiaco indossano armature d'oro"], ["🎤", "Cristina D'Avena canta le sigle dei cartoni"], ["🎩", "Lupin III è un ladro gentiluomo"], ["⛰️", "Heidi vive sulle Alpi con il nonno"],
      ["🏐", "Mila e Shiro giocano a pallavolo"], ["🐕", "Remi viaggia con il cane Capi"], ["🐢", "Tom e Jerry si rincorrono da una vita"] ] }
  };

  // ---------- feste, tradizioni e supereroi (per tutte le età) ----------
  const TUTTI = ['asilo', '1', '2', '3', '4', '5', 'adulti'];
  const FESTE = {
    'feste': { name: "Feste e tradizioni", icon: '🎉', levels: TUTTI, items: [
      ["🎄", "A Natale si fa l'albero e si scartano i regali"], ["🌙", "La sera del 24 dicembre è la Vigilia di Natale"], ["🐑", "Il presepe racconta la nascita di Gesù"], ["🍰", "Panettone e pandoro sono i dolci tipici del Natale"],
      ["🎅", "Babbo Natale arriva con la slitta e le renne"], ["⭐", "L'Epifania è il 6 gennaio: arriva la Befana"], ["🧹", "La Befana viaggia su una scopa e porta dolci (o carbone)"], ["🥳", "La notte di San Silvestro, il 31 dicembre, si aspetta l'anno nuovo"],
      ["🥣", "A Capodanno si mangiano le lenticchie per portare fortuna"], ["💘", "San Valentino è il 14 febbraio, la festa degli innamorati"], ["🎭", "A Carnevale ci si veste in maschera"], ["🥟", "A Carnevale si mangiano chiacchiere e frappe"],
      ["🎭", "Il Carnevale di Venezia è famoso per le sue maschere"], ["🍊", "A Ivrea c'è la battaglia delle arance"], ["🌼", "L'8 marzo è la Festa della donna, con le mimose"], ["👨", "Il 19 marzo è la Festa del papà, San Giuseppe"],
      ["🍩", "Il 19 marzo si mangiano le zeppole di San Giuseppe"], ["🐣", "A Pasqua si regalano le uova di cioccolato"], ["🕊️", "La colomba è il dolce tipico della Pasqua"], ["🧺", "Il lunedì dopo Pasqua è la Pasquetta, la gita fuori porta"],
      ["🇮🇹", "Il 25 aprile è la Festa della Liberazione"], ["⚒️", "Il 1° maggio è la Festa dei lavoratori"], ["💐", "La Festa della mamma è la seconda domenica di maggio"], ["🗳️", "Il 2 giugno è la Festa della Repubblica"],
      ["🔥", "Nella notte di San Giovanni, il 24 giugno, si accendono i falò"], ["🏇", "Il Palio di Siena si corre il 2 luglio e il 16 agosto"], ["🎆", "Il 15 agosto è Ferragosto"], ["🏖️", "A Ferragosto si fa il picnic o la grigliata con gli amici"],
      ["🎃", "Il 31 ottobre è Halloween"], ["🕯️", "Il 2 novembre si ricordano i defunti"], ["🌰", "L'11 novembre è San Martino: castagne e vino nuovo"], ["🕯️", "Il 13 dicembre è Santa Lucia, che in alcune regioni porta i doni ai bambini"],
      ["💡", "In Puglia le feste patronali si illuminano con le luminarie"], ["🔥", "A Novoli, a gennaio, si accende la grande Focara per Sant'Antonio Abate"], ["🎶", "La Notte della Taranta si tiene ad agosto nel Salento"], ["⛪", "San Nicola è il patrono di Bari"],
      ["🌸", "A Noto e a Genzano si fanno le Infiorate"], ["🕊️", "San Gennaro è il patrono di Napoli"], ["🧸", "A Napoli via San Gregorio Armeno è la via dei presepi"], ["⛵", "La Regata storica si svolge a Venezia in settembre"],
      ["⚔️", "Il Calcio storico si gioca a Firenze in giugno"], ["🎂", "Per il compleanno si soffiano le candeline e si esprime un desiderio"], ["🍽️", "La domenica in Italia si pranza in famiglia"], ["🥂", "Per fare il brindisi ci si guarda negli occhi"],
      ["🍬", "Ai matrimoni si regalano i confetti"], ["🎁", "La sera dell'Epifania si dice: «l'Epifania tutte le feste porta via»"] ] },
    'supereroi': { name: "Supereroi", icon: '🦸', levels: TUTTI, items: [
      ["⭐", "Superman viene dal pianeta Krypton"], ["🟢", "La kryptonite è il punto debole di Superman"], ["📰", "Clark Kent lavora al Daily Planet"], ["🦇", "Batman è Bruce Wayne e vive a Gotham City"],
      ["🧠", "Batman non ha superpoteri: usa intelligenza e tecnologia"], ["🚗", "Il Batmobile è l'auto di Batman"], ["🃏", "Il Joker è il nemico più famoso di Batman"], ["🕷️", "Peter Parker diventa Spider-Man dopo il morso di un ragno"],
      ["🕸️", "Spider-Man lancia ragnatele per muoversi in città"], ["💬", "«Da un grande potere derivano grandi responsabilità» dice Spider-Man"], ["🛡️", "Capitan America ha uno scudo rotondo"], ["⚡", "Thor è il dio del tuono e ha il martello Mjolnir"],
      ["🤖", "Iron Man è Tony Stark, con la sua armatura"], ["💚", "Hulk diventa verde e fortissimo quando si arrabbia"], ["👑", "Black Panther viene dal regno di Wakanda"], ["🏹", "Occhio di Falco è un arciere"],
      ["🐜", "Ant-Man può rimpicciolirsi"], ["🔮", "Doctor Strange usa la magia"], ["🦸", "Gli Avengers sono la squadra dei Vendicatori"], ["🌟", "La Justice League riunisce Superman, Batman, Wonder Woman e altri"],
      ["💫", "Wonder Woman è Diana, principessa delle Amazzoni"], ["🪢", "Wonder Woman ha il Lazo della Verità"], ["⚡", "Flash è l'uomo più veloce del mondo"], ["🔱", "Aquaman parla con i pesci e comanda il mare"],
      ["💍", "Lanterna Verde ha un anello speciale"], ["🌩️", "Shazam si trasforma pronunciando una parola magica"], ["🦸", "Gli Incredibili sono una famiglia di supereroi"], ["🪨", "La Cosa dei Fantastici Quattro è fatta di roccia"],
      ["🐆", "Miles Morales è un altro Spider-Man"], ["💎", "Thanos cerca le Gemme dell'Infinito"], ["🦆", "Paperinik è l'alter ego di Paperino"], ["🐶", "Super Pippo è il supereroe più goffo del mondo"],
      ["🕶️", "Diabolik è un ladro italiano creato dalle sorelle Giussani nel 1962"], ["🔍", "Dylan Dog è l'indagatore dell'incubo"], ["📅", "Superman debuttò nel 1938"], ["📅", "Batman debuttò nel 1939"],
      ["📅", "Capitan America debuttò nel 1941"], ["📅", "Spider-Man debuttò nel 1962"], ["🐺", "Wolverine ha gli artigli di adamantio"], ["🎭", "I supereroi hanno spesso un costume e un'identità segreta"],
      ["🤝", "Anche tu puoi essere un eroe aiutando gli altri"] ] }
  };

  // ---------- videogiochi e manga: Super Mario, Roblox, One Piece ----------
  const GIOCHI = {
    'super-mario': { name: "Super Mario", icon: '🍄', levels: TUTTI, items: [
      ["🍄", "Mario è un idraulico con il cappello rosso e la M"], ["💚", "Luigi è il fratello di Mario e veste di verde"], ["🍄", "Il fungo fa diventare Mario grande"], ["⭐", "La Stella rende Mario invincibile per pochi secondi"],
      ["🔥", "Il Fiore di fuoco permette di lanciare palle di fuoco"], ["🪙", "Mario raccoglie le monete mentre salta"], ["👑", "La principessa Peach viene rapita da Bowser"], ["🐢", "Bowser è il re dei Koopa"],
      ["🐢", "Le Koopa Troopa sono tartarughe che camminano"], ["🍄", "I Goomba si schiacciano saltandoci sopra"], ["🟢", "Mario entra nei tubi verdi"], ["🏁", "Alla fine del livello c'è una bandiera"],
      ["🦖", "Yoshi è un dinosauro verde con una lingua lunghissima"], ["🍄", "Toad è un piccolo fungo amico di Peach"], ["🦍", "Donkey Kong è un grande gorilla"], ["🕹️", "Mario è comparso per la prima volta in Donkey Kong, nel 1981"],
      ["🎮", "Super Mario Bros è uscito nel 1985"], ["🏎️", "Mario Kart è il gioco di corse con i personaggi di Mario"], ["🍌", "In Mario Kart si lanciano gusci e bucce di banana"], ["💣", "Bob-omba è una bomba che cammina"],
      ["🟡", "Wario è il cattivone con il cappello giallo"], ["🟣", "Waluigi è il compagno di Wario"], ["🌟", "Rosalinda è la principessa delle stelle"], ["🌌", "In Super Mario Galaxy si salta di pianeta in pianeta"],
      ["🍄", "Il Regno dei Funghi è la casa di Peach"], ["🎮", "Nintendo è un'azienda giapponese"], ["🎬", "Nel film del 2023 Chris Pratt ha dato la voce a Mario"], ["🎹", "La musichetta di Super Mario è famosissima"],
      ["🌋", "Il castello di Bowser è pieno di lava"], ["👻", "In Luigi's Mansion Luigi cattura i fantasmi con un aspirapolvere"], ["👻", "I Boo si nascondono quando li guardi"], ["🌿", "Le piante Piranha escono dai tubi"],
      ["🧱", "Mario rompe i mattoni con la testa"], ["❓", "I blocchi con il punto interrogativo nascondono premi"], ["🎲", "Mario Party è un gioco di gare e giochi in compagnia"], ["🎾", "Mario gioca anche a tennis, golf e calcio"],
      ["🐱", "In Super Mario 3D World Mario si trasforma in gatto"], ["🐢", "Il guscio rosso insegue gli avversari in Mario Kart"] ] },
    'roblox': { name: "Roblox", icon: '🧱', levels: ['1', '2', '3', '4', '5', 'adulti'], items: [
      ["🧱", "Roblox è una piattaforma dove si gioca ai giochi creati da altri giocatori"], ["🛠️", "Con Roblox Studio si creano i propri giochi"], ["🧍", "Il personaggio di Roblox si chiama avatar"], ["🟩", "Gli avatar hanno un aspetto a blocchetti"],
      ["💎", "La moneta di Roblox si chiama Robux"], ["🐾", "In Adopt Me! si adottano e si crescono gli animaletti"], ["🏙️", "In Brookhaven si vive in una città con gli amici"], ["🏃", "Un obby è un percorso a ostacoli da superare"],
      ["🍕", "In Work at a Pizza Place si lavora in una pizzeria"], ["🏠", "In Welcome to Bloxburg si costruisce e si arreda una casa"], ["🌪️", "In Natural Disaster Survival si sopravvive a terremoti e tornado"], ["🏰", "In Royale High si va in una scuola da principesse"],
      ["🍎", "Blox Fruits è un gioco ispirato a One Piece"], ["🐱", "In MeepCity si incontrano gli amici e si gioca con i Meep"], ["🚪", "In Doors si scappa dai mostri in un hotel misterioso"], ["📅", "Roblox è nato nel 2006"],
      ["👨‍💻", "I giochi di Roblox si programmano in Lua"], ["🔒", "Non dare mai nome, indirizzo o password a chi conosci solo online"], ["👨‍👩‍👧", "Gli adulti possono attivare il controllo parentale"], ["👥", "In Roblox si gioca online con gli amici"],
      ["🛍️", "Nel catalogo si comprano vestiti e accessori per l'avatar"], ["🎤", "Su Roblox ci sono stati anche concerti virtuali"], ["🧑‍🏫", "Roblox si usa anche a scuola per imparare a programmare"], ["⏱️", "Fai delle pause: non giocare per troppo tempo"],
      ["🛑", "Se qualcuno ti scrive cose che non ti piacciono, dillo a un adulto"], ["🎮", "Roblox si può giocare su computer, tablet e telefono"], ["🧠", "Creare un gioco è un ottimo modo per imparare a programmare"], ["🏗️", "In Roblox si possono costruire città, castelli e parchi giochi"],
      ["🏆", "Un gioco su Roblox può essere giocato da milioni di persone"], ["🧩", "Un gioco ha un creatore, che si chiama sviluppatore"] ] },
    'one-piece': { name: "One Piece", icon: '🏴‍☠️', levels: ['3', '4', '5', 'adulti'], items: [
      ["🏴‍☠️", "Monkey D. Rufy sogna di diventare il Re dei Pirati"], ["🍖", "Rufy adora mangiare la carne"], ["👒", "Rufy porta un cappello di paglia"], ["🍇", "Rufy ha mangiato il frutto Gom Gom e ha il corpo di gomma"],
      ["⚔️", "Roronoa Zoro combatte con tre spade"], ["🍊", "Nami è la navigatrice e ama i mandarini"], ["🎯", "Usop è il cecchino che racconta tante bugie"], ["👨‍🍳", "Sanji è il cuoco e combatte con i calci"],
      ["🦌", "Chopper è una renna che fa il dottore"], ["📚", "Nico Robin è l'archeologa della ciurma"], ["🔧", "Franky è il carpentiere cyborg"], ["🎻", "Brook è uno scheletro musicista"],
      ["🐟", "Jinbe è un uomo-pesce, il timoniere della ciurma"], ["⛵", "La prima nave della ciurma è la Going Merry"], ["☀️", "La seconda nave si chiama Thousand Sunny"], ["💀", "La bandiera dei pirati di Cappello di Paglia ha un teschio con il cappello"],
      ["🍇", "I Frutti del Diavolo danno poteri ma tolgono la capacità di nuotare"], ["🗺️", "Il tesoro leggendario si chiama One Piece"], ["🌊", "La Rotta Maggiore (Grand Line) è il mare più pericoloso"], ["👑", "Gol D. Roger era il Re dei Pirati"],
      ["🔥", "Ace è il fratello di Rufy"], ["🏴‍☠️", "Barbabianca è uno dei pirati più potenti"], ["🎩", "Shanks il Rosso ha affidato il cappello a Rufy"], ["⚓", "La Marina cerca di fermare i pirati"],
      ["🇯🇵", "One Piece è un manga di Eiichiro Oda"], ["📖", "Il manga One Piece è iniziato nel 1997"], ["📺", "L'anime di One Piece va in onda dal 1999"], ["💰", "I pirati ricercati hanno una taglia sulla testa"],
      ["🧭", "Il Log Pose è la bussola della Grand Line"], ["🏜️", "Alabasta è un regno nel deserto"], ["☁️", "Skypiea è un'isola in mezzo alle nuvole"], ["🐋", "Laboon è una balena gigantesca"],
      ["🎌", "Wano è un paese ispirato al Giappone antico"], ["🫧", "L'Isola degli Uomini-Pesce si trova sul fondo del mare"], ["🌴", "La ciurma di Cappello di Paglia viaggia di isola in isola"], ["🤝", "In One Piece l'amicizia è più forte di tutto"] ] },
    'minecraft': { name: "Minecraft", icon: '⛏️', levels: ['1', '2', '3', '4', '5', 'adulti'], items: [
      ["⛏️", "In Minecraft si scava e si costruisce con i blocchi"], ["🧟", "Il Creeper è il mostro verde che esplode"], ["🧍", "Steve e Alex sono i personaggi di Minecraft"], ["💎", "I diamanti servono per fare gli attrezzi più resistenti"],
      ["🪵", "Si comincia raccogliendo il legno degli alberi"], ["🛏️", "Dormendo nel letto si fa passare la notte"], ["🌙", "Di notte arrivano i mostri"], ["🧟", "Gli zombie compaiono quando è buio"],
      ["💀", "Gli scheletri sparano con l'arco"], ["🕷️", "I ragni si arrampicano sui muri"], ["🐖", "Si possono allevare maiali, mucche, pecore e galline"], ["🐺", "I lupi si addomesticano con le ossa"],
      ["🐱", "I gatti si addomesticano con il pesce"], ["🐴", "Il cavallo si doma e poi si cavalca"], ["🔨", "Con il banco da lavoro si costruiscono gli oggetti"], ["⚒️", "Il piccone serve per scavare la pietra"],
      ["🌋", "La lava è pericolosissima"], ["🏠", "Con i blocchi si può costruire una casa"], ["🌲", "Un bioma è un ambiente: foresta, deserto, giungla..."], ["🔥", "Il Nether è un mondo pieno di fuoco"],
      ["🐉", "L'Ender Dragon vive nell'End"], ["🟣", "L'Enderman è alto, nero e si teletrasporta"], ["🛡️", "L'armatura protegge il giocatore"], ["❤️", "I cuori sono la vita del giocatore"],
      ["🍖", "Se hai fame devi mangiare"], ["🧪", "Le pozioni si preparano nel banco di pozioni"], ["🔴", "La redstone serve per costruire circuiti"], ["🚂", "Con le rotaie si costruiscono i binari per i carrelli"],
      ["🏘️", "Gli abitanti dei villaggi si scambiano oggetti"], ["🟢", "Gli slime sono cubi verdi che saltano"], ["🗡️", "La spada serve a difendersi dai mostri"], ["🎮", "Minecraft è stato creato da Markus Persson, detto Notch"],
      ["📅", "La versione completa di Minecraft è uscita nel 2011"], ["🏢", "Oggi Minecraft appartiene a Microsoft"], ["🎬", "Nel 2025 è uscito il film di Minecraft"], ["🏫", "Minecraft Education si usa anche a scuola"],
      ["🧱", "Il mondo di Minecraft è fatto di blocchi cubici"], ["🌍", "Ogni mondo di Minecraft è enorme e creato a caso"], ["🛠️", "In modalità creativa hai blocchi infiniti e puoi volare"], ["⚔️", "In modalità sopravvivenza devi raccogliere risorse e difenderti"],
      ["👥", "Si può giocare insieme agli amici"] ] }
  };

  // ---------- cartoni giapponesi ----------
  const ANIME = {
    'ghibli': { name: "Studio Ghibli", icon: '🌳', levels: TUTTI, items: [
      ["🌳", "Il mio vicino Totoro è un film del 1988"], ["🚌", "In Totoro c'è un autobus a forma di gatto"], ["👧", "Satsuki e Mei sono le due sorelline di Totoro"], ["⚫", "I Susuwatari sono piccoli spiritelli di fuliggine"],
      ["🧹", "Kiki consegna i pacchi volando su una scopa"], ["🐈‍⬛", "Il gatto nero di Kiki si chiama Jiji"], ["🐟", "Ponyo è un pesciolino rosso che vuole diventare bambina"], ["🌊", "Ponyo vuole mangiare il prosciutto con Sosuke"],
      ["🏆", "«La città incantata» ha vinto l'Oscar per l'animazione nel 2003"], ["🐉", "In «La città incantata» Haku è un drago"], ["🎭", "Senza Volto è lo spirito mascherato della «Città incantata»"], ["🏰", "Il castello errante di Howl cammina su zampe di metallo"],
      ["🔥", "Calcifer è il demone del fuoco del castello di Howl"], ["👵", "Sophie viene trasformata in una vecchietta"], ["🏔️", "Laputa è un castello che vola nel cielo"], ["✈️", "Porco Rosso è un pilota con la testa di maiale"],
      ["🐺", "Principessa Mononoke è un film del 1997"], ["🪶", "Il ragazzo e l'airone ha vinto l'Oscar nel 2024"], ["🧑‍🎨", "Hayao Miyazaki è il regista dei film più famosi dello Studio Ghibli"], ["🎹", "Joe Hisaishi ha composto le musiche di molti film Ghibli"],
      ["🏢", "Lo Studio Ghibli è stato fondato nel 1985"], ["🌳", "Il simbolo dello Studio Ghibli è Totoro"], ["✏️", "I film Ghibli sono quasi tutti disegnati a mano"], ["🧚", "Arrietty è una ragazzina alta come un dito"],
      ["🌬️", "Nausicaä della Valle del vento è del 1984"], ["🏛️", "Il Museo Ghibli si trova a Mitaka, vicino a Tokyo"], ["🎬", "Isao Takahata ha fondato lo studio insieme a Miyazaki"], ["🌿", "I film Ghibli parlano spesso del rispetto per la natura"],
      ["🤝", "Nei film Ghibli i protagonisti sono spesso ragazzine coraggiose"], ["🍙", "Nei film Ghibli il cibo è sempre disegnato in modo goloso"] ] },
    'anime-classici': { name: "Anime classici (anni '70-'90)", icon: '📼', levels: ['adulti'], items: [
      ["🤖", "Goldrake è arrivato in Italia nel 1978"], ["🤖", "Mazinga Z è il robot gigante guidato da Koji Kabuto"], ["🎀", "Candy Candy è un'orfana bionda con i codini"], ["👑", "Lady Oscar è ambientata alla corte di Versailles"],
      ["⛰️", "Heidi è un anime giapponese tratto da un romanzo svizzero"], ["🌎", "Marco va dagli Appennini alle Ande a cercare la mamma"], ["🌾", "Anna dai capelli rossi vive a Green Gables"], ["🚀", "«Conan, il ragazzo del futuro» è la prima serie di Miyazaki"],
      ["🏴‍☠️", "Capitan Harlock è un pirata dello spazio"], ["👊", "«Tu sei già morto» dice Ken il guerriero"], ["🐉", "Dragon Ball è tratto dal manga di Akira Toriyama"], ["🤖", "Arale è la robottina di Dr. Slump"],
      ["🎨", "Osamu Tezuka è chiamato il «dio dei manga»"], ["🦁", "Kimba il leone bianco è un'opera di Osamu Tezuka"], ["🚀", "Astro Boy è il bambino robot di Tezuka"], ["🤖", "Mobile Suit Gundam è del 1979"],
      ["🥊", "Rocky Joe è la storia di un giovane pugile"], ["🏐", "Mila e Shiro giocano a pallavolo"], ["⚽", "Holly e Benji giocano a calcio su campi lunghissimi"], ["🏀", "Slam Dunk racconta una squadra di basket di un liceo"],
      ["⭐", "Seiya è il protagonista dei Cavalieri dello Zodiaco"], ["🐱", "Occhi di gatto: tre sorelle ladre d'arte"], ["🔫", "City Hunter è il detective Ryo Saeba"], ["✨", "L'incantevole Creamy si trasforma in una ragazza più grande"],
      ["🌙", "Sailor Moon è tratto dal manga di Naoko Takeuchi"], ["🧢", "Lupin III è un ladro gentiluomo"], ["⚡", "Pokémon è nato in Giappone nel 1996 come videogioco"], ["💻", "Digimon è del 1999"],
      ["🃏", "Yu-Gi-Oh! è il cartone dei duelli con le carte"], ["🤖", "Neon Genesis Evangelion è del 1995"], ["🚬", "Cowboy Bebop è una serie del 1998 su cacciatori di taglie nello spazio"], ["🏍️", "Akira è un film di fantascienza del 1988"],
      ["🌐", "Ghost in the Shell è un film del 1995"], ["📺", "Le sigle italiane dei cartoni giapponesi sono entrate nella storia"], ["🍥", "Doraemon è nato in Giappone come manga nel 1969"], ["📖", "In Giappone il manga si legge da destra a sinistra"] ] },
    'anime-oggi': { name: "Anime e manga di oggi", icon: '🎌', levels: ['3', '4', '5', 'adulti'], items: [
      ["🗡️", "In Demon Slayer Tanjiro vuole salvare la sorella Nezuko"], ["🦸", "In My Hero Academia quasi tutti hanno un superpotere chiamato Quirk"], ["🏐", "Haikyu!! è un anime sulla pallavolo"], ["🔬", "In Dr. Stone si ricostruisce la civiltà con la scienza"],
      ["👧", "In Spy x Family la piccola Anya legge nel pensiero"], ["🍥", "Naruto sogna di diventare Hokage"], ["🏴‍☠️", "Rufy, in One Piece, sogna di diventare il Re dei Pirati"], ["🐉", "In Dragon Ball Goku cerca le sette sfere del drago"],
      ["⚡", "Pikachu è il Pokémon più famoso"], ["💻", "Nei Digimon i mostri digitali si evolvono"], ["🃏", "Yu-Gi-Oh! è il cartone dei duelli con le carte"], ["🌀", "Beyblade è il gioco delle trottole da battaglia"],
      ["⚽", "Inazuma Eleven è un anime sul calcio"], ["🏀", "Kuroko's Basket è un anime sul basket"], ["🔍", "Detective Conan è un detective con il corpo di un bambino"], ["🌸", "Sakura Card Captor deve ritrovare le carte magiche"],
      ["👦", "Shin Chan è un bambino dispettoso"], ["🤖", "Doraemon ha una tasca magica"], ["📖", "Un manga è un fumetto giapponese, un anime è un cartone animato giapponese"], ["🗼", "La capitale del Giappone è Tokyo"],
      ["🍙", "L'onigiri è una polpetta di riso"], ["🙇", "Sensei significa maestro"], ["👋", "Senpai è il compagno più grande a cui ci si ispira"], ["🥰", "Kawaii significa «carino»"],
      ["🎭", "Il cosplay è travestirsi da un personaggio"], ["📚", "Un fan appassionato di anime e manga si chiama otaku"], ["🎴", "I manga si leggono da destra a sinistra"], ["🌸", "In Giappone la fioritura dei ciliegi è una festa"],
      ["🍜", "Il ramen è una zuppa di noodles giapponese"], ["🍣", "Il sushi è fatto di riso e pesce crudo o verdure"], ["🥋", "Il judo è un'arte marziale giapponese"], ["🏯", "Il castello è il simbolo del Giappone antico"],
      ["🗻", "Il Monte Fuji è il simbolo del Giappone"], ["🎋", "Il Tanabata è la festa delle stelle del Giappone"], ["🏆", "Il Giappone ha dato al mondo manga e videogiochi"], ["✏️", "Un mangaka è chi disegna i manga"] ] }
  };

  // ---------- la legge di Murphy ----------
  const MURPHY = {
    'murphy': { name: "La legge di Murphy", icon: '🍞', levels: ['4', '5', 'adulti'], items: [
      ["😬", "Se qualcosa può andare storto, lo farà"], ["🔧", "Se c'è un modo di fare una cosa sbagliata, qualcuno lo troverà"], ["🍞", "Il pane col burro cade sempre dalla parte del burro"], ["🛒", "La fila accanto alla tua avanza sempre più in fretta"],
      ["🚿", "Il telefono squilla proprio quando sei sotto la doccia"], ["🚗", "Appena lavi la macchina, comincia a piovere"], ["🔑", "Le chiavi sono sempre nell'ultimo posto in cui guardi"], ["🖊️", "La penna smette di scrivere proprio quando devi firmare"],
      ["🪙", "Un oggetto che cade rotola sempre dove non puoi raggiungerlo"], ["🚦", "Il semaforo diventa rosso proprio quando arrivi"], ["☂️", "L'ombrello lo dimentichi sempre nel giorno in cui piove"], ["📦", "Quello che cerchi è sempre sotto l'ultima cosa che sposti"],
      ["⏳", "Tutto richiede più tempo del previsto, anche tenendo conto di questa legge (legge di Hofstadter)"], ["📅", "Il lavoro si espande fino a riempire il tempo disponibile (legge di Parkinson)"], ["🪜", "Ognuno viene promosso fino al proprio livello di incompetenza (principio di Peter)"], ["🇬🇧", "In Inghilterra la legge di Murphy si chiama «Sod's law»"],
      ["💣", "Un guasto si presenta sempre nel momento peggiore (corollario di Finagle)"], ["🔍", "Se tutto sembra andare bene, hai trascurato qualcosa"], ["💻", "Il computer si blocca proprio quando non hai salvato"], ["📶", "Il Wi-Fi cade a metà della videochiamata"],
      ["📱", "Il telefono cade sempre a faccia in giù"], ["🚆", "Il treno parte proprio quando arrivi in stazione"], ["🚌", "L'autobus arriva appena hai smesso di aspettare"], ["🍝", "La macchia di sugo cerca sempre la camicia bianca"],
      ["👕", "Le macchie cadono sempre sul vestito più bello"], ["🛞", "Si buca una gomma proprio il giorno della riunione importante"], ["📵", "Il cellulare non ha mai segnale nei posti dove serve"], ["🅿️", "Quando cerchi parcheggio, restano liberi solo i posti lontanissimi"],
      ["🔩", "Dopo aver montato il mobile, ti avanza sempre una vite"], ["🗝️", "L'ultima chiave che provi è sempre quella giusta"], ["🍲", "Pentola guardata non bolle mai"], ["🧰", "Il problema sparisce appena arriva il tecnico"],
      ["📝", "Dopo aver preparato tutto, scopri di aver dimenticato qualcosa"], ["🧾", "Lo scontrino sparisce proprio quando devi fare il reso"], ["🌦️", "Se prendi l'ombrello non piove: se lo lasci a casa si scatena il temporale"], ["📞", "La telefonata più importante arriva quando hai le mani occupate"],
      ["🍀", "Ogni tanto va tutto liscio: è la legge di Murphy al contrario"], ["🗺️", "La miglior difesa contro Murphy è avere un piano B"], ["🛰️", "La legge di Murphy nasce nel 1949 alla base aerea di Edwards, in California"], ["👨‍🔬", "Il nome viene dall'ingegnere Edward A. Murphy"],
      ["🎙️", "A diffondere la frase fu il dottor John Paul Stapp in una conferenza stampa"], ["📖", "Murphy non voleva dare la colpa a nessuno: voleva evitare gli errori prevedendoli"], ["🧠", "Prevedere cosa può andare storto è il primo passo per evitarlo"], ["🥪", "Il panino cade sempre quando hai più fame"],
      ["🧦", "Il calzino spaiato è sempre quello che ti serve"], ["🍳", "La cosa più semplice da cucinare si brucia quando ti distrai"], ["🪟", "Il vetro appena pulito si sporca subito"], ["🛋️", "Il telecomando è sempre nel posto più scomodo"] ] }
  };

  // ---------- materie di scuola con i cartoni ----------
  const PERS = [['Peppa Pig', '🐷'], ['Topolino', '🐭'], ['Pikachu', '⚡'], ['Mario', '🍄'], ['Elsa', '❄️'], ['Un Minion', '🍌'], ['SpongeBob', '🧽'], ['Doraemon', '🤖'],
    ['Masha', '👧'], ['Olaf', '⛄'], ['Simba', '🦁'], ['Bluey', '🐕'], ['Woody', '🤠'], ['Paperino', '🦆'], ['Titti', '🐤'], ['Heidi', '⛰️'],
    ['Shrek', '🟢'], ['Nemo', '🐠'], ['Rufy', '🏴‍☠️'], ['Goku', '🐉'], ['Totoro', '🌳'], ['Kiki', '🧹'], ['Winnie Pooh', '🧸'], ['Stitch', '👽']];
  const OGG = [['un gelato', 'gelati', 'm'], ['un palloncino', 'palloncini', 'm'], ['un biscotto', 'biscotti', 'm'], ['una moneta', 'monete', 'f'], ['una stella', 'stelle', 'f'],
    ['una carota', 'carote', 'f'], ['una mela', 'mele', 'f'], ['una caramella', 'caramelle', 'f'], ['una matita', 'matite', 'f'], ['una figurina', 'figurine', 'f']];
  const scelta = n => ({ pers: PERS[hh(n, 7) % PERS.length], ogg: OGG[hh(n, 8) % OGG.length] });

  const SCUOLA_CARTONI = {
    'conta-cartoni': { name: "Contiamo con i cartoni", icon: '🧮', levels: ['asilo', '1'],
      f(n) {
        const [nome, em] = scelta(n).pers;
        if (n <= 10) return { e: em.repeat(n), t: `${nome} ci aiuta a contare: ${n}` };
        if (n <= 20) return { e: '🔟' + em.repeat(n - 10), t: `${n} è una decina e ${n - 10}` };
        return { e: em, t: `${n} è ${Math.floor(n / 10)} ${Math.floor(n / 10) === 1 ? 'decina' : 'decine'}${n % 10 ? ' e ' + n % 10 : ''}` };
      } },
    'problemi-piccoli': { name: "Problemi con i cartoni (addizioni e sottrazioni)", icon: '➕', levels: ['1', '2'],
      f(n) {
        const { pers: [nome, em], ogg: [uno, pl, g] } = scelta(n);
        if (n === 1) return { e: em, t: `${nome} ha ${uno}: è 1!` };
        if (hh(n, 9) % 2 === 0) {
          const a = 1 + hh(n, 10) % (n - 1);
          return { e: em, t: `${nome} ha ${a} ${pl} e ne trova ${g === 'f' ? 'altre' : 'altri'} ${n - a}: ora ne ha ${n}` };
        }
        const k = 1 + hh(n, 11) % 9;
        return { e: em, t: `${nome} ha ${n + k} ${pl}, ne regala ${k}: ne restano ${n}` };
      } },
    'problemi-grandi': { name: "Problemi con i cartoni (moltiplicazioni e divisioni)", icon: '✖️', levels: ['3', '4', '5'],
      f(n) {
        const { pers: [nome, em], ogg: [uno, pl] } = scelta(n);
        const pairs = []; for (let a = 2; a <= 10; a++) if (n % a === 0 && n / a >= 2 && n / a <= 10) pairs.push([a, n / a]);
        const mode = hh(n, 12) % 3;
        if (mode === 0 && pairs.length) { const [a, b] = pairs[hh(n, 13) % pairs.length]; return { e: em, t: `${nome} prepara ${b} sacchetti da ${a} ${pl}: in tutto ${n} ${pl}` }; }
        if (mode === 2) return { e: em, t: `${nome} ha ${2 * n} ${pl} e ne regala la metà: ne restano ${n}` };
        const k = 2 + hh(n, 14) % 4;
        return { e: em, t: `${nome} divide ${n * k} ${pl} tra ${k} amici: ognuno ne riceve ${n}` };
      } },
    'alfabeto-cartoni': { name: "L'alfabeto dei cartoni", icon: '🔤', levels: ['1', '2'], items: [
      ["🧞", "A come Aladdin"], ["🦌", "B come Bambi"], ["🐥", "C come Calimero"], ["🐘", "D come Dumbo"], ["❄️", "E come Elsa"], ["🟢", "F come Fiona"], ["😺", "G come Garfield"],
      ["⛰️", "H come Heidi"], ["🦸", "I come Incredibili"], ["👽", "L come Lilo e Stitch"], ["🍌", "M come Minions"], ["🐠", "N come Nemo"], ["⛄", "O come Olaf"], ["🐷", "P come Peppa Pig"],
      ["🦆", "Q come Qui, Quo e Qua"], ["💇", "R come Rapunzel"], ["🦁", "S come Simba"], ["🐤", "T come Titti"], ["🦑", "U come Ursula"], ["🌺", "V come Vaiana"], ["🦊", "Z come Zootropolis"] ] },
    'colori-cartoni': { name: "I colori dei cartoni", icon: '🎨', levels: ['asilo', '1'], items: [
      ["🐷", "Peppa Pig è rosa"], ["🧸", "Winnie Pooh è giallo"], ["👽", "Stitch è blu"], ["🟢", "Shrek è verde"], ["🍌", "I Minions sono gialli"], ["⚡", "Pikachu è giallo"],
      ["🔵", "I Puffi sono blu"], ["🐭", "Topolino ha i pantaloncini rossi"], ["🦆", "Paperino ha la giacca blu"], ["🐕", "Bluey è azzurra"], ["🐤", "Titti è giallo"], ["🐟", "Dory è blu"],
      ["🐠", "Nemo è arancione"], ["🦁", "Simba è color sabbia"], ["🐻", "Baloo è grigio"], ["🍄", "Mario ha il cappello rosso"], ["💚", "Luigi ha il cappello verde"], ["🦔", "Sonic è blu"],
      ["💚", "Hulk è verde"], ["🕷️", "Spider-Man è rosso e blu"], ["🦇", "Batman è nero"], ["❄️", "Elsa è azzurra"], ["🎀", "Hello Kitty ha un fiocco rosso"], ["🦖", "Yoshi è verde"] ] },
    'cartoni-nel-mondo': { name: "I cartoni nel mondo", icon: '🌍', levels: ['2', '3', '4', '5'], items: [
      ["🇨🇭", "Heidi vive in Svizzera, sulle Alpi"], ["🇮🇹", "Pinocchio è nato in Italia, dalla penna di Collodi"], ["🇬🇧", "Peppa Pig è inglese"], ["🇫🇷", "Asterix è francese e vive nella Gallia"],
      ["🇧🇪", "Tintin è belga"], ["🇯🇵", "Totoro è giapponese"], ["🇷🇺", "Masha e Orso vengono dalla Russia"], ["🇧🇪", "I Puffi sono nati in Belgio"],
      ["🇺🇸", "Topolino è americano e nasce nel 1928"], ["🇦🇷", "Mafalda è argentina"], ["🇦🇺", "Bluey è australiana"], ["🇫🇮", "I Mumin vengono dalla Finlandia"],
      ["🇸🇪", "Pippi Calzelunghe è svedese"], ["🇨🇳", "Kung Fu Panda è ambientato in Cina"], ["🇲🇽", "Coco è ambientato in Messico"], ["🌺", "Vaiana è ambientata nel Pacifico"],
      ["🌍", "Il Re Leone è ambientato in Africa"], ["🇧🇷", "Rio è ambientato in Brasile"], ["🗼", "Ratatouille è ambientato a Parigi"], ["🇩🇰", "La Sirenetta è una fiaba danese di Andersen"],
      ["🇳🇴", "Il regno di Frozen è ispirato alla Norvegia"], ["🇮🇹", "La Pimpa è italiana ed è nata dalla matita di Altan"], ["🇮🇹", "Geronimo Stilton è italiano"], ["🇮🇹", "Topo Gigio è italiano"],
      ["🇮🇹", "Calimero è italiano e nasce a Carosello nel 1963"], ["🇮🇹", "Le Winx sono state create in Italia"], ["🇫🇷", "I Barbapapà sono francesi"], ["🇺🇸", "Snoopy è il cane di Charlie Brown"],
      ["🇬🇧", "Paddington è un orsetto inglese"], ["🇬🇧", "Winnie Pooh è nato in Inghilterra, dai libri di A. A. Milne"], ["🇬🇧", "Alice nel Paese delle Meraviglie è un libro inglese di Lewis Carroll"], ["🇯🇵", "Doraemon è giapponese"] ] },
    'inglese-cartoni': { name: "Inglese con i cartoni", icon: '🇬🇧', levels: ['3', '4', '5'], items: [
      ["🐷", "Pig in inglese vuol dire maiale, come in Peppa Pig"], ["🐭", "Mouse vuol dire topo, come in Mickey Mouse"], ["🦁", "Lion vuol dire leone, come ne «Il Re Leone»"], ["❄️", "Frozen vuol dire congelato"],
      ["🤠", "Toy vuol dire giocattolo, come in Toy Story"], ["🐠", "Fish vuol dire pesce, come in Finding Nemo"], ["🔎", "To find vuol dire trovare, come in Finding Nemo"], ["🎈", "Up vuol dire su"],
      ["🚗", "Cars vuol dire automobili"], ["👾", "Monster vuol dire mostro"], ["❄️", "Snow vuol dire neve, come in Snow White"], ["🌹", "Beauty vuol dire bellezza e Beast vuol dire bestia"],
      ["🧜", "Mermaid vuol dire sirena"], ["🌴", "Jungle vuol dire giungla, come ne «Il libro della giungla»"], ["🐕", "Dog vuol dire cane, come in Bluey"], ["🦆", "Duck vuol dire papero, come in Donald Duck"],
      ["🐻", "Bear vuol dire orso"], ["🐱", "Cat vuol dire gatto, come in Tom and Jerry"], ["🏴‍☠️", "Pirate vuol dire pirata"], ["🧚", "Fairy vuol dire fata"],
      ["🏰", "Castle vuol dire castello"], ["👑", "King vuol dire re e Queen vuol dire regina"], ["⭐", "Star vuol dire stella"], ["🚀", "Space vuol dire spazio, come in Buzz Lightyear"],
      ["🦸", "Hero vuol dire eroe"], ["🧙", "Wizard vuol dire mago"], ["🐢", "Turtle vuol dire tartaruga, come nelle Tartarughe Ninja"], ["🍌", "Banana si scrive uguale in inglese, come per i Minions"] ] }
  };

  // ---------- animali ----------
  const ANIMALI = {
    'animali-curiosita': { name: "Curiosità sugli animali", icon: '🐾', levels: TUTTI, items: [
      ["🐆", "Il ghepardo è l'animale terrestre più veloce"], ["🐋", "La balenottera azzurra è l'animale più grande del mondo"], ["🐦", "Il colibrì può volare anche all'indietro"], ["🐙", "Il polpo ha tre cuori"],
      ["🦒", "Le giraffe dormono pochissimo"], ["🦒", "La giraffa ha sette vertebre nel collo, come noi"], ["🐘", "L'elefante è il più grande animale terrestre"], ["🐘", "Gli elefanti hanno una memoria eccezionale"],
      ["🐝", "Le api comunicano con una danza"], ["🐝", "In un alveare c'è una sola regina"], ["🦎", "Il camaleonte cambia colore"], ["🐕", "Il cane ha un olfatto potentissimo"],
      ["🦇", "I pipistrelli si orientano con gli ultrasuoni"], ["🐬", "I delfini dormono con metà cervello alla volta"], ["🐜", "Una formica può portare fino a 50 volte il proprio peso"], ["🐈", "Il gatto fa le fusa quando è contento"],
      ["🦘", "Il canguro porta il cucciolo nel marsupio"], ["🐨", "Il koala dorme fino a 20 ore al giorno"], ["🐧", "Il papà pinguino imperatore cova l'uovo sui piedi"], ["🐢", "Alcune tartarughe vivono più di 100 anni"],
      ["🌊", "Nel cavalluccio marino è il papà a portare i piccoli"], ["🦔", "Il riccio si appallottola quando ha paura"], ["🦅", "L'aquila ha una vista acutissima"], ["🐌", "La lumaca si porta la casa sulla schiena"],
      ["🦉", "Il gufo può ruotare molto la testa"], ["🕷️", "Il ragno non è un insetto: ha otto zampe"], ["🦋", "La farfalla nasce da un bruco"], ["🐸", "La rana da piccola è un girino"],
      ["🐟", "Il salmone nuota controcorrente per tornare dove è nato"], ["🕊️", "La rondine d'inverno migra verso l'Africa"], ["🐻", "In inverno l'orso va in letargo"], ["🐿️", "Lo scoiattolo nasconde le ghiande per l'inverno"],
      ["🐪", "Il dromedario ha una gobba, il cammello ne ha due"], ["🦓", "Ogni zebra ha strisce diverse dalle altre"], ["🐠", "Il pesce pagliaccio vive tra le anemoni di mare"], ["🐼", "Il panda mangia soprattutto bambù"],
      ["🦏", "Il corno del rinoceronte è fatto della stessa sostanza delle unghie"], ["🐄", "La mucca ha uno stomaco con quattro scomparti"], ["🐍", "Il serpente non ha le palpebre"], ["🐯", "Ogni tigre ha strisce uniche"],
      ["🐱", "Si dice che il gatto abbia sette vite"], ["🦁", "Il leone dorme molte ore al giorno"] ] },
    'cuccioli': { name: "I cuccioli degli animali", icon: '🍼', levels: ['asilo', '1', '2', '3'], items: [
      ["🐴", "Il cucciolo del cavallo è il puledro"], ["🐄", "Il cucciolo della mucca è il vitello"], ["🐑", "Il cucciolo della pecora è l'agnello"], ["🐐", "Il cucciolo della capra è il capretto"],
      ["🐔", "Il cucciolo della gallina è il pulcino"], ["🦆", "Il cucciolo dell'anatra è l'anatroccolo"], ["🐸", "Il cucciolo della rana è il girino"], ["🦌", "Il cucciolo del cervo è il cerbiatto"],
      ["🐻", "Il cucciolo dell'orso è l'orsacchiotto"], ["🐘", "Il cucciolo dell'elefante è l'elefantino"], ["🦅", "Il cucciolo dell'aquila è l'aquilotto"], ["🦁", "Il cucciolo del leone è il leoncino"],
      ["🐯", "Il cucciolo della tigre è il tigrotto"], ["🐋", "Il cucciolo della balena è il balenottero"], ["🐱", "Il cucciolo del gatto è il gattino"], ["🐶", "Il cucciolo del cane è il cagnolino"],
      ["🐷", "Il cucciolo del maiale è il maialino"], ["🫏", "Il cucciolo dell'asino è l'asinello"], ["🐺", "Il cucciolo del lupo è il lupacchiotto"], ["🐰", "Il cucciolo del coniglio è il coniglietto"],
      ["🪿", "Il cucciolo dell'oca è il papero"], ["🕊️", "Il cucciolo del piccione è il piccioncino"], ["🦘", "Il cucciolo del canguro vive nel marsupio"], ["🐎", "Il cucciolo della zebra è un puledro a strisce"] ] },
    'animali-habitat': { name: "Dove vivono gli animali", icon: '🗺️', levels: ['2', '3', '4', '5', 'adulti'], items: [
      ["❄️", "Al Polo Nord vive l'orso polare"], ["🐧", "In Antartide vivono i pinguini"], ["🐪", "Nel deserto vivono i dromedari"], ["🦁", "Nella savana vivono leoni, zebre e giraffe"],
      ["🐅", "Le tigri vivono nelle foreste dell'Asia"], ["🦘", "In Australia vivono canguri e koala"], ["🐋", "Le balene vivono negli oceani"], ["🦜", "Nella foresta pluviale vivono pappagalli e scimmie"],
      ["🐐", "Sulle Alpi vivono stambecchi e marmotte"], ["🐻", "In Abruzzo vive l'orso marsicano"], ["🐺", "Sugli Appennini vive il lupo italiano"], ["🫏", "In Puglia, a Martina Franca, c'è un famoso asino"],
      ["🦩", "I fenicotteri rosa vivono nelle lagune e nelle saline, anche in Italia"], ["🐢", "Le tartarughe marine depongono le uova sulle spiagge"], ["🐬", "Nel mar Mediterraneo vivono i delfini"], ["🐘", "Gli elefanti vivono in Africa e in Asia"],
      ["🦒", "Le giraffe vivono in Africa"], ["🐼", "Il panda gigante vive in Cina"], ["🦥", "I bradipi vivono in America centrale e meridionale"], ["🦎", "Il drago di Komodo vive in Indonesia"],
      ["🐊", "I coccodrilli vivono nei fiumi e nelle paludi dei paesi caldi"], ["🦅", "L'aquila reale vive in montagna"], ["🐗", "Il cinghiale vive nei boschi"], ["🐠", "I pesci pagliaccio vivono nelle barriere coralline"],
      ["🦉", "Il gufo caccia di notte"], ["🐝", "Le api vivono negli alveari"], ["🐜", "Le formiche vivono nei formicai"], ["🦫", "Il castoro costruisce dighe nei fiumi"],
      ["🐿️", "Lo scoiattolo vive sugli alberi"], ["🐙", "Il polpo vive tra gli scogli"] ] },
    'dinosauri-tema': { name: "Dinosauri e animali preistorici", icon: '🦖', levels: TUTTI, items: [
      ["🦖", "Il T. rex era un grande predatore con denti enormi"], ["🦕", "Il Brachiosauro aveva un collo lunghissimo"], ["🌿", "Molti dinosauri mangiavano solo piante"], ["🦴", "I fossili sono i resti di animali del passato"],
      ["☄️", "I dinosauri si sono estinti circa 66 milioni di anni fa"], ["🐦", "Gli uccelli discendono dai dinosauri"], ["🦏", "Il Triceratopo aveva tre corna"], ["🛡️", "Lo Stegosauro aveva placche sulla schiena"],
      ["🦖", "Il Velociraptor era piccolo e aveva le piume"], ["🦅", "Lo Pterodattilo volava ma non era un dinosauro"], ["🐘", "Il mammut era un parente dell'elefante, coperto di pelo"], ["🐯", "La tigre dai denti a sciabola aveva canini lunghissimi"],
      ["🥚", "I dinosauri nascevano dalle uova"], ["🔍", "Il paleontologo studia i fossili"], ["🌋", "Il Giurassico è il periodo che dà il nome a Jurassic Park"], ["🏜️", "Il Cretaceo è l'ultimo periodo dei dinosauri"],
      ["🦕", "Il Diplodoco era lungo più di 25 metri"], ["🦤", "Il dodo viveva a Mauritius ed è estinto"], ["🦈", "Il Megalodonte era uno squalo gigantesco"], ["🦖", "Lo Spinosauro aveva una grande vela sul dorso"],
      ["🇮🇹", "Ciro è un piccolo dinosauro trovato a Pietraroia, in Italia"], ["🌴", "Ai tempi dei dinosauri il clima era più caldo di oggi"], ["🐊", "I coccodrilli sono animali molto antichi"], ["🦎", "Le lucertole e i serpenti sono rettili, come i dinosauri"] ] },
    'animali-modi-di-dire': { name: "Gli animali nei modi di dire", icon: '🦊', levels: ['4', '5', 'adulti'], items: [
      ["🦊", "Furbo come una volpe: molto astuto"], ["🐘", "Avere una memoria d'elefante: ricordare tutto"], ["🐴", "Lavorare come un mulo: lavorare moltissimo"], ["🐟", "Muto come un pesce: non dire una parola"],
      ["🐺", "Avere una fame da lupi: avere tantissima fame"], ["🐕", "Fare una vita da cani: una vita difficile"], ["🥶", "Fa un freddo cane: fa molto freddo"], ["🐠", "Sentirsi un pesce fuor d'acqua: a disagio"],
      ["🐊", "Piangere lacrime di coccodrillo: piangere senza essere sinceri"], ["🐷", "Mangiare come un maiale: mangiare in modo sporco e senza misura"], ["🫏", "Testardo come un mulo: molto ostinato"], ["🦅", "Avere un occhio di falco: vedere benissimo"],
      ["🐭", "Dormire come un ghiro: dormire profondamente"], ["🐜", "Lavorare come una formica: con impegno e costanza"], ["🦗", "La cicala canta tutta l'estate, la formica lavora: la favola di Esopo"], ["🦢", "Il canto del cigno: l'ultima opera di un artista"],
      ["🦁", "Fare la parte del leone: prendersi la parte più grande"], ["🐎", "Cavallo di battaglia: la cosa in cui si è più bravi"], ["🐑", "Pecora nera: chi è diverso dagli altri nel gruppo"], ["🐔", "Gallina dalle uova d'oro: una fonte di guadagno"],
      ["🐺", "Lupo travestito da agnello: finto buono"], ["🦚", "Fare il pavone: mettersi in mostra"], ["🐕", "Il cane che si morde la coda: un problema senza soluzione"], ["🐈", "Gatta ci cova: c'è qualcosa di strano sotto"],
      ["🦉", "Essere un gufo: portare sfortuna"], ["🕊️", "Colomba di pace: simbolo di pace"], ["🐄", "Dalle stalle alle stelle: dalla povertà al successo"], ["🐒", "Fare le scimmie: imitare gli altri"] ] }
  };

  // ---------- un tema per ogni regione italiana ----------
  const R = (name, icon, items) => ({ name, icon, levels: ['3', '4', '5', 'adulti'], items });
  const REGIONI = {
    'reg-valle-d-aosta': R("Valle d'Aosta", '🏔️', [
      ["🏔️", "Il capoluogo della Valle d'Aosta è Aosta"], ["📏", "È la regione più piccola d'Italia"], ["🇫🇷", "Qui si parla italiano e francese"], ["🏔️", "Il Monte Bianco è la vetta più alta delle Alpi"],
      ["⛰️", "Il Cervino è al confine con la Svizzera"], ["🏰", "Il castello di Fénis è tra i più famosi della regione"], ["🏛️", "Aosta è chiamata la «Roma delle Alpi»"], ["🧀", "La fontina è un formaggio valdostano"],
      ["🐐", "Nel Parco del Gran Paradiso vive lo stambecco"], ["🌲", "Il Gran Paradiso è il più antico parco nazionale d'Italia"], ["⛷️", "Courmayeur è una famosa località sciistica"], ["🥓", "Il lardo di Arnad è un salume tipico"],
      ["🚇", "Il traforo del Monte Bianco collega l'Italia alla Francia"], ["🪵", "La Fiera di Sant'Orso è la fiera dell'artigianato del legno"], ["🌍", "La regione confina con Francia e Svizzera"], ["🛡️", "È una regione a statuto speciale"] ]),
    'reg-piemonte': R("Piemonte", '🍫', [
      ["🏰", "Il capoluogo del Piemonte è Torino"], ["🇮🇹", "Torino fu la prima capitale d'Italia"], ["🗼", "La Mole Antonelliana è il simbolo di Torino"], ["🏺", "Il Museo Egizio di Torino è tra i più importanti al mondo"],
      ["🚗", "La Fiat è nata a Torino nel 1899"], ["🍷", "Il Barolo è un vino piemontese"], ["🍄", "Il tartufo bianco d'Alba è molto pregiato"], ["🍫", "La Nutella nasce ad Alba"],
      ["🍫", "Il gianduiotto è un cioccolatino torinese"], ["🍸", "Il vermouth è nato a Torino"], ["🏔️", "Il Po nasce dal Monviso"], ["🧣", "La Sacra Sindone si conserva nel Duomo di Torino"],
      ["🏰", "La Reggia di Venaria è una grande residenza reale"], ["🥣", "La bagna cauda è un piatto piemontese"], ["⚽", "Juventus e Torino sono le squadre di calcio di Torino"], ["🏞️", "Il Lago Maggiore è in parte piemontese"] ]),
    'reg-lombardia': R("Lombardia", '🏙️', [
      ["🏙️", "Il capoluogo della Lombardia è Milano"], ["⛪", "In cima al Duomo di Milano c'è la Madonnina"], ["🎨", "L'Ultima Cena di Leonardo è a Milano"], ["🎭", "Il Teatro alla Scala è il più famoso teatro lirico"],
      ["🏞️", "Il lago di Como è famoso per i suoi paesaggi"], ["🍰", "Il panettone è nato a Milano"], ["🍚", "Il risotto alla milanese si colora con lo zafferano"], ["🍖", "La cotoletta alla milanese è un piatto tipico"],
      ["👥", "La Lombardia è la regione più popolosa d'Italia"], ["👗", "Milano è la capitale italiana della moda"], ["🚤", "I Navigli sono i canali di Milano"], ["🧀", "Il gorgonzola è un formaggio lombardo"],
      ["🏰", "Il Castello Sforzesco è un simbolo di Milano"], ["🏎️", "A Monza si corre il Gran Premio d'Italia di Formula 1"], ["⚽", "San Siro è lo stadio di Milan e Inter"], ["🏰", "Bergamo Alta è una città fortificata dalle antiche mura veneziane"] ]),
    'reg-trentino-alto-adige': R("Trentino-Alto Adige", '⛰️', [
      ["⛰️", "Il capoluogo del Trentino-Alto Adige è Trento"], ["🏔️", "Le Dolomiti sono patrimonio UNESCO"], ["🗣️", "Qui si parla italiano e tedesco"], ["🛣️", "Il Brennero è il valico verso l'Austria"],
      ["🧊", "A Bolzano si trova Ötzi, l'uomo venuto dal ghiaccio"], ["🥓", "Lo speck è un salume tipico dell'Alto Adige"], ["🍎", "La Val di Non è famosa per le mele"], ["🥧", "Lo strudel è un dolce tipico"],
      ["🍲", "I canederli sono un piatto tipico"], ["🎄", "A Bolzano ci sono famosi mercatini di Natale"], ["⛷️", "Madonna di Campiglio è una località sciistica"], ["🏰", "A Trento c'è il Castello del Buonconsiglio"],
      ["⛪", "A Trento si tenne il Concilio nel 1545"], ["🏞️", "Il lago di Braies è uno dei più fotografati d'Italia"], ["🛡️", "La regione è divisa in due province autonome: Trento e Bolzano"], ["🌲", "Un terzo della regione è coperto da boschi"] ]),
    'reg-veneto': R("Veneto", '🚤', [
      ["🚤", "Il capoluogo del Veneto è Venezia"], ["🌊", "Venezia è costruita sull'acqua"], ["🎭", "Il Carnevale di Venezia è famoso per le maschere"], ["🌉", "Il Ponte di Rialto attraversa il Canal Grande"],
      ["🛶", "La gondola è la barca tipica di Venezia"], ["🎭", "L'Arena di Verona ospita famosi spettacoli d'opera"], ["💘", "Verona è la città di Romeo e Giulietta"], ["🎨", "A Padova Giotto affrescò la Cappella degli Scrovegni"],
      ["🏛️", "Vicenza è la città di Palladio"], ["🥂", "Il Prosecco è uno spumante veneto"], ["🍰", "Il tiramisù nasce in Veneto, secondo la tradizione più diffusa"], ["🎬", "A Venezia si tiene la Mostra del cinema"],
      ["⛷️", "Cortina d'Ampezzo è la «perla delle Dolomiti»"], ["💧", "L'acqua alta invade spesso le strade di Venezia"], ["🚧", "Il Mose protegge Venezia dall'acqua alta"], ["⛪", "La Basilica di San Marco è il simbolo di Venezia"] ]),
    'reg-friuli-venezia-giulia': R("Friuli-Venezia Giulia", '⚓', [
      ["⚓", "Il capoluogo del Friuli-Venezia Giulia è Trieste"], ["🏛️", "Piazza Unità d'Italia a Trieste si affaccia sul mare"], ["🥓", "Il prosciutto di San Daniele è famoso in tutto il mondo"], ["🏰", "Il castello di Miramare si affaccia sul golfo di Trieste"],
      ["💨", "La bora è il vento forte di Trieste"], ["🏺", "Aquileia è patrimonio UNESCO"], ["🏛️", "Cividale del Friuli conserva testimonianze dei Longobardi"], ["🍷", "Il Friuli è terra di grandi vini bianchi"],
      ["☕", "Trieste è la capitale italiana del caffè"], ["⛰️", "La Carnia è una zona di montagna"], ["⭐", "Palmanova è una città a forma di stella"], ["🧀", "Il frico è un piatto friulano a base di formaggio"],
      ["🗣️", "Qui si parlano italiano, friulano, sloveno e tedesco"], ["🏔️", "Il Carso è un altopiano di rocce calcaree"], ["🏙️", "Udine, Pordenone e Gorizia sono altre città della regione"], ["🛡️", "È una regione a statuto speciale"] ]),
    'reg-liguria': R("Liguria", '🌊', [
      ["🌊", "Il capoluogo della Liguria è Genova"], ["🌎", "Genova è la città di Cristoforo Colombo"], ["🗼", "La Lanterna è il faro di Genova"], ["🌿", "Il pesto alla genovese nasce in Liguria"],
      ["🍞", "La focaccia genovese è famosa in tutta Italia"], ["🏘️", "Le Cinque Terre sono patrimonio UNESCO"], ["⛵", "Portofino è un borgo di pescatori famoso nel mondo"], ["🎤", "Sanremo ospita il Festival della canzone italiana"],
      ["🐠", "L'Acquario di Genova è uno dei più grandi d'Europa"], ["🌸", "La Riviera dei Fiori è la costa di ponente"], ["🗿", "Il Cristo degli Abissi è sott'acqua a San Fruttuoso"], ["🎻", "Niccolò Paganini era nato a Genova"],
      ["🚢", "Il porto di Genova è tra i più importanti d'Italia"], ["🍝", "Le trofie sono una pasta ligure"], ["🏖️", "La Liguria è una striscia di terra tra mare e montagna"], ["🫒", "L'olio ligure è molto delicato"] ]),
    'reg-emilia-romagna': R("Emilia-Romagna", '🏎️', [
      ["🍝", "Il capoluogo dell'Emilia-Romagna è Bologna"], ["🧠", "Bologna è detta «la dotta, la grassa e la rossa»"], ["🗼", "Le Due Torri sono il simbolo di Bologna"], ["🧀", "Il Parmigiano Reggiano è il re dei formaggi"],
      ["🥓", "Il prosciutto di Parma è famoso nel mondo"], ["🍷", "L'aceto balsamico è di Modena"], ["🥟", "I tortellini sono un piatto emiliano"], ["🏛️", "Ravenna è famosa per i mosaici bizantini"],
      ["🏖️", "Rimini è la capitale delle vacanze sulla Riviera Romagnola"], ["🏎️", "La Ferrari ha sede a Maranello"], ["🐂", "La Lamborghini nasce a Sant'Agata Bolognese"], ["🏍️", "La Ducati è nata a Bologna"],
      ["🎓", "L'Università di Bologna è la più antica d'Europa"], ["🎶", "Giuseppe Verdi era emiliano"], ["🎤", "Luciano Pavarotti era di Modena"], ["🎬", "Federico Fellini era nato a Rimini"],
      ["🫓", "La piadina è il pane tipico della Romagna"], ["⚰️", "Dante Alighieri è sepolto a Ravenna"] ]),
    'reg-toscana': R("Toscana", '🎨', [
      ["🎨", "Il capoluogo della Toscana è Firenze"], ["⛪", "La cupola del Duomo di Firenze è di Brunelleschi"], ["🌉", "Ponte Vecchio è il ponte più famoso di Firenze"], ["🖼️", "La Galleria degli Uffizi custodisce capolavori del Rinascimento"],
      ["🗿", "Il David di Michelangelo si trova a Firenze"], ["🗼", "La Torre di Pisa è pendente"], ["🏇", "A Siena si corre il Palio in Piazza del Campo"], ["🍷", "Il Chianti è un vino toscano"],
      ["🏰", "Lucca è circondata da mura intatte"], ["🏙️", "San Gimignano è famosa per le sue torri"], ["🎭", "Il Carnevale di Viareggio è famoso per i carri allegorici"], ["🥩", "La bistecca alla fiorentina è un piatto celebre"],
      ["🍲", "La ribollita è una zuppa toscana"], ["🤥", "Pinocchio è nato dalla penna di Collodi"], ["🧠", "Leonardo da Vinci era nato a Vinci"], ["🏝️", "L'isola d'Elba è la più grande dell'arcipelago toscano"],
      ["🍞", "Il pane toscano si fa senza sale"], ["⛰️", "Il marmo di Carrara è famoso nel mondo"] ]),
    'reg-umbria': R("Umbria", '💚', [
      ["💚", "Il capoluogo dell'Umbria è Perugia"], ["⛪", "Assisi è la città di San Francesco"], ["🍫", "A Perugia nascono i Baci Perugina"], ["🍫", "Eurochocolate è la festa del cioccolato di Perugia"],
      ["🏞️", "Il lago Trasimeno è il più grande dell'Italia centrale"], ["🎭", "Spoleto ospita il Festival dei Due Mondi"], ["⛪", "Il Duomo di Orvieto è un capolavoro gotico"], ["💧", "La Cascata delle Marmore è tra le più alte d'Europa"],
      ["🕯️", "A Gubbio si corre la Festa dei Ceri"], ["🌍", "È l'unica regione italiana senza mare e senza confini con altri Stati"], ["🍄", "Il tartufo nero di Norcia è molto pregiato"], ["⛪", "A Norcia nacque San Benedetto"],
      ["🏛️", "La Basilica di San Francesco ad Assisi è patrimonio UNESCO"], ["🌿", "L'Umbria è detta «il cuore verde d'Italia»"], ["🍷", "Il Sagrantino è un vino umbro"], ["🫘", "La lenticchia di Castelluccio è famosa per le fioriture dei suoi campi"] ]),
    'reg-marche': R("Marche", '⛵', [
      ["⛵", "Il capoluogo delle Marche è Ancona"], ["🎨", "Raffaello era nato a Urbino"], ["🏰", "Il Palazzo Ducale di Urbino è un gioiello del Rinascimento"], ["⛪", "A Loreto c'è un famoso santuario"],
      ["🏖️", "Il Conero è un promontorio sul mare Adriatico"], ["📖", "Giacomo Leopardi era di Recanati"], ["🕳️", "Le grotte di Frasassi sono tra le più belle d'Europa"], ["🎶", "Gioachino Rossini era nato a Pesaro"],
      ["🏰", "La rocca di Gradara è legata a Paolo e Francesca"], ["🍽️", "Le olive all'ascolana sono un piatto tipico"], ["🍷", "Il Verdicchio è un vino bianco marchigiano"], ["⛰️", "I Monti Sibillini sono un parco nazionale"],
      ["🏖️", "Sirolo e Numana hanno spiagge bellissime"], ["🧶", "Le Marche sono famose per le scarpe e l'artigianato"], ["🏛️", "Urbino è patrimonio UNESCO"], ["🍲", "Il brodetto è la zuppa di pesce adriatica"] ]),
    'reg-lazio': R("Lazio", '🏛️', [
      ["🏛️", "Il capoluogo del Lazio è Roma"], ["🏟️", "Il Colosseo è il simbolo di Roma"], ["⛲", "Chi lancia una moneta nella Fontana di Trevi tornerà a Roma"], ["⛪", "Il Vaticano è lo Stato più piccolo del mondo"],
      ["🏛️", "Il Pantheon è un tempio romano ancora in uso"], ["🌉", "Il Tevere attraversa Roma"], ["🍝", "Carbonara e cacio e pepe sono piatti romani"], ["🧀", "Il pecorino romano è un formaggio del Lazio"],
      ["🍷", "Frascati è un vino dei Castelli Romani"], ["⛲", "A Tivoli ci sono Villa d'Este e Villa Adriana"], ["🏺", "Ostia Antica era il porto dell'antica Roma"], ["🎬", "A Roma c'è Cinecittà, la città del cinema"],
      ["🛣️", "La Via Appia è la «regina delle strade»"], ["🏝️", "Ponza è un'isola del Lazio"], ["🏞️", "Il lago di Bolsena è di origine vulcanica"], ["🏖️", "Sabaudia è sul mare, vicino al Circeo"] ]),
    'reg-abruzzo': R("Abruzzo", '🐻', [
      ["🐻", "Il capoluogo dell'Abruzzo è L'Aquila"], ["⛰️", "Il Gran Sasso è la montagna più alta degli Appennini"], ["🐻", "Nel Parco d'Abruzzo vive l'orso marsicano"], ["🍢", "Gli arrosticini sono spiedini di carne di pecora"],
      ["📖", "Gabriele D'Annunzio era nato a Pescara"], ["🍬", "I confetti di Sulmona sono famosi"], ["🍷", "Il Montepulciano d'Abruzzo è un vino rosso"], ["🏰", "Rocca Calascio è uno dei castelli più scenografici d'Italia"],
      ["🪵", "I trabocchi sono antiche macchine da pesca sulla costa"], ["⛰️", "Il Parco nazionale della Maiella è una vasta area protetta"], ["🍝", "I maccheroni alla chitarra sono la pasta tipica"], ["🏔️", "Campo Imperatore è chiamato il «piccolo Tibet»"],
      ["🌲", "L'Abruzzo è detta «la regione verde d'Europa»"], ["🏖️", "La costa dei Trabocchi è lunga e sabbiosa"], ["⛷️", "Roccaraso è una località sciistica"], ["🏘️", "Scanno è un borgo di montagna molto fotografato"] ]),
    'reg-molise': R("Molise", '🔔', [
      ["🔔", "Il capoluogo del Molise è Campobasso"], ["👶", "Il Molise è la regione più giovane d'Italia: dal 1963"], ["📏", "Il Molise è tra le regioni più piccole d'Italia"], ["🏖️", "Termoli ha un borgo antico sul mare"],
      ["🔔", "Ad Agnone si fabbricano campane da secoli"], ["🎭", "Il Carnevale di Larino è molto antico"], ["🏛️", "Sepino ha i resti di una città romana"], ["🍄", "A San Pietro Avellana si trova il tartufo bianco"],
      ["🧀", "Il caciocavallo di Agnone è famoso"], ["😄", "C'è chi dice per scherzo «il Molise non esiste»: invece esiste!"], ["⛰️", "Il Matese è un massiccio montuoso"], ["🔪", "Frosolone è famosa per i coltelli"],
      ["🦴", "A Isernia c'è un importante sito preistorico"], ["🎉", "La Festa dei Misteri di Campobasso è molto sentita"], ["🍝", "I cavatelli sono una pasta tipica"], ["🌾", "Il Molise è una regione di borghi e campagne"] ]),
    'reg-campania': R("Campania", '🍕', [
      ["🍕", "Il capoluogo della Campania è Napoli"], ["🍕", "La pizza è nata a Napoli"], ["🌋", "Il Vesuvio domina il golfo di Napoli"], ["🏺", "Pompei ed Ercolano furono sepolte dall'eruzione del 79 d.C."],
      ["🏝️", "Capri è l'isola dei Faraglioni"], ["🍋", "La Costiera Amalfitana è patrimonio UNESCO"], ["🏰", "La Reggia di Caserta è tra le più grandi residenze reali"], ["🧀", "La mozzarella di bufala è della Campania"],
      ["🍰", "Il babà e la sfogliatella sono dolci napoletani"], ["☕", "A Napoli il caffè è un rito"], ["🎭", "Pulcinella è la maschera napoletana"], ["🎭", "Totò era nato a Napoli"],
      ["🕊️", "San Gennaro è il patrono di Napoli"], ["🎄", "A Napoli c'è via San Gregorio Armeno, la via dei presepi"], ["🌋", "I Campi Flegrei sono una vasta area vulcanica"], ["🎶", "Il Teatro San Carlo è il più antico teatro d'opera d'Europa"],
      ["🏝️", "Ischia è famosa per le terme"], ["🍋", "Il limone di Sorrento è famoso"] ]),
    'reg-basilicata': R("Basilicata", '🏘️', [
      ["🏘️", "Il capoluogo della Basilicata è Potenza"], ["🕳️", "Matera è famosa per i Sassi, patrimonio UNESCO"], ["🏆", "Matera è stata Capitale europea della cultura nel 2019"], ["🌊", "La Basilicata si affaccia su due mari: il Tirreno e lo Ionio"],
      ["⛪", "A Maratea c'è la statua del Cristo Redentore"], ["🌶️", "Il peperone crusco è un prodotto tipico"], ["🍞", "Il pane di Matera è famoso in tutta Italia"], ["🍷", "L'Aglianico del Vulture è un vino lucano"],
      ["👻", "Craco è una città fantasma"], ["⛰️", "Le Dolomiti Lucane sono montagne dalle forme particolari"], ["🌲", "Il Parco del Pollino è condiviso con la Calabria"], ["📜", "Lucania è l'antico nome della Basilicata"],
      ["🪂", "A Castelmezzano si fa il Volo dell'Angelo"], ["🏛️", "A Metaponto ci sono le Tavole Palatine"], ["🏰", "A Melfi c'è un castello di Federico II"], ["⛪", "Le chiese rupestri sono scavate nella roccia"] ]),
    'reg-calabria': R("Calabria", '🌶️', [
      ["🌶️", "Il capoluogo della Calabria è Catanzaro"], ["🗿", "I Bronzi di Riace sono al museo di Reggio Calabria"], ["🌶️", "La 'nduja è un salume piccante"], ["🧅", "La cipolla rossa di Tropea è famosa"],
      ["🌶️", "Il peperoncino è il simbolo della cucina calabrese"], ["🌊", "Scilla e Cariddi sono nello Stretto di Messina"], ["🌲", "La Sila è un altopiano ricoperto di boschi"], ["⛰️", "L'Aspromonte è un massiccio montuoso"],
      ["🍋", "Il bergamotto cresce quasi solo in Calabria"], ["📐", "Pitagora fondò la sua scuola a Crotone"], ["🏛️", "La Calabria faceva parte della Magna Grecia"], ["🏰", "Il castello aragonese di Le Castella è sul mare"],
      ["🏘️", "Gerace è un borgo medievale"], ["🏖️", "Capo Vaticano ha spiagge bellissime"], ["🍬", "La liquirizia di Rossano è famosa"], ["🌊", "La Calabria è bagnata da due mari: lo Ionio e il Tirreno"] ]),
    'reg-sicilia': R("Sicilia", '🌋', [
      ["🌋", "Il capoluogo della Sicilia è Palermo"], ["🌋", "L'Etna è un vulcano sempre attivo"], ["🏛️", "La Valle dei Templi è ad Agrigento"], ["🎭", "Taormina ha un teatro greco affacciato sul mare"],
      ["📐", "Archimede era di Siracusa"], ["⛪", "Il Duomo di Monreale è famoso per i suoi mosaici"], ["🏝️", "Stromboli è un vulcano delle Isole Eolie"], ["🥮", "La cassata e i cannoli sono dolci siciliani"],
      ["🍙", "Gli arancini sono palle di riso fritte"], ["🍧", "La granita con la brioche è la colazione siciliana"], ["🌰", "Il pistacchio di Bronte è famoso"], ["🍷", "Il Marsala è un vino liquoroso"],
      ["🧂", "Le saline di Trapani sono famose per il sale"], ["📺", "Il commissario Montalbano è ambientato in Sicilia"], ["📖", "Il Gattopardo è un romanzo di Tomasi di Lampedusa"], ["🎭", "Luigi Pirandello era nato ad Agrigento"],
      ["🏝️", "Lampedusa è l'isola più a sud d'Italia"], ["🌊", "La Sicilia è la più grande isola del Mediterraneo"] ]),
    'reg-sardegna': R("Sardegna", '🏝️', [
      ["🏝️", "Il capoluogo della Sardegna è Cagliari"], ["🏖️", "La Costa Smeralda è famosa per il mare cristallino"], ["🗿", "I nuraghi sono antiche torri di pietra"], ["🌊", "La Sardegna è la seconda isola del Mediterraneo"],
      ["🧀", "Il pecorino sardo è un formaggio famoso"], ["🍖", "Il porceddu è il maialino arrosto"], ["🫓", "Il pane carasau è sottile e croccante"], ["🍷", "Il Cannonau è un vino rosso sardo"],
      ["🏝️", "La Maddalena è un arcipelago di isole"], ["🫏", "All'Asinara vivono gli asinelli bianchi"], ["🏰", "Ad Alghero si parla anche il catalano"], ["🌿", "Il mirto è un liquore sardo"],
      ["⛰️", "Il Supramonte è un altopiano selvaggio"], ["📖", "Grazia Deledda vinse il Nobel per la letteratura nel 1926"], ["🎶", "Le launeddas sono uno strumento musicale antico"], ["🏇", "La Sartiglia di Oristano è una giostra a cavallo"],
      ["🏛️", "Su Nuraxi di Barumini è patrimonio UNESCO"], ["🌊", "Cala Goloritzé è una delle spiagge più belle d'Italia"] ])
  };

  // ---------- santi, Chiesa e parole di Gesù (da scegliere a mano: non entrano nel «Casuale» né in «Tutto un po'») ----------
  const FEDE = {
    'santi': { name: "I santi", icon: '😇', levels: TUTTI, optIn: true, items: [
      ["🕊️", "San Francesco d'Assisi è il patrono d'Italia e si festeggia il 4 ottobre"], ["🌿", "San Francesco scrisse il Cantico delle creature"], ["⛪", "Santa Caterina da Siena è copatrona d'Italia"], ["⚓", "San Nicola è il patrono di Bari"],
      ["🔎", "Sant'Antonio da Padova si invoca per ritrovare le cose smarrite"], ["🩸", "San Gennaro è il patrono di Napoli e si festeggia il 19 settembre"], ["🏙️", "Sant'Ambrogio è il patrono di Milano e si festeggia il 7 dicembre"], ["🦁", "San Marco è il patrono di Venezia"],
      ["💧", "San Giovanni Battista è il patrono di Firenze e di Genova"], ["🌹", "Santa Rosalia è la patrona di Palermo"], ["🕯️", "Sant'Agata è la patrona di Catania e si festeggia il 5 febbraio"], ["🏛️", "San Pietro e San Paolo sono i patroni di Roma e si festeggiano il 29 giugno"],
      ["🌊", "Sant'Efisio è il patrono della Sardegna"], ["🌰", "San Martino si festeggia l'11 novembre"], ["👁️", "Santa Lucia, il 13 dicembre, è la protettrice della vista"], ["💘", "San Valentino si festeggia il 14 febbraio"],
      ["🔨", "San Giuseppe, il 19 marzo, è il patrono dei papà"], ["⚔️", "San Giorgio è il santo che, secondo la leggenda, sconfisse il drago"], ["🚶", "San Cristoforo è il protettore dei viaggiatori"], ["🍞", "San Biagio, il 3 febbraio, è il protettore della gola"],
      ["🐷", "Sant'Antonio Abate è il protettore degli animali e si festeggia il 17 gennaio"], ["🕊️", "San Pio da Pietrelcina, Padre Pio, visse a San Giovanni Rotondo"], ["⚽", "San Giovanni Bosco, il 31 gennaio, è il patrono dei giovani"], ["🌸", "Santa Chiara fu la compagna di San Francesco"],
      ["👵", "Sant'Anna e San Gioacchino sono i genitori di Maria e si festeggiano il 26 luglio"], ["🛡️", "San Michele Arcangelo si festeggia il 29 settembre"], ["📖", "Sant'Agostino scrisse le «Confessioni»"], ["🏔️", "San Benedetto è il patrono d'Europa"],
      ["🤲", "Madre Teresa di Calcutta è stata proclamata santa nel 2016"], ["🌍", "San Giovanni Paolo II è stato proclamato santo nel 2014"], ["🌊", "San Cataldo è il patrono di Taranto"], ["⛪", "Sant'Oronzo è il patrono di Lecce"],
      ["🕯️", "Il 1° novembre si festeggiano tutti i Santi"], ["🙏", "Il 2 novembre si ricordano i defunti"], ["✨", "Un santo è una persona che ha vissuto il Vangelo in modo esemplare"], ["⭕", "Nelle immagini sacre i santi hanno l'aureola"],
      ["📜", "Proclamare santo qualcuno si dice «canonizzare»"], ["👼", "Il 2 ottobre si festeggiano gli angeli custodi"], ["🍅", "Ogni paese ha il suo santo patrono con una festa"] ] },
    'chiesa': { name: "La Chiesa e le sue tradizioni", icon: '⛪', levels: TUTTI, optIn: true, items: [
      ["🏛️", "Il Papa è il vescovo di Roma e vive in Vaticano"], ["⛪", "La Basilica di San Pietro sorge sulla tomba dell'apostolo Pietro"], ["🎨", "La Cappella Sistina è affrescata da Michelangelo"], ["📖", "I Vangeli sono quattro: Matteo, Marco, Luca e Giovanni"],
      ["📚", "La Bibbia è divisa in Antico e Nuovo Testamento"], ["👥", "Gli apostoli di Gesù erano dodici"], ["7️⃣", "I sacramenti sono sette: Battesimo, Cresima, Eucaristia, Penitenza, Unzione degli infermi, Ordine e Matrimonio"], ["💧", "Il Battesimo è il primo dei sacramenti"],
      ["🔔", "Le campane chiamano alla Messa"], ["☀️", "La domenica è il giorno del Signore"], ["🎄", "Il Natale celebra la nascita di Gesù"], ["🐣", "La Pasqua celebra la risurrezione di Gesù"],
      ["4️⃣", "La Quaresima dura quaranta giorni"], ["⚫", "Il Mercoledì delle Ceneri apre la Quaresima"], ["🌿", "La domenica delle Palme apre la Settimana Santa"], ["🔥", "La Pentecoste ricorda la discesa dello Spirito Santo, cinquanta giorni dopo Pasqua"],
      ["🕯️", "L'Avvento è il tempo delle quattro domeniche prima di Natale"], ["⭐", "L'Epifania è il 6 gennaio"], ["🎆", "Il 15 agosto si festeggia l'Assunzione di Maria, che chiamiamo Ferragosto"], ["🌸", "L'8 dicembre si festeggia l'Immacolata"],
      ["📿", "Il Rosario è una preghiera con la corona di grani"], ["🙏", "Il Padre Nostro è la preghiera insegnata da Gesù"], ["✝️", "Il segno della croce si fa con la mano destra"], ["💦", "L'acqua benedetta si trova all'ingresso delle chiese"],
      ["📜", "I dieci comandamenti furono consegnati a Mosè"], ["📅", "Il Concilio Vaticano II si svolse dal 1962 al 1965"], ["⛪", "La cattedrale è la chiesa del vescovo"], ["🧑‍🦱", "Il parroco guida la parrocchia"],
      ["🐑", "Il primo presepe fu fatto da San Francesco a Greccio nel 1223"], ["🎹", "L'organo è lo strumento tipico delle chiese"], ["🚪", "Il Giubileo ordinario si celebra ogni 25 anni"], ["🌟", "La Porta Santa si apre durante il Giubileo"],
      ["📅", "Gli anni si contano dalla nascita di Cristo"], ["✝️", "Molte chiese hanno la pianta a forma di croce"], ["💨", "L'incenso profuma le celebrazioni"], ["🕯️", "Il tabernacolo custodisce l'Eucaristia"],
      ["🍞", "La Messa ha due parti: la Liturgia della Parola e la Liturgia eucaristica"], ["🕊️", "La colomba è il simbolo dello Spirito Santo"], ["🐑", "L'agnello è il simbolo di Gesù"], ["🌍", "Il Vangelo significa «buona notizia»"] ] },
    'gesu': { name: "Le parole di Gesù", icon: '✝️', levels: TUTTI, optIn: true, items: [
      ["❤️", "«Amerai il prossimo tuo come te stesso» (Mt 22,39)"], ["🕊️", "«Beati gli operatori di pace, perché saranno chiamati figli di Dio» (Mt 5,9)"], ["🌱", "«Beati i miti, perché avranno in eredità la terra» (Mt 5,5)"], ["🤝", "«Beati i misericordiosi, perché troveranno misericordia» (Mt 5,7)"],
      ["💎", "«Beati i puri di cuore, perché vedranno Dio» (Mt 5,8)"], ["🧂", "«Voi siete il sale della terra» (Mt 5,13)"], ["💡", "«Voi siete la luce del mondo» (Mt 5,14)"], ["🚪", "«Chiedete e vi sarà dato, cercate e troverete, bussate e vi sarà aperto» (Mt 7,7)"],
      ["⚖️", "«Non giudicate, per non essere giudicati» (Mt 7,1)"], ["🪙", "«Date a Cesare quello che è di Cesare e a Dio quello che è di Dio» (Mt 22,21)"], ["🧒", "«Lasciate che i bambini vengano a me» (Mc 10,14)"], ["🛣️", "«Io sono la via, la verità e la vita» (Gv 14,6)"],
      ["🐑", "«Io sono il buon pastore» (Gv 10,11)"], ["🔦", "«Io sono la luce del mondo» (Gv 8,12)"], ["🍞", "«Io sono il pane della vita» (Gv 6,35)"], ["🛋️", "«Venite a me, voi tutti che siete stanchi e oppressi, e io vi darò ristoro» (Mt 11,28)"],
      ["🙏", "«Padre nostro che sei nei cieli, sia santificato il tuo nome» (Mt 6,9)"], ["🍽️", "«Non di solo pane vivrà l'uomo» (Mt 4,4)"], ["👣", "«Seguimi» (Mt 9,9)"], ["🌊", "«Coraggio, sono io, non abbiate paura» (Mt 14,27)"],
      ["🕊️", "«Pace a voi!» (Gv 20,19)"], ["🤲", "«Padre, perdonali, perché non sanno quello che fanno» (Lc 23,34)"], ["🪨", "«Chi di voi è senza peccato, getti per primo la pietra» (Gv 8,7)"], ["💞", "«Amate i vostri nemici e pregate per quelli che vi perseguitano» (Mt 5,44)"],
      ["📅", "«Il sabato è stato fatto per l'uomo» (Mc 2,27)"], ["💰", "«Dov'è il tuo tesoro, là sarà anche il tuo cuore» (Mt 6,21)"], ["⚖️", "«Nessuno può servire due padroni» (Mt 6,24)"], ["🐦", "«Guardate gli uccelli del cielo: non seminano e non mietono» (Mt 6,26)"],
      ["🌷", "«Osservate come crescono i gigli del campo» (Mt 6,28)"], ["🌅", "«Non preoccupatevi del domani» (Mt 6,34)"], ["🌾", "«La messe è molta, ma gli operai sono pochi» (Mt 9,37)"], ["🛡️", "«Va' e anche tu fa' lo stesso» (Lc 10,37)"],
      ["🧎", "«Il Figlio dell'uomo non è venuto per essere servito, ma per servire» (Mt 20,28)"], ["🌍", "«Dio ha tanto amato il mondo da dare il suo Figlio unigenito» (Gv 3,16)"], ["🍞", "«Fate questo in memoria di me» (Lc 22,19)"], ["🌐", "«Io sono con voi tutti i giorni, fino alla fine del mondo» (Mt 28,20)"],
      ["📣", "«Andate in tutto il mondo e proclamate il Vangelo» (Mc 16,15)"], ["🏠", "«Ero straniero e mi avete accolto» (Mt 25,35)"], ["🥣", "«Ho avuto fame e mi avete dato da mangiare» (Mt 25,35)"], ["✝️", "«Se qualcuno vuol venire dietro a me, rinunci a se stesso, prenda la sua croce e mi segua» (Mt 16,24)"],
      ["☀️", "«Il Padre vostro fa sorgere il suo sole sui cattivi e sui buoni» (Mt 5,45)"], ["🗣️", "«Sia il vostro parlare: sì, sì; no, no» (Mt 5,37)"], ["🫂", "«Tutto quello che avete fatto a uno solo di questi miei fratelli più piccoli, l'avete fatto a me» (Mt 25,40)"], ["🎁", "«Date e vi sarà dato» (Lc 6,38)"],
      ["💗", "«Siate misericordiosi, come è misericordioso il Padre vostro» (Lc 6,36)"], ["💞", "«Amatevi gli uni gli altri come io ho amato voi» (Gv 13,34)"] ] }
  };

  // ---------- matematica, statistica e informatica (adulti) ----------
  // Oltre alle frasi fisse, alcune «frasi vive» sono calcolate sui numeri usciti nella partita in corso
  // (probabilità di ambo, terno... dopo N estrazioni, medie, pari e dispari). Valgono per la tombola classica da 90 numeri.
  const LF = [0]; for (let i = 1; i <= 100; i++) LF[i] = LF[i - 1] + Math.log(i);
  const lC = (n, r) => (r < 0 || r > n) ? -Infinity : LF[n] - LF[r] - LF[n - r];
  // distribuzione ipergeometrica: pesco m numeri su N; K sono «i miei»; probabilità di averne almeno j tra i pescati
  const atLeast = (N, K, m, j) => { let p = 0; for (let x = j; x <= Math.min(K, m); x++) p += Math.exp(lC(K, x) + lC(N - K, m - x) - lC(N, m)); return Math.min(1, p); };
  const fmtPct = p => {
    const v = p * 100;
    if (v > 0 && v < 0.001) return 'meno di 0,001%';
    let s = v >= 10 ? v.toFixed(1) : v >= 0.1 ? v.toFixed(2) : v.toFixed(3);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\\.$/, '');
    return s.replace('.', ',') + '%';
  };
  const fmt1 = x => x.toFixed(1).replace('.', ',');
  // Frase viva: riceve il numero n e la partita ({ drawn, max }); restituisce { e, t } oppure null (allora si usa una frase fissa).
  const viva = fn => (n, ctx) => {
    if (!ctx || ctx.max !== 90) return null;
    const k = ctx.drawn.indexOf(n) + 1;
    return k ? fn(n, k, ctx.drawn.slice(0, k)) : null;
  };
  const probRiga = (j, label, emoji) => viva((n, k) => {
    const p = atLeast(90, 5, k, j);
    return p > 0 ? { e: emoji, t: `Dopo ${k} estrazioni, una riga di 5 numeri ha già fatto ${label} con probabilità ${fmtPct(p)}` } : null;
  });
  const MATE_DYN = [
    viva((n, k) => ({ e: '🎯', t: `Il ${n} è uscito all'estrazione numero ${k}: la probabilità era 1 su ${91 - k}, cioè ${fmtPct(1 / (91 - k))}` })),
    viva((n, k) => k < 90 ? { e: '🔢', t: `Dopo ${k} estrazioni restano ${90 - k} numeri: ognuno ha ${fmtPct(1 / (90 - k))} di probabilità di uscire alla prossima` } : null),
    viva((n, k, pre) => { const e = pre.filter(x => x % 2 === 0).length; return k >= 4 ? { e: '⚖️', t: `Sono usciti ${e} numeri pari e ${k - e} dispari: a metà strada ne attenderemmo ${fmt1(k / 2)} per tipo` } : null; }),
    viva((n, k, pre) => k >= 5 ? { e: '📊', t: `La media dei ${k} numeri usciti è ${fmt1(pre.reduce((a, b) => a + b, 0) / k)}: il valore atteso è 45,5` } : null),
    viva((n, k, pre) => k >= 5 ? { e: '↕️', t: `Finora il numero più basso uscito è il ${Math.min(...pre)} e il più alto il ${Math.max(...pre)}` } : null),
    viva((n, k, pre) => {
      if (k < 8) return null;
      const c = Array(9).fill(0); pre.forEach(x => c[Math.floor((x - 1) / 10)]++);
      const d = c.indexOf(Math.max(...c));
      return { e: '🌡️', t: `La decina più «calda» finora è ${d * 10 + 1}-${d * 10 + 10}, con ${c[d]} numeri usciti` };
    }),
    viva((n, k, pre) => { const rem = 90 - k; if (rem <= 0) return null; const alti = 45 - pre.filter(x => x > 45).length; return { e: '🎲', t: `Probabilità che il prossimo numero sia maggiore di 45: ${fmtPct(alti / rem)}` }; }),
    viva((n, k) => ({ e: '🧮', t: `Dopo ${k} estrazioni una cartella da 15 numeri ha in media ${fmt1(15 * k / 90)} numeri già usciti` })),
    probRiga(2, 'almeno ambo', '✌️'),
    probRiga(3, 'almeno terno', '🥉'),
    probRiga(4, 'almeno quaterna', '🥈'),
    probRiga(5, 'cinquina (riga completa)', '🥇'),
    viva((n, k) => { const p = atLeast(90, 15, k, 15); return p > 0 ? { e: '🏆', t: `Dopo ${k} estrazioni una cartella da 15 numeri è completa (tombola) con probabilità ${fmtPct(p)}` } : null; }),
    viva((n, k) => k < 90 ? { e: '⏳', t: `Un numero specifico non è ancora uscito dopo ${k} estrazioni con probabilità ${fmtPct((90 - k) / 90)}` } : null)
  ];
  const MATEMATICA = {
    'matematica': { name: "Matematica, statistica e informatica", icon: '📐', levels: ['adulti'], dyn: MATE_DYN, items: [
      ["🎂", "Paradosso del compleanno: bastano 23 persone per avere più del 50% di probabilità che due compleanni coincidano"], ["🚪", "Problema di Monty Hall: cambiando porta si vince 2 volte su 3"],
      ["🪙", "Legge dei grandi numeri: con molte prove la frequenza si avvicina alla probabilità"], ["🧠", "Nella tombola i numeri non hanno memoria: nessun numero è «in ritardo»"],
      ["🎲", "Pascal e Fermat fondarono la teoria della probabilità nel 1654, scrivendosi lettere sui giochi d'azzardo"], ["📜", "Gerolamo Cardano scrisse un trattato sul gioco d'azzardo, il «Liber de ludo aleae»"],
      ["🔔", "La curva a campana è la distribuzione normale di Gauss"], ["📏", "La deviazione standard misura quanto i dati si disperdono attorno alla media"],
      ["➗", "La media aritmetica è la somma dei valori divisa per il loro numero"], ["🎯", "La mediana è il valore centrale, la moda è il valore più frequente"],
      ["🧮", "Il valore atteso è la media dei risultati pesata sulle probabilità"], ["♻️", "La tombola è un'estrazione senza reinserimento: segue la distribuzione ipergeometrica"],
      ["🔗", "Il teorema di Bayes aggiorna una probabilità alla luce di nuove informazioni"], ["🏛️", "Kolmogorov formalizzò la teoria della probabilità nel 1933"],
      ["🔬", "Jakob Bernoulli dimostrò la legge dei grandi numeri"], ["📐", "Laplace scrisse la «Teoria analitica delle probabilità» nel 1812"],
      ["🩺", "Florence Nightingale usò i grafici statistici per migliorare gli ospedali"], ["🌾", "Ronald Fisher è considerato uno dei padri della statistica moderna"],
      ["🧪", "Il p-value misura quanto un risultato sarebbe sorprendente se contasse solo il caso"], ["🔄", "Correlazione non significa causalità"],
      ["🔀", "Il paradosso di Simpson: un andamento può invertirsi quando si uniscono i dati di gruppi diversi"], ["🧑‍🔬", "Un campione deve essere rappresentativo della popolazione"],
      ["🔔", "Il teorema del limite centrale: la somma di molte variabili casuali tende alla curva normale"], ["1️⃣", "Legge di Benford: la cifra 1 compare come prima cifra in circa il 30% dei dati reali"],
      ["🔢", "Le possibili coppie di numeri su 90 sono 4.005: tanti sono gli ambi diversi"], ["🔢", "I terni possibili sono 117.480"],
      ["🔢", "Le quaterne possibili sono 2.555.190"], ["🔢", "Le cinquine possibili sono 43.949.268"],
      ["♾️", "I modi di estrarre i 90 numeri sono 90 fattoriale: un numero di 139 cifre"], ["⏱️", "In media servono circa 85 estrazioni per completare una cartella da 15 numeri"],
      ["🕐", "Dopo 45 estrazioni ogni numero ha il 50% di probabilità di essere già uscito"], ["➕", "La somma dei numeri da 1 a 90 è 4.095"],
      ["🧒", "Il piccolo Gauss sommò i numeri da 1 a 100 in un attimo: fa 5.050"], ["🧩", "Il 90 si scompone in 2 per 3 per 3 per 5 e ha 12 divisori"],
      ["♾️", "I numeri primi sono infiniti: lo dimostrò Euclide"], ["🥧", "Pi greco ha infinite cifre decimali senza periodo: 3,14159..."],
      ["🌀", "La successione di Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21..."], ["📖", "Fibonacci portò in Europa i numeri arabi con il «Liber abaci» nel 1202"],
      ["🔺", "Teorema di Pitagora: il quadrato dell'ipotenusa è la somma dei quadrati dei cateti"], ["🌀", "La congettura di Collatz: se pari dividi per 2, se dispari moltiplica per 3 e aggiungi 1"],
      ["🔟", "Il 90 in binario si scrive 1011010 e in esadecimale 5A"], ["💾", "Un bit vale 0 o 1; otto bit formano un byte, che arriva fino a 255"],
      ["🤖", "Alan Turing descrisse la macchina che porta il suo nome nel 1936"], ["👩‍💻", "Ada Lovelace scrisse il primo programma della storia per la macchina analitica di Babbage"],
      ["🪲", "Il primo «bug» informatico fu una falena trovata in un computer nel 1947"], ["⚙️", "La parola «algoritmo» deriva dal nome del matematico al-Khwarizmi"],
      ["👩‍🔧", "Grace Hopper sviluppò uno dei primi compilatori"], ["🐍", "Il linguaggio Python prende il nome dai Monty Python"],
      ["🌐", "Il Web fu inventato da Tim Berners-Lee al CERN nel 1989"], ["🎰", "Un computer genera numeri pseudocasuali: seguono una formula, ma sembrano casuali"],
      ["🔀", "L'algoritmo di Fisher-Yates mescola un elenco in modo uniforme"], ["❓", "«P contro NP» è uno dei sette problemi del millennio"] ] }
  };

  // ---------- videogiochi ----------
  const VIDEOGIOCHI = {
    'videogiochi-classici': { name: "Videogiochi classici (anni '70-'90)", icon: '👾', levels: ['3', '4', '5', 'adulti'], items: [
      ["🏓", "Pong, del 1972, è uno dei primi videogiochi di successo: due racchette e una pallina"], ["👾", "In Space Invaders, del 1978, gli alieni scendono verso il basso"], ["🟡", "Pac-Man, del 1980, mangia i puntini e scappa dai fantasmi"], ["👻", "I fantasmi di Pac-Man si chiamano Blinky, Pinky, Inky e Clyde"],
      ["🦍", "In Donkey Kong, del 1981, Mario salta i barili"], ["🧱", "Tetris fu inventato da Alexey Pajitnov nel 1984"], ["🟦", "In Tetris i pezzi sono sette forme fatte di quattro quadretti"], ["🍄", "Super Mario Bros è uscito nel 1985"],
      ["🗡️", "In The Legend of Zelda, del 1986, l'eroe si chiama Link, non Zelda"], ["🚀", "In Metroid, del 1986, la protagonista è Samus Aran"], ["💨", "Sonic è il porcospino blu della Sega, nato nel 1991"], ["💍", "Sonic raccoglie anelli d'oro mentre corre"],
      ["🥊", "In Street Fighter II, del 1991, i protagonisti sono Ryu e Ken"], ["🗺️", "Prince of Persia, del 1989, è famoso per i movimenti fluidi del principe"], ["🧟", "In Lemmings, del 1991, bisogna guidare tanti omini verdi fino all'uscita"], ["⚡", "Pokémon è uscito in Giappone nel 1996"],
      ["🐾", "Crash Bandicoot è la mascotte della prima PlayStation"], ["🏺", "Lara Croft è la protagonista di Tomb Raider, del 1996"], ["🌍", "Super Mario 64, del 1996, fu il primo Mario in 3D"], ["⚔️", "Final Fantasy VII è uscito nel 1997"],
      ["🪱", "In Worms i vermi si sfidano a turni con armi buffe"], ["🕹️", "L'Atari 2600, del 1977, portò i videogiochi nelle case"], ["⌚", "Game & Watch, del 1980, erano piccoli giochi portatili di Nintendo"], ["🎮", "Il Game Boy, del 1989, veniva venduto con Tetris"],
      ["📟", "Il Mega Drive è la console della Sega: in Giappone uscì nel 1988"], ["💻", "Il Commodore 64, del 1982, fu il computer dei videogiochi di una generazione"], ["🪙", "Nelle sale giochi si giocava con i gettoni"], ["🕹️", "Il joystick è la leva con cui si muove il personaggio"],
      ["💀", "«Game Over» compare quando finiscono le vite"], ["🍄", "Un «1-Up» regala una vita in più"], ["⬆️", "Il codice Konami è su, su, giù, giù, sinistra, destra, sinistra, destra, B, A"], ["🐕", "In Duck Hunt un cagnolino ride quando sbagli il colpo"],
      ["💣", "In Bomberman il protagonista piazza bombe per aprirsi la strada"], ["🐸", "In Frogger una rana deve attraversare la strada e il fiume"], ["🛸", "Galaga, del 1981, è un gioco di navicelle contro insetti spaziali"], ["☄️", "In Asteroids, del 1979, una navicella evita i massi nello spazio"],
      ["🧱", "Breakout, del 1976, è un gioco in cui si rompono i mattoncini con una pallina"], ["🩷", "Kirby, del 1992, è una pallina rosa che ingoia i nemici"], ["🤖", "Mega Man, del 1987, è un robottino blu che copia i poteri dei nemici"], ["🏎️", "Super Mario Kart, del 1992, è il primo Mario Kart"] ] },
    'videogiochi-oggi': { name: "Videogiochi di oggi", icon: '🎮', levels: ['3', '4', '5', 'adulti'], items: [
      ["🏝️", "In Animal Crossing: New Horizons si abita su un'isola deserta e si incontra Tom Nook"], ["🏔️", "Zelda: Breath of the Wild, del 2017, ha un enorme mondo da esplorare"], ["🪽", "Zelda: Tears of the Kingdom è uscito nel 2023"], ["🎩", "In Super Mario Odyssey il cappello Cappy si lancia per catturare i nemici"],
      ["🏎️", "Mario Kart 8 Deluxe è uno dei giochi più venduti di Switch"], ["🦑", "In Splatoon i calamari colorano il campo con l'inchiostro"], ["🫘", "Fall Guys è un gioco di ostacoli con tanti buffi fagioli"], ["🚗", "In Rocket League le automobili giocano a calcio"],
      ["🚀", "Among Us è ambientato su un'astronave dove si cerca l'impostore"], ["💃", "Fortnite è famoso anche per i balletti dei personaggi"], ["📱", "Pokémon GO, del 2016, si gioca camminando e catturando i Pokémon per strada"], ["🍬", "Candy Crush Saga è il gioco delle caramelle da far combaciare"],
      ["🐦", "Angry Birds nasce in Finlandia: gli uccelli lanciano contro i maiali"], ["👑", "Clash Royale è un gioco di carte e battaglie in tempo reale"], ["🏃", "In Subway Surfers si corre sui binari evitando i treni"], ["⚽", "EA Sports FC è il nuovo nome del gioco di calcio che prima si chiamava FIFA"],
      ["🏠", "The Sims è un gioco in cui si costruisce e si guida la vita dei personaggi"], ["🕺", "Just Dance è il gioco in cui si balla davanti allo schermo"], ["🎳", "Wii Sports, del 2006, fece muovere tutta la famiglia davanti alla TV"], ["🌾", "In Stardew Valley si coltiva una fattoria"],
      ["🍳", "In Overcooked bisogna cucinare tutti insieme in cucine sempre più folli"], ["🤝", "It Takes Two è un gioco da fare in due"], ["🎮", "Nintendo Switch, del 2017, è una console che si può usare anche come portatile"], ["🏆", "Gli e-sport sono tornei di videogiochi"],
      ["📺", "Gli streamer giocano in diretta davanti a un pubblico online"], ["🥽", "Il visore per la realtà virtuale fa entrare dentro il gioco"], ["🔞", "Il PEGI indica l'età minima consigliata di un videogioco"], ["👨‍👩‍👧", "Il controllo parentale permette di scegliere cosa e quanto giocare"],
      ["🔒", "Nei giochi online non si danno mai nome, indirizzo o password"], ["⏱️", "Fai una pausa ogni ora: anche gli occhi si stancano"], ["🗣️", "Se qualcuno online ti scrive cose che non ti piacciono, dillo a un adulto"], ["🧠", "Molti giochi allenano la logica, la memoria e la collaborazione"],
      ["🌐", "Molti giochi si possono giocare insieme online con gli amici"], ["🛠️", "Alcuni giochi permettono di costruire livelli e mondi tutti tuoi"], ["💾", "Quasi tutti i giochi hanno il salvataggio: così riparti da dove eri arrivato"], ["🏅", "In molti giochi si sbloccano trofei e obiettivi"] ] },
    'console': { name: "Console e storia dei videogiochi", icon: '🕹️', levels: ['4', '5', 'adulti'], items: [
      ["🃏", "Nintendo è stata fondata nel 1889 e all'inizio produceva carte da gioco"], ["🏓", "Il primo videogioco di grande successo fu Pong, con Atari, nel 1972"], ["🕹️", "L'Atari 2600 uscì nel 1977"], ["📺", "Una console si collega alla TV e ha i suoi controller"],
      ["🎮", "Il NES, la console a 8 bit di Nintendo, ebbe grande successo negli anni Ottanta"], ["🎮", "Il Game Boy uscì nel 1989 ed era portatile"], ["📟", "Il Mega Drive è la console a 16 bit della Sega"], ["💿", "PlayStation, della Sony, uscì in Giappone nel 1994"],
      ["🟩", "La prima Xbox, di Microsoft, uscì nel 2001"], ["🎳", "La Wii, del 2006, si giocava muovendo il telecomando"], ["🎮", "Nintendo Switch uscì nel 2017"], ["💾", "Un tempo i giochi stavano su cartucce, poi su CD e infine si scaricano da internet"],
      ["🔢", "I bit indicano la potenza della console: 8 bit, 16 bit, 32 bit..."], ["🖼️", "Il pixel è il quadratino con cui è fatta l'immagine sullo schermo"], ["🎨", "La grafica 3D arrivò in massa negli anni Novanta"], ["🖥️", "Il PC è usato anche per i videogiochi, con mouse e tastiera"],
      ["📱", "Oggi si gioca anche con smartphone e tablet"], ["🌐", "Il gioco online permette di sfidare persone in tutto il mondo"], ["☁️", "Il cloud gaming fa girare il gioco su un computer lontano"], ["🏆", "Gli e-sport hanno campionati con premi in denaro"],
      ["🧑‍💻", "Un game designer inventa le regole e il mondo di un gioco"], ["🎵", "La musica dei videogiochi si chiama colonna sonora, anche chiamata «soundtrack»"], ["🧩", "Un livello è una parte del gioco con un obiettivo da raggiungere"], ["👾", "Il «boss» è il nemico più forte alla fine di un livello"],
      ["🕵️", "Un «easter egg» è una sorpresa nascosta dagli sviluppatori"], ["💥", "Un «bug» è un errore del programma"], ["🛠️", "Una «mod» è una modifica creata dai giocatori"], ["🔓", "«Sbloccare» significa rendere disponibile un personaggio o un livello"],
      ["🇯🇵", "Molte grandi aziende di videogiochi sono giapponesi: Nintendo, Sega, Capcom, Sony"], ["🇮🇹", "Anche in Italia si sviluppano videogiochi"], ["🍄", "Mario è la mascotte di Nintendo"], ["🦔", "Sonic è la mascotte della Sega"],
      ["🎮", "Il controller moderno ha pulsanti, levette e vibrazione"], ["📚", "I videogiochi sono considerati una forma di arte e di intrattenimento"] ] },
    'pokemon': { name: "Pokémon", icon: '⚡', levels: ['1', '2', '3', '4', '5', 'adulti'], items: [
      ["⚡", "Pikachu è il Pokémon più famoso: è di tipo Elettro"], ["🟡", "Pikachu si evolve in Raichu con una Pietratuono"], ["🔥", "Charmander ha una fiammella sulla coda"], ["🐢", "Squirtle è una tartarughina che spara acqua"],
      ["🌱", "Bulbasaur ha un bulbo sulla schiena"], ["🦊", "Eevee può evolversi in tanti Pokémon diversi"], ["😴", "Snorlax dorme quasi sempre ed è un grande mangione"], ["🐟", "Magikarp è debole, ma si evolve nel potente Gyarados"],
      ["🦆", "Psyduck ha sempre mal di testa"], ["🎤", "Jigglypuff canta e fa addormentare chi ascolta"], ["👻", "Gengar è un Pokémon fantasma"], ["🧬", "Mewtwo è stato creato dagli scienziati partendo da Mew"],
      ["🟣", "Ditto può trasformarsi in qualsiasi altro Pokémon"], ["🐱", "Meowth, della Team Rocket, è un gatto che sa parlare"], ["⚽", "La Poké Ball serve a catturare i Pokémon"], ["📱", "Il Pokédex è l'enciclopedia dei Pokémon"],
      ["🏅", "Nelle palestre si sfidano i capipalestra per ottenere le medaglie"], ["8️⃣", "Per partecipare alla Lega Pokémon servono otto medaglie"], ["👦", "Ash Ketchum è l'allenatore che gira il mondo con Pikachu"], ["🌊", "Misty è un'allenatrice di Pokémon Acqua"],
      ["🪨", "Brock è un allenatore di Pokémon Roccia"], ["🚀", "Jessie, James e Meowth sono la Team Rocket"], ["🔥", "Fuoco, Acqua ed Erba sono tre dei tipi di Pokémon"], ["🎨", "I tipi di Pokémon sono diciotto"],
      ["🗺️", "Kanto è la prima regione dei giochi Pokémon"], ["🇯🇵", "Pokémon è stato inventato in Giappone da Satoshi Tajiri nel 1996"], ["❄️", "Articuno, Zapdos e Moltres sono tre Pokémon leggendari"], ["💪", "Più un Pokémon combatte, più sale di livello"],
      ["🦋", "Un Pokémon può evolversi e cambiare forma"], ["🎮", "Pokémon Rosso e Blu sono tra i primi giochi della serie"], ["📺", "La serie animata dei Pokémon va in onda dal 1997"], ["🃏", "Le carte Pokémon si collezionano e si scambiano"],
      ["📱", "Pokémon GO si gioca camminando all'aperto"], ["🌍", "Esistono più di mille Pokémon diversi"], ["🤝", "I Pokémon e gli allenatori diventano amici e si aiutano"], ["🍃", "Pikachu accumula elettricità nelle guance rosse"] ] }
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
    'puglia': { name: "Puglia e dintorni", icon: '🫒', levels: ['3', '4', '5', 'adulti'], items: [
      ["🏠", "Ad Alberobello ci sono i trulli, patrimonio UNESCO"], ["🏰", "Castel del Monte fu voluto da Federico II"], ["⛪", "Lecce è chiamata la «Firenze del Sud»"], ["🤍", "Ostuni è la «città bianca»"],
      ["🎤", "Domenico Modugno era di Polignano a Mare"], ["🌊", "Polignano a Mare è famosa per le scogliere e le grotte"], ["🍞", "Bari è la città di San Nicola e della focaccia"], ["🌅", "Il Gargano è lo sperone dello stivale"],
      ["💃", "La pizzica è la danza del Salento"], ["🌳", "In Puglia ci sono milioni di ulivi"], ["🍷", "Il Primitivo è un vino di Manduria"], ["🥣", "Le orecchiette con le cime di rapa sono il piatto simbolo pugliese"],
      ["🌉", "Taranto è chiamata la «città dei due mari»"], ["🏞️", "Ginosa è conosciuta per le sue gravine"], ["🎬", "Rodolfo Valentino nacque a Castellaneta"], ["🏖️", "Il Salento ha spiagge bianche e mare cristallino"],
      ["🕳️", "Le grotte di Castellana sono tra le più belle d'Italia"], ["🏛️", "Matera, vicina alla Puglia, è famosa per i Sassi"], ["🧀", "La burrata è nata nelle campagne di Andria"] ] }
  };

  // ---------- personaggi e film: Totò, Alberto Sordi, Ritorno al futuro ----------
  const PERSONAGGI = {
    'toto': { name: "Tutto Totò", icon: '🎩', levels: ['adulti'], items: [
      ["🎩", "Totò, cioè Antonio de Curtis, nacque a Napoli, nel rione Sanità, nel 1898"], ["👑", "Lo chiamavano «il principe della risata»"], ["📜", "Aveva un lunghissimo nome da principe, pieno di titoli nobiliari"], ["🧒", "Alla nascita il suo cognome era Clemente"],
      ["🎬", "Girò quasi cento film"], ["🎭", "Cominciò in teatro, con la rivista e l'avanspettacolo"], ["🤸", "Si muoveva come una marionetta: bastavano il corpo e la faccia per far ridere"], ["🎩", "Bombetta, giacca stretta e pantaloni corti: il costume di tanti suoi personaggi"],
      ["🎖️", "«Siamo uomini o caporali?» è il titolo di un suo film del 1955"], ["😏", "«Ma mi faccia il piacere!» è una delle sue battute più famose"], ["🙄", "«Quisquilie, pinzillacchere!»: così liquidava le cose da poco"], ["🗣️", "«A prescindere» è un modo di dire che Totò ha reso famoso"],
      ["🔢", "«È la somma che fa il totale»: una sua celebre battuta"], ["✉️", "Nella lettera alla «malafemmina» detta: «Signorina, veniamo noi con questa mia addirvi...»"], ["🧥", "A Milano, nel Duomo, chiede al vigile: «Noio volevàn savuàr...»"], ["🎞️", "«Totò, Peppino e la malafemmina» è del 1956"],
      ["🤝", "Con Peppino De Filippo formò una delle coppie comiche più amate del cinema italiano"], ["🎵", "Scrisse anche canzoni: «Malafemmina» è del 1951"], ["✒️", "Scrisse poesie in napoletano: la più famosa è «'A livella»"], ["⚖️", "«'A livella» racconta che davanti alla morte siamo tutti uguali"],
      ["🍝", "In «Miseria e nobiltà» (1954) mangia gli spaghetti con le mani e se li mette perfino in tasca"], ["💃", "Sophia Loren recitò con lui in «Miseria e nobiltà»"], ["🎨", "«Totò a colori» (1952) fu il primo film italiano girato a colori"], ["🚴", "In «Totò al Giro d'Italia» (1948) compaiono i campioni Coppi e Bartali"],
      ["🏠", "«Totò cerca casa» (1949) racconta quanto era difficile trovare un alloggio"], ["👮", "«Guardie e ladri» (1951) lo vede in coppia con Aldo Fabrizi"], ["💶", "In «La banda degli onesti» (1956) un portiere e i suoi amici stampano banconote false"], ["🌴", "«Totò sceicco» e «Totò Tarzan» sono film del 1950: due parodie"],
      ["🏛️", "«Totò e Cleopatra» (1963) è una parodia ambientata tra Egitto e antica Roma"], ["🌆", "«Totò, Peppino e... la dolce vita» (1961) fa il verso al film di Fellini"], ["🐦", "Pasolini lo diresse in «Uccellacci e uccellini» (1966), dove Totò parla con un corvo"], ["🌋", "Recitò anche ne «L'oro di Napoli» (1954), di Vittorio De Sica"],
      ["🙈", "Negli ultimi anni perse quasi del tutto la vista, ma continuò a lavorare"], ["🕊️", "Morì a Roma nel 1967: ai suoi funerali, a Napoli, c'era una folla enorme"], ["⛪", "È sepolto a Napoli, nel cimitero del Pianto"], ["🏅", "È ricordato come uno dei più grandi attori comici italiani di sempre"] ] },

    'alberto-sordi': { name: "Tutto Alberto Sordi", icon: '🎬', levels: ['adulti'], items: [
      ["🎬", "Alberto Sordi nacque a Roma, a Trastevere, nel 1920"], ["🏛️", "Il pubblico lo chiamava affettuosamente «Albertone»"], ["🎙️", "Da giovane fu la voce italiana di Oliver Hardy, cioè «Ollio» di Stanlio e Ollio"], ["📻", "Alla radio inventò personaggi come «il compagnuccio della parrocchietta»"],
      ["🎭", "Esordì in teatro e nel varietà, prima del cinema"], ["🇺🇸", "In «Un americano a Roma» (1954) Nando Moriconi sogna di essere americano"], ["🍝", "Nando davanti ai maccheroni: «Maccarone, m'hai provocato e io ti distruggo, io me te magno!»"], ["🤌", "In «I vitelloni» (1953) di Fellini fa il gesto dell'ombrello e grida «Lavoratori della tomba!»"],
      ["🦸", "In «Lo sceicco bianco» (1952), di Federico Fellini, è l'eroe dei fotoromanzi"], ["🚔", "In «Il vigile» (1960) è un vigile urbano"], ["🩺", "In «Il medico della mutua» (1968) è il dottor Guido Tersilli"], ["🛻", "In «Una vita difficile» (1961), di Dino Risi, si racconta l'Italia dal dopoguerra al boom"],
      ["🚗", "«Il boom» (1963) è un film diretto da Vittorio De Sica"], ["⚔️", "In «La grande guerra» (1959), di Monicelli, recita con Vittorio Gassman"], ["🦁", "«La grande guerra» vinse il Leone d'oro alla Mostra di Venezia"], ["🏠", "In «Tutti a casa» (1960) è un sottotenente dopo l'8 settembre 1943"],
      ["👑", "Nel «Marchese del Grillo» (1981) è un nobile romano dell'Ottocento che fa scherzi a tutti"], ["🗣️", "Nel «Marchese del Grillo» dice: «Io so' io, e voi non siete un...»"], ["😢", "In «Un borghese piccolo piccolo» (1977) ha una parte drammatica"], ["🚕", "Ne «Il tassinaro» (1983) è un tassista romano: tra i passeggeri compaiono Fellini e Andreotti"],
      ["🔫", "In «Finché c'è guerra c'è speranza» (1974) è un venditore di armi"], ["⚖️", "In «Detenuto in attesa di giudizio» (1971) è un uomo finito nei guai della burocrazia"], ["🧳", "In «Mafioso» (1962) è un siciliano che vive a Milano e torna al paese per le vacanze"], ["🎞️", "«Il vedovo» (1959) lo vede recitare con Franca Valeri"],
      ["👨‍👦", "Con Carlo Verdone girò «In viaggio con papà» (1982)"], ["🎥", "Il suo primo film da regista è «Fumo di Londra» (1966)"], ["🌎", "Come regista girò anche «Un italiano in America» (1967)"], ["🖋️", "Fu anche sceneggiatore, oltre che attore e regista"],
      ["🤝", "Lavorò con Fellini, Monicelli, Risi, De Sica e Comencini"], ["🇮🇹", "Per decenni ha raccontato con ironia i pregi e i difetti degli italiani"], ["🏅", "Nel 1995 ricevette il Leone d'oro alla carriera alla Mostra di Venezia"], ["🎂", "Per i suoi 80 anni fu nominato sindaco di Roma per un giorno"],
      ["🏰", "A Roma c'è la Galleria Alberto Sordi, in piazza Colonna"], ["🏡", "La sua casa romana, Villa Sordi, è diventata un museo"], ["🕯️", "Morì a Roma nel 2003: ai funerali c'era una folla immensa"] ] },

    'ritorno-al-futuro': { name: "Tutto Ritorno al futuro", icon: '⚡', levels: ['5', 'adulti'], items: [
      ["🎬", "«Ritorno al futuro» (in inglese «Back to the Future») è del 1985 ed è diretto da Robert Zemeckis"], ["🖋️", "Zemeckis scrisse il film insieme a Bob Gale"], ["🎞️", "Il produttore esecutivo era Steven Spielberg"], ["🧑‍🎤", "Marty McFly, il protagonista, ha 17 anni ed è interpretato da Michael J. Fox"],
      ["🧪", "Il dottor Emmett Brown, detto Doc, è lo scienziato un po' pazzo che inventa la macchina del tempo"], ["🚗", "La macchina del tempo è una DeLorean DMC-12"], ["🏭", "La vera DeLorean fu costruita in Irlanda del Nord"], ["🚪", "La DeLorean ha le portiere che si aprono verso l'alto, come ali di gabbiano"],
      ["⚡", "Per viaggiare nel tempo la DeLorean deve raggiungere le 88 miglia all'ora, circa 142 chilometri orari"], ["🔋", "Per il salto nel tempo servono 1,21 gigawatt di energia"], ["🔧", "Il «condensatore di flusso» è il cuore della macchina del tempo"], ["☢️", "Nel primo film la DeLorean funziona con il plutonio"],
      ["🧊", "Nelle prime idee la macchina del tempo doveva essere un frigorifero"], ["🐶", "Einstein, il cane di Doc, è il primo viaggiatore nel tempo: va avanti di un minuto"], ["🏙️", "La città di Marty si chiama Hill Valley"], ["⏰", "Il fulmine colpisce la torre dell'orologio sabato 12 novembre 1955 alle 22:04"],
      ["🌲", "Nel 1955 Marty investe un pino: il centro commerciale «Twin Pines» diventerà «Lone Pine»"], ["⏪", "Marty torna nel 1955, trent'anni prima"], ["👩", "Nel 1955 Lorraine, la mamma di Marty, si innamora di lui"], ["🧑‍💼", "George McFly, il papà di Marty, da giovane è timido"],
      ["💪", "Biff Tannen è il bullo di Hill Valley"], ["🥊", "George dà un pugno a Biff e conquista Lorraine"], ["🚛", "Biff finisce in un carro di letame"], ["🏫", "Il preside della scuola di Marty si chiama Strickland"],
      ["🎸", "Al ballo della scuola Marty suona «Johnny B. Goode»"], ["🌊", "Il ballo della scuola si chiama «Enchantment Under the Sea», cioè «incanto sotto il mare»"], ["🎵", "«The Power of Love», di Huey Lewis and the News, è nella colonna sonora"], ["🎹", "La musica del film è di Alan Silvestri"],
      ["🛹", "Marty usa lo skateboard per scappare dai guai"], ["😮", "«Grande Giove!» è l'esclamazione preferita di Doc"], ["🩲", "Lorraine chiama Marty «Calvin Klein» perché legge il nome sulla sua biancheria"], ["📸", "La foto di famiglia di Marty sbiadisce quando il passato cambia"],
      ["🏠", "La casa di Doc nel 1955 è la Gamble House, a Pasadena"], ["⭐", "Eric Stoltz doveva essere Marty, ma fu sostituito da Michael J. Fox"], ["📺", "Michael J. Fox girava anche la serie «Casa Keaton»"], ["🏆", "Il film vinse un Oscar per gli effetti sonori"],
      ["🔄", "«Ritorno al futuro – Parte II» è del 1989"], ["📅", "Nella Parte II Marty va nel futuro, al 21 ottobre 2015"], ["🛸", "Nella Parte II compare l'hoverboard, lo skateboard che vola"], ["👟", "Le scarpe del 2015 si allacciano da sole"],
      ["🦈", "Al cinema del 2015 danno «Lo squalo 19»"], ["♻️", "Mr. Fusion trasforma i rifiuti in energia per la DeLorean"], ["📖", "Nella Parte II Biff usa un almanacco sportivo per vincere le scommesse"], ["🗓️", "Il 21 ottobre è il «Back to the Future Day»"],
      ["🤠", "La Parte III (1990) è ambientata nel Far West, nel 1885"], ["👩‍🏫", "Nel Far West Doc conosce la maestra Clara Clayton"], ["🐴", "Buford «Cane Pazzo» Tannen è il bisnonno di Biff"], ["🚂", "Alla fine Doc costruisce una locomotiva che viaggia nel tempo"],
      ["👦", "Doc e Clara hanno due figli, Jules e Verne"], ["📝", "Il messaggio finale di Doc: il futuro non è ancora scritto, ce lo costruiamo noi"], ["🎢", "Alla Universal Studios c'era un'attrazione dedicata a «Ritorno al futuro»"] ] },

    'chuck-norris': { name: "Chuck Norris (fatti veri e barzellette del web)", icon: '🥋', levels: ['5', 'adulti'], items: [
      ["🥋", "Chuck Norris, all'anagrafe Carlos Ray Norris, nacque nel 1940 a Ryan, in Oklahoma"], ["✈️", "Fece il militare nell'aeronautica americana, in Corea, e lì cominciò con le arti marziali"], ["🏆", "Fu campione del mondo di karate per diversi anni di fila"], ["🥇", "Ha fondato uno stile tutto suo di arti marziali: il Chun Kuk Do"],
      ["🐉", "Nel film di Bruce Lee «L'urlo di Chen terrorizza anche l'Occidente» (1972) combatte contro di lui nel Colosseo"], ["🏛️", "Il duello nel Colosseo contro Bruce Lee è una delle scene di combattimento più famose del cinema"], ["🎬", "«Missing in Action» (1984) e «Delta Force» (1986) sono due suoi film d'azione"], ["🤠", "Fu il protagonista della serie «Walker Texas Ranger», trasmessa dal 1993 al 2001"],
      ["💥", "Nel 2012 comparve ne «I mercenari 2»"], ["🧒", "Ha creato Kickstart Kids, che insegna arti marziali e valori ai ragazzi"], ["🌐", "I «Chuck Norris Facts», le battute su di lui, diventarono famosi su internet nel 2005"], ["😂", "Barzelletta del web: «Chuck Norris ha contato fino all'infinito. Due volte»"],
      ["💪", "Barzelletta del web: «Chuck Norris non fa le flessioni: spinge giù la Terra»"], ["😴", "Barzelletta del web: «Chuck Norris non dorme: aspetta»"], ["⌚", "Barzelletta del web: «Chuck Norris non porta l'orologio: decide lui che ore sono»"], ["➗", "Barzelletta del web: «Chuck Norris sa dividere per zero»"],
      ["🚪", "Barzelletta del web: «Chuck Norris riesce a sbattere una porta girevole»"], ["🟡", "Barzelletta del web: «Chuck Norris vince a Forza 4 in tre mosse»"], ["🔢", "Barzelletta del web: «Chuck Norris conosce l'ultima cifra del pi greco»"], ["🔍", "Barzelletta del web: «Chuck Norris non cerca su Google: è Google che chiede a lui»"],
      ["👏", "Barzelletta del web: «Chuck Norris sente il suono di una mano sola che applaude»"], ["🦸", "Chuck Norris è diventato un mito di internet, quasi un supereroe da barzelletta"], ["🥷", "Ha ricevuto la cintura nera in diverse arti marziali, anche nel jiu-jitsu brasiliano"], ["🏋️", "Ha fatto per anni la pubblicità di un attrezzo per la ginnastica in casa, il Total Gym"] ] },

    'simpson': { name: "I Simpson", icon: '🍩', levels: ['5', 'adulti'], items: [
      ["🍩", "I Simpson sono stati creati da Matt Groening"], ["📺", "I Simpson cominciarono nel 1987 come brevi cartoni nello show di Tracey Ullman"], ["🗓️", "La serie vera e propria partì nel 1989 ed è una delle più lunghe della televisione"], ["🏘️", "La famiglia abita a Springfield, al numero 742 di Evergreen Terrace"],
      ["👨", "Homer è il papà: lavora alla centrale nucleare, nel settore 7G"], ["🍩", "Homer ama le ciambelle e la birra Duff"], ["😖", "«D'oh!» è l'esclamazione di Homer quando le cose vanno male"], ["👩", "Marge è la mamma, con i capelli blu alti alti"],
      ["🛹", "Bart è il figlio di dieci anni: monello, con lo skateboard e la fionda"], ["📝", "A inizio puntata Bart scrive una frase sulla lavagna come punizione"], ["🗣️", "«Ciucciati il calzino!» è una battuta di Bart"], ["🎷", "Lisa, la sorella intelligente, suona il sassofono"],
      ["🌱", "Lisa è vegetariana"], ["👶", "Maggie è la più piccola e ha sempre il ciuccio"], ["🐶", "Il cane di famiglia si chiama Piccolo Aiutante di Babbo Natale"], ["🐱", "Il gatto di famiglia si chiama Palla di Neve"],
      ["👴", "Nonno Abe Simpson vive in una casa di riposo"], ["🍺", "Moe è il proprietario della taverna dove va Homer"], ["🤡", "Krusty il Clown è il presentatore del programma preferito di Bart"], ["🐭", "In tv Bart e Lisa guardano «Grattachecca e Fichetto»"],
      ["💰", "Il signor Burns è il padrone ricchissimo della centrale nucleare"], ["😈", "«Eccellente...» dice il signor Burns, unendo le dita delle mani"], ["🧑‍💼", "Smithers è l'assistente fedele del signor Burns"], ["🙋", "Ned Flanders è il vicino gentilissimo di casa Simpson"],
      ["👋", "«Salve salvino!» è il saluto di Ned Flanders"], ["🍩", "Il capo Wiggum è il poliziotto di Springfield"], ["🏫", "Il preside della scuola si chiama Skinner"], ["📚", "Milhouse è il migliore amico di Bart"],
      ["📖", "Il negoziante di fumetti è sempre scorbutico"], ["🧬", "I personaggi hanno la pelle gialla e quattro dita per mano"], ["👨‍👩‍👧‍👦", "I nomi di famiglia vengono dalla famiglia di Matt Groening: Homer, Marge, Lisa e Maggie"], ["🔤", "Il nome Bart è l'anagramma di «brat», che in inglese vuol dire monello"],
      ["🎞️", "«I Simpson – Il film» uscì nel 2007"], ["🏆", "La serie ha vinto moltissimi premi Emmy"], ["🌴", "Matt Groening ha creato anche il cartone «Futurama»"], ["📺", "I Simpson sono la serie animata americana più longeva"] ] }
  };

  // ---------- frasi in più, così ogni tema copre tutti i 90 numeri ----------
  const EXTRA = {
    'toto': [
      ["📅", "Totò nacque il 15 febbraio 1898"], ["🕯️", "Totò morì il 15 aprile 1967"], ["🏠", "Nacque in via Santa Maria Antesaecula, nel rione Sanità di Napoli"], ["🎪", "Debuttò da ragazzo nei piccoli teatri di Napoli"],
      ["🎞️", "Il suo primo film fu «Fermo con le mani!», del 1937"], ["👦", "«I due orfanelli» (1947), con Carlo Campanini, fu uno dei suoi primi grandi successi"], ["🐂", "«Fifa e arena» (1948) fa il verso al mondo della corrida"], ["🚒", "«I pompieri di Viggiù» è un suo film del 1949"],
      ["🏝️", "«L'imperatore di Capri» (1949) è diretto da Luigi Comencini"], ["🕌", "«Totò le Mokò» (1949) è una parodia di film d'avventura"], ["💍", "«Totò cerca moglie» è un film del 1950"], ["🤝", "Totò e Alberto Sordi recitarono insieme in «Totò e i re di Roma»"],
      ["🕵️", "«Totò terzo uomo» (1951) è la parodia di un famoso film con la zither"], ["👩", "«Totò e le donne» è un film del 1952"], ["🎭", "Ne «Il turco napoletano» (1953) Totò è un buffo finto turco"], ["🗽", "Roberto Rossellini lo diresse in «Dov'è la libertà?» (1954)"],
      ["✂️", "«Totò e Carolina» (1955) ebbe grossi guai con la censura"], ["❓", "«Totò lascia o raddoppia?» (1956) fa il verso al celebre quiz televisivo"], ["👶", "In «Totò e Marcellino» (1958) recita con il piccolo Pablito Calvo"], ["🩺", "«Totò, Vittorio e la dottoressa» (1957) lo vede con Vittorio De Sica"],
      ["🔐", "Ne «I soliti ignoti» (1958) ha una piccola parte nel ruolo di Dante Cruciani"], ["📜", "«La mandragola» (1965), di Alberto Lattuada, è tratta da una commedia di Machiavelli"], ["⏱️", "«Il giorno più corto» (1962) è diretto da Sergio Corbucci"], ["🎩", "In «Totò diabolicus» (1962) interpreta ben sei personaggi diversi"],
      ["💸", "«Totò truffa '62» è un film del 1961"], ["🗳️", "«Gli onorevoli» (1963) prende in giro il mondo della politica"], ["👥", "«Totò contro i quattro» (1963) è un film diretto da Steno"], ["🍼", "«Che fine ha fatto Totò baby?» (1964) è uno dei suoi film più strani"],
      ["🏜️", "«Totò d'Arabia» è un film del 1965"], ["🗝️", "In «Operazione San Gennaro» (1966) una banda vuole rubare il tesoro del santo di Napoli"], ["💪", "«Totò contro Maciste» (1962) è una parodia dei film con i supereroi dell'antica Roma"], ["🧱", "«Totò e Peppino divisi a Berlino» è un film del 1962"],
      ["🌙", "Con Pasolini girò anche «La terra vista dalla luna» (1967), insieme a Ninetto Davoli"], ["👬", "In «Totò, Peppino e la malafemmina» i due sono i fratelli Caponi"], ["🏙️", "Nella «malafemmina» i due vanno a Milano per fermare il nipote che si vuole sposare"], ["📖", "Nella lettera famosa Totò detta anche un finto latino: «Abundandis in abundandum»"],
      ["🪖", "Per Totò i «caporali» sono i prepotenti che si credono superiori agli altri"], ["🥈", "Per «Guardie e ladri» ricevette il Nastro d'argento come miglior attore"], ["⛪", "Dopo la morte ci furono due funerali: uno a Roma e uno a Napoli"], ["❤️", "Era conosciuto per la sua generosità verso i più poveri di Napoli"],
      ["🐕", "Amava gli animali, soprattutto i cani"], ["🎭", "A teatro recitò con Anna Magnani nella rivista «Volumineide» (1942)"], ["🔢", "Nella smorfia il 47 è «il morto» e il 48 «il morto che parla»: da qui il titolo «47 morto che parla»"], ["👨‍👦", "Peppino De Filippo era il fratello di Eduardo e Titina De Filippo"],
      ["👴", "In «Totò, Fabrizi e i giovani d'oggi» (1960) i due padri litigano per i figli"], ["🌜", "«Totò nella luna» è un film del 1958"], ["💃", "«Totò, Peppino e le fanatiche» è un film del 1958"], ["🤠", "«Totò, Peppino e... i fuorilegge» è del 1956"],
      ["🏥", "«Il medico dei pazzi» (1954) è tratto da una commedia di Eduardo Scarpetta"], ["🎭", "«Miseria e nobiltà» è tratto da una commedia di Eduardo Scarpetta"], ["🍴", "In «Miseria e nobiltà» Totò interpreta Felice Sciosciammocca, la maschera creata da Scarpetta"], ["💼", "In «La banda degli onesti» il portiere si chiama Antonio Bonocore"],
      ["🎬", "In «La banda degli onesti» recita con Peppino De Filippo e Giacomo Furia"], ["⚰️", "In «'A livella» il protagonista è un marchese e l'altro è uno spazzino"] ],
    'alberto-sordi': [
      ["📅", "Alberto Sordi nacque il 15 giugno 1920"], ["🕯️", "Alberto Sordi morì il 24 febbraio 2003"], ["🎙️", "Vinse un concorso per doppiare Oliver Hardy, cioè Ollio"], ["🎬", "Da ragazzo fece la comparsa in «Scipione l'Africano» (1937)"],
      ["📻", "Diventò famoso con la radio e la rivista"], ["💘", "«Il seduttore» (1954) lo vede recitare con Franca Valeri"], ["♊", "«Il segno di Venere» (1955) è diretto da Dino Risi"],
      ["🕺", "«Lo scapolo» (1955) è diretto da Antonio Pietrangeli"], ["🧐", "In «Il moralista» (1959) recita con Vittorio De Sica"], ["🎩", "«Il conte Max» (1957) è un film con Vittorio De Sica"], ["⚖️", "«Il giudizio universale» (1961) è un film di Vittorio De Sica"],
      ["😈", "In «Il diavolo» (1963) gira con Gian Luigi Polidoro"], ["🌙", "«La più bella serata della mia vita» (1972) è diretto da Ettore Scola"], ["📸", "«Il comune senso del pudore» (1976) è diretto da lui stesso"], ["🎭", "Nel «Marchese del Grillo» fa anche il carbonaro Gasperino: due ruoli in un film"],
      ["📖", "«Un borghese piccolo piccolo» è tratto da un romanzo di Vincenzo Cerami"], ["🚔", "In «Il vigile» il protagonista si chiama Otello Celletti"], ["⚔️", "In «La grande guerra» interpreta Oreste Jacovacci, mentre Vittorio Gassman è Giovanni Busacca"], ["🎖️", "In «Tutti a casa» il sottotenente si chiama Alberto Innocenzi"],
      ["📚", "«Il medico della mutua» è tratto da un romanzo di Giuseppe D'Agata"], ["🚶", "In «Una vita difficile» il protagonista si chiama Silvio Magnozzi"], ["🎥", "«Un americano a Roma» è diretto da Steno"], ["🥈", "«I vitelloni» di Fellini vinse il Leone d'argento a Venezia"],
      ["🐴", "«Nestore l'ultima corsa» (1994) racconta la storia di un vecchio vetturino e del suo cavallo"], ["🎞️", "«Incontri proibiti» (1998) è un film diretto da lui"], ["🔫", "In «Finché c'è guerra c'è speranza» il protagonista si chiama Pietro Chiocca"], ["🧑", "Non si è mai sposato"],
      ["🗣️", "Parlava romanesco e lo ha reso famoso in tutta Italia"], ["♈", "«Di che segno sei?» (1975) è un film a episodi con tanti ruoli diversi per lui"], ["✨", "In «Polvere di stelle» (1973) racconta il mondo del varietà, con Monica Vitti"], ["🆘", "«Amore mio aiutami» (1969) lo vede recitare con Monica Vitti"],
      ["🤖", "In «Io e Caterina» (1980) la domestica Caterina è un robot"], ["🇬🇧", "In «I due nemici» (1961) recita con David Niven"], ["✊", "«Contestazione generale» (1970) è un film di Luigi Zampa"], ["🩺", "«Il medico e lo stregone» (1957) è diretto da Mario Monicelli"],
      ["🎪", "«Fortunella» (1958) lo vede recitare con Giulietta Masina"], ["🎖️", "«Un eroe dei nostri tempi» (1955) è un film di Mario Monicelli"], ["🏖️", "«Le vacanze intelligenti» (1978) è un episodio del film «Dove vai in vacanza?»"], ["🤝", "Recitò con Totò in «Totò e i re di Roma»"],
      ["🏅", "Vinse moltissimi premi David di Donatello"], ["🏛️", "Il «Marchese del Grillo» è ambientato nella Roma papale del 1809"], ["🚶‍♂️", "In «Tutti a casa» il sottotenente attraversa l'Italia per tornare a casa"], ["🎬", "«Tutti a casa» è diretto da Luigi Comencini"],
      ["🎥", "«Una vita difficile» ha tra i protagonisti Lea Massari"], ["🩺", "«Il medico della mutua» è diretto da Luigi Zampa"], ["🎥", "«Mafioso» (1962) è diretto da Alberto Lattuada"], ["⚖️", "«Detenuto in attesa di giudizio» è diretto da Nanni Loy"],
      ["🎥", "«Un borghese piccolo piccolo» è diretto da Mario Monicelli"], ["🎬", "«Il tassinaro» è diretto da lui stesso"], ["🎥", "«Il marchese del Grillo» è diretto da Mario Monicelli"], ["🇺🇸", "In «Un americano a Roma» Nando parla uno strano inglese maccheronico"],
      ["🚓", "«Il vigile» è diretto da Luigi Zampa"], ["✍️", "«Il boom» è scritto con Cesare Zavattini"], ["🎞️", "«Amore mio aiutami» lo ha diretto lui stesso"], ["🍝", "Il piatto di maccheroni di Nando è una delle scene più citate del cinema italiano"] ],
    'ritorno-al-futuro': [
      ["🚽", "Doc ha l'idea del condensatore di flusso dopo una caduta mentre appende un orologio"], ["🔢", "Il pannello dei circuiti del tempo ha tre righe: tempo di destinazione, tempo presente e ultima partenza"], ["🚘", "La targa della DeLorean è «OUTATIME»"], ["🐕", "Nel 1955 il cane di Doc si chiama Copernico"],
      ["👨‍👩‍👦", "Marty ha un fratello, Dave, e una sorella, Linda"], ["👧", "La ragazza di Marty si chiama Jennifer Parker"], ["🏙️", "Nel 1955 Doc ha un plastico di Hill Valley per preparare l'esperimento"], ["🔌", "Per far arrivare il fulmine alla DeLorean, Marty e Doc stendono un lungo cavo dalla torre dell'orologio"],
      ["☕", "Nel 1955 Marty entra nel Caffè di Lou"], ["🧑‍🔧", "Nel 1955 Marty incontra Goldie Wilson e gli dice che diventerà sindaco"], ["✉️", "Nel 1955 Doc strappa la lettera di Marty, ma poi la rimette insieme"], ["🔫", "Nel 1985 Doc viene aggredito da alcuni terroristi, ma indossava un giubbotto antiproiettile"],
      ["🎸", "La band di Marty si chiama The Pinheads"], ["📖", "Alla fine del film George è diventato uno scrittore di fantascienza"], ["🚿", "Alla fine del film Biff lucida la macchina di George"], ["🛻", "Alla fine Marty trova davanti a casa il fuoristrada che sognava"],
      ["🚀", "Alla fine del primo film Doc torna dal futuro e dice a Marty che i suoi figli hanno un problema"], ["🛣️", "La frase finale di Doc è: dove andiamo non servono strade"], ["🎼", "Marvin Berry telefona al cugino Chuck Berry mentre Marty suona «Johnny B. Goode»"], ["🔥", "Dopo l'assolo Marty dice che forse il pubblico non è ancora pronto, ma i suoi figli lo adoreranno"],
      ["🕐", "Dopo il fulmine del 1955 la torre dell'orologio resta ferma"], ["🪧", "All'inizio del film una signora distribuisce volantini per salvare la torre dell'orologio"], ["🎶", "«Back in Time» di Huey Lewis and the News è un'altra canzone del film"], ["🧒", "Nel 2015 Marty incontra i suoi figli: Marty Jr. e Marlene"],
      ["🥊", "Nel 2015 Griff Tannen, il nipote di Biff, guida una banda di bulli"], ["🚁", "Nel 2015 le auto volano"], ["🐕", "Nel 2015 un drone porta a spasso un cane"], ["👔", "Nel 2015 la giacca di Marty si adatta alla sua misura e si asciuga da sola"],
      ["⚾", "Nel film i Cubs vincono le World Series del 2015: in realtà le vinsero nel 2016"], ["🏚️", "Nella Parte II, in un 1985 cambiato da Biff, Hill Valley è una città cupa e piena di guai"], ["🥧", "Nel 1885 Marty usa un piatto di alluminio come scudo"], ["🤠", "Nel 1885 Marty si fa chiamare Clint Eastwood"],
      ["🪦", "Nel 1885 Doc scopre una lapide con la data del 7 settembre 1885"], ["🚂", "Alla fine della Parte III la locomotiva vola nel cielo"], ["🕳️", "Nel 1955 Doc nasconde la DeLorean in una grotta, per farla ritrovare nel 1885"], ["🎭", "La storia è diventata anche un musical teatrale"],
      ["🏥", "Michael J. Fox ha creato una fondazione per la ricerca sul Parkinson"], ["🧑‍🔬", "Doc Brown è interpretato da Christopher Lloyd"], ["👩", "Lorraine è interpretata da Lea Thompson"], ["🧑‍💼", "George McFly è interpretato da Crispin Glover"],
      ["💪", "Biff Tannen è interpretato da Thomas F. Wilson"], ["👧", "Nel primo film Jennifer è interpretata da Claudia Wells"], ["📺", "Esiste anche una serie a cartoni animati su «Ritorno al futuro»"] ],
    'chuck-norris': [
      ["📅", "Chuck Norris è nato il 10 marzo 1940"], ["🧬", "Ha origini irlandesi e native americane"], ["🙈", "Da bambino era molto timido"], ["🌴", "Crescendo si trasferì in California, a Torrance"],
      ["🥋", "Tornato dalla Corea aprì delle scuole di karate"], ["🎬", "Tra i suoi allievi c'era l'attore Steve McQueen"], ["🐉", "Fu Bruce Lee a volerlo nel film «L'urlo di Chen terrorizza anche l'Occidente»"], ["🧥", "«Good Guys Wear Black» (1978) è uno dei suoi primi film d'azione"],
      ["🐺", "In «Lone Wolf McQuade» (1983) recita con David Carradine"], ["🤐", "«Code of Silence» (1985) è un suo film poliziesco"], ["🇺🇸", "«Invasion U.S.A.» è un suo film del 1985"], ["🪖", "In «Missing in Action» è il colonnello James Braddock"],
      ["🎞️", "«Missing in Action» ha avuto due seguiti, tra cui «Braddock»"], ["✈️", "«Delta Force 2» è un suo film del 1990"], ["👨‍👦", "Suo fratello Aaron Norris è produttore, regista e stuntman"], ["📺", "In «Walker Texas Ranger» il suo collega si chiama Trivette"],
      ["🤠", "Il suo personaggio in «Walker Texas Ranger» si chiama Cordell Walker"], ["📆", "«Walker Texas Ranger» durò otto stagioni"], ["📘", "Chun Kuk Do significa «la via universale»"], ["📜", "Il Chun Kuk Do ha un suo codice di comportamento"],
      ["🥇", "Nel 1968 vinse il titolo mondiale di karate dei pesi medi"], ["🏅", "Tenne il titolo mondiale per sei anni"], ["🎂", "Nel 2020 ha compiuto 80 anni"], ["👦", "In «Sidekicks» (1992) recita insieme a un ragazzo appassionato di karate"],
      ["🦵", "Il calcio rotante è la sua mossa più famosa"], ["🏐", "Ha fatto un cameo nel film «Palle al balzo»"], ["📕", "Ha scritto un libro che si intitola «The Secret Power Within»"], ["📚", "La sua autobiografia si intitola «Against All Odds»"],
      ["🤠", "Vive in Texas"], ["😂", "Barzelletta del web: «Quando Chuck Norris guarda sotto il letto, sono i mostri a nascondersi»"], ["🌊", "Barzelletta del web: «Il Mar Morto era vivo, finché non è arrivato Chuck Norris»"], ["⏰", "Alla Chuck Norris: la sveglia suona solo quando lui è già sveglio"],
      ["🧊", "Alla Chuck Norris: il cubo di Rubik si risolve da solo quando lui lo guarda"], ["📶", "Alla Chuck Norris: il Wi-Fi si collega prima che lui entri nella stanza"], ["🚦", "Alla Chuck Norris: i semafori diventano verdi quando sta per passare"], ["🧭", "Alla Chuck Norris: il navigatore gli chiede dove vuole andare"],
      ["🙈", "Alla Chuck Norris: a nascondino non lo ha mai trovato nessuno"], ["🔐", "Alla Chuck Norris: la sua password è sempre quella giusta al primo tentativo"], ["♨️", "Alla Chuck Norris: l'acqua bolle solo perché lui la guarda"], ["🌬️", "Alla Chuck Norris: il vento non soffia, lo saluta"],
      ["☔", "Alla Chuck Norris: quando esce senza ombrello, la pioggia si ferma"], ["♟️", "Alla Chuck Norris: batte il computer a scacchi giocando a dama"], ["☀️", "Alla Chuck Norris: il Sole sorge perché lui glielo ricorda"], ["⛰️", "Alla Chuck Norris: le montagne si spostano per fargli strada"],
      ["🌙", "Alla Chuck Norris: la Luna cambia fase per non disturbarlo"], ["🕰️", "Alla Chuck Norris: cambia l'ora legale senza chiedere il permesso al governo"], ["🍳", "Alla Chuck Norris: le uova si rompono da sole quando le guarda"], ["📱", "Alla Chuck Norris: il telefono non si scarica mai, ha troppa paura"],
      ["🎯", "Alla Chuck Norris: le frecce lo schivano"], ["📖", "Alla Chuck Norris: legge un'enciclopedia intera in una pagina"], ["🏃", "Alla Chuck Norris: arriva prima ancora di partire"], ["🧮", "Alla Chuck Norris: la calcolatrice gli chiede il risultato"],
      ["🪜", "Alla Chuck Norris: le scale lo portano su da sole"], ["🌳", "Alla Chuck Norris: gli alberi si inchinano quando passa"], ["📺", "Alla Chuck Norris: lui non guarda la tv, è la tv che guarda lui"], ["🚪", "Alla Chuck Norris: le porte si aprono ancora prima che ci arrivi"],
      ["🧊", "Alla Chuck Norris: l'inverno aspetta che sia lui a dare il via"], ["🔔", "Alla Chuck Norris: il campanello suona solo quando ha voglia di aprire"], ["💡", "Alla Chuck Norris: le lampadine si accendono quando lui entra in una stanza"], ["🎲", "Alla Chuck Norris: nei giochi da tavolo tira sempre il numero che serve"],
      ["🕹️", "Alla Chuck Norris: finisce i videogiochi al livello difficile senza perdere una vita"], ["📏", "Alla Chuck Norris: il metro è lungo esattamente quanto lui dice"],
      ["🍕", "Alla Chuck Norris: la pizza arriva a casa prima ancora che la ordini"], ["🎈", "Alla Chuck Norris: i palloncini non scoppiano mai quando c'è lui"], ["🧦", "Alla Chuck Norris: le calze spaiate si ritrovano da sole quando entra in casa"], ["🥷", "Alla Chuck Norris: gli ostacoli si fermano da soli quando lo vedono arrivare"] ],
    'simpson': [
      ["🎄", "La prima puntata, trasmessa il 17 dicembre 1989, era di Natale"], ["📺", "I Simpson vanno in onda sulla rete americana Fox"], ["👨‍👩‍👧‍👦", "La famiglia ha tre figli: Bart, Lisa e Maggie"], ["👨", "Homer si chiama Homer Jay Simpson"],
      ["👩", "Marge da signorina si chiamava Bouvier"], ["👦", "Bart si chiama in realtà Bartholomew, cioè Bartolomeo"], ["👧", "Lisa si chiama Lisa Marie Simpson"], ["👵", "La mamma di Homer si chiama Mona"],
      ["👭", "Patty e Selma sono le sorelle gemelle di Marge"], ["🚗", "Patty e Selma lavorano alla Motorizzazione"], ["😂", "Il dottor Hibbert ha una risata inconfondibile"], ["🍻", "Barney è l'amico di Homer sempre seduto al bancone di Moe"],
      ["🏪", "Apu gestisce il minimarket di Springfield"], ["🏛️", "Il sindaco di Springfield si chiama Quimby"], ["🎬", "Troy McClure è l'attore che si presenta sempre con «Forse mi ricordate da...»"], ["🤡", "Telespalla Bob è il nemico di Bart"],
      ["😏", "Nelson fa sempre «Ah-ah!» quando prende in giro qualcuno"], ["🤓", "Martin Prince è il primo della classe"], ["👦", "Ralph è il figlio del capo Wiggum"], ["🚌", "Otto guida lo scuolabus"],
      ["👩‍🏫", "La signora Krabappel è l'insegnante di Bart"], ["🧹", "Willie è il bidello scozzese della scuola"], ["☸️", "Lisa è buddista"], ["🔫", "«Chi ha sparato al signor Burns?» è una celebre puntata in due parti"],
      ["🛋️", "Nella sigla la famiglia si ritrova sul divano in modi sempre diversi"], ["🛋️", "Il divano dei Simpson è arancione"], ["📞", "Bart fa gli scherzi telefonici a Moe"], ["🚀", "Homer è anche stato un astronauta"],
      ["🧔", "Herb Powell è il fratellastro di Homer"], ["🚙", "Homer ha disegnato una macchina tutta sua, con un risultato disastroso"], ["🗣️", "«Ay, caramba!» è un'altra esclamazione di Bart"], ["🙅", "«Non sono stato io!» è la scusa preferita di Bart"],
      ["🍩", "«Mmm... ciambelle» dice Homer davanti a una ciambella"], ["🎃", "Ogni anno a Halloween c'è un episodio speciale: «La paura fa novanta»"], ["🌟", "Molte star del cinema e della musica sono apparse come ospiti nella serie"], ["🏙️", "Lo stato in cui si trova Springfield non viene mai detto"],
      ["⚔️", "Shelbyville è la città rivale di Springfield"], ["🐟", "Blinky è il pesce a tre occhi che nuota vicino alla centrale nucleare"], ["🧸", "Il signor Burns ha un vecchio orsacchiotto di nome Bobo"], ["🐕", "Il signor Burns sguinzaglia i suoi cani mastini contro chi gli dà fastidio"],
      ["🧠", "Lisa è un genio con un quoziente intellettivo altissimo"], ["🍼", "La prima parola di Maggie è stata «papà»"], ["🗨️", "La prima parola di Lisa è stata «Bart»"], ["👦", "Rod e Todd sono i figli di Ned Flanders"],
      ["⛪", "Il reverendo Lovejoy è il pastore di Springfield"], ["🏫", "La scuola di Bart è la Scuola Elementare di Springfield"], ["🍔", "Krusty Burger è il fast food di Krusty il Clown"], ["📚", "Lisa ama leggere e studiare"],
      ["🏠", "Casa Simpson ha un garage dove Homer parcheggia la macchina"], ["💤", "Homer si addormenta spesso sul divano davanti alla tv"], ["🎷", "Lisa suona il sassofono e il suo musicista preferito è Bleeding Gums Murphy"], ["🧑‍🍳", "Marge cucina per tutta la famiglia"],
      ["🪁", "Bart ha una fionda e uno skateboard"], ["📣", "Il capo Wiggum fa il poliziotto di Springfield"] ]
  };
  Object.keys(EXTRA).forEach(k => { PERSONAGGI[k].items.push(...EXTRA[k]); });

  // ---------- API ----------
  const ALL = Object.assign({}, GEN, LISTE, CARTONI, CARTONI_OGGI, FESTE, GIOCHI, VIDEOGIOCHI, ANIME, MURPHY, PERSONAGGI, SCUOLA_CARTONI, ANIMALI, REGIONI, FEDE, MATEMATICA, ADULTI);
  Object.keys(ALL).forEach(k => { ALL[k].key = k; });

  // ---------- frasi in più per Cinema e TV, Sport e Musica: ogni tema copre i 90 numeri ----------
  const EXTRA2 = {
    'cinema': [
      ["👔", "«Il padrino» (1972) è tratto dal romanzo di Mario Puzo"], ["🎩", "Marlon Brando interpreta Vito Corleone ne «Il padrino»"], ["🎻", "La musica de «Il padrino» è di Nino Rota"], ["🚿", "«Psyco» di Alfred Hitchcock ha la famosa scena della doccia"],
      ["🎬", "Alfred Hitchcock è chiamato il maestro del brivido"], ["🎹", "«Casablanca» (1942) ha per protagonisti Humphrey Bogart e Ingrid Bergman"], ["🌪️", "«Via col vento» (1939) ha per protagonisti Clark Gable e Vivien Leigh"], ["👠", "In «Il mago di Oz» Dorothy ha le scarpette rosse"],
      ["🍎", "«Biancaneve e i sette nani» (1937) è il primo lungometraggio animato Disney"], ["🤠", "«Toy Story» (1995) è il primo lungometraggio interamente in computer grafica"], ["🦁", "In «Il re leone» (1994) il protagonista è Simba"], ["❄️", "«Frozen» ha la canzone «Let It Go»"],
      ["🌍", "«Avatar» (2009) è un film di James Cameron"], ["🚢", "James Cameron ha diretto anche «Titanic»"], ["🦖", "«Jurassic Park» (1993) è un film di Steven Spielberg"], ["💊", "In «Matrix» bisogna scegliere tra la pillola rossa e la pillola blu"],
      ["🥊", "In «Rocky» Sylvester Stallone sale di corsa i gradini del museo di Filadelfia"], ["🤠", "Il protagonista di «Indiana Jones» è Harrison Ford"], ["🚀", "Harrison Ford è anche Han Solo in «Guerre stellari»"], ["🎩", "Charlie Chaplin è il vagabondo Charlot"],
      ["🌐", "«Il grande dittatore» (1940) è un film di Charlie Chaplin"], ["🎭", "Stanlio e Ollio erano una coppia comica del cinema"], ["💃", "Marilyn Monroe recita in «A qualcuno piace caldo»"], ["💎", "Audrey Hepburn è la protagonista di «Colazione da Tiffany»"],
      ["🛵", "«Vacanze romane» (1953) ha per protagonisti Audrey Hepburn e Gregory Peck"], ["🚲", "«Ladri di biciclette» è un film di Vittorio De Sica"], ["🏛️", "«Roma città aperta» è un film di Roberto Rossellini"], ["👑", "«Il Gattopardo» è un film di Luchino Visconti"],
      ["🎪", "«Otto e mezzo» e «Amarcord» sono film di Federico Fellini"], ["⛲", "In «La dolce vita» Anita Ekberg fa il bagno nella Fontana di Trevi"], ["🎼", "Ennio Morricone ha scritto la musica de «Il buono, il brutto, il cattivo»"], ["🏆", "Ennio Morricone ha vinto l'Oscar per la colonna sonora di «The Hateful Eight»"],
      ["🤠", "Bud Spencer e Terence Hill sono i protagonisti di «Lo chiamavano Trinità»"], ["🇮🇹", "Bud Spencer, il cui vero nome era Carlo Pedersoli, nacque a Napoli"], ["🎬", "Il vero nome di Terence Hill è Mario Girotti"], ["📚", "Il commissario Montalbano è tratto dai romanzi di Andrea Camilleri"],
      ["⛪", "In «Don Camillo» l'attore Fernandel è il parroco e Gino Cervi è Peppone"], ["🚗", "«Il sorpasso» (1962) è un film con Vittorio Gassman"], ["🔐", "«I soliti ignoti» (1958) è un film di Mario Monicelli"], ["✉️", "«Il postino» (1994) è il film con Massimo Troisi"],
      ["🎬", "«Ricomincio da tre» (1981) è un film di Massimo Troisi"], ["😂", "«Un sacco bello» (1980) è il primo film di Carlo Verdone"], ["🧑‍💼", "Paolo Villaggio ha creato il ragionier Fantozzi"], ["🍻", "«Amici miei» (1975) è un film di Mario Monicelli"],
      ["🕰️", "«Non ci resta che piangere» è un film di Roberto Benigni e Massimo Troisi"], ["🌹", "Monica Bellucci recita in «Malèna», un film di Giuseppe Tornatore"], ["💃", "Claudia Cardinale recita ne «Il Gattopardo»"], ["🎩", "Toni Servillo è il protagonista de «La grande bellezza»"],
      ["📖", "«Gomorra» è tratto dal libro di Roberto Saviano"], ["🎬", "Leonardo DiCaprio ha vinto l'Oscar per «Revenant»"], ["🏐", "Tom Hanks è il protagonista di «Forrest Gump» e di «Cast Away»"], ["🐭", "Topolino nacque nel 1928 nel cortometraggio «Steamboat Willie»"],
      ["🎞️", "I fratelli Lumière organizzarono le prime proiezioni pubbliche nel 1895, a Parigi"], ["🎙️", "«Il cantante di jazz» (1927) è considerato il primo film sonoro"], ["🏆", "La statuetta dell'Oscar è alta circa 34 centimetri"], ["🥇", "I David di Donatello sono i premi del cinema italiano"],
      ["🌴", "Il Festival di Cannes assegna la Palma d'oro"], ["🐻", "Il Festival di Berlino assegna l'Orso d'oro"], ["🌟", "La Mostra del cinema di Venezia, dal 1932, è la più antica del mondo"], ["🌌", "George Lucas ha creato «Guerre stellari»"],
      ["👽", "«Alien» (1979) è un film di Ridley Scott"], ["🐠", "In «Alla ricerca di Nemo» Nemo è un pesce pagliaccio"], ["🟢", "Shrek è un orco verde"], ["☂️", "In «Mary Poppins» c'è la parola «Supercalifragilistichespiralidoso»"],
      ["📺", "La televisione italiana iniziò le trasmissioni regolari nel 1954"], ["📖", "Il maestro Alberto Manzi insegnava a leggere e a scrivere in TV con «Non è mai troppo tardi»"], ["📺", "«Carosello» era lo spazio pubblicitario serale per i bambini"], ["🎤", "Raffaella Carrà conduceva «Pronto, Raffaella?»"],
      ["❓", "«Lascia o raddoppia?» è stato uno dei primi quiz della TV italiana"], ["🐕", "Il Commissario Rex è un cane pastore tedesco"], ["🧪", "Il protagonista di «Breaking Bad» è Walter White"], ["🔦", "«Stranger Things» è ambientata nella cittadina di Hawkins"],
      ["🇰🇷", "«Squid Game» è una serie coreana"], ["💰", "«La casa di carta» è una serie spagnola"] ],

    'sport': [
      ["🚴", "Il Giro d'Italia nacque nel 1909"], ["🚴", "Il Tour de France nacque nel 1903"], ["🚴", "Gino Bartali vinse il Tour de France nel 1938 e nel 1948"], ["🚴", "Fausto Coppi vinse il Tour de France nel 1949 e nel 1952"],
      ["🚴", "Vincenzo Nibali ha vinto il Giro, il Tour e la Vuelta"], ["🚴", "Al Giro d'Italia la maglia ciclamino è del miglior velocista"], ["💙", "La nazionale italiana di calcio è chiamata «gli Azzurri»"], ["🧤", "Gianluigi Buffon, portiere, vinse il Mondiale del 2006"],
      ["⚽", "Fabio Grosso segnò il rigore decisivo nella finale del Mondiale 2006"], ["⚽", "Paolo Rossi fu il capocannoniere del Mondiale 1982"], ["🧤", "Dino Zoff era il portiere e capitano dell'Italia campione del mondo nel 1982"], ["🏟️", "Lo stadio di San Siro è la casa di Milan e Inter"],
      ["🏟️", "Lo Stadio Olimpico di Roma ospita Roma e Lazio"], ["⚽", "Il Napoli ha vinto lo scudetto nel 2023"], ["⚽", "Il Cagliari vinse lo scudetto nel 1970 con Gigi Riva"], ["⚽", "Gigi Riva è il miglior marcatore nella storia della nazionale italiana"],
      ["⚽", "Francesco Totti ha giocato quasi tutta la carriera nella Roma"], ["⚽", "Alessandro Del Piero ha giocato per tanti anni nella Juventus"], ["🥇", "Il Pallone d'Oro è il premio al miglior calciatore dell'anno"], ["🇦🇷", "Lionel Messi ha vinto il Mondiale nel 2022 con l'Argentina"],
      ["🇵🇹", "Cristiano Ronaldo è un calciatore portoghese"], ["🇧🇷", "Il Brasile ha vinto 5 Mondiali di calcio"], ["🇩🇪", "La Germania ha vinto 4 Mondiali di calcio"], ["🇺🇾", "Il primo Mondiale di calcio si giocò in Uruguay nel 1930"],
      ["⚪", "Il Real Madrid è la squadra che ha vinto più Champions League"], ["🥅", "Il calcio di rigore si tira da 11 metri"], ["⏱️", "Una partita di calcio dura 90 minuti, divisi in due tempi"], ["🎾", "Nel tennis i punti si contano 15, 30, 40"],
      ["🎾", "Adriano Panatta vinse il Roland Garros nel 1976"], ["🎾", "Roger Federer ha vinto 8 volte Wimbledon"], ["🎾", "Rafael Nadal ha vinto 14 volte il Roland Garros"], ["🎾", "Novak Djokovic ha vinto 24 tornei del Grande Slam"],
      ["🎾", "Flavia Pennetta vinse gli US Open nel 2015"], ["🏛️", "Le Olimpiadi moderne ripartirono ad Atene nel 1896"], ["🎖️", "Pierre de Coubertin fu il fondatore delle Olimpiadi moderne"], ["🇮🇹", "Roma ha ospitato le Olimpiadi estive nel 1960"],
      ["❄️", "Torino ha ospitato le Olimpiadi invernali del 2006"], ["⛷️", "Cortina d'Ampezzo ha ospitato le Olimpiadi invernali del 1956"], ["💍", "I cerchi olimpici sono 5"], ["🔥", "La fiaccola olimpica si accende a Olimpia, in Grecia"],
      ["⚡", "Usain Bolt detiene il record dei 100 metri: 9 secondi e 58"], ["🏃", "Dorando Pietri, alla maratona olimpica di Londra del 1908, tagliò il traguardo sorretto dai giudici"], ["🦘", "Sara Simeoni vinse l'oro nel salto in alto alle Olimpiadi di Mosca 1980"], ["🏃", "Stefano Baldini vinse la maratona alle Olimpiadi di Atene 2004"],
      ["🤺", "Valentina Vezzali ha vinto 6 ori olimpici nella scherma"], ["🏀", "Il basket fu inventato nel 1891 da James Naismith"], ["🏀", "LeBron James ha vinto 4 titoli NBA"], ["🏀", "Kobe Bryant ha giocato per tutta la carriera nei Lakers"],
      ["🏐", "La pallavolo nacque nel 1895"], ["🏉", "Il Sei Nazioni di rugby è giocato da sei squadre, tra cui l'Italia"], ["🏎️", "Ayrton Senna ha vinto 3 titoli mondiali di Formula 1"], ["🏎️", "Lewis Hamilton ha vinto 7 titoli mondiali di Formula 1"],
      ["🏁", "Il Gran Premio d'Italia di Formula 1 si corre a Monza"], ["🏍️", "Francesco Bagnaia ha vinto il mondiale MotoGP nel 2022 e nel 2023"], ["🏍️", "Giacomo Agostini ha vinto 15 titoli mondiali di motociclismo"], ["⛷️", "Deborah Compagnoni ha vinto l'oro olimpico di sci nel 1992, nel 1994 e nel 1998"],
      ["🏇", "Il Palio di Siena si corre due volte all'anno: il 2 luglio e il 16 agosto"], ["⚽", "Il calcio storico fiorentino si gioca a Firenze, in piazza Santa Croce"], ["🏊", "Gregorio Paltrinieri vinse l'oro nei 1500 stile libero alle Olimpiadi di Rio 2016"], ["🤽", "La nazionale di pallanuoto è chiamata «Settebello»"],
      ["🏅", "Il decathlon è una gara di atletica con 10 prove"], ["🥊", "Muhammad Ali era chiamato «il più grande»"], ["🤸", "Vanessa Ferrari vinse il Mondiale di ginnastica nel 2006, nel concorso individuale"], ["🟢⚪🔴", "Chi vince il campionato di calcio porta sulla maglia lo scudetto tricolore"] ],

    'musica': [
      ["🎼", "Johann Sebastian Bach compose i «Concerti brandeburghesi»"], ["🧙", "Mozart compose «Il flauto magico»"], ["🎹", "Beethoven compose «Per Elisa»"], ["🎹", "Chopin era un pianista e compositore polacco"],
      ["🦢", "Čajkovskij compose «Il lago dei cigni»"], ["🪄", "Il direttore d'orchestra guida i musicisti con la bacchetta"], ["🎻", "Un'orchestra sinfonica ha archi, fiati, ottoni e percussioni"], ["🎭", "Il Teatro alla Scala di Milano fu inaugurato nel 1778"],
      ["🏛️", "L'Arena di Verona ospita ogni estate le opere liriche"], ["🎭", "Verdi compose «Aida» e «Nabucco»"], ["🎭", "Puccini compose «La bohème» e «Turandot»"], ["🌙", "«Nessun dorma» è un'aria della «Turandot»"],
      ["🎤", "Andrea Bocelli è un tenore toscano"], ["🎼", "Ennio Morricone scrisse la musica di «C'era una volta il West»"], ["🪈", "Il flauto è uno strumento a fiato"], ["🪕", "L'arpa da concerto ha 47 corde"],
      ["🎻", "Il contrabbasso è il più grande strumento ad arco"], ["🎺", "La tromba è uno strumento a fiato della famiglia degli ottoni"], ["🎹", "Il pianoforte fu inventato a Firenze, da Bartolomeo Cristofori, intorno al 1700"], ["🎻", "Antonio Stradivari costruiva violini a Cremona"],
      ["🎶", "I nomi delle note vengono da un inno latino studiato da Guido d'Arezzo"], ["🎵", "La nota «do» un tempo si chiamava «ut»"], ["🔊", "«Forte» e «piano» sono indicazioni di intensità del suono"], ["🎸", "Mick Jagger è la voce dei Rolling Stones"],
      ["🎸", "Jimi Hendrix è stato un grandissimo chitarrista"], ["🇯🇲", "Bob Marley è il più famoso cantante di reggae, nato in Giamaica"], ["📜", "Bob Dylan ha vinto il premio Nobel per la letteratura nel 2016"], ["🎸", "I Led Zeppelin cantano «Stairway to Heaven»"],
      ["👑", "I Queen pubblicarono «Bohemian Rhapsody» nel 1975"], ["💃", "Madonna è chiamata «la regina del pop»"], ["💔", "Whitney Houston cantò «I Will Always Love You»"], ["🕯️", "Elton John cantò «Candle in the Wind»"],
      ["🎸", "I Beatles erano quattro: John, Paul, George e Ringo"], ["🎵", "I Beatles cantarono «Yesterday» e «Let It Be»"], ["🚀", "David Bowie cantò «Space Oddity»"], ["💜", "Prince cantò «Purple Rain»"],
      ["🎤", "Adele ha cantato «Hello»"], ["🎤", "Ed Sheeran ha cantato «Shape of You»"], ["🎤", "Il rap nacque negli anni Settanta nel Bronx, a New York"], ["🥁", "Il jazz nacque a New Orleans"],
      ["🎺", "Louis Armstrong cantò «What a Wonderful World»"], ["💃", "La samba è una danza brasiliana"], ["💃", "Il tango nacque in Argentina"], ["🩰", "Il valzer è una danza che si è molto diffusa a Vienna"],
      ["💃", "Il flamenco è una danza spagnola"], ["💃", "La tarantella è una danza del Sud Italia"], ["🎻", "Il Concerto di Capodanno a Vienna è eseguito dalla Filarmonica"], ["🎭", "Il Festival di Sanremo si svolge al Teatro Ariston"],
      ["🏆", "«Nel blu dipinto di blu» vinse Sanremo nel 1958"], ["👶", "Lo Zecchino d'Oro è il festival della canzone per bambini, nato a Bologna nel 1959"], ["☕", "«Il caffè della Peppina» è una canzone dello Zecchino d'Oro"], ["🐱", "«44 gatti» è una canzone dello Zecchino d'Oro"],
      ["🎤", "Claudio Baglioni cantò «Questo piccolo grande amore»"], ["🎤", "Gianna Nannini cantò «Bello e impossibile»"], ["🎸", "Ligabue cantò «Certe notti»"], ["🎤", "Jovanotti cantò «Penso positivo»"],
      ["🎸", "Pino Daniele cantò «Napule è»"], ["🎤", "Francesco De Gregori cantò «La donna cannone»"], ["🎤", "Franco Battiato cantò «Centro di gravità permanente»"], ["🎤", "Elisa vinse Sanremo nel 2001 con «Luce (tramonti a nord est)»"],
      ["🎤", "Mahmood vinse Sanremo nel 2019 con «Soldi»"], ["🎸", "I Måneskin vinsero Sanremo nel 2021 con «Zitti e buoni»"], ["🎤", "Gli 883 cantarono «Hanno ucciso l'Uomo Ragno»"], ["⚽", "«Notti magiche», di Gianna Nannini ed Edoardo Bennato, fu la canzone dei Mondiali di calcio del 1990"],
      ["📀", "I dischi in vinile giravano a 33 o a 45 giri al minuto"], ["🎧", "Spotify è un servizio di musica in streaming nato in Svezia"] ]
  };
  Object.keys(EXTRA2).forEach(k => { ALL[k].items.push(...EXTRA2[k]); });

  // ---------- frasi in più per «Personaggi dei cartoni» e «Disney e Pixar»: ogni tema copre i 90 numeri ----------
  const EXTRA3 = {
    'cartoni': [
      ["🐭", "Topolino ha le orecchie tonde e i guanti bianchi"], ["🏠", "Topolino abita a Topolinia e Paperino a Paperopoli"], ["⚓", "Paperino indossa un vestito da marinaio"], ["💰", "Paperon de' Paperoni è lo zio ricchissimo di Paperino"],
      ["🐶", "Pluto è il cane di Topolino"], ["🏜️", "Beep Beep corre velocissimo e il Coyote non riesce mai a prenderlo"], ["📦", "Il Coyote ordina strani attrezzi dalla ditta Acme"], ["🐷", "Porky Pig chiude i cartoni dicendo: «Questo è tutto, gente!»"],
      ["🦆", "Daffy Duck è un papero nero pasticcione"], ["🎬", "I Looney Tunes sono nati alla Warner Bros."], ["🐱", "Garfield è un gatto arancione che adora le lasagne"], ["🐶", "Snoopy è il cane di Charlie Brown e dorme sul tetto della sua cuccia"],
      ["🐤", "Woodstock è l'uccellino amico di Snoopy"], ["🧸", "Linus ha sempre con sé la sua copertina"], ["🐻", "Yoghi è un orso che ruba i cestini del picnic"], ["🦴", "Fred Flintstone vive nell'età della pietra insieme a Wilma"],
      ["🚀", "I Pronipoti vivono in una casa che vola nel cielo, nel futuro"], ["🏴", "Hanna e Barbera hanno creato Tom e Jerry"], ["🐕", "Shaggy è l'amico di Scooby-Doo, sempre affamato"], ["🎒", "Dora l'esploratrice ha uno zaino parlante"],
      ["🐒", "Curioso come George è una scimmietta curiosissima"], ["🎩", "L'amico di George è l'uomo con il cappello giallo"], ["🚜", "Bob Aggiustatutto ripara tutto con i suoi attrezzi e dice: «Possiamo farlo?»"], ["🐘", "Babar è un elefante che diventa re"],
      ["🐼", "I Cinque Cicloni di Kung Fu Panda sono Tigre, Gru, Mantide, Vipera e Scimmia"], ["🦓", "In Madagascar Marty è una zebra, Melman una giraffa e Gloria un'ippopotama"], ["🐧", "I pinguini di Madagascar sono Skipper, Kowalski, Rico e Soldato"], ["🐱", "Il Gatto con gli stivali è lo spadaccino che compare in Shrek"],
      ["🫏", "Ciuchino è l'amico chiacchierone di Shrek"], ["👸", "Fiona è la principessa che sposa Shrek"], ["👻", "Casper è un fantasma gentile"], ["🦄", "My Little Pony racconta le avventure di piccoli pony colorati"],
      ["🎀", "Hello Kitty è una gattina bianca con un fiocco rosso"], ["🍊", "L'orso Paddington adora la marmellata di arance"], ["🐕", "Clifford è un grandissimo cane rosso"], ["🦸", "I Super Pigiamini sono Gattoboy, Gufetta e Geco"],
      ["🚒", "Sam il pompiere soccorre gli abitanti di Pontypandy"], ["🐛", "Il piccolo bruco Maisazio mangia tantissimo prima di diventare farfalla"], ["🐷", "George è il fratellino di Peppa Pig e ama i dinosauri"], ["🐶", "Bingo è la sorellina di Bluey, e Bandit è il loro papà"],
      ["🕷️", "L'Uomo Ragno ha un costume rosso e blu"], ["🦇", "Batman vive a Gotham City"], ["🦸", "Superman viene dal pianeta Krypton"], ["🌸", "Heidi ha un amico capraio che si chiama Peter"],
      ["🐕", "La Pimpa è stata creata dal fumettista Altan"], ["🐥", "Calimero esclama: «Questa è un'ingiustizia!»"], ["🫧", "I Barbapapà sono Barbapapà, Barbamamma e sette Barbabimbi"], ["👦", "Nobita è il bambino amico di Doraemon"],
      ["🔥", "Charmander è il Pokémon con la fiamma sulla coda"], ["🌱", "Bulbasaur ha un bulbo sulla schiena"], ["🐢", "Squirtle è un Pokémon tartaruga che spruzza acqua"], ["⭐", "Patrick è la stella marina amica di SpongeBob"],
      ["🍔", "I Krabby Patty sono i panini del ristorante di SpongeBob"], ["🕶️", "I Minions lavorano per Gru, il protagonista di «Cattivissimo me»"] ],

    'disney': [
      ["🚢", "Topolino comparve nel cortometraggio «Steamboat Willie»"], ["🎬", "Walt Disney creò Topolino"], ["🎂", "Walt Disney nacque a Chicago nel 1901"], ["🏰", "Disneyland aprì nel 1955, in California"],
      ["🏰", "Il castello nel logo Disney è ispirato a castelli veri"], ["💡", "Il logo della Pixar è una lampada chiamata Luxo Jr."], ["🎶", "«Fantasia» (1940) mette insieme cartoni e musica classica"], ["🪄", "In «Fantasia» Topolino è l'apprendista stregone"],
      ["🦗", "Il Grillo Parlante è la coscienza di Pinocchio"], ["🪵", "Geppetto è il falegname che costruisce Pinocchio"], ["🐭", "I topolini amici di Cenerentola si chiamano Giac e Gus"], ["✨", "La Fata Madrina di Cenerentola dice «Bibbidi Bobbidi Bu»"],
      ["🍎", "Biancaneve assaggia una mela avvelenata"], ["🤓", "Dotto è il capo dei sette nani e porta gli occhiali"], ["😠", "Brontolo è il nano sempre arrabbiato"], ["🤐", "Cucciolo è il nano più giovane e non parla mai"],
      ["🧚", "La fatina di Peter Pan si chiama Campanellino"], ["🪝", "Il nemico di Peter Pan è Capitan Uncino"], ["🐊", "Il coccodrillo di Capitan Uncino ha mangiato una sveglia"], ["😸", "In «Alice nel Paese delle Meraviglie» lo Stregatto appare e scompare"],
      ["🎩", "In «Alice nel Paese delle Meraviglie» il Cappellaio Matto fa un tè senza fine"], ["♥️", "In «Alice nel Paese delle Meraviglie» la Regina di Cuori vuole tagliare la testa a tutti"], ["🐰", "Tamburino è il coniglietto amico di Bambi"], ["🦨", "Fiore è la puzzola amica di Bambi"],
      ["🐭", "Timoteo è il topolino amico di Dumbo"], ["👩", "Crudelia De Mon vuole una pelliccia di cuccioli dalmata"], ["🕯️", "In «La Bella e la Bestia» Lumière è un candelabro"], ["🌹", "Alla fine de «La Bella e la Bestia» la Bestia torna principe"],
      ["🏹", "Gaston è il cacciatore vanitoso de «La Bella e la Bestia»"], ["🦀", "Il granchio Sebastian è amico di Ariel, la Sirenetta"], ["🐠", "Flounder è il pesciolino amico di Ariel"], ["🐙", "Ursula è la strega del mare con otto tentacoli"],
      ["🐯", "Jasmine ha una tigre di nome Rajah"], ["🐒", "Abu è la scimmietta di Aladdin"], ["🧞", "Aladdin viaggia sul tappeto volante"], ["🐍", "Jafar è il visir cattivo di Aladdin"],
      ["🦁", "Scar è lo zio cattivo di Simba"], ["🐗", "Timon e Pumbaa sono gli amici di Simba"], ["🦁", "Nala è l'amica d'infanzia di Simba"], ["🐒", "Rafiki è la saggia scimmia del «Re Leone»"],
      ["🦝", "Meeko è il procione amico di Pocahontas"], ["🔔", "Quasimodo suona le campane di Notre Dame"], ["🐴", "Pegaso è il cavallo alato di Hercules"], ["🦍", "Tarzan è cresciuto con i gorilla"],
      ["👽", "Stitch è un alieno blu che vive alle Hawaii con Lilo"], ["🐷", "Pimpi è il maialino timido amico di Winnie the Pooh"], ["🐅", "Tigro è la tigre saltellante del Bosco dei Cento Acri"], ["🫏", "Ih-Oh è l'asinello triste del Bosco dei Cento Acri"],
      ["🦎", "Pascal è il camaleonte amico di Rapunzel"], ["🗡️", "Flynn Rider è il ladro che incontra Rapunzel"], ["👭", "Anna è la sorella di Elsa in «Frozen»"], ["🦌", "Kristoff ha una renna che si chiama Sven"],
      ["🐔", "Heihei è il gallo sbadato di Vaiana"], ["🐉", "Mushu è il draghetto amico di Mulan"], ["🦗", "Il grillo Cri-Kee porta fortuna a Mulan"], ["🐰", "Judy Hopps, in «Zootropolis», è una coniglietta poliziotto"],
      ["🦊", "Nick Wilde, in «Zootropolis», è una volpe furba"], ["🤖", "Baymax è un robot gonfiabile che cura i suoi amici"], ["🥔", "Mr. Potato è il signor Patata di «Toy Story»"], ["🦖", "Rex è il dinosauro verde pauroso di «Toy Story»"],
      ["🐕", "Slinky è il cane a molla di «Toy Story»"], ["👧", "Boo è la bambina di «Monsters & Co.»"], ["🧵", "Edna Mode è la stilista dei supereroi de «Gli Incredibili»"], ["🚚", "Cricchetto è il carro attrezzi amico di Saetta McQueen"],
      ["💚", "WALL-E è innamorato della robot EVE"], ["🎈", "In «Up» il protagonista è il vecchietto Carl, e con lui c'è Russell"], ["🐶", "Dug è il cane che parla in «Up»"], ["🐘", "Bing Bong è l'amico immaginario di Riley in «Inside Out»"],
      ["🎸", "In «Coco» Miguel sogna di suonare la chitarra"], ["🏹", "Merida è la principessa con i capelli rossi e ricci che tira con l'arco"], ["🧑‍🍳", "Linguini è il ragazzo che cucina insieme a Remy"], ["🐟", "«Luca» (2021) è ambientato sulla Riviera ligure"],
      ["🐠", "In «Alla ricerca di Dory» Dory cerca la sua famiglia"], ["🦉", "Il Mago Merlino insegna a Semola, in «La spada nella roccia»"], ["🐻", "Re Luigi è l'orango che balla e canta con Mowgli nel «Libro della giungla»"], ["🐅", "Shere Khan è la tigre cattiva del «Libro della giungla»"],
      ["🐆", "Baghera è la pantera che porta Mowgli al villaggio"], ["🍝", "Lilli e il vagabondo mangiano insieme gli spaghetti"], ["🧚", "Le tre fate proteggono Aurora, la Bella Addormentata"], ["🐲", "Malefica è la cattiva de «La Bella Addormentata»"],
      ["🦊", "Robin Hood, nel cartone Disney, è una volpe"] ]
  };
  Object.keys(EXTRA3).forEach(k => { ALL[k].items.push(...EXTRA3[k]); });

  // ---------- altri 38 cartoni anni '80 e '90 (per arrivare a 90) e tre temi nuovi: medicina, corpo umano, parrucchieri e barbieri ----------
  const EXTRA4 = {
    'cartoni-80-90': [
      ["⭐", "Seiya è il Cavaliere di Pegaso, nei «Cavalieri dello Zodiaco»"], ["🪐", "Goku, il protagonista di Dragon Ball, è nato su un altro pianeta ed è un Saiyan"], ["👑", "Vegeta è il principe dei Saiyan"], ["🥊", "Ken il guerriero usa la tecnica di Hokuto e urla «Atatatatatata!»"],
      ["🔫", "Jigen e Goemon sono gli amici di Lupin III"], ["👮", "L'ispettore Zenigata insegue sempre Lupin III"], ["💃", "Fujiko Mine è la bella complice di Lupin III"], ["🤖", "Il Dottor Inferno è il nemico di Mazinga Z"],
      ["🚀", "L'Arcadia è la nave spaziale di Capitan Harlock"], ["🌹", "Anna dai capelli rossi vive nella fattoria di Green Gables"], ["🦁", "Kimba è un leoncino bianco"], ["🤖", "Arale è una robot bambina nel cartone «Dr. Slump»"],
      ["🗡️", "D'Artagnan e i moschettieri del re è un cartone con cani al posto delle persone"], ["🦆", "Darkwing Duck è un papero supereroe con il mantello"], ["🐿️", "Chip e Chop sono gli «agenti speciali» che risolvono i casi"], ["🐭", "I Gummi sono orsetti che saltano e bevono succo di gummiberry"],
      ["🐰", "Roger Rabbit è il coniglio protagonista del film «Chi ha incastrato Roger Rabbit»"], ["🐢", "Le Tartarughe Ninja si chiamano Leonardo, Donatello, Raffaello e Michelangelo"], ["🐀", "Splinter è il maestro delle Tartarughe Ninja"], ["😈", "Shredder è il nemico delle Tartarughe Ninja"],
      ["🚗", "Optimus Prime è il capo degli Autobot nei Transformers"], ["😤", "Megatron è il capo dei Decepticon"], ["⚽", "Mark Lenders è il rivale di Holly Hutton"], ["🥅", "Benji Price è il portiere di Holly e Benji"],
      ["🥊", "Rocky Joe è un cartone sulla boxe"], ["🔫", "City Hunter è un cartone con protagonista Ryo Saeba"], ["🐱", "Luna è la gatta parlante di Sailor Moon"], ["🤠", "Lucky Luke spara più veloce della sua ombra"],
      ["🕵️", "Tintin è un giovane reporter con il cagnolino Milù"], ["🎈", "Willy Fog è il gentiluomo che fa il giro del mondo in 80 giorni"], ["🚀", "Ulisse 31 è una versione spaziale dell'Odissea"], ["🧸", "I Muppet Babies sono i Muppet da piccoli"],
      ["🍄", "Super Mario Bros. Super Show! è del 1989"], ["🌍", "Capitan Planet ha un anello per ogni potere della natura"], ["🐾", "Digimon sono mostri digitali"], ["🦖", "Dinosaucers sono dinosauri alieni che lottano insieme a ragazzi"],
      ["🦸", "Il Grande Mazinga è il robot che arriva dopo Mazinga Z"], ["🇯🇵", "In Giappone «Holly e Benji» si chiama «Capitan Tsubasa»"] ],
  };
  Object.keys(EXTRA4).forEach(k => { ALL[k].items.push(...EXTRA4[k]); });

  // Temi per mestieri e salute (adulti)
  const MESTIERI = {
    'medicina': { name: "Medicina e salute", icon: '🩺', levels: ['adulti'], items: [
      ["⚕️", "Il simbolo della medicina è il bastone di Asclepio con un serpente avvolto"], ["📜", "Ippocrate, medico dell'antica Grecia, è considerato il padre della medicina"], ["🤝", "Il Giuramento di Ippocrate è l'impegno etico dei medici"], ["🏛️", "Galeno fu un grande medico greco che lavorò a Roma"],
      ["📖", "Avicenna scrisse il «Canone della medicina»"], ["🦴", "Andrea Vesalio pubblicò nel 1543 un grande trattato di anatomia, dopo aver insegnato a Padova"], ["❤️", "William Harvey descrisse la circolazione del sangue nel 1628"], ["💉", "Edward Jenner realizzò il primo vaccino, contro il vaiolo, nel 1796"],
      ["🐕", "Louis Pasteur mise a punto un vaccino contro la rabbia"], ["🍄", "Alexander Fleming scoprì la penicillina nel 1928"], ["🧼", "Ignaz Semmelweis capì che lavarsi le mani può salvare vite"], ["🕯️", "Florence Nightingale, «la signora con la lampada», rivoluzionò l'assistenza ai malati"],
      ["🩻", "Wilhelm Röntgen scoprì i raggi X nel 1895"], ["🔬", "Camillo Golgi, italiano, vinse il Nobel per la medicina nel 1906"], ["🧠", "Rita Levi-Montalcini vinse il Nobel per la medicina nel 1986"], ["🦠", "Il vaiolo è stato dichiarato eradicato nel 1980"],
      ["💊", "L'aspirina contiene acido acetilsalicilico"], ["🌡️", "La temperatura normale del corpo è intorno ai 36,5-37 gradi"], ["🩸", "La pressione del sangue ideale è intorno a 120/80 mmHg"], ["💓", "A riposo un adulto ha tra 60 e 100 battiti al minuto"],
      ["🩺", "Lo stetoscopio fu inventato da René Laennec nel 1816"], ["📏", "Lo sfigmomanometro misura la pressione del sangue"], ["📈", "L'elettrocardiogramma registra l'attività elettrica del cuore"], ["🩻", "La radiografia usa i raggi X"],
      ["🔊", "L'ecografia usa gli ultrasuoni"], ["🧲", "La risonanza magnetica usa un forte campo magnetico"], ["🍩", "La TAC permette di ottenere immagini del corpo a strati"], ["🅰️", "I gruppi sanguigni principali sono A, B, AB e 0"],
      ["🧪", "Karl Landsteiner scoprì i gruppi sanguigni nel 1901"], ["🩸", "Il gruppo 0 negativo è considerato il donatore universale di globuli rossi"], ["🩸", "Chi ha il gruppo AB positivo può ricevere globuli rossi da tutti i gruppi"], ["💉", "L'insulina fu scoperta nel 1921 da Banting e Best"],
      ["😴", "L'anestesia con l'etere fu mostrata a Boston nel 1846"], ["🧴", "Joseph Lister introdusse l'antisepsi in chirurgia con l'acido fenico"], ["❤️‍🔥", "Il primo trapianto di cuore umano fu eseguito da Christiaan Barnard nel 1967"], ["🚑", "Il numero unico di emergenza europeo è il 112"],
      ["🚨", "In Italia il 118 è stato a lungo il numero delle emergenze sanitarie"], ["🚦", "Al pronto soccorso i codici di triage vanno dal rosso, il più urgente, al bianco"], ["🏥", "Il Servizio sanitario nazionale italiano è stato istituito nel 1978"], ["💳", "La tessera sanitaria serve per le prestazioni del Servizio sanitario"],
      ["➕", "La Croce Rossa nacque per l'idea di Henry Dunant"], ["🌍", "L'Organizzazione mondiale della sanità è nata nel 1948"], ["🩹", "«Primum non nocere», cioè «prima di tutto non nuocere», è un principio attribuito alla tradizione ippocratica"], ["🥼", "Il camice bianco è la divisa tradizionale del medico"],
      ["🔪", "Il bisturi è il coltello del chirurgo"], ["🧵", "I punti di sutura chiudono le ferite"], ["🦽", "Il gesso immobilizza un osso rotto mentre guarisce"], ["💉", "La siringa serve a iniettare un farmaco o a prelevare sangue"],
      ["👶", "Il pediatra cura i bambini"], ["🦴", "L'ortopedico si occupa di ossa e articolazioni"], ["❤️", "Il cardiologo cura il cuore"], ["👁️", "L'oculista cura gli occhi"],
      ["🧴", "Il dermatologo cura la pelle"], ["👂", "L'otorinolaringoiatra cura orecchie, naso e gola"], ["🦷", "L'odontoiatra è il dentista"], ["😴", "L'anestesista si occupa dell'anestesia durante gli interventi"],
      ["🩻", "Il radiologo interpreta radiografie, ecografie e risonanze"], ["🤰", "L'ostetrica assiste le donne durante il parto"], ["🧑‍⚕️", "L'infermiere assiste i pazienti giorno e notte"], ["🦠", "Gli antibiotici combattono i batteri, non i virus"],
      ["🧼", "Per lavare bene le mani servono almeno venti secondi"], ["💉", "I vaccini allenano il sistema immunitario a riconoscere un microbo"], ["🩸", "Un uomo può donare il sangue intero al massimo quattro volte l'anno"], ["🥦", "Si consigliano almeno cinque porzioni di frutta e verdura al giorno"],
      ["🏃", "Per gli adulti si consigliano almeno 150 minuti di attività fisica a settimana"], ["😴", "Un adulto dovrebbe dormire in media 7-9 ore a notte"], ["💧", "È consigliabile bere circa un litro e mezzo di acqua al giorno"], ["🚭", "Il fumo è una delle principali cause di malattie ai polmoni"],
      ["🍬", "Il diabete è una malattia in cui c'è troppo zucchero nel sangue"], ["🫀", "L'infarto avviene quando una parte del cuore non riceve abbastanza sangue"], ["🤒", "La febbre è un modo del corpo di difendersi dalle infezioni"], ["🤧", "L'influenza è causata da un virus"],
      ["🦟", "La malaria è trasmessa dalle zanzare"], ["🧬", "Il DNA contiene le istruzioni genetiche delle cellule"], ["📺", "Il «Dottor House» è un medico burbero e geniale di una serie TV"], ["🚑", "In «ER – Medici in prima linea» recitava anche George Clooney"],
      ["😄", "Patch Adams, interpretato da Robin Williams, curava i pazienti con il buonumore"], ["📺", "«Medico in famiglia» è una serie italiana con Lino Banfi"], ["🐾", "Il veterinario cura gli animali"], ["💊", "I farmaci generici hanno lo stesso principio attivo di quelli di marca"],
      ["🕐", "Il pronto soccorso è aperto ventiquattr'ore su ventiquattro"], ["🛡️", "Il sistema immunitario ci difende da virus e batteri"], ["📋", "La visita medica comincia dall'anamnesi, cioè dalla storia clinica del paziente"], ["🔬", "Il microscopio permette di osservare cellule e batteri"],
      ["🧫", "Robert Koch scoprì il batterio della tubercolosi nel 1882"], ["🚰", "John Snow, nel 1854 a Londra, studiò un'epidemia di colera e collegò i casi a una pompa dell'acqua"], ["🌍", "Il 7 aprile è la Giornata mondiale della salute"], ["🎗️", "Il nastro rosa è il simbolo della lotta contro il tumore al seno"],
      ["🧑‍⚕️", "Il medico di famiglia è il primo punto di riferimento per la salute"], ["🦠", "Louis Pasteur dimostrò che molte malattie sono causate dai microbi"], ["☢️", "Marie Curie scoprì il radio e il polonio, poi usati anche in medicina"] ] },

    'corpo-umano-grandi': { name: "Il corpo umano: curiosità", icon: '🫀', levels: ['adulti'], items: [
      ["🦴", "Un adulto ha 206 ossa"], ["👶", "Un neonato ha oltre 270 ossa, che crescendo in parte si uniscono"], ["💪", "I muscoli del corpo sono circa 600"], ["🦵", "Il femore è l'osso più lungo del corpo"],
      ["👂", "La staffa, nell'orecchio, è l'osso più piccolo del corpo"], ["🧴", "La pelle è l'organo più grande del corpo"], ["🩸", "Un adulto ha circa cinque litri di sangue"], ["❤️", "Il cuore batte circa 100.000 volte al giorno"],
      ["❤️", "Il cuore ha quattro cavità: due atri e due ventricoli"], ["✊", "Il cuore ha più o meno le dimensioni di un pugno chiuso"], ["🫁", "I polmoni sono due, e il destro è un po' più grande del sinistro"], ["🌬️", "A riposo un adulto respira 12-20 volte al minuto"],
      ["🧠", "Il cervello di un adulto pesa circa un chilo e quattro"], ["🧠", "Il cervello ha circa 86 miliardi di neuroni"], ["⚡", "Il cervello usa circa un quinto dell'energia del corpo"], ["⚖️", "Il cervelletto controlla equilibrio e coordinazione dei movimenti"],
      ["🧠", "Il cervello ha due emisferi"], ["🦴", "Il midollo spinale passa dentro la colonna vertebrale"], ["🦴", "La colonna vertebrale ha 33 vertebre"], ["🫁", "Le costole sono dodici paia"],
      ["💀", "Il cranio è formato da 22 ossa"], ["✋", "Ogni mano ha 27 ossa"], ["🦶", "Ogni piede ha 26 ossa"], ["💧", "Il corpo di un adulto è fatto per circa il 60% di acqua"],
      ["🔴", "I globuli rossi trasportano l'ossigeno"], ["⚪", "I globuli bianchi difendono il corpo dalle infezioni"], ["🩹", "Le piastrine aiutano il sangue a coagulare"], ["🦴", "Il midollo osseo produce le cellule del sangue"],
      ["⏱️", "Il sangue fa un giro completo del corpo in circa un minuto"], ["🚰", "Le arterie portano il sangue dal cuore al corpo, le vene lo riportano al cuore"], ["🧵", "I capillari sono i vasi sanguigni più piccoli"], ["💪", "Il bicipite è il muscolo che piega il braccio"],
      ["🍑", "Il grande gluteo è il muscolo più grande del corpo"], ["🦵", "Il tendine d'Achille è il tendine più grosso del corpo"], ["🌬️", "Il diaframma è il muscolo che ci aiuta a respirare"], ["😮‍💨", "Il singhiozzo è una contrazione del diaframma"],
      ["👅", "La lingua è un muscolo"], ["👅", "Le papille gustative distinguono dolce, salato, acido, amaro e umami"], ["👃", "Il naso riconosce moltissimi odori diversi"], ["👁️", "La cornea è la parte trasparente davanti all'occhio"],
      ["👁️", "L'iride è la parte colorata dell'occhio"], ["⚫", "La pupilla si stringe quando c'è tanta luce"], ["🔍", "Il cristallino mette a fuoco le immagini"], ["👁️", "La retina è lo strato dell'occhio che raccoglie la luce"],
      ["👂", "L'orecchio ha tre parti: esterna, media e interna"], ["🐌", "La coclea, detta anche chiocciola, è nell'orecchio interno"], ["⚖️", "L'orecchio interno aiuta anche l'equilibrio"], ["🦷", "Un adulto ha 32 denti, compresi i denti del giudizio"],
      ["🍼", "I bambini hanno 20 denti da latte"], ["🦷", "Lo smalto dei denti è la sostanza più dura del corpo"], ["😀", "I muscoli del viso permettono di fare tante espressioni diverse"], ["👁️", "Si sbattono le palpebre circa 15-20 volte al minuto"],
      ["💅", "Le unghie crescono circa tre millimetri al mese"], ["💇", "I capelli crescono circa un centimetro al mese"], ["🖐️", "Le impronte digitali sono diverse per ogni persona"], ["👍", "Il pollice opponibile permette di afferrare gli oggetti"],
      ["🍽️", "Lo stomaco produce acido cloridrico per digerire il cibo"], ["🌀", "L'intestino tenue è lungo diversi metri"], ["🧈", "Il fegato è un organo che può rigenerarsi"], ["⚖️", "Il fegato pesa circa un chilo e mezzo"],
      ["🍬", "Il pancreas produce l'insulina"], ["🫘", "I reni sono due e filtrano il sangue"], ["🚽", "La vescica raccoglie l'urina"], ["🦋", "La tiroide è una ghiandola a forma di farfalla nel collo"],
      ["🧬", "Le cellule umane hanno 46 cromosomi, cioè 23 coppie"], ["🧬", "Il DNA è una lunga molecola a doppia elica"], ["🧫", "Il corpo umano è fatto di migliaia di miliardi di cellule"], ["🛡️", "Il sistema immunitario ci difende da virus e batteri"],
      ["💭", "Si sogna soprattutto durante la fase REM del sonno"], ["😴", "Un adulto ha bisogno di circa 7-9 ore di sonno per notte"], ["🌡️", "La temperatura normale del corpo è circa 36,5-37 gradi"], ["🥶", "I brividi aiutano il corpo a scaldarsi"],
      ["💦", "Il sudore aiuta il corpo a raffreddarsi"], ["🧴", "La pelle si rinnova completamente in circa quattro settimane"], ["💧", "Le ghiandole salivari producono più di mezzo litro di saliva al giorno"], ["🤧", "Lo starnuto serve a liberare il naso da polvere e microbi"],
      ["😮", "Gli sbadigli sono contagiosi"], ["🔄", "A riposo il cuore fa circolare circa cinque litri di sangue al minuto"], ["🧭", "Il sistema nervoso porta i segnali dal cervello a tutto il corpo"], ["⚡", "I nervi trasmettono segnali elettrici"],
      ["🔨", "Il riflesso del ginocchio si controlla con un piccolo martelletto"], ["🦶", "L'arco del piede ammortizza i passi"], ["🤸", "Le articolazioni, come ginocchio e gomito, collegano le ossa"], ["🔗", "I legamenti collegano un osso all'altro, i tendini collegano i muscoli alle ossa"],
      ["👃", "La cartilagine è più morbida dell'osso e si trova nel naso e nelle orecchie"], ["🖐️", "I cinque sensi sono vista, udito, olfatto, gusto e tatto"], ["✋", "Le punte delle dita sono molto sensibili al tatto"], ["🩸", "Il sangue è rosso per l'emoglobina, che contiene ferro"],
      ["💓", "Il cuore è un muscolo che non si ferma mai"], ["🦴", "Le ossa contengono calcio, che le rende dure e robuste"] ] },

    'parrucchieri-barbieri': { name: "Parrucchieri e barbieri", icon: '✂️', levels: ['adulti'], items: [
      ["✂️", "Le forbici sono lo strumento principale del parrucchiere"], ["💈", "Il palo a strisce rosse e bianche è l'insegna tradizionale dei barbieri"], ["🩸", "Secondo la tradizione, il rosso e il bianco ricordano i salassi che facevano i barbieri-chirurghi"], ["🦷", "Nel Medioevo i barbieri facevano anche piccoli interventi, come togliere i denti"],
      ["🎭", "«Il barbiere di Siviglia» è un'opera di Gioachino Rossini"], ["🎤", "«Largo al factotum» è l'aria di Figaro nel «Barbiere di Siviglia»"], ["🗣️", "«Figaro qua, Figaro là» è uno dei versi più famosi di Rossini"], ["🎭", "Figaro è il barbiere più famoso della lirica"],
      ["🧼", "La parola «shampoo» viene da una parola hindi che significa massaggiare"], ["💨", "Il primo asciugacapelli fu inventato da Alexandre Godefroy intorno al 1890"], ["🌊", "L'ondulazione Marcel fu creata dal parrucchiere francese François Marcel Grateau nel 1872"], ["🌀", "La permanente moderna fu inventata da Karl Nessler nel 1906"],
      ["🎨", "L'Oréal nacque dall'idea del chimico Eugène Schueller, che inventò una tintura per capelli"], ["🪒", "King Camp Gillette inventò il rasoio di sicurezza con la lametta"], ["🪒", "Il rasoio a mano libera ha una lama pieghevole che si affila su una striscia di cuoio"], ["🧴", "Per radere la barba si usano schiuma e pennello"],
      ["♨️", "Il barbiere usa un asciugamano caldo per ammorbidire la barba"], ["🧴", "Il dopobarba calma la pelle dopo la rasatura"], ["🧬", "I capelli sono fatti di cheratina"], ["🔢", "Sulla testa abbiamo in media circa 100.000 capelli"],
      ["📏", "I capelli crescono in media circa un centimetro al mese"], ["💇", "Normalmente si perdono tra i 50 e i 100 capelli al giorno"], ["⚪", "I capelli grigi hanno meno melanina"], ["🧑‍🦲", "L'alopecia è la perdita dei capelli"],
      ["🌱", "Il follicolo è la piccola sacca della pelle da cui nasce il capello"], ["🧴", "Il cuoio capelluto è la pelle che ricopre la testa"], ["🔥", "La piastra liscia i capelli con il calore"], ["🌀", "Il ferro arricciacapelli forma i ricci"],
      ["💨", "La messa in piega si fa con phon e spazzola"], ["🌀", "I bigodini servono a fare i boccoli"], ["🎨", "La tinta cambia il colore dei capelli"], ["✨", "Le meches sono ciocche più chiare dei capelli"],
      ["🌅", "Il balayage è una tecnica di colore sfumato, fatta a mano libera"], ["🌗", "L'ombré è una sfumatura che va dallo scuro al chiaro"], ["✂️", "Il caschetto è un taglio a forma di casco, all'altezza del mento"], ["✂️", "Il taglio scalato ha lunghezze diverse"],
      ["✂️", "La frangia è la parte di capelli che cade sulla fronte"], ["✂️", "Il pixie è un taglio molto corto"], ["🧑‍🎤", "La cresta è un taglio con i capelli lunghi al centro e rasati ai lati"], ["🧔", "Nella sfumatura i capelli sui lati diventano via via più corti"],
      ["🧢", "Il taglio a spazzola ha i capelli corti e dritti sulla testa"], ["🧔", "Per la barba curata si usano olio e pettine"], ["🥸", "I baffi a manubrio hanno le estremità arricciate"], ["🧔", "Il pizzetto è una piccola barba sul mento"],
      ["🪒", "Il barbiere rifinisce il contorno di barba e capelli con il rasoio"], ["💅", "La cheratina è usata in alcuni trattamenti lisciati"], ["🔴", "I capelli rossi sono i meno diffusi: riguardano circa l'1-2% delle persone"], ["👱", "I biondi hanno in media più capelli dei rossi"],
      ["🧅", "Il capello ha tre strati: cuticola, corteccia e midollo"], ["💧", "L'umidità fa gonfiare i capelli e li rende crespi"], ["💨", "Il diffusore aiuta ad asciugare i capelli ricci"], ["✂️", "Le doppie punte si eliminano con la spuntatina"],
      ["🧴", "Il balsamo rende i capelli più morbidi"], ["🧴", "La maschera nutre i capelli secchi"], ["🌀", "I capelli ricci nascono da un follicolo curvo"], ["🌈", "Il colore dei capelli dipende dalla melanina"],
      ["👘", "Il parrucchiere fa indossare un mantellino per proteggere i vestiti"], ["🚿", "Il lavatesta è il lavello dove si fa lo shampoo"], ["🪞", "Nel salone ogni postazione ha il suo specchio"], ["🧹", "La spazzola per il collo toglie i capelli tagliati"],
      ["💨", "La lacca fissa l'acconciatura"], ["🧴", "Il gel dà forma ai capelli"], ["🧴", "La cera modellante dà un effetto opaco"], ["💆", "Il massaggio del cuoio capelluto rilassa"],
      ["🏺", "Nell'antico Egitto si usavano le parrucche"], ["🎩", "Nel Settecento molti nobili europei portavano parrucche incipriate"], ["👑", "Il re di Francia Luigi XIV rese di moda la parrucca"], ["🏛️", "I barbieri dell'antica Roma si chiamavano tonsores"],
      ["🎬", "In «Edward mani di forbice» il protagonista ha le forbici al posto delle mani"], ["🎬", "«Shampoo» (1975) è un film con Warren Beatty"], ["🎭", "«Sweeney Todd» è un musical su un barbiere"], ["🏅", "Gli acconciatori partecipano a gare e campionati di hairstyling"],
      ["✂️", "Le forbici da parrucchiere hanno due anelli: uno per il pollice e uno per l'anulare"], ["🪮", "Il pettine a coda serve a fare la riga e le sezioni"], ["🪮", "Il pettine a denti larghi districa i capelli bagnati"], ["🧼", "Dopo la tinta si consiglia uno shampoo delicato"],
      ["🧪", "Prima della tinta si fa la prova di tolleranza, cioè il patch test"], ["⏳", "Il tempo di posa è il tempo in cui il prodotto resta sui capelli"], ["💇‍♀️", "Le extension aggiungono lunghezza e volume"], ["🧶", "Le treccine africane sono un'antica acconciatura"],
      ["🎀", "La treccia alla francese parte dalla sommità della testa"], ["👰", "Lo chignon è una crocchia raccolta sulla nuca"], ["💍", "L'acconciatura da sposa si prova prima del matrimonio"], ["💈", "Quello di barbiere è uno dei mestieri più antichi"],
      ["🧵", "Un solo capello può sostenere un peso di circa cento grammi"], ["🧔", "La barba cresce circa mezzo millimetro al giorno"],
      ["🎸", "Il taglio «alla Beatles» fece moda negli anni Sessanta"], ["📐", "Vidal Sassoon rese famosi i tagli geometrici negli anni Sessanta"], ["💃", "Il taglio «alla maschietta» fu di moda negli anni Venti"], ["🎤", "Il ciuffo alto è legato all'immagine di Elvis Presley"],
      ["⚡", "La macchinetta serve a tagliare i capelli molto corti"] ] }
  };
  Object.keys(MESTIERI).forEach(k => { MESTIERI[k].key = k; ALL[k] = MESTIERI[k]; });

  // Proverbi e modi di dire in dialetto ginosino (Ginosa, Puglia), nella grafia in cui sono stati scritti.
  // Il tema è «da scegliere a mano» (non entra nei mix né nella scelta a sorpresa); con più di 90 frasi, in una partita non se ne ripete nessuna.
  // ATTENZIONE: l'ordine delle frasi di questo tema è fisso. Il numero (posizione nell'elenco, da 001) identifica la registrazione audio
  // della frase: le nuove frasi si aggiungono sempre in fondo e le esistenti non si spostano né si cancellano.
  const GINOSA = {
    'ginosa': { name: "Proverbi e modi di dire Ginosini", icon: '🗣️', levels: ['adulti'], optIn: true, credit: "Con i proverbi di Vincenzo D'Angelo e della pagina Ginosa Proverbi", items: [
      ["🔥", "La capa tort l'ammatur la cort, la lion tort l'addrizz u fuoc"],
      ["🐖", "Puorc e 'nnamurat na vold voln iess purtat"],
      ["🎣", "A mar avandat non ge scenn a pescà"],
      ["🌅", "Ci vuò frecà u vescin ialzt prest la matin"],
      ["🍈", "Quann ammatur la fic u melon s' appic"],
      ["👬", "Ci Giacobb l sapev 'mmienz a ddo fratr non z mettev"],
      ["❄️", "Gennar sicc massar ricc"],
      ["🌾", "A mal metetor l vè stritt u petterral"],
      ["🎶", "Astip la zampogn che quann abbesogn"],
      ["🍑", "Rocc Rocc s'e' mmangiat la vernecocc, l'e' rumast u nuzz ngann curr curr da cumba' Giuann"],
      ["🧒", "Necol Necol la zit non t vol, t' a' mis u cacchie verde Necol mangiammerd"],
      ["🌧️", "Quann chiov la matin pigghie la zapp e camin"],
      ["🙏", "Ci vuò speccià a pezzendarì mann e non ge scì"],
      ["🏠", "Salve Eegin, la camastr appes o 'ngin, pescker e zavorr, mamt fusce e attant corr, arriv affin a serrarì, vaffangul a segnerì"],
      ["🐟", "Quand è bbell u pesce, ind all'acque cresce, da for all'acque mor, spacc u pesce e iacchie u cor"],
      // dalle immagini della pagina «ginosaproverbi» (anche le frasi seguenti, fino alla fine dell'elenco; le icone sono scelte in automatico dal contenuto)
      // dalle immagini della pagina «ginosaproverbi»: dialetto e traduzione in italiano (per alcuni proverbi la traduzione sotto l'immagine non era visibile o era interrotta: l'ha completata Claude in modo letterale)
      ["🐈", "Che n'uôcchie frisce u pèsce e che l'alde uàrde la iàtte", "Con un occhio friggi il pesce e con l'altro guardi la gatta"],
      ["🍀", "Fertüne nge völe a sapè sckitte non giöve", "Fortuna ci vuole poiché il solo sapere non giova"],
      ["🛞", "Jünge l'asse ca la röte camìne", "Ungi l'asse che la ruota cammina"],
      ["⏳", "U tiémbe passe e la mörte s'avvecìne", "Il tempo passa e la morte si avvicina"],
      ["👑", "Mégghie pezzénde a case de rrè ca no rrè a case de pezzénde", "Meglio pezzente a casa di Re che Re a casa di pezzente"],
      ["⚖️", "Ci male fasce male aspétte", "Chi male fa male aspetta"],
      ["🍷", "Quànte chiü u miére jé dòlge tante chiü sübbete fasce acìte", "Quanto più il vino è dolce tanto più presto diventa aceto"],
      ["🌦️", "Maletiémbe e buônetiémbe non dürene troppe tiémbe", "Il brutto tempo e il bel tempo non durano troppo tempo"],
      ["🌶️", "Che n'àscene de pèpe se pèrde la menéstre", "Per un acino di pepe si perde la minestra"],
      ["🚪", "Pörte achiüse duère fatte", "Porta chiusa dovere fatto"],
      ["🏋️", "Tante pèse nu quendàle de pàgghie e tante pèse nu quendàle de chiümme", "Tanto pesa un quintale di paglia e tanto pesa un quintale di piombo"],
      ["🌽", "Ci se mange la pulénde prime s'abbòtte e pö s'allénde", "Chi si mangia la polenta, prima si gonfia e poi si allenta (scorreggia)"],
      ["🧵", "Dö mestiére non puôte fa o a tèsse o a felà", "Due mestieri non puoi fare, o a tessere o a filare"],
      ["🎲", "Jind'a vite du sciuquatòre non ge manche maje delòre, iösce vènge nu ducuàte e crè pèrde u duplecàte", "Nella vita del giocatore non manca mai dolore: oggi vince un ducato e domani ne perde il doppio"],
      ["👥", "La mala cumbagnìe pörte a mala vìe", "La cattiva compagnia porta sulla cattiva strada"],
      ["🏗️", "Ci fràbbeche e sfràbbeche non pèrde màje tiémbe", "Chi fabbrica e sfabbrica non perde mai tempo: chi fa e disfa non perde mai tempo"],
      ["🌱", "L'àrvele s'addrìzze quànn'è repüdde", "L'albero si raddrizza quando è rampollo"],
      ["🩹", "U tiémbe uarìsce le ferìte", "Il tempo guarisce le ferite"],
      ["🏠", "Tant'è da case a cast e tant'è da cast a case", "Tanto è da casa mia a casa tua e tanto è da casa tua a casa mia"],
      ["👂", "U parète non téne rècchie, ma sende", "Il muro non ha orecchie, ma sente"],
      ["🩺", "U miédeche vè e véne, ma ci jàve le wàje se le téne", "Il medico va e viene, ma colui che ha i guai se li tiene"],
      ["👀", "Ci s'assrummàvene le mane accòme s'assròmmene l'uôcchie, nesciüne jér'a fa chiü niénde", "Se si spaventassero le mani come si spaventano gli occhi, nessuno farebbe più niente"],
      ["🫏", "U ciücce ca non völe sénde non sénde manghe le mazzàte", "L'asino che non vuole sentire non sente neanche le mazzate"],
      ["🐕", "U cuàne scallàte dall'acqua frevüte s'assròmme de chèra frédde", "Il cane scottato dall'acqua bollente si spaventa dell'acqua fredda"],
      ["✂️", "Tàgghie de cchiü la lègne ca la fuôrce affelàte", "Taglia di più la lingua che le forbici affilate"],
      ["🔐", "Ci mégghie achiüte mégghie jàpre", "Chi meglio chiude meglio apre"],
      ["🌦️", "Chiuwì, scambò, tütte u munne allariò", "Piovve, smise, tutto tornò sereno"],
      ["🐦", "L'acéddere s'accòcchiene 'ngiéle le fetiénde s'accòcchiene 'ndérre", "Gli uccelli si incontrano in cielo, gli imbroglioni si incontrano sulla terra"],
      ["🍽️", "U segghiütte jé véndra chiène", "Il singhiozzo è pancia piena"],
      ["🏛️", "U sìneche stè cing'anne u fésse stè sémbe", "Il sindaco sta cinque anni, il fesso sta sempre"],
      ["💋", "U prime vase véne arrubbuàte u secònde véne dunàte", "Il primo bacio viene rubato, il secondo viene donato"],
      ["🤞", "Ci assè premètte picche mandéne", "Chi tanto promette poco mantiene"],
      ["🧠", "Tütte cunzìgghie a pigghià, ma u tùje non l'a lassà", "Tutti i consigli devi prendere, ma il tuo non lo devi lasciare"],
      ["👁️", "Ó paìse de le cecàte ci téne n'uôcchie jé u mégghie", "Nel paese dei ciechi chi ha un occhio è il migliore"],
      ["🍇", "Acque d'aiüste tütte iuôgghie e tütte müste", "Acqua di agosto, tutto olio e tutto mosto"],
      ["💸", "Le sölde du carrucchiàle se le mange u sciampagnòne", "I soldi dell'avaro li spende lo sciupone"],
      ["🎻", "Càngene le sunatüre, ma la canzòne jè la stésse", "Cambiano i suonatori, ma la canzone è la stessa"],
      ["☀️", "Quanne véne u mese d'aiüste a ci téne da dà le véne la süste", "Quando arriva il mese di agosto, a chi ha da dare gli viene la stizza"],
      ["🤚", "Ci téne la rügne se l'a jrattà", "Chi ha la rogna se la deve grattare"],
      ["❤️", "Jàme a ci te jàme e respünne a ci te chiàme", "Ama chi ti ama e rispondi a chi ti chiama"],
      ["🐤", "L'aciédde achiüse ind'a gàbbie non cande c'amòre, ma che ràbbie", "L'uccello chiuso in gabbia non canta per amore, ma per rabbia"],
      ["🦊", "Ci secutèsce la vòlpe sape quànte iòste la pédde", "Chi caccia la volpe sa quanto costa la sua pelle"],
      ["🧦", "A vecchièzze le càlze rosse", "In vecchiaia le calze rosse"],
      ["🃏", "Quànne la carte véne u sciuquatòre s'avànde", "Quando la carta viene, il giocatore si vanta"],
      ["💰", "Mégghie poveriédde anuràte ca ricche sbruwegnàte", "Meglio povero e onorato che ricco e svergognato"],
      ["⏳", "Descéve tatarànne “Nesciüne béne düre ciénd'anne”", "Diceva il nonno: «nessun bene dura cent'anni»"],
      ["⛪", "Iüne iére böne e le fascérne madönne", "Una era buona e la fecero Madonna"],
      ["🗣️", "Ci vuò cambà e vuò sta sane dalle pariénde a sta lundàne", "Se vuoi vivere e vuoi stare sano, dai parenti devi stare lontano"],
      ["🗣️", "Vale de chiü iüne a fa ca ciénde a cummannà", "Vale più uno a fare che cento a comandare"],
      ["🍽️", "Non ge sckutànne ind'ó piàtte addò si mangiàte", "Non sputare nel piatto in cui hai mangiato"],
      ["🐔", "Ci lasse la strada vécchie e pìgghie chera növe sape ce lasse e non sape ce tröve", "Chi lascia la strada vecchia e prende quella nuova sa cosa lascia e non sa cosa trova"],
      ["💰", "Fatì fatte denàre aspéte", "Lavoro fatto, denaro aspetta"],
      ["🗣️", "Jé mégghie ci t'anòre ca ci te sàzzie", "È meglio chi ti onora che chi ti sazia"],
      ["🗣️", "Male non fa paiüre non'avè", "Male non fare, paura non avere"],
      ["⛪", "Se disce u peccàte, none u peccatòre", "Si dice il peccato, non il peccatore"],
      ["🔥", "Ci téne la còte de pàgghie stasse lundàne dó fuôche", "Chi ha la coda di paglia stia lontano dal fuoco"],
      ["🐎", "U cuavàdde de ciénde patrüne o tand'abbenghiàte o tande desciüne", "Il cavallo di cento padroni: o tanto sazio o tanto digiuno"],
      ["🗣️", "Còntr'a förze la rasciòne non vale", "Contro la forza la ragione non vale"],
      ["🗣️", "La sucetà jé böne, ma dö persüne sò assè", "La società è buona, ma due persone sono troppe"],
      ["🗣️", "Ci vè a arröbbe fasce nu penziére, ci jàve arrubbàte ne fasce ciénde", "Chi va a rubare fa un pensiero, chi subisce il furto ne fa cento"],
      ["🍇", "Quànne u candeniére stè 'nnanz'a pörte jé ségne ca u miére jé acìte", "Quando il cantiniere sta davanti alla porta della cantina è segno che il vino è aceto"],
      ["🗣️", "Jé mégghie nu triste accuôrde ca na càusa vengiüte", "È meglio un triste accordo che una causa vinta"],
      ["🍽️", "Ci non puôte mangià carne bìvete u bröte", "Se non puoi mangiare la carne, bevi il brodo"],
      ["💰", "Tèrre vacànde non pàjene patrüne", "Terreni vuoti non ripagano il padrone"],
      ["⏳", "L'òra tarde sepàre l'amìce", "L'ora tarda separa gli amici"],
      ["🗣️", "Ci chiü ne tène chiü ne völe", "Chi più ne ha, più ne vuole"],
      ["🗣️", "Ind'a nu cuôppe cüpe cüpe pìcche pèpe càpe pìcche pèpe càpe ind'a nu cuôppe cüpe cüpe", "In un coppo cupo cupo poco pepe entra, poco pepe entra in un coppo cupo cupo"],
      ["🍈", "N'a mètte fìche ind'o panàre", "Ne devi mettere fichi nel paniere: si dice a chi deve ancora fare esperienza"],
      ["👅", "Prìme de parlà de me sciàcquete la vòcche", "Prima di parlare di me sciacquati la bocca"],
      ["🍽️", "Petresìne ogne menéstre", "Prezzemolo in ogni minestra: si dice di chi si intromette dappertutto"],
      ["🗣️", "Pestà l'acque ind'o martàle", "Pestare l'acqua nel mortaio: compiere un'azione inutile"],
      ["🍇", "A San Martìne ògne müste jé vine", "A San Martino ogni mosto è vino"],
      ["🗣️", "Non te dìche e non te cònde", "Non ti dico e non ti racconto: espressione usata prima di raccontare qualcosa di eclatante"],
      ["🎄", "Pasquàle spacche a me e jìe non so buône a spaccà a Pasquàle", "Pasquale spacca a me, ed io non sono buono a spaccare a Pasquale"],
      ["🗣️", "O de line o de làne", "O di lino o di lana: in un modo o nell'altro"],
      ["🗣️", "Tenè apérte la peté", "Tenere aperta la bottega: avere la patta dei pantaloni aperta"],
      ["🗣️", "Chèdd'è ci le puôrte nguôdde e chèdd'è ci le strascìne", "Quella è se la porti addosso e quella è se la trascini: è la stessa cosa"],
      ["🌾", "Settémbre, ottöbre e nuwémbre va före e mànge sémbe", "Settembre, ottobre e novembre, vai in campagna e mangia sempre"],
      ["🌱", "Sciòppa lattüche", "Spianta lattughe: persona priva di capacità"],
      ["💨", "Tìre na zajàgghie", "Tira una zagaglia: quando soffia un vento forte che penetra"],
      ["🗣️", "Rügghiàrse c'u cière tuôrte", "Alzarsi con il verso dei capelli al contrario: iniziare male la giornata"],
      ["🗣️", "Scìrse a métte sus'a scàle de sand'aiustìne", "Andare a mettersi sulla scala di Sant'Agostino: andare a chiedere l'elemosina"],
      ["🌾", "A tèrre dàlle ca te dè", "Al terreno dai ciò che ti dà: bisogna prendersi cura della terra"],
      ["🎄", "Ci nu buône natàle vuò fa d'a 'mmaculàte a cumengià", "Se un buon Natale vuoi fare, dall'Immacolata devi cominciare"],
      ["🚪", "Tène u cuangièdde de fuddaràte", "Avere il cancello di Follerati: si dice di chi non ha i denti incisivi"],
      ["✋", "Pegghiàrse u màneche che tütte u rezzüle", "Prendersi il manico con tutto l'orciolo: abusare della generosità altrui"],
      ["🍞", "A pàsque e a natàle s'arrecchéscene le furnàre", "A Pasqua e a Natale si arricchiscono i fornai"],
      ["🍞", "Côre de màmme non te 'ngànne côre d'attàne te de u pàne", "Cuore di mamma non ti inganna, cuore di padre ti porta il pane"],
      ["🗣️", "Münne é state münne jé e münne a jésse", "Mondo è stato, mondo è e mondo sarà"],
      ["👅", "Iàgghie paiüre de ci non pàrle", "Abbi paura di chi non parla"],
      ["👅", "La lègne non téne iössere, ma rombe l'össere", "La lingua non ha ossa, ma rompe le ossa"],
      ["🎄", "Bön'annàte... Natàle assütte e pasqua abbagnàte", "Buona annata: Natale asciutto e Pasqua bagnata"],
      ["🗣️", "Lasse sta u münne accòme ste", "Lascia stare il mondo come sta"],
      ["🗣️", "Chiü parle chiü sgàrre", "Più parli più sbagli"],
      ["💰", "Ci pàje apprìme jé male servüte", "Chi paga anticipatamente è mal servito"],
      ["🗣️", "Biànghe o rüsse tràse d'o müsse", "Bianco o rosso, entra dal muso"],
      ["🍽️", "La fame no uàrde 'mbàcce a nesciüne", "La fame non guarda in faccia a nessuno"],
      ["⛪", "Menà péschere 'mbàcce a criste", "Buttare le pietre in faccia a Gesù"],
      ["🗣️", "Le dìtte andìche non sbàgliene màie", "I detti antichi non sbagliano mai"],
      ["🗣️", "Stè sémbe ci le völe cötte e ci le völe crüte", "C'è sempre chi la vuole cotta e chi la vuole cruda"],
      ["💰", "Le ternìse fàscene aprì l'uôcchie alle cecàte", "I soldi fanno aprire gli occhi ai ciechi"],
      ["🗣️", "Na cose è a disce na cose è a ffa", "Una cosa è dire, una cosa è fare"],
      ["⚰️", "Mégghie na böna mörte ca na mala sörte", "Meglio una buona morte che una brutta sorte"],
      ["💰", "U rìcche accòme völe u poveriédde accòme pöte", "Il ricco come vuole, il povero come può"],
      ["⏳", "Ci nu punde scappe ciénd'anne jé vive", "Chi supera un punto pericoloso è vivo per cent'anni"],
      ["💨", "Accòme jé u wiénde a vendelà", "Come è il vento devi ventilare"],
      ["❄️", "Fridde e zappe de gennàre te iénghiene u jranàre", "Freddo e zappa di gennaio ti riempiono il granaio"],
      ["🐎", "Jé mégghie a pèrde la sélle ca tütt u cuavàdde", "È meglio perdere la sella che tutto il cavallo"],
      ["🏛️", "Ci jé tuôrte a chiàzze non ge scénne a còrte", "Se hai torto in piazza non andare a farti giudicare dalla Corte"],
      ["⚰️", "Non ge ste case senza pörte e non ge ste vite senza mörte", "Non c'è casa senza porta e non c'è vita senza morte"],
      ["🗣️", "No ffà u pàsse chiü luôgne de la iàmme", "Non fare il passo più lungo della gamba"],
      ["🐕", "Nu père uastàte uàste tütte u cuanìstre", "Una pera guasta guasta tutto il canestro"],
      ["⏳", "C'u tiémbe tütte se sàpe", "Con il tempo tutto si sa"],
      ["❄️", "Febbràre assütte ièrve che tütte", "Febbraio asciutto, erba per tutti"],
      ["🗣️", "Mégghie na spine ca na mala vecìne", "Meglio una spina che una cattiva vicina"],
      ["✋", "La rròbbe passe tre mmàne: ci l'acquìste, ci le mandéne e ci le strüsce", "La roba passa tre mani: chi l'acquista, chi la mantiene e chi la consuma"],
      ["🐟", "U munne jé tünne ci annatèsce e ci vè a fünne", "Il mondo è tondo: chi nuota e chi va a fondo"],
      ["🍽️", "Ci téne da mangià non téne a ce penzà", "Chi ha da mangiare non ha di che preoccuparsi"],
      ["💨", "Le fàttere so frütte e le paröle so frünne", "I fatti sono frutti e le parole sono foglie: le parole se le porta il vento"],
      ["⛪", "Peccàte cumbessàte jé miénze perdunàte", "Peccato confessato è per metà perdonato"],
      ["❄️", "Jind'a febbràre ne jacque 'ndérre ne cannìzze a pagghiàre", "Nel mese di febbraio né acqua in terra né canniccio nel pagliaio"],
      ["👩", "Ci non sénde la mamme e l'attàne mala fine fasce", "Chi non ascolta la madre e il padre fa una brutta fine"],
      ["❄️", "Febbràre miénze dòlge e miénze amàre", "Febbraio: metà dolce e metà amaro"],
      ["🗣️", "Prime stémme ca “màje sìe” mö stame ca “non sia màje”", "Prima stavamo che «mai sia» e ora stiamo che «non sia mai»"],
      ["🫏", "Mégghie cape de ciücce ca còte de liòne", "Meglio testa d'asino che coda di leone: meglio essere capo di una piccola entità che gregario di una grande"],
      ["👨", "A ci me dè da mangià le chiàme tatà", "A chi mi dà da mangiare lo chiamo papà"],
      ["🗣️", "Ci vè a féste senza 'mbetàte fasce buône ci véne cacciàte", "Chi va alla festa senza essere invitato, gli sta bene se viene cacciato"],
      ["🗣️", "La suggietà jé bböne, ma ci ne puôte fa a mméne jé mégghie", "La società è buona, ma se ne puoi fare a meno è meglio"],
      ["🗣️", "L'ömmene jé frònne e la fémmene jé chelönne", "L'uomo è foglia e la donna è colonna"],
      ["🍇", "Ci vuò iénghie le vütte zappe affünne e püte cürte", "Se vuoi riempire le botti, zappa a fondo e pota corto"],
      ["🗣️", "U picche sevérchie l'assé non abbàste", "Il poco soverchia e il troppo non basta"],
      ["📅", "Marze assütte bunnànze de frütte", "Marzo asciutto, abbondanza di frutti"],
      ["🗣️", "Non te véste a prime fridde, non te spugghiànne a prime calle", "Non ti vestire ai primi freddi e non ti spogliare ai primi caldi"],
      ["🗣️", "Fa cìnghe e tre iötte", "Fare cinque e tre otto: rubare"],
      ["🐌", "Tène chiü cörne de nu panàre de cuzzetèdde", "Avere più corna di un paniere di lumache: essere cornuto, ma anche molto furbo"],
      ["🐦", "Ó cande nge völe l'aciédde ó descürse nge völe cerviédde", "Per il canto ci vuole l'uccello, per un discorso ci vuole cervello"],
      ["☀️", "Pegghiàte d'ó sole de màrze", "Preso dal sole di marzo: si dice che esporsi molto al sole di marzo faccia impazzire"],
      ["🗣️", "Nüdde fè e nüdde jàcchie", "Niente fai e niente ti ritrovi"],
      ["🍇", "Da male vetìgne no pegghià magghiuôle ca accòme jè l'attàne sò le fegghiuôle", "Da cattivi vitigni non prendere talee, perché come è il ceppo così saranno i germogli"],
      ["🗣️", "Métte la curnìsce", "Mettere la cornice: contornare, agghindare una notizia"],
      ["🗣️", "Pegghià asse che fiüre", "Prendere asso per figura: confondersi"],
      ["💨", "Cüsse passe u cummuénde", "Questo passa il convento: un invito ad accontentarsi di quel che c'è"],
      ["🗣️", "Fa la jòcce", "Fare la goccia: spaventarsi"],
      ["⚰️", "D'ó muôrte tanne tanne d'a sgravàte püre döppe n'anne", "Dal defunto subito, dalla partoriente anche dopo un anno"],
      ["🍈", "Buône che scì a accögghie le fìche a megghiuôneche", "Buono per andare a raccogliere i fichi a Miglionico: si dice di persona alta di statura, ma di basso livello"],
      ["🐎", "Suldàte de giacchìne", "Soldato di Gioacchino: si dice a chi ha un bell'abito ma nessuna qualità"],
      ["💰", "D'ó male pajatòre acciàffe chèdde ca puôte", "Dal cattivo pagatore afferra quello che puoi"],
      ["🧠", "Dà le nümere", "Dare i numeri: delirare, farneticare"],
      ["🗣️", "Ci la fémmene non sénde a prima vosce jé ségne ca la canzòne non le piàsce", "Se la donna non sente la prima chiamata è segno che l'idea non le piace"],
      ["🤝", "L'amìce non sò màje seviérchie", "Gli amici non sono mai troppi"],
      ["🗣️", "Iüne jé tènde e l'alde é callàre", "Uno è tintura e l'altro è caldaia: due persone da trattare con cautela, senza differenza tra i due"],
      ["🏛️", "Ma ci t'ha fatte sìneche?", "Ma chi ti ha fatto sindaco? Si dice a chi si prende un ruolo di privilegio o decide da solo"],
      ["🌧️", "Quànne criste völe a tütte tiémbe chiöve", "Quando Dio vuole, di tutti i tempi piove"],
      ["🗣️", "Addò te fide te iàcchie 'ngannàte", "Lì dove ti fidi ti ritrovi ingannato"],
      ["🍞", "Le fiésse se cuwérnene a pane e jàcque", "I fessi si governano a pane e acqua"],
      ["❤️", "Mégghie delòre de sacche ca delòre de côre", "Meglio dolore di tasca che dolore di cuore"],
      ["📅", "Abbrìle fasce le fiòre e masce jàve l'anòre", "Aprile fa fiorire i fiori e maggio ne ha l'onore"],
      ["🔥", "Ddö me jüscke ddö me scàlle e ddö ste l'acqua càlle", "Qui mi brucio, qui mi scotto e qui c'è l'acqua calda: tre alternative con lo stesso risultato"],
      ["🍽️", "Fögghie e maccarüne jónn'a scì a nnatüne", "Verdure e maccheroni devono galleggiare durante la cottura"],
      ["🌾", "Masce assütte jràne che tütte", "Maggio asciutto, grano per tutti"],
      ["🍞", "Sime scettàte u pièzze du pane e sciàme accugghiénne le meddìchele", "Abbiamo buttato il pezzo di pane e andiamo raccogliendo le molliche"],
      ["👩", "Na mamme cambe ciénde file, ma ciénde file non càmbene na mamme", "Una mamma campa cento figli, ma cento figli non campano una mamma"],
      ["☀️", "A San Catàlle passe u fridde e vvéne u cuàlle", "A San Cataldo passa il freddo e viene il caldo"],
      ["📅", "Masce, addò te cürche jàcchie pasce", "Maggio, dove ti corichi trovi pace"],
      ["⏳", "Accòme te mìtte?", "Come ti metti? Una domanda di un tempo, come «come ti chiami?»"],
      ["🐎", "Accòme jé u suldàte se dè la sckuppétte", "In base a come è il soldato gli si dà il fucile"],
      ["🔥", "A lüme de cannèlle né fémmene né tèle", "A lume di candela né donne né tela"],
      ["🏠", "Càsere che quànte jàvete e tèrre che quànte puôte", "Case per quante ne puoi abitare e terreni per quanti ne puoi lavorare"],
      ["💰", "Ci s'accundénde de picche devénte ricche", "Chi si accontenta di poco diventa ricco"],
      ["🍇", "Pìnnele de iaddìne e scerrübbe de candìne", "Pillole di gallina e sciroppo di cantina: uova e vino"],
      ["🗣️", "L'acque ca non ha fatte 'ngiéle stè", "L'acqua che non ha fatto in cielo sta"],
      ["🌧️", "Jàque de ggiügne arruìne u münne", "Acqua di giugno rovina il mondo"],
      ["🗣️", "U rise n'òre mandéne tise", "Il riso un'ora mantiene teso: il riso ti sazia per un'ora"],
      ["🩺", "Fa scènne la cügghie", "Far calare l'ernia: essere pesante, opprimente"],
      ["🗣️", "Spénge u traìne a scennetòre", "Spinge il traino in discesa: aiutare quando non ce n'è bisogno"],
      ["🗣️", "Va d'ó patüte e lasse sta u sapüte", "Vai dall'esperto e lascia stare il colto"],
      ["⚰️", "Mörta prejàte màje arruàte", "Morte augurata mai arrivata"],
      ["🤝", "Amìche de cappiédde", "Amico di cappello: amico con cui ci si conosce appena"],
      ["🫏", "U ciücce carrèsce la pàgghie e u ciücce se le mange", "L'asino trasporta la paglia e l'asino se la mangia"],
      ["🗣️", "Mégghie nu male cambà ca nu buône murì", "Meglio un cattivo campare che un buon morire"],
      ["💰", "Téne na mane c'asìgge e l'alde che no pajà", "Ha una mano per esigere e l'altra per non pagare"],
      ["🩺", "Spisse u malàte uarìsce e u miédeche möre", "Spesso il malato guarisce e il medico muore"],
      ["🌱", "Quànne u père jé ammatüre chète senza turcetüre", "Quando la pera è matura cade senza che la si torca"],
      ["🍉", "Ó tiémbe de le melüne u curtiédde sèrv'ó patrüne", "Quando è il periodo di angurie e meloni il coltello serve al padrone"],
      ["🗣️", "Chiàne chiàne se vè lundàne", "Piano piano si va lontano"],
      ["🗣️", "U marìte prebbòne la megghiére despòne", "Il marito propone, la moglie dispone"],
      ["⚰️", "Tütte nàscene chiangénne e nesciüne möre redénne", "Tutti nascono piangendo e nessuno muore ridendo"],
      ["🐑", "Tèrre a zappatüre e péchere a pastüre", "Terra a zappatori e pecore a pastori: ad ognuno il suo"],
      ["🫏", "Ci u ciùcce non ge völe bève jé 'nütele ca tu fiscke", "Se l'asino non vuole bere è inutile che fischi"],
      ["🗣️", "Na còsa assüte dalle diénde le sàpene chiü de ciénde", "Una cosa uscita dai denti la sanno più di cento"],
      ["🗣️", "U male metetòre se tàgghie le dèscetere", "Il cattivo mietitore si taglia le dita"],
      ["🗣️", "U despétte lasse a te stésse", "Il dispetto rimane a te stesso"],
      ["❤️", "Juôcchie ca non vète u côre non desìdere", "Occhio che non vede, cuore che non desidera"],
      ["🗣️", "La carne ca döle chiü jé chèra ca stè vecìne all'uôsse", "La carne che duole di più è quella che si trova vicino all'osso"],
      ["💨", "Nu spaviénde vale che ciénde", "Uno spavento vale per cento"],
      ["🗣️", "Non te fedà de ci téne dö pertòsere ó nase", "Non ti fidare di chi ha due buchi al naso"],
      ["🗣️", "U picche jé mégghie du nüdde", "Il poco è meglio del niente"],
      ["🗣️", "U scuarpàre che le scarpe ròtte", "Il calzolaio con le scarpe rotte"],
      ["🐕", "Gàtte e cane sènza miédece stònne sane", "Gatti e cani senza medici stanno sani"],
      ["🗣️", "Jé nu brütte delòre da patrüne a servetòre", "È un brutto dolore da padrone a servitore"],
      ["⚰️", "U 'nnammuràte se canòsce da l'uôcchie, u sèrve de Ddìe dalle scenòcchiere, u muôrte de fame dalle stennìcchie", "L'innamorato si conosce dagli occhi, il servo di Dio dalle ginocchia, il morto di fame dagli sbadigli"],
      ["🍇", "Le vigne jé accòme all'uôrte a stà vive e muôrte", "La vigna è come l'orto: devi starci vivo e morto, cioè starci sempre"],
      ["🗣️", "Jé mégghie a jésse ammediàte ca cumbiatìte", "È meglio essere invidiati che compatiti"],
      ["🗣️", "Nge völe u cugne du stésse legnàme", "Ci vuole il cuneo dello stesso legname"],
      ["🗣️", "U marügge ògne male destrügge", "Il marrubio ogni male distrugge"],
      ["💰", "Ogne dèbbete se pàje ogne peccàte se chiànge", "Ogni debito si paga, ogni peccato si piange"],
      ["⛪", "Tiéne l'uôcchie quànte a na chièse e non vite la pörte de la sacrestìe", "Hai gli occhi grandi quanto una chiesa e non vedi la porta della sacrestia"],
      ["🐕", "Le cane se càccene che le mazzàte e le crestiàne che la cère", "I cani si cacciano con le botte e le persone con lo sguardo"],
      ["🐑", "La catàrre 'mmane a le pastüre", "La chitarra in mano ai pastori: quando qualcuno fa qualcosa che non gli compete"],
      ["⛪", "Djie ce scanze da na mala vecìne e da nu prencepiànte de viulìne", "Dio ci scansi da una brutta vicina e da un principiante di violino"],
      ["⚰️", "Ci möre giàsce e ci cambe se dè pasce", "Chi muore giace e chi vive si dà pace"],
      ["🍉", "La checüzze non söne e non tüzze, ma ci le cuônze, cande, söne e tüzze", "La zucca non suona e non bussa, ma se la condisci canta, suona e bussa"],
      ["🐔", "Iaddìna giòvene che fa l'öve e vécchie che cuàrle", "Gallina giovane per fare le uova e vecchia per covarle"],
      ["🍽️", "Nüdde chiànde e nüdde mànge", "Nulla pianti, nulla mangi"],
      ["🍽️", "O te mange sta menéstre o te sciétte d'a fenéstre", "O ti mangi questa minestra o ti butti dalla finestra"],
      ["🌾", "Parle che l'ömmene ca te 'ndénne e semenìsce la tèrre ca te rénne", "Parla con l'uomo che ti intende e semina il terreno che rende"],
      ["💰", "Pìgghie a credénze ca a pajà pö se pénze", "Compra a credito che a pagare poi si pensa"],
      ["🚪", "A ci pörte iàpre la pörte a ci non pörte före d'a pörte", "A chi porta apri la porta, a chi non porta fuori dalla porta"],
      ["⚰️", "Cè chiànt'amàre fasce la cattìve, téne u muôrte 'nnanze e pènz'o vive", "Che pianto amaro fa la vedova: ha davanti il morto, ma pensa al vivo"],
      ["🌧️", "Jàrche a punénde de matìne l'acque jé vecìne", "Arcobaleno a ponente di mattina, la pioggia è vicina"]
    ] }
  };
  GINOSA.ginosa.items.forEach((it, i) => { it.id = i + 1; });   // numero della frase (identifica la registrazione audio), anche nella versione per bambini
  // Versione per bambini: stesse frasi, senza quelle volgari o troppo da adulti (parolacce, corna, ernia, «fesso»…).
  const SOLO_ADULTI = /scorreggi|merd|vaffa|culo|cornut|\bcorna\b|\bfess|\bernia\b|partorient|defunt|putt|prostitut|cuzzet|sgravat/;
  const senzaAccenti = x => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  GINOSA['ginosa-bambini'] = { name: "Proverbi Ginosini (per bambini)", icon: '🗣️', levels: ['asilo', '1', '2', '3', '4', '5'], optIn: true, credit: GINOSA.ginosa.credit,
    items: GINOSA.ginosa.items.filter(it => !SOLO_ADULTI.test(senzaAccenti(it.slice(1).join(' ')))) };
  Object.keys(GINOSA).forEach(k => { GINOSA[k].key = k; ALL[k] = GINOSA[k]; });

  // ---------- mnemotecniche: trucchi per ricordare e «smorfia della memoria» (sistema fonetico) ----------
  const MEMORIA = {
    'mnemotecniche': { name: "Mnemotecniche: trucchi per ricordare", icon: '🧠', levels: ['3', '4', '5', 'adulti'], items: [
      ["🧠", "«Mnemotecnica» viene dal greco «mnéme», che vuol dire memoria"], ["👸", "Mnemosine era la dea greca della memoria e la madre delle nove Muse"], ["🏛️", "Il metodo dei loci, o «palazzo della memoria», lega ciò che vuoi ricordare a luoghi che conosci bene"],
      ["🏚️", "Secondo la tradizione, il poeta greco Simonide di Ceo inventò il metodo dei loci dopo il crollo di una sala da banchetto"], ["📜", "Cicerone racconta la storia di Simonide nel suo libro «De oratore»"], ["💭", "Giordano Bruno scrisse libri sull'arte della memoria"],
      ["🇨🇳", "Il gesuita italiano Matteo Ricci insegnò il palazzo della memoria in Cina"], ["🔤", "Un acrostico è una frase fatta con le iniziali delle cose da ricordare"], ["🔡", "Un acronimo è una sigla fatta con le iniziali: per esempio ONU"],
      ["🧩", "Il «chunking» consiste nel raggruppare le informazioni in blocchi più piccoli"], ["📞", "Un numero di telefono si ricorda meglio a gruppi di due o tre cifre"], ["7️⃣", "Negli anni Cinquanta lo psicologo George Miller mostrò che la memoria a breve termine tiene circa 7 elementi, più o meno 2"],
      ["📉", "La curva dell'oblio di Hermann Ebbinghaus, del 1885, mostra che si dimentica in fretta se non si ripassa"], ["🔁", "Ripassare a intervalli sempre più lunghi aiuta a ricordare a lungo: si chiama ripetizione dilazionata"], ["🗣️", "Spiegare a voce alta ciò che hai studiato aiuta a ricordarlo"],
      ["😴", "Dormire dopo aver studiato aiuta il cervello a fissare i ricordi"], ["🤪", "Le immagini strane e buffe si ricordano più facilmente di quelle normali"], ["🔗", "Collegare una cosa nuova a una che già conosci è la base di quasi tutte le mnemotecniche"],
      ["🎵", "Le rime e le filastrocche si ricordano più facilmente delle frasi normali"], ["🗺️", "In una mappa mentale l'idea principale sta al centro e i collegamenti partono come rami"], ["🌳", "Tony Buzan ha reso famose le mappe mentali"],
      ["🔢", "Il sistema fonetico trasforma i numeri in consonanti e poi in parole"], ["🅰️", "Nel sistema fonetico le vocali non contano: servono solo a formare le parole"], ["🧲", "Nel sistema fonetico il 1 è T o D, il 2 è N e il 3 è M"],
      ["🃏", "Negli sport della memoria si impara a mente l'ordine di un mazzo di carte in pochi minuti"], ["🏆", "Dominic O'Brien ha vinto otto volte il campionato del mondo della memoria"], ["🌍", "Il campionato del mondo della memoria esiste dal 1991"],
      ["📖", "Il neuropsicologo Aleksandr Lurija studiò un uomo, Solomon Shereshevsky, che ricordava quasi tutto"], ["🎬", "Kim Peek, che ispirò il film «Rain Man», imparò a memoria migliaia di libri"], ["🥧", "Per ricordare le cifre del pi greco si usano frasi in cui il numero di lettere di ogni parola è una cifra"],
      ["✊", "Il trucco dei pugni: le nocche sono i mesi di 31 giorni, gli spazi tra le nocche i mesi più corti"], ["📅", "«Trenta dì conta novembre, con april, giugno e settembre; di ventotto ce n'è uno, tutti gli altri ne han trentuno»"], ["🌈", "I colori dell'arcobaleno sono sette: rosso, arancione, giallo, verde, azzurro, blu e viola"],
      ["🪐", "I pianeti, dal Sole in poi, sono Mercurio, Venere, Terra, Marte, Giove, Saturno, Urano e Nettuno"], ["🎼", "Guido d'Arezzo usò le prime sillabe di un inno a San Giovanni per dare il nome alle note"], ["🖐️", "La «mano guidoniana» usava le dita della mano per ricordare le note"],
      ["🎶", "In inglese «Every Good Boy Deserves Fruit» ricorda le note sulle righe del pentagramma"], ["🔮", "La smorfia napoletana lega ogni numero a un'immagine: è anch'essa una mnemotecnica"], ["💀", "Nella smorfia il 47 è «il morto» e il 90 è «la paura»"],
      ["📚", "Il sistema fonetico moderno risale al Seicento ed è stato perfezionato da vari studiosi"], ["🚶", "Il tragitto da casa a scuola può diventare un percorso della memoria, con un oggetto da ricordare in ogni punto"], ["🛒", "Per ricordare la lista della spesa, immagina ogni prodotto in una stanza di casa tua"],
      ["📖", "Inventare una storia che unisce le cose da ricordare è la tecnica della storia concatenata"], ["🇬🇧", "Il metodo delle parole chiave associa una parola straniera a un suono simile in italiano"], ["🧑‍🤝‍🧑", "Per ricordare un nome nuovo, ripetilo subito e collegalo a un'immagine"],
      ["📌", "Nel «peg system» ogni numero è legato a un oggetto con una rima, e ci si appendono le cose da ricordare"], ["🧪", "Secondo un modello del 1968, la memoria si divide in sensoriale, a breve e a lungo termine"], ["🦛", "L'ippocampo è la zona del cervello importante per formare i ricordi nuovi"],
      ["❤️", "Ciò che ti emoziona si ricorda meglio"], ["🥇", "Di una lista si ricordano meglio le prime e le ultime parole"], ["🍪", "Per Marcel Proust, il sapore di una madeleine inzuppata nel tè riportava a galla un ricordo d'infanzia"],
      ["🏋️", "Nessuna tecnica funziona senza esercizio"], ["🖐️", "Per la tabellina del 9 puoi usare le dita: piega il dito corrispondente, a sinistra ci sono le decine e a destra le unità"], ["9️⃣", "Nei multipli del 9 fino a 90 la somma delle cifre fa sempre 9"],
      ["👢", "L'Italia a forma di stivale aiuta a ricordare la forma del Paese"], ["✍️", "Per distinguere la destra dalla sinistra si può pensare alla mano con cui scrivi"], ["🌙", "«Gobba a levante luna calante, gobba a ponente luna crescente»"],
      ["🌅", "«Rosso di sera bel tempo si spera»"], ["☀️", "Il Sole sorge a est e tramonta a ovest"], ["🕳️", "La stalattite pende dal tetto, la stalagmite cresce dal pavimento"],
      ["🔤", "Per ricordare quando scrivere l'acca: «ho, hai, ha, hanno» ce l'hanno tutti"], ["🪢", "Fare un nodo al fazzoletto serve a ricordarsi di qualcosa"], ["🐘", "«L'elefante non dimentica mai» è un modo di dire sulla grande memoria degli elefanti"],
      ["📓", "Per imparare una poesia, dividila in strofe e impara una strofa per volta"], ["🍅", "La tecnica del pomodoro, 25 minuti di studio e 5 di pausa, è stata inventata dall'italiano Francesco Cirillo"], ["🧑‍🏫", "La tecnica di Feynman dice: spiega l'argomento con parole semplici, come a un bambino"],
      ["🗃️", "Le schede con domanda e risposta si possono mettere in scatole: è il sistema ideato da Sebastian Leitner"], ["💬", "Cicerone chiamava la memoria «tesoro di tutte le cose»"], ["❤️‍🔥", "«Ricordare» viene dal latino «cor», cuore: vuol dire riportare al cuore"],
      ["🔤", "In molte lingue l'alfabeto si impara con una canzoncina"], ["🎤", "Una canzone si ricorda più facilmente di un testo parlato"], ["🔌", "I colori dei resistori elettrici, dal nero al bianco, corrispondono alle cifre da 0 a 9"],
      ["🚥", "La bandiera italiana ha, da sinistra, verde, bianco e rosso"], ["⭕", "I cinque anelli olimpici sono blu, giallo, nero, verde e rosso"], ["🕵️", "Nella serie «Sherlock» il detective usa un «palazzo mentale»"],
      ["🎬", "Nel film «Memento» il protagonista non forma nuovi ricordi e usa foto e tatuaggi"], ["🐠", "In «Alla ricerca di Dory» la pesciolina Dory ha problemi di memoria a breve termine"], ["📱", "Il 112 è il numero unico di emergenza europeo: più è breve un numero, più è facile da ricordare"],
      ["🔟", "Il 10 si ricorda con «tazza» nel sistema fonetico: 1 = T, 0 = Z"], ["🧩", "Ricordare in blocchi: «1-1-2» è più facile di «112»"], ["⛪", "Tommaso d'Aquino consigliava di aiutarsi con le immagini per ricordare"],
      ["🔊", "Ripetere ad alta voce aiuta a ricordare meglio che leggere in silenzio"], ["✏️", "Riscrivere con parole tue ciò che hai letto aiuta a ricordarlo"], ["📆", "Un po' di studio ogni giorno funziona meglio di tanto studio in una volta sola"],
      ["💧", "Anche bere acqua e fare movimento aiutano la concentrazione"], ["🍎", "Per ricordare «un'arancia, un libro, una chiave» immagina l'arancia che legge il libro e apre una porta con la chiave"], ["👀", "Guardare ciò che vuoi ricordare con molta attenzione è il primo passo: se non lo noti, non lo ricordi"],
      ["📆", "I giorni della settimana ricordano i pianeti: lunedì la Luna, martedì Marte, mercoledì Mercurio, giovedì Giove, venerdì Venere"], ["🅿️", "Per ricordare dove hai parcheggiato, fai caso al piano e a un punto di riferimento"],
      ["🏰", "Il palazzo della memoria funziona anche con luoghi immaginari, come un castello che inventi tu"], ["📜", "Gli antichi cantori ricordavano poemi lunghissimi come l'Iliade grazie al ritmo dei versi"],
      ["📵", "Oggi i numeri li ricorda lo smartphone, ma esercitare la memoria resta utile"] ] },
    'smorfia-memoria': { name: "La smorfia della memoria (sistema fonetico)", icon: '🔢', levels: ['3', '4', '5', 'adulti'], f: null }
  };
  // Sistema fonetico: a ogni cifra uno o più suoni di consonante; con due consonanti si forma una parola (le vocali non contano).
  const MS_SUONI = ['S o Z', 'T o D', 'N', 'M', 'R', 'L', 'C o G dolce, o SC', 'C o G dura, o Q', 'F o V', 'P o B'];
  const MS_LETTERE = ['S/Z', 'T/D', 'N', 'M', 'R', 'L', 'C-G dolci/SC', 'C-G dure/Q', 'F/V', 'P/B'];
  const MS_PARLATO = ['esse o zeta', 'ti o di', 'enne', 'emme', 'erre', 'elle', 'ci o gi dolce, oppure sci', 'ci o gi dura, oppure qu', 'effe o vu', 'pi o bi'];
  const MS_PAROLE = {
    1: ['dea', '👸'], 2: ['Noè', '🚢'], 3: ['amo', '🎣'], 4: ['ora', '⏰'], 5: ['ala', '🪽'], 6: ['uscio', '🚪'], 7: ['oca', '🦆'], 8: ['uva', '🍇'], 9: ['ape', '🐝'],
    10: ['tazza', '☕'], 11: ['dado', '🎲'], 12: ['tana', '🕳️'], 13: ['dama', '♟️'], 14: ['toro', '🐂'], 15: ['tela', '🧵'], 16: ['doccia', '🚿'], 17: ['tacco', '👠'], 18: ['tuffo', '🏊'], 19: ['topo', '🐭'],
    20: ['naso', '👃'], 21: ['nido', '🐦'], 22: ['nonna', '👵'], 23: ['nome', '🏷️'], 24: ['nuora', '👩'], 25: ['Nilo', '🏞️'], 26: ['noce', '🌰'], 27: ['nocca', '✊'], 28: ['neve', '❄️'], 29: ['nebbia', '🌫️'],
    30: ['mese', '📅'], 31: ['moto', '🏍️'], 32: ['mano', '✋'], 33: ['mamma', '👩‍👧'], 34: ['mare', '🌊'], 35: ['mela', '🍎'], 36: ['magia', '🪄'], 37: ['mago', '🧙'], 38: ['muffa', '🍞'], 39: ['mappa', '🗺️'],
    40: ['rosa', '🌹'], 41: ['rete', '🥅'], 42: ['rana', '🐸'], 43: ['remo', '🚣'], 44: ['arare', '🚜'], 45: ['rullo', '🎨'], 46: ['roccia', '🪨'], 47: ['orco', '👹'], 48: ['riva', '🏖️'], 49: ['rapa', '🥬'],
    50: ['lesso', '🍲'], 51: ['lido', '⛱️'], 52: ['luna', '🌙'], 53: ['lima', '💅'], 54: ['lira', '💶'], 55: ['lillà', '💜'], 56: ['luce', '💡'], 57: ['lago', '🏞️'], 58: ['lava', '🌋'], 59: ['lupo', '🐺'],
    60: ['gesso', '✏️'], 61: ['gita', '🚌'], 62: ['scena', '🎭'], 63: ['gemma', '💎'], 64: ['cera', '🕯️'], 65: ['gelo', '🧊'], 66: ['ceci', '🫘'], 67: ['cieco', '🦯'], 68: ['Giove', '🪐'], 69: ['giubba', '🧥'],
    70: ['casa', '🏠'], 71: ['gatto', '🐈'], 72: ['cane', '🐕'], 73: ['gomma', '🛞'], 74: ['cuore', '❤️'], 75: ['culla', '🍼'], 76: ['caccia', '🏹'], 77: ['cacao', '🍫'], 78: ['gufo', '🦉'], 79: ['cubo', '🧱'],
    80: ['vaso', '🏺'], 81: ['foto', '📷'], 82: ['fune', '🪢'], 83: ['fame', '🍽️'], 84: ['faro', '🏮'], 85: ['vela', '⛵'], 86: ['foce', '🌊'], 87: ['fuoco', '🔥'], 88: ['fava', '🌱'], 89: ['fiaba', '📖'], 90: ['pizza', '🍕']
  };
  MEMORIA['smorfia-memoria'].f = n => {
    const cifre = String(n).split('').map(Number), p = MS_PAROLE[n]; if (!p) return null;
    const legenda = [...new Set(cifre)].map(c => `${c} = ${MS_LETTERE[c]}`).join(', ');
    const lettere = cifre.map(c => MS_LETTERE[c]).join(' + ');
    const parlato = [...new Set(cifre)].map(c => `${c === 0 ? 'zero' : ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'][c]} è ${MS_PARLATO[c]}`).join('; ');
    return { e: p[1], t: `${n} → ${lettere} → «${p[0]}» (${legenda})`, sp: `La parola è ${p[0]}: ${parlato}` };
  };
  Object.keys(MEMORIA).forEach(k => { MEMORIA[k].key = k; ALL[k] = MEMORIA[k]; });

  // Categorie per ordinare i menu (un tema sta in una sola categoria).
  const C = { mix: '🎲 Mix di temi', scuola: '📚 Scuola', cartoni: '📺 Cartoni, giochi e supereroi', animali: '🐾 Animali', regioni: "🇮🇹 Regioni d'Italia",
              feste: '🎉 Feste e tradizioni', fede: '✝️ Santi, Chiesa e Vangelo', divertente: '😂 Divertente', cultura: '🎵 Cultura e passioni', mate: '📐 Matematica e statistica', mestieri: '🧑‍⚕️ Mestieri e salute', mio: '✏️ I miei temi' };
  const CATEGORIES = [C.mix, C.scuola, C.cartoni, C.animali, C.regioni, C.feste, C.fede, C.divertente, C.cultura, C.mestieri, C.mate, C.mio];
  const CAT_KEYS = {
    [C.animali]: ['animali-versi', 'animali-classi', 'animali-curiosita', 'cuccioli', 'animali-habitat', 'dinosauri-tema', 'animali-modi-di-dire'],
    [C.cartoni]: ['cartoni', 'disney', 'cartoni-oggi', 'cartoni-80-90', 'ghibli', 'anime-classici', 'anime-oggi', 'super-mario', 'roblox', 'one-piece', 'minecraft', 'supereroi',
                  'videogiochi-classici', 'videogiochi-oggi', 'console', 'pokemon', 'conta-cartoni', 'problemi-piccoli', 'problemi-grandi', 'alfabeto-cartoni', 'colori-cartoni', 'cartoni-nel-mondo', 'inglese-cartoni', 'simpson'],
    [C.mate]: ['matematica'], [C.mestieri]: ['medicina', 'corpo-umano-grandi', 'parrucchieri-barbieri'], [C.feste]: ['feste'], [C.fede]: ['santi', 'chiesa', 'gesu'], [C.divertente]: ['verita', 'mamma', 'proverbi', 'modi-di-dire', 'murphy', 'chuck-norris'], [C.cultura]: ['musica', 'sport', 'cinema', 'sapori', 'capitali', 'cultura', 'toto', 'alberto-sordi', 'ritorno-al-futuro', 'mnemotecniche', 'smorfia-memoria']
  };
  function catOf(key) {
    if (key.startsWith('mix-')) return C.mix;
    if (key.startsWith('mio-')) return C.mio;
    if (key === 'puglia' || key === 'ginosa' || key === 'ginosa-bambini' || key === 'regioni' || key.startsWith('reg-')) return C.regioni;
    for (const c in CAT_KEYS) if (CAT_KEYS[c].includes(key)) return c;
    return C.scuola;   // tutto il resto è materia di scuola
  }

  // Mix di temi: per ogni classe (e per gli adulti) un tema che pesca da tanti temi insieme, così una partita
  // intera ha centinaia di frasi diverse. Si usano solo i temi pronti (non quelli personali), uguali su ogni dispositivo.
  function buildMixes() {
    Object.keys(ALL).filter(k => k.startsWith('mix-')).forEach(k => delete ALL[k]);
    ['asilo', '1', '2', '3', '4', '5', 'adulti'].forEach(level => {
      const all = Object.keys(ALL).filter(k => !k.startsWith('mix-') && !k.startsWith('mio-') && ALL[k].items && ALL[k].levels.includes(level));
      const base = all.filter(k => !ALL[k].optIn);   // i temi «da scegliere a mano» (es. santi e Chiesa) restano fuori da «Tutto un po'"
      const make = (suffix, name, keys) => {
        if (keys.length < 2) return;
        const seen = new Set(), items = [];
        keys.forEach(k => ALL[k].items.forEach(it => { if (!seen.has(it[1])) { seen.add(it[1]); items.push(it); } }));
        if (items.length < 40) return;
        const key = 'mix-' + level + '-' + suffix;
        ALL[key] = { key, name, icon: '🎲', levels: [level], items };
      };
      make('tutto', "Tutto un po' (mix di tutti i temi)", base);
      [['scuola', C.scuola], ['cartoni', C.cartoni], ['animali', C.animali], ['regioni', C.regioni], ['fede', C.fede], ['divertente', C.divertente], ['cultura', C.cultura], ['mestieri', C.mestieri]]
        .forEach(([suffix, cat]) => make(suffix, 'Mix: ' + cat.replace(/^\S+\s/, ''), all.filter(k => catOf(k) === cat)));
    });
  }
  buildMixes();
  const themesFor = level => Object.keys(ALL).filter(k => ALL[k].levels.includes(level)).map(k => ({ key: k, name: ALL[k].name, icon: ALL[k].icon, cat: catOf(k), optIn: !!ALL[k].optIn }));

  // Voce per il numero n del tema: { e: emoji, t: frase, sp?: testo da leggere, spk?: [[testo, lingua]] }
  // idx (facoltativo) sceglie la frase dell'elenco al posto di quella «di default» del numero.
  // ctx (facoltativo) = { drawn, max }: serve ai temi con «frasi vive» calcolate sulla partita in corso.
  function entry(key, n, idx, ctx) {
    const th = ALL[key]; if (!th) return null;
    if (th.f) return th.f(n);
    const S = th.items.length, dn = th.dyn || [], L = S + dn.length, i = idx != null ? idx : n - 1, j = ((i % L) + L) % L;
    if (j >= S) { const r = dn[j - S](n, ctx); if (r) return r; }   // frase viva; se non si può calcolare, una frase fissa
    const it = th.items[j % S];
    // voce a tre elementi: [emoji, frase in dialetto, traduzione in italiano] → si mostra «dialetto — italiano» e la voce legge l'italiano
    if (it[2]) return { e: it[0], d: it[1], t: it[2], sp: it[2], id: it.id };
    return { e: it[0], t: it[1], id: it.id };
  }
  // Quante frasi ha un tema a elenco (0 per i temi generati dal numero, che sono già tutti diversi).
  const size = key => { const t = ALL[key]; return t && t.items ? t.items.length + (t.dyn ? t.dyn.length : 0) : 0; };

  // Tema a caso per la classe, diverso dal precedente se possibile.
  function pick(level, avoid) {
    let l = themesFor(level).map(t => t.key).filter(k => !k.startsWith('mix-') && !(ALL[k] && ALL[k].optIn));   // a caso: solo temi singoli e non «da scegliere a mano»
    if (l.length > 1) l = l.filter(k => k !== avoid);
    return l[Math.floor(Math.random() * l.length)];
  }

  // Temi scritti dall'utente (chiave «mio-...»): disponibili per tutte le classi e per gli adulti.
  function register(themes) {
    Object.keys(themes).forEach(k => {
      const t = themes[k];
      if (!k.startsWith('mio-') || !t || !Array.isArray(t.items) || !t.items.length) return;
      const noTag = x => String(x).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');   // via i caratteri di controllo (i testi si mostrano sempre come testo, mai come HTML)
      ALL[k] = { key: k, name: noTag(t.name || 'Il mio tema').slice(0, 40), icon: '✏️', levels: TUTTI,
                 items: t.items.slice(0, 300).map(i => [noTag(i[0]).slice(0, 12), noTag(i[1]).slice(0, 200)]) };
    });
  }
  function unregister(key) { if (key.startsWith('mio-')) delete ALL[key]; }

  // Prepara un testo per la lettura ad alta voce: sigle, riferimenti del Vangelo, simboli e numeri romani
  // si leggono come si pronunciano (a schermo il testo resta com'è). Es.: «753 a.C.» → «753 avanti Cristo».
  const LIBRI = { Mt: 'Matteo', Mc: 'Marco', Lc: 'Luca', Gv: 'Giovanni' };
  function speakable(text) {
    let t = String(text);
    if (t === t.toUpperCase() && /[A-ZÀ-ÖØ-Ý]/.test(t)) t = t.toLowerCase();   // un testo tutto in maiuscolo non va letto lettera per lettera
    return t
      .replace(/\b([ad])\.\s?C\./gi, (m, x) => x.toLowerCase() === 'a' ? 'avanti Cristo' : 'dopo Cristo')
      .replace(/\((Mt|Mc|Lc|Gv)\s*(\d+),\s*(\d+)\)/g, (m, b, c, v) => `, ${LIBRI[b]}, capitolo ${c}, versetto ${v}`)
      .replace(/\b1°/g, 'primo')
      .replace(/\bT\. rex\b/gi, 'Tirex')
      .replace(/\bDr\.\s/g, 'Dottor ')
      .replace(/\b([A-Z])\.\s(?=[A-Z])/g, '$1 ')            // iniziali: «A. A. Milne», «Monkey D. Rufy»
      .replace(/\bPaolo II\b/g, 'Paolo secondo').replace(/\bVaticano II\b/g, 'Vaticano secondo')
      .replace(/&/g, ' e ').replace(/×/g, ' per ').replace(/÷/g, ' diviso ').replace(/\+/g, ' più ')
      .replace(/−/g, ' meno ').replace(/=/g, ' fa ').replace(/%/g, ' per cento')
      .replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',');
  }

  g.TombolaTemi = { credit: k => (ALL[k] && ALL[k].credit) || '', LEVELS, CATEGORIES, register, unregister, size, speakable, themesFor, entry, pick, name: k => ALL[k] ? ALL[k].icon + ' ' + ALL[k].name : '' };
})(window);
