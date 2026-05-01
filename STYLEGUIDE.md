# Styleguide — ritadigregorio.it

Documento di riferimento per la manutenzione e l'aggiornamento del sito. Le regole qui dentro sono vincolanti: chi modifica il sito (umano o agente) deve seguirle o motivare esplicitamente la deviazione.

La parola **deve** indica una regola obbligatoria, **dovrebbe** una forte preferenza, **può** una scelta lasciata al contesto.

---

## 1. Architettura

### 1.1 Stack
- Sito statico su GitHub Pages, dominio `ritadigregorio.it`.
- Nessun framework, nessun bundler runtime.
- Build locale tramite `build.py` (Python 3.8+, solo stdlib) che assembla pagine HTML da template + partial.
- Web-app interattive (`quiz/`, `lifestyle-matrix/`) restano applicazioni indipendenti con regole proprie.

### 1.2 Struttura cartelle
```
/
├── pages/                 # Sorgenti delle pagine (template con placeholder)
│   ├── index.html
│   ├── chi-sono.html
│   ├── media.html
│   ├── webinar.html
│   ├── siigioia.html
│   └── lifestyle-matrix.html
├── partials/              # Frammenti HTML riutilizzati
│   ├── head.html
│   ├── topbar.html
│   ├── footer.html
│   └── cookie-banner.html
├── assets/
│   ├── css/
│   │   ├── tokens.css     # Variabili CSS (colori, font, spazi)
│   │   ├── base.css       # Reset + elementi base (body, h1-h3, .btn)
│   │   └── components.css # Componenti (.topbar, .footer, .card, ...)
│   └── js/
│       ├── cookies.js     # Gestione consenso + GA
│       └── ui.js          # Hamburger, scroll animations, floating CTA
├── images/
├── slides/
├── quiz/                  # App indipendente
├── lifestyle-matrix/      # App Firebase indipendente
├── content.json           # Dati condivisi (WhatsApp, email, GA ID, URL Brevo)
├── build.py               # Generatore delle pagine
├── sitemap.xml            # Generato da build.py
├── robots.txt
├── CNAME
├── favicon.ico
└── STYLEGUIDE.md
```

Le pagine **finali** (`index.html`, ecc.) vivono nella **root** perché GitHub Pages le serve da lì. Le **sorgenti** (`pages/*.html`) sono template: non vanno pubblicate, ma non danno fastidio se presenti (non sono linkate). In alternativa si può ignorare `pages/` via `.gitattributes export-ignore` se mai useremo artifact.

Decisione operativa: **teniamo sia sorgente che output nel repo**. L'output è rigenerato, il sorgente è la verità.

### 1.3 Source of truth
- Unico repo: `/home/teionam/ritadigregorio` (git).
- La copia in OneDrive è una comodità locale, non una fonte. Se diverge, vince git.
- Ogni modifica deve passare per `build.js` prima del commit.

---

## 2. Design tokens

**Regola**: nessun valore di colore, font, dimensione o raggio deve essere hard-coded nelle pagine o nei componenti. Tutto passa da `assets/css/tokens.css`.

### 2.1 Colori
| Token | Valore | Uso |
|---|---|---|
| `--color-bg-dark` | `#111` | Sfondo topbar, footer, hero scuri, box CTA |
| `--color-bg-dark-2` | `#1a1a1a` | Box interni su sfondo scuro (event-box, price-card interno) |
| `--color-bg-light` | `#fff` | Sfondo sezioni bianche |
| `--color-bg-alt` | `#faf8f5` | Sfondo sezioni alternate (unico beige canonico) |
| `--color-gold` | `#c8a96a` | Accento primario, CTA, bordi decorativi |
| `--color-text` | `#111` | Testo su sfondo chiaro |
| `--color-text-muted` | `#666` | Testo secondario su sfondo chiaro |
| `--color-text-on-dark` | `#fff` | Testo su sfondo scuro |
| `--color-text-on-dark-muted` | `rgba(255,255,255,0.6)` | Testo informativo su scuro |
| `--color-text-on-dark-subtle` | `rgba(255,255,255,0.3)` | Copyright, disclaimer |
| `--color-border-subtle` | `#ddd` | Divider su sfondo chiaro |
| `--color-border-dark` | `#222` | Divider su sfondo scuro |

Il beige `#f9f6f0` presente su `lifestyle-matrix.html` **deve** essere uniformato a `#faf8f5`.

### 2.2 Tipografia
| Token | Valore |
|---|---|
| `--font-heading` | `'Playfair Display', serif` |
| `--font-body` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--fs-h1` | `48px` |
| `--fs-h1-mobile` | `28px` |
| `--fs-h2` | `32px` |
| `--fs-h2-mobile` | `24px` |
| `--fs-h3` | `22px` |
| `--fs-body` | `18px` |
| `--fs-body-mobile` | `16px` |
| `--fs-small` | `14px` |
| `--fs-xsmall` | `12px` |
| `--lh-body` | `1.7` |
| `--lh-heading` | `1.3` |
| `--ls-wide` | `2px` |
| `--ls-xwide` | `4px` |

Tutti gli `h1` **devono** avere la stessa dimensione (48px desktop / 28px mobile). Le varianti attuali (42px, 38px) vanno normalizzate.

Colore di default dei titoli:
- `h1` eredita il colore del contesto (nero su chiaro, bianco su scuro).
- `h2` è oro (`--color-gold`) su tutti i contesti. Se serve un h2 che erediti il colore del testo, usare una classe esplicita.
- `h3` eredita il colore del contesto, salvo classi di componente che lo sovrascrivono (`.pillar h3`, `.price-card__title`, ecc.).

### 2.3 Layout
| Token | Valore |
|---|---|
| `--container-max` | `1100px` (pagine con griglia) |
| `--content-max` | `700px` (pagine di testo lungo) |
| `--radius-md` | `6px` (bottoni, input) |
| `--radius-lg` | `10px` (card, box) |
| `--radius-pill` | `30px` (floating CTA) |
| `--shadow-hover` | `0 10px 20px rgba(0,0,0,0.2)` |
| `--shadow-card` | `0 8px 24px rgba(0,0,0,0.1)` |
| `--bp-mobile` | `768px` |
| `--space-section` | `60px 20px` |

Il breakpoint **deve** essere 768px ovunque. La variante 600px presente su `lifestyle-matrix.html` va corretta.

### 2.4 Transizioni
- Hover standard: `transition: 0.3s`.
- Animazioni di scroll (`.card.show`, `.split.show`): `transition: 0.6s`–`0.8s`.

---

## 3. Componenti

Ogni componente è definito una sola volta in `assets/css/components.css` e usato uguale ovunque.

### 3.1 `.topbar`
Barra superiore con logo + menu. Identica in tutte le pagine. Navigazione: Home, Chi Sono, Media, Lifestyle Matrix, Sii Gioia. Aggiornare l'elenco **solo** in `partials/topbar.html`.

### 3.2 `.btn`
Bottone dorato primario. Per varianti usare modificatori:
- `.btn` = pieno oro, testo bianco
- `.btn--outline` = trasparente con bordo oro
- `.btn--dark` = su fondo scuro (se mai serve variante)

### 3.3 `.hero`
Sezione di apertura. Un solo nome di classe. Modificatori:
- `.hero` = pagina home (immagine + titolo)
- `.hero--dark` = fondo scuro (chi-sono, media, webinar, siigioia, lifestyle-matrix)
- `.hero--centered` = contenuto centrato

Vietato creare `.hero-chi`, `.hero-lm`, `.hero-media`. Se già esistono nel codice legacy, si migrano.

### 3.4 `.section` / `.section-alt`
Contenitore di contenuto a tutta larghezza. `.section` sfondo bianco, `.section-alt` beige `--color-bg-alt`.

Regola alternanza: dopo l'hero, alternare `.section` (bianco) e `.section-alt`, partendo da bianco. Ogni volta che si aggiunge o rimuove una sezione, **verificare** che l'alternanza sia rispettata lungo tutta la pagina.

### 3.5 `.card`
Blocco con immagine + titolo + descrizione. Usato per i "percorsi" della home. Modificatori:
- `.card--percorso` = fondo scuro (ex `.percorso-box`)

### 3.6 `.price-card`
Blocco prezzo con titolo, lista feature, prezzo, CTA. Modificatore `.price-card--featured` aggiunge badge "Consigliato".

### 3.7 `.event-box`
Box scuro con bordo oro per informazioni di evento/sessioni.

### 3.8 `.footer`
Footer con social, Iubenda, copyright. Modificare **solo** `partials/footer.html`.

### 3.9 `.cookie-banner`
Banner consenso. Modificare **solo** `partials/cookie-banner.html` e `assets/js/cookies.js`.

### 3.10 `.floating-cta`
Pulsante WhatsApp fisso in basso a destra, compare dopo 600px di scroll. Gestito da `assets/js/ui.js`.

---

## 4. HTML semantico

Regole:
- `<header>` per la topbar, non `<div class="topbar">`.
- `<nav>` per il menu.
- `<main>` per il contenuto principale di ogni pagina.
- `<section>` per le sezioni di contenuto (con classe `.section` / `.section-alt` per lo stile).
- `<footer>` per il footer.
- `<button>` per le interazioni JS (hamburger), mai `<div>` con onclick.

Accessibilità minima obbligatoria:
- Hamburger: `<button aria-label="Apri menu" aria-expanded="false" aria-controls="main-nav">`. Il JS aggiorna `aria-expanded`.
- Skip link "Salta al contenuto" in cima a ogni pagina, puntato a `<main id="main">`.
- `<img>` sempre con `alt` descrittivo. `alt=""` solo per immagini puramente decorative.
- Focus visibile: `:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }`.
- Link esterni: `target="_blank" rel="noopener"`.

---

## 5. Naming

### 5.1 File
- Tutti i nomi file in **kebab-case**, minuscolo, senza spazi, senza caratteri accentati.
- Estensioni immagine in minuscolo (`.jpg`, non `.JPG`; scegliere una tra `.jpg` e `.jpeg` per lo stesso scopo).
- `siigioia.html` va rinominato `sii-gioia.html` in un intervento dedicato (richiede redirect, si valuta a parte).
- File immagini con spazi o typo (storico: `challenge 1.png`, `chellenge 5.png`) vanno rinominati secondo questa convenzione. La challenge è stata risolta in un commit dedicato.

### 5.2 Classi CSS
- **Blocco**: nome breve, kebab-case (`card`, `price-card`, `topbar`, `cookie-banner`).
- **Elemento**: `blocco__elemento` (`card__title`, `topbar__nav`).
- **Modificatore**: `blocco--modificatore` (`price-card--featured`, `hero--dark`, `btn--outline`).
- **Utility**: prefisso `u-` (`u-text-center`, `u-mt-0`). Usare con parsimonia; preferire classi semantiche.

### 5.3 ID
- Solo dove serve: anchor link (`#pacchetti`) o hook JS (`#cookie-banner`, `#floating-cta`).
- Sempre kebab-case.

### 5.4 Immagini
Convenzione nuova: `{scope}-{descrittore}-{indice}.{ext}`.
- `hero-rita.avif`
- `home-visione.png` (ex `visione.png`)
- `challenge-1.png`
- `evento-07.jpg`

I file esistenti si rinominano in un intervento di pulizia dedicato. Finché non si fa, almeno **non introdurre nuovi nomi sbagliati**.

---

## 6. CSS

### 6.1 Ordine di inclusione
In ogni pagina, nell'ordine:
1. `assets/css/tokens.css`
2. `assets/css/base.css`
3. `assets/css/components.css`
4. Eventuale CSS specifico della pagina in `<style>` inline (solo per casi davvero unici)

### 6.2 Regole di stile
- **Nessun `style="..."` inline** nelle pagine, salvo eccezioni motivate (es. background immagine dinamica). Se serve ripetuta personalizzazione, si crea una classe.
- **Nessun valore letterale** di colore/dimensione nel CSS: usare i token.
- Media query: `@media (max-width: var(--bp-mobile))` non è supportato; usare `@media (max-width: 768px)` e commentare `/* --bp-mobile */`. In alternativa, preprocessare. Per ora: hard-code di `768px` nei media query, ma **solo** nei media query.
- `!important` solo con commento che spieghi perché.

### 6.3 Animazioni
- `.card`, `.split` entrano con fade-in su scroll (IntersectionObserver in `ui.js`).
- Hero fade-in on load.
- Niente animazioni su `prefers-reduced-motion: reduce` (da aggiungere in `base.css`).

---

## 7. JavaScript

### 7.1 File condivisi
- `assets/js/cookies.js`: gestione consenso e injection GA.
- `assets/js/ui.js`: hamburger, scroll animations, floating CTA.

### 7.2 Regole
- No `onclick="..."` inline. Usare `addEventListener` in `ui.js`.
- Nessuna dipendenza esterna oltre a quelle già presenti (Font Awesome CDN, Google Fonts, Iubenda, Firebase per la app).
- Variabili globali solo se documentate (es. `window.__GA_ID__` da `content.json`).

---

## 8. Metadata e SEO

Ogni pagina **deve** avere, nel suo `<head>`:
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<meta name="google-site-verification" content="dXll1czWayKbcaMxpZLQQg_kQ-v89kEecStvvJpRlTM">`
- `<title>` univoco
- `<meta name="description">` univoca, max 160 caratteri
- `<link rel="canonical">` all'URL assoluto della pagina
- Open Graph completo: `og:title`, `og:description`, `og:image` (specifica della pagina, non il logo), `og:type`, `og:url`
- Favicon e apple-touch-icon

JSON-LD per pagina:
- `index.html`: `ProfessionalService` (già presente)
- `chi-sono.html`: `Person`
- `siigioia.html`: `Course`
- `lifestyle-matrix.html`: `Service`
- `webinar.html`: `VideoObject` con `embedUrl`
- `media.html`: facoltativo

`sitemap.xml` è rigenerato da `build.js` con `lastmod` reale (mtime del file sorgente).

---

## 9. Contenuti condivisi (`content.json`)

Dati ripetuti in più pagine vivono in `content.json` e vengono iniettati da `build.js` via placeholder.

Struttura:
```json
{
  "site": {
    "domain": "ritadigregorio.it",
    "url": "https://ritadigregorio.it",
    "title": "Rita Di Gregorio",
    "subtitle": "Lifestyle Coach",
    "copyrightYear": "2026"
  },
  "contact": {
    "whatsapp": "+393477185545",
    "whatsappUrl": "https://wa.me/393477185545",
    "email": "digregorio.rita@gmail.com",
    "senderEmail": "no-reply@ritadigregorio.it"
  },
  "social": {
    "instagram": "https://www.instagram.com/rita.digregorio_la_prof_coach/",
    "youtube": "https://www.youtube.com/@siiguerriero",
    "telegram": "https://t.me/LifestyleRita",
    "linkedin": "https://www.linkedin.com/in/rita-di-gregorio-a1754738a/"
  },
  "analytics": {
    "gaId": "G-3FEX3GSE3Y"
  },
  "iubenda": {
    "privacyId": "67937036"
  },
  "brevo": {
    "formUrl": "https://9849341c.sibforms.com/serve/..."
  }
}
```

Cambiare il numero WhatsApp o l'email deve richiedere **una sola** modifica in `content.json`.

---

## 10. Build

### 10.1 `build.py`
- Nessuna dipendenza: solo Python 3.8+ stdlib.
- Input: `pages/*.html`, `partials/*.html`, `content.json`.
- Output: `*.html` nella root + `sitemap.xml`.
- Placeholder supportati:
  - `{{> nome-partial}}` include il contenuto di `partials/nome-partial.html`
  - `{{ chiave.sotto-chiave }}` sostituisce con valore da `content.json`
  - `{{#each lista}}...{{this.campo}}...{{/each}}` itera su un array
  - `{{ page.title }}`, `{{ page.description }}`, `{{ page.path }}` vengono da un blocco `<!--page {...json...} page-->` in cima al sorgente

### 10.2 Workflow
1. Modifica `pages/*.html`, `partials/*.html`, `assets/**`, `content.json`
2. Esegui `python3 build.py`
3. Verifica output con apertura locale
4. `git add`, commit, push
5. `build.py` aggiorna `sitemap.xml` automaticamente

In CI o pre-commit si può usare `python3 build.py --check` per verificare che l'output sia sincronizzato (exit code 1 se non lo è).

### 10.3 Pre-commit (opzionale, consigliato)
Hook `.git/hooks/pre-commit` che esegue `python3 build.py` e poi `python3 build.py --check`. Non installato di default; va attivato manualmente.

---

## 11. Performance

- Immagini sempre con `loading="lazy"` tranne l'hero (`loading="eager"` o nessun attributo).
- Immagini sempre con `width` e `height` espliciti (evitare CLS).
- Formato preferito: AVIF > WebP > JPG. PNG solo per loghi/grafica con trasparenza.
- Logo pagina: versione ottimizzata `<20 KB`.
- File immagini di contenuto: target `<200 KB`.
- Font Awesome: ok tenere CDN, ma valutare subsetting se peso diventa problema.

---

## 12. Cosa **non** si fa

- Non si inseriscono stili inline nuovi.
- Non si duplicano topbar/footer/cookie banner nelle pagine.
- Non si hard-codano colori o font size letterali.
- Non si aggiungono nuove pagine senza: topbar, footer, cookie banner, metadata completi, voce in sitemap.
- Non si fa push senza aver eseguito `build.py`.
- Non si modificano `quiz/` e `lifestyle-matrix/` seguendo queste regole: sono app indipendenti con lifecycle proprio.

---

## 13. Deviazioni

Se una regola qui sopra blocca un'esigenza reale, la deviazione si documenta nel commit message:
```
feat(siigioia): prezzo dinamico via JS

Deviazione styleguide §9: il prezzo non è in content.json perché cambia
per promozioni temporanee. Resta hard-coded in siigioia.html con commento
`<!-- STYLEGUIDE-DEVIATION: prezzo temporaneo -->`.
```

Ogni deviazione ha un commento marker `<!-- STYLEGUIDE-DEVIATION: motivo -->` accanto al codice, così è grep-abile.
