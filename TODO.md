# TODO — Miglioramenti sito ritadigregorio.it

Questo file traccia gli interventi di miglioramento pianificati per il sito.

## 1. Architettura & CSS (Manutenibilità)
- [ ] **Pulizia stili inline:** Migrare gli stili inline residui (specialmente in `index.html`) verso classi in `assets/css/components.css` o utility `u-`.
- [ ] **Audit Token CSS:** Verificare in tutti i file HTML/CSS l'uso corretto dei token (`tokens.css`). Uniformare il beige (usare `--color-bg-alt` invece di valori hard-coded) e i breakpoint (`768px`).
- [ ] **Normalizzazione `h1`:** Assicurare che tutti i tag `h1` abbiano dimensioni coerenti come da Styleguide (48px desktop / 28px mobile).

## 2. Performance & SEO
- [ ] **Ottimizzazione Immagini:** Audit del peso di tutte le immagini. Target: < 200KB per immagini di contenuto, < 20KB per loghi. Assicurare uso coerente di `picture` + `source` (AVIF/WebP).
- [ ] **Font:** Valutare self-hosting dei font e subsetting di Font Awesome per ridurre richieste esterne.
- [ ] **SEO Schema (JSON-LD):**
    - [x] `index.html` (ProfessionalService) — *Già presente*
    - [x] `chi-sono.html` (Person) — *Implementato*
    - [x] `sii-gioia.html` (Course) — *Implementato*
    - [x] `lifestyle-matrix.html` (Service) — *Già presente*
    - [x] `webinar.html` (VideoObject) — *Già presente*
    - [x] `media.html` (ItemList di VideoObject) — *Implementato*

## 3. Pulizia & Struttura
- [ ] **Rinomina immagini:** Audit e rinomina file immagini secondo la convenzione `{scope}-{descrittore}-{indice}.{ext}` (§5.4).
- [ ] **Accessibilità:** Verificare coerenza gerarchica dei tag `h2`/`h3` in tutte le pagine. Assicurare attributi ARIA corretti per componenti dinamici.
- [x] **Cleanup:** Rimossa `siigioia.html` (Sii Gioia Pre Summer, percorso obsoleto). La pagina viva è `sii-gioia.html` (Academy); il link nel quiz è stato reindirizzato.
