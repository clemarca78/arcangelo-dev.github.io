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

  // ---------- API ----------
  const ALL = Object.assign({}, GEN, LISTE, CARTONI, CARTONI_OGGI, FESTE, GIOCHI, VIDEOGIOCHI, ANIME, MURPHY, SCUOLA_CARTONI, ANIMALI, REGIONI, FEDE, MATEMATICA, ADULTI);
  Object.keys(ALL).forEach(k => { ALL[k].key = k; });

  // Categorie per ordinare i menu (un tema sta in una sola categoria).
  const C = { mix: '🎲 Mix di temi', scuola: '📚 Scuola', cartoni: '📺 Cartoni, giochi e supereroi', animali: '🐾 Animali', regioni: "🇮🇹 Regioni d'Italia",
              feste: '🎉 Feste e tradizioni', fede: '✝️ Santi, Chiesa e Vangelo', divertente: '😂 Divertente', cultura: '🎵 Cultura e passioni', mate: '📐 Matematica e statistica', mio: '✏️ I miei temi' };
  const CATEGORIES = [C.mix, C.scuola, C.cartoni, C.animali, C.regioni, C.feste, C.fede, C.divertente, C.cultura, C.mate, C.mio];
  const CAT_KEYS = {
    [C.animali]: ['animali-versi', 'animali-classi', 'animali-curiosita', 'cuccioli', 'animali-habitat', 'dinosauri-tema', 'animali-modi-di-dire'],
    [C.cartoni]: ['cartoni', 'disney', 'cartoni-oggi', 'cartoni-80-90', 'ghibli', 'anime-classici', 'anime-oggi', 'super-mario', 'roblox', 'one-piece', 'minecraft', 'supereroi',
                  'videogiochi-classici', 'videogiochi-oggi', 'console', 'pokemon', 'conta-cartoni', 'problemi-piccoli', 'problemi-grandi', 'alfabeto-cartoni', 'colori-cartoni', 'cartoni-nel-mondo', 'inglese-cartoni'],
    [C.mate]: ['matematica'], [C.feste]: ['feste'], [C.fede]: ['santi', 'chiesa', 'gesu'], [C.divertente]: ['verita', 'mamma', 'proverbi', 'modi-di-dire', 'murphy'], [C.cultura]: ['musica', 'sport', 'cinema', 'sapori', 'capitali', 'cultura']
  };
  function catOf(key) {
    if (key.startsWith('mix-')) return C.mix;
    if (key.startsWith('mio-')) return C.mio;
    if (key === 'puglia' || key === 'regioni' || key.startsWith('reg-')) return C.regioni;
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
      [['scuola', C.scuola], ['cartoni', C.cartoni], ['animali', C.animali], ['regioni', C.regioni], ['fede', C.fede], ['divertente', C.divertente], ['cultura', C.cultura]]
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
    return { e: it[0], t: it[1] };
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
      ALL[k] = { key: k, name: String(t.name || 'Il mio tema').slice(0, 40), icon: t.icon || '✏️', levels: TUTTI,
                 items: t.items.slice(0, 300).map(i => [String(i[0]).slice(0, 12), String(i[1]).slice(0, 200)]) };
    });
  }
  function unregister(key) { if (key.startsWith('mio-')) delete ALL[key]; }

  // Prepara un testo per la lettura ad alta voce: sigle, riferimenti del Vangelo, simboli e numeri romani
  // si leggono come si pronunciano (a schermo il testo resta com'è). Es.: «753 a.C.» → «753 avanti Cristo».
  const LIBRI = { Mt: 'Matteo', Mc: 'Marco', Lc: 'Luca', Gv: 'Giovanni' };
  function speakable(text) {
    return String(text)
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

  g.TombolaTemi = { LEVELS, CATEGORIES, register, unregister, size, speakable, themesFor, entry, pick, name: k => ALL[k] ? ALL[k].icon + ' ' + ALL[k].name : '' };
})(window);
