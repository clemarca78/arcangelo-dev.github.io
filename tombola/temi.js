// Tombola di Arcangelo Clemente.
// Smorfia per la scuola: a ogni numero estratto corrisponde un'immagine e una frase a tema.
// Classi: asilo (scuola dell'infanzia) e 1ª-5ª elementare.
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

  // ---------- API ----------
  const ALL = Object.assign({}, GEN, LISTE);
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
