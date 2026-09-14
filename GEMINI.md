# Istruzioni Operative per Gemini CLI

Questo file definisce il workflow di automazione per il progetto.

## Riferimenti Autoritativi
- **Regole di Progetto:** Fare riferimento a `STYLEGUIDE.md` per ogni standard di architettura, design e convenzione di file.
- **Source of Truth:** Il repository git locale (`/home/onoame72/Progetti/ritadigregorio`).

## Workflow Operativo
1. **Validazione:** Prima di ogni modifica, leggere le sezioni pertinenti di `STYLEGUIDE.md`.
2. **Automazione:** Ogni modifica che impatta la struttura HTML o i componenti deve essere seguita dall'esecuzione di `build.py` per rigenerare gli output.
3. **Commit:** Non committare mai senza aver verificato lo stato con `git status` e `git diff`.
