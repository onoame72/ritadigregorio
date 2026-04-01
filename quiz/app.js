// Sii Gioia – Quiz Archetipi (static, GitHub Pages)

// Question order stays identical to the original web quiz.
// We update the wording + archetype names according to the latest version.

const QUESTIONS = [
  // 1 – 7 (interleaved)
  "Riesco a restare presente anche quando l’esperienza è instabile.",
  "Porto a termine ciò che inizio.",
  "So proteggere la mia energia nelle situazioni quotidiane.",
  "Riesco a trarre comprensione o orientamento dalle esperienze che vivo.",
  "Sono presente nella relazione senza dover aggiustare, cambiare o salvare l’altro.",
  "So dare una direzione chiara alle mie scelte.",
  "So dare senso alle esperienze che vivo.",

  // 8 – 14
  "La creatività dà movimento alla mia vita.",
  "So dire sì e so dire no in modo chiaro.",
  "Avanzo anche quando è faticoso, se sento che ne vale la pena.",
  "La chiarezza interiore mi sostiene.",
  "Posso attraversare il cambiamento senza perdere il mio centro.",
  "Mi assumo la responsabilità di ciò che faccio e di ciò che scelgo di non fare.",
  "Mi prendo cura senza annullarmi.",

  // 15 – 21
  "L’immaginazione è per me una risorsa concreta.",
  "Riconosco quando è il momento di fermarmi e lo rispetto.",
  "Affronto le difficoltà senza sottrarmi.",
  "Non ho bisogno di piacere a tutti per sentirmi importante.",
  "Riesco a cogliere il senso di ciò che vivo mentre accade.",
  "Ciò che offro agli altri nasce da un’esperienza integrata.",
  "Riconosco i bisogni emotivi miei e altrui senza fonderli.",

  // 22 – 28
  "Mi sento vivo/a quando creo.",
  "Non mi sento in colpa nel mettere limiti.",
  "Dirigo la mia energia verso ciò che mi fa crescere davvero.",
  "Integro ciò che accade invece di respingerlo.",
  "Resto in relazione senza perdermi né chiudermi.",
  "Contribuisco restando nel mio centro, senza sostituirmi agli altri.",
  "La connessione autentica mi nutre.",

  // 29 – 35
  "Riesco a rivedere il mio modo di agire quando serve.",
  "Riesco a tollerare l’incertezza senza bisogno di controllare tutto.",
  "Investo tempo e denaro in ciò che sostiene la mia evoluzione.",
  "Mi fido dei processi nel tempo.",
  "So osservare ciò che sto diventando mentre mi muovo.",
  "So distinguere quando il mio contributo è utile e quando diventa sacrificio.",
  "So stare nella relazione anche nei momenti difficili.",

  // 36 – 42
  "Porto nuove prospettive nelle situazioni che vivo.",
  "Anche quando le cose non vanno come previsto, sento di poter reggere la situazione.",
  "Sento allineati anima, mente e corpo nel mio percorso di crescita.",
  "Riesco a osservare prima di reagire.",
  "Contribuisco alla vita degli altri portando gioia, senza spostarmi dal mio centro.",
  "Il mio contributo è sostenibile nel tempo, anche sul piano dell’energia e delle risorse.",
  "Resto gentile anche quando è difficile.",

  // 43 – 49
  "Cambiare linguaggio o punto di vista modifica il mio modo di sentire le situazioni.",
  "Mettere confini mi aiuta a restare centrato/a.",
  "Le difficoltà diventano occasioni di apprendimento.",
  "Il mio valore non dipende dal giudizio degli altri.",
  "So restare presente anche nelle emozioni intense.",
  "La mia presenza orienta senza imporsi.",
  "L’amore che offro non è sacrificio."
];

// Question → Archetype mapping (keeps the original interleaving)
const Q_TO_ARCH = {
  // Testimone della Gioia
  "1": "TestimoneGioia", "12": "TestimoneGioia", "19": "TestimoneGioia", "26": "TestimoneGioia", "33": "TestimoneGioia", "40": "TestimoneGioia", "47": "TestimoneGioia",
  // Eroe
  "2": "Eroe", "10": "Eroe", "17": "Eroe", "24": "Eroe", "31": "Eroe", "38": "Eroe", "45": "Eroe",
  // Custode
  "3": "Custode", "9": "Custode", "16": "Custode", "23": "Custode", "30": "Custode", "37": "Custode", "44": "Custode",
  // Mago
  "4": "Mago", "8": "Mago", "15": "Mago", "22": "Mago", "29": "Mago", "36": "Mago", "43": "Mago",
  // Amante
  "5": "Amante", "14": "Amante", "21": "Amante", "28": "Amante", "35": "Amante", "42": "Amante", "49": "Amante",
  // Re
  "6": "Re", "13": "Re", "20": "Re", "27": "Re", "34": "Re", "41": "Re", "48": "Re",
  // Saggio
  "7": "Saggio", "11": "Saggio", "18": "Saggio", "25": "Saggio", "32": "Saggio", "39": "Saggio", "46": "Saggio"
};

// Result copy follows the agreed rule:
// - Dominant archetype = need currently well-satisfied (resource)
// - Bottom archetypes = needs that ask for attention (work areas)
const RESULTS = {
  "Custode": {
    title: "Il Custode",
    symbol: "Talismano di confine",
    need: "Sicurezza",
    text: "Il tuo bisogno di sicurezza è ben nutrito. Proteggi la tua energia, riconosci i limiti, scegli confini chiari e resti centrato/a anche nell’incertezza.",
    advice: "Area di lavoro: confini, riposo, protezione dell’energia, fiducia nel poter reggere l’incertezza."
  },
  "Mago": {
    title: "Il Mago",
    symbol: "Bacchetta",
    need: "Varietà",
    text: "Il tuo bisogno di varietà è ben nutrito. Cambi prospettiva, crei movimento, trasformi l’esperienza in nuove possibilità concrete.",
    advice: "Area di lavoro: introdurre piccole variazioni, riaprire creatività, cambiare linguaggio e punti di vista, uscire dalla ripetizione."
  },
  "Saggio": {
    title: "Il Saggio",
    symbol: "Piuma",
    need: "Significato",
    text: "Il tuo bisogno di significato è ben nutrito. Dai senso all’esperienza, resti coerente ai tuoi valori e non hai bisogno di piacere a tutti per sentirti importante.",
    advice: "Area di lavoro: chiarire valori, osservare prima di reagire, integrare ciò che accade, dare senso invece di subire."
  },
  "Amante": {
    title: "L’Amante",
    symbol: "Cuore",
    need: "Amore",
    text: "Il tuo bisogno di amore e connessione è ben nutrito. Stai in relazione senza salvare né annullarti. Gentilezza, confini e reciprocità restano presenti.",
    advice: "Area di lavoro: presenza nella relazione, confini emotivi, comunicazione dei bisogni, distinzione tra amore e sacrificio."
  },
  "Eroe": {
    title: "L’Eroe",
    symbol: "Pietra",
    need: "Crescita",
    text: "Il tuo bisogno di crescita è ben nutrito. Procedi anche nella fatica quando ne vale la pena, investi su di te e trasformi le difficoltà in apprendimento.",
    advice: "Area di lavoro: piccoli passi sostenibili, motivazione legata al senso, allineamento anima-mente-corpo, investimento consapevole su di te."
  },
  "Re": {
    title: "Il Re",
    symbol: "Corona",
    need: "Contributo",
    text: "Il tuo bisogno di contributo è ben nutrito. Dai direzione, assumi responsabilità e orienti senza imporsi. Il tuo contributo resta sostenibile.",
    advice: "Area di lavoro: direzione chiara, contributo sostenibile, distinzione tra aiutare e sostituirsi, valorizzare l’esperienza integrata."
  },
  "TestimoneGioia": {
    title: "Il Testimone della Gioia",
    symbol: "Luce",
    need: "Integrazione",
    text: "La tua presenza integra più bisogni insieme. Resti presente anche nelle emozioni intense e porti gioia come effetto dell’allineamento.",
    advice: "Area di lavoro: presenza nel qui e ora, osservazione senza giudizio, integrazione delle emozioni, contatto con l’esperienza."
  }
};

// Scoring rules (0–10 scale, sum of 7 items per archetype)
// Max per archetype = 70. Threshold 80% = 56.
const MAX_ARCH_SCORE = 70;
const THRESH = 56;
// Set to 1 or 2. With 0–70 totals, 2 is a good default.
const DELTA = 2;

const ARCHETYPES_6 = ["Custode","Mago","Saggio","Amante","Eroe","Re"];

// Images (file names match archetypes)
const ARCH_IMG = {
  "Custode": "custode.png",
  "Mago": "mago.png",
  "Saggio": "saggio.png",
  "Amante": "amante.png",
  "Eroe": "eroe.png",
  "Re": "re.png",
  "TestimoneGioia": "testimone.png"
};

function imgTag(key, size = "large") {
  const src = ARCH_IMG[key] || "";
  const alt = RESULTS[key]?.title || key;
  const cls = size === "small" ? "arch-img small" : "arch-img";
  return `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" />`;
}

// SVG cards (same style, updated titles)
const SVG_BASE = (title, subtitle) => `\
<svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">\
  <defs>\
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\
      <stop offset="0" stop-color="#2c6e7a" stop-opacity="1"/>\
      <stop offset="1" stop-color="#d1b26f" stop-opacity="1"/>\
    </linearGradient>\
    <radialGradient id="r" cx="25%" cy="20%" r="90%">\
      <stop offset="0" stop-color="#d1b26f" stop-opacity="0.35"/>\
      <stop offset="1" stop-color="#0d0f14" stop-opacity="1"/>\
    </radialGradient>\
  </defs>\
  <rect x="0" y="0" width="900" height="560" rx="36" fill="url(#r)"/>\
  <circle cx="700" cy="160" r="140" fill="url(#g)" opacity="0.22"/>\
  <circle cx="270" cy="410" r="200" fill="url(#g)" opacity="0.14"/>\
  <path d="M140 300 C260 210, 360 210, 480 300 C600 390, 700 390, 820 300" fill="none" stroke="url(#g)" stroke-width="10" opacity="0.55"/>\
  <text x="70" y="210" font-size="58" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#f4f6f8" font-weight="900">${title}</text>\
  <text x="70" y="260" font-size="22" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#9aa3ad">Simbolo: ${subtitle}</text>\
  <text x="70" y="312" font-size="20" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#9aa3ad">Sii Gioia · Quiz esperienziale</text>\
</svg>`;

const SVG = {
  "Saggio": SVG_BASE("Il Saggio", RESULTS["Saggio"].symbol),
  "Custode": SVG_BASE("Il Custode", RESULTS["Custode"].symbol),
  "Amante": SVG_BASE("L’Amante", RESULTS["Amante"].symbol),
  "Mago": SVG_BASE("Il Mago", RESULTS["Mago"].symbol),
  "Eroe": SVG_BASE("L’Eroe", RESULTS["Eroe"].symbol),
  "Re": SVG_BASE("Il Re", RESULTS["Re"].symbol),
  "TestimoneGioia": `
<svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Il Testimone della Gioia">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2c6e7a" stop-opacity="1"/>
      <stop offset="1" stop-color="#d1b26f" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="r" cx="25%" cy="20%" r="90%">
      <stop offset="0" stop-color="#d1b26f" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0d0f14" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="900" height="560" rx="36" fill="url(#r)"/>
  <circle cx="700" cy="160" r="140" fill="url(#g)" opacity="0.22"/>
  <circle cx="270" cy="410" r="200" fill="url(#g)" opacity="0.14"/>
  <path d="M140 300 C260 210, 360 210, 480 300 C600 390, 700 390, 820 300" fill="none" stroke="url(#g)" stroke-width="10" opacity="0.55"/>
  <text x="70" y="200" font-size="44" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#f4f6f8" font-weight="900">Il Testimone</text>
  <text x="70" y="250" font-size="44" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#f4f6f8" font-weight="900">della Gioia</text>
  <text x="70" y="300" font-size="22" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#9aa3ad">Simbolo: ${RESULTS["TestimoneGioia"].symbol}</text>
  <text x="70" y="350" font-size="20" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#9aa3ad">Sii Gioia · Quiz esperienziale</text>
</svg>`
};

const introCard = document.getElementById('introCard');
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const copyBtn = document.getElementById('copyBtn');

const qNum = document.getElementById('qNum');
const qText = document.getElementById('qText');
const numScale = document.getElementById('numScale');
const barFill = document.getElementById('barFill');
const progressPill = document.getElementById('progressPill');

const resultLead = document.getElementById('resultLead');
const mainTitle = document.getElementById('mainTitle');
const mainNeed = document.getElementById('mainNeed');
const mainText = document.getElementById('mainText');
const mainImage = document.getElementById('mainImage');

const work1Title = document.getElementById('work1Title');
const work1Need = document.getElementById('work1Need');
const work1Text = document.getElementById('work1Text');
const work1Image = document.getElementById('work1Image');

const work2Title = document.getElementById('work2Title');
const work2Need = document.getElementById('work2Need');
const work2Text = document.getElementById('work2Text');
const work2Image = document.getElementById('work2Image');

const closingText = document.getElementById('closingText');
const scoreTable = document.getElementById('scoreTable');

let idx = 0;
let answers = new Array(QUESTIONS.length).fill(null);

// Current value (0–10) selected on the numeric scale
let currentRating = null;

// Keep the last computed result in memory (no saving of answers/results)
let lastResult = null;



function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function updateProgress() {
  progressPill.textContent = `${idx+1} / ${QUESTIONS.length}`;
  barFill.style.width = `${Math.round(((idx+1)/QUESTIONS.length)*100)}%`;
}

function render() {
  qNum.textContent = `Domanda ${idx+1}`;
  qText.textContent = QUESTIONS[idx];
  const v = answers[idx];
  currentRating = v;
  updateNumScaleUI(v);
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = v === null;
  nextBtn.textContent = (idx === QUESTIONS.length - 1) ? "Vedi risultato" : "Avanti";
  updateProgress();
}

function updateNumScaleUI(value) {
  if (!numScale) return;
  const buttons = numScale.querySelectorAll('button.num-btn');
  buttons.forEach(btn => {
    const v = Number(btn.dataset.value);
    const active = value !== null && v === Number(value);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function computeScores() {
  const scores = {"Saggio":0,"Custode":0,"Amante":0,"Mago":0,"Eroe":0,"Re":0,"TestimoneGioia":0};
  for (let i=0;i<answers.length;i++) {
    const arch = Q_TO_ARCH[String(i+1)];
    const val = answers[i];
    if (val === null || val === undefined) continue;
    scores[arch] += Number(val);
  }
  return scores;
}

function sortArchetypes(scores) {
  const keys = ARCHETYPES_6; // 6 bisogni
  const priority = {"Custode":0,"Mago":1,"Saggio":2,"Amante":3,"Eroe":4,"Re":5};
  const arr = keys.map(k => ({ key:k, value:scores[k] }));
  arr.sort((a,b) => {
    if (b.value !== a.value) return b.value - a.value;
    return priority[a.key] - priority[b.key];
  });
  return arr;
}

function computeProfile(scores) {
  // Testimone della Gioia gating
  const allNeedsAbove = ARCHETYPES_6.every(k => (scores[k] ?? 0) >= THRESH);
  const witnessAbove = (scores["TestimoneGioia"] ?? 0) >= THRESH;
  const witnessActive = allNeedsAbove && witnessAbove;

  const ordered = sortArchetypes(scores);
  const top1 = ordered[0];
  const topBand = ordered.filter(x => (top1.value - x.value) <= DELTA);

  let profileType = "singolo";
  let dominants = [top1.key];

  if (witnessActive) {
    profileType = "testimone_gioia";
    dominants = ["TestimoneGioia"];
  } else if (topBand.length >= 3 && top1.value >= 42) {
    profileType = "ampio_integrato";
    dominants = topBand.map(x => x.key);
  } else if (ordered.length >= 2 && (ordered[0].value - ordered[1].value) <= DELTA) {
    profileType = "misto";
    dominants = [ordered[0].key, ordered[1].key];
  }

  // Aree di lavoro: escludi i dominanti e prendi gli ultimi 2 (punteggi più bassi)
  const workAreas = ordered.filter(x => !dominants.includes(x.key));
  
  // Se non ci sono aree di lavoro (tutti dominanti), prendi gli ultimi 2 dall'ordinamento completo
  let bottom1, bottom2;
  if (workAreas.length < 2) {
    bottom1 = ordered[ordered.length - 1];
    bottom2 = ordered[ordered.length - 2];
  } else {
    bottom1 = workAreas[workAreas.length - 1];
    bottom2 = workAreas[workAreas.length - 2];
  }
  
  // Se hanno lo stesso punteggio, ordina per priorità
  if (bottom1.value === bottom2.value) {
    const priority = {"Custode":0,"Mago":1,"Saggio":2,"Amante":3,"Eroe":4,"Re":5};
    const bottomPair = [bottom1, bottom2].sort((a,b) => priority[a.key] - priority[b.key]);
    return { witnessActive, profileType, dominants, bottom1: bottomPair[0], bottom2: bottomPair[1], ordered, topBand };
  }

  return { witnessActive, profileType, dominants, bottom1, bottom2, ordered, topBand };
}

function makeScoreRow(label, need, value) {
  const div = document.createElement('div');
  div.className = 'score-row';
  div.innerHTML = `<span>${label} <span style="opacity:.75">· ${need}</span></span><strong>${value}</strong>`;
  return div;
}

function showResults() {
  const scores = computeScores();
  const p = computeProfile(scores);

  lastResult = { scores, profile: p };

  hide(introCard);
  hide(quizCard);
  show(resultCard);

//  resultLead.textContent = "Punteggio alto = bisogno oggi ben soddisfatto (risorsa). Punteggio basso = bisogno che chiede più spazio (area di lavoro).";
  resultLead.textContent = "";

  // Dominant / Mixed / Wide / Witness
  if (p.profileType === "testimone_gioia") {
    const r = RESULTS["TestimoneGioia"];
    mainTitle.textContent = r.title;
    mainNeed.textContent = `Meta-archetipo · ${r.need}`;
    mainText.textContent = r.text;
    mainImage.innerHTML = imgTag("TestimoneGioia");
  } else if (p.profileType === "misto") {
    const a = RESULTS[p.dominants[0]];
    const b = RESULTS[p.dominants[1]];
    const topScore = p.ordered[0].value;
    mainTitle.textContent = `Profilo misto: ${a.title} + ${b.title}`;
    mainNeed.textContent = `Bisogni: ${a.need} · ${b.need}`;
    if (topScore < 42) {
      mainText.textContent = `I punteggi indicano che tutti i bisogni richiedono attenzione. ${a.title} e ${b.title} emergono come aree relativamente meno critiche, ma necessitano comunque di essere rafforzate.`;
    } else {
      mainText.textContent = `${a.text} ${b.text}`;
    }
    mainImage.innerHTML = `<div class="img-grid">${imgTag(p.dominants[0])}${imgTag(p.dominants[1])}</div>`;
  } else if (p.profileType === "ampio_integrato") {
    const titles = p.dominants.map(k => RESULTS[k].title).join(" · ");
    const needs = p.dominants.map(k => RESULTS[k].need).join(" · ");
    const topScore = p.ordered[0].value;
    mainTitle.textContent = "Profilo ampio / integrato";
    mainNeed.textContent = `Risorse principali: ${titles}`;
    if (topScore < 42) {
      mainText.textContent = `I punteggi indicano che tutti i bisogni richiedono attenzione. Tutti gli archetipi emergono come aree da rafforzare.`;
    } else {
      mainText.textContent = `In questo momento più bisogni risultano ben soddisfatti. Hai accesso a più risorse contemporaneamente: ${needs}.`;
    }
    mainImage.innerHTML = `<div class="img-grid">${p.dominants.map(k => imgTag(k)).join("")}</div>`;
  } else {
    const rD = RESULTS[p.dominants[0]];
    const topScore = p.ordered[0].value;
    mainTitle.textContent = rD.title;
    mainNeed.textContent = `Bisogno: ${rD.need}`;
    if (topScore < 42) {
      mainText.textContent = `I punteggi indicano che tutti i bisogni richiedono attenzione. ${rD.title} emerge come area relativamente meno critica, ma necessita comunque di essere rafforzato.`;
    } else {
      mainText.textContent = rD.text;
    }
    mainImage.innerHTML = imgTag(p.dominants[0]);
  }

  const rB1 = RESULTS[p.bottom1.key];
  work1Title.textContent = rB1.title;
  work1Need.textContent = `Bisogno: ${rB1.need}`;
  work1Text.textContent = rB1.advice;
  work1Image.innerHTML = imgTag(p.bottom1.key, "small");

  const rB2 = RESULTS[p.bottom2.key];
  work2Title.textContent = rB2.title;
  work2Need.textContent = `Bisogno: ${rB2.need}`;
  work2Text.textContent = rB2.advice;
  work2Image.innerHTML = imgTag(p.bottom2.key, "small");

  const test = RESULTS["TestimoneGioia"];
  closingText.innerHTML = `
    <strong>Chiavi di lettura</strong><br/>
    • Punteggio alto = bisogno oggi ben soddisfatto (risorsa). Punteggio basso = bisogno che chiede più spazio (area di lavoro).<br/>
    • L’archetipo dominante indica il bisogno oggi più soddisfatto: è una risorsa disponibile.<br/>
    • Gli archetipi con punteggio più basso indicano i bisogni che chiedono più spazio: sono le aree di lavoro del percorso.<br/>
    <br/>
    Il <strong>${test.title}</strong> è il meta-archetipo: emerge quando più bisogni diventano abitabili insieme. La gioia, qui, è un effetto dell’integrazione.
  `;

  scoreTable.innerHTML = "";
  scoreTable.appendChild(makeScoreRow("Il Custode", RESULTS["Custode"].need, scores["Custode"]));
  scoreTable.appendChild(makeScoreRow("Il Mago", RESULTS["Mago"].need, scores["Mago"]));
  scoreTable.appendChild(makeScoreRow("Il Saggio", RESULTS["Saggio"].need, scores["Saggio"]));
  scoreTable.appendChild(makeScoreRow("L’Amante", RESULTS["Amante"].need, scores["Amante"]));
  scoreTable.appendChild(makeScoreRow("L’Eroe", RESULTS["Eroe"].need, scores["Eroe"]));
  scoreTable.appendChild(makeScoreRow("Il Re", RESULTS["Re"].need, scores["Re"]));
  scoreTable.appendChild(makeScoreRow("Il Testimone della Gioia", RESULTS["TestimoneGioia"].need, scores["TestimoneGioia"]));

  // Note: answers and result are not saved or collected.
}

function restart() {
  idx = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  lastResult = null;
  hide(resultCard);
  show(introCard);
  progressPill.textContent = `0 / ${QUESTIONS.length}`;
}

startBtn.addEventListener('click', () => {
  hide(introCard);
  hide(resultCard);
  show(quizCard);
  idx = 0;
  render();
});

// Numeric scale (0–10) selection
if (numScale) {
  numScale.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('button.num-btn');
    if (!btn) return;
    const v = Number(btn.dataset.value);
    if (Number.isNaN(v)) return;
    currentRating = v;
    updateNumScaleUI(v);
    nextBtn.disabled = false;
  });
}

nextBtn.addEventListener('click', () => {
  answers[idx] = Number(currentRating);
  if (idx === QUESTIONS.length - 1) {
    showResults();
    return;
  }
  idx += 1;
  render();
});

prevBtn.addEventListener('click', () => {
  answers[idx] = Number(currentRating);
  if (idx > 0) idx -= 1;
  render();
});

restartBtn.addEventListener('click', restart);



copyBtn.addEventListener('click', async () => {
  try {
    const prof = lastResult?.profile;
    const doms = prof?.dominants || [];
    const b1 = prof?.bottom1?.key;
    const b2 = prof?.bottom2?.key;

    const lines = [];
    if (doms.length) {
      if (prof?.profileType === "testimone_gioia") {
        lines.push(`Profilo: ${RESULTS["TestimoneGioia"].title}`);
        lines.push(RESULTS["TestimoneGioia"].text);
      } else if (prof?.profileType === "misto") {
        lines.push(`Profilo misto: ${RESULTS[doms[0]].title} + ${RESULTS[doms[1]].title}`);
        lines.push(RESULTS[doms[0]].text);
        lines.push(RESULTS[doms[1]].text);
      } else if (prof?.profileType === "ampio_integrato") {
        lines.push(`Profilo ampio / integrato: ${doms.map(k => RESULTS[k].title).join(" · ")}`);
      } else {
        lines.push(`Archetipo dominante: ${RESULTS[doms[0]].title} (Bisogno: ${RESULTS[doms[0]].need})`);
        lines.push(RESULTS[doms[0]].text);
      }
    }
    if (b1) {
      lines.push("");
      lines.push(`Area di lavoro: ${RESULTS[b1].title} (Bisogno: ${RESULTS[b1].need})`);
      lines.push(RESULTS[b1].advice);
    }
    if (b2) {
      lines.push("");
      lines.push(`Area di lavoro: ${RESULTS[b2].title} (Bisogno: ${RESULTS[b2].need})`);
      lines.push(RESULTS[b2].advice);
    }
    lines.push("");
    lines.push(`${RESULTS["TestimoneGioia"].title}: ${RESULTS["TestimoneGioia"].text}`);

    if (!lines.length) throw new Error("no_result");
    await navigator.clipboard.writeText(lines.join("\n"));
    copyBtn.textContent = "Copiato!";
    setTimeout(() => (copyBtn.textContent = "Copia risultato"), 1400);
  } catch(e) {
    copyBtn.textContent = "Non disponibile";
    setTimeout(() => (copyBtn.textContent = "Copia risultato"), 1400);
  }
});
