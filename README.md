# Portfolio — Ruben Verwiel

Persoonlijke portfolio-website. Commerciële Economie & AI.

## Opzet

| Pagina | Wat staat er |
|---|---|
| `index.html` | Beginpagina met hero, intro, overzicht en uitgelicht werk |
| `werk.html` | Al mijn werk, met filter en detailvenster per project (inclusief links) |
| `over.html` | Over mij, ervaring & opleiding, skills |
| `minor.html` | Minor-reis: begin, tussentijds, einde |
| `toekomst.html` | Waar ik naartoe wil |
| `ideeen.html` | To-do lijst met ideeën (idee / bezig / klaar) |

- `js/data.js`: **alle inhoud** (projecten, links, minor, toekomst, ideeën). Hier pas je dingen aan.
- `js/main.js`: bouwt navigatie, footer en pagina's op uit `data.js`; thema en ⌘K-zoekmenu.
- `js/effects.js`: alle animaties (GSAP, ScrollTrigger, SplitText, Lenis) en nagebouwde React Bits-effecten.
- `js/chat.js`: AI-chatwidget (praat met `api/chat.js`).
- `css/style.css`: alle opmaak, licht en donker thema.
- `assets/`: profielfoto (`ruben.png`), cv (`cv-ruben-verwiel.pdf`) en projectafbeeldingen.

## Iets toevoegen

- **Nieuw project:** voeg een blok toe aan `projects` in `js/data.js`.
- **Link bij een project:** vul `links` in, bijvoorbeeld `{ label: 'Bekijk live', url: 'https://...', kind: 'live' }`.
- **Afbeelding:** zet het bestand in `assets/` en vul `image: 'assets/naam.png'` in.
- **Minor of toekomst:** vul `text: ['Eerste alinea', 'Tweede alinea']` in; zolang die leeg is, toont de site hulpvragen.
- **Idee:** voeg een regel toe aan `ideas` met `status: 'idee' | 'bezig' | 'klaar'`.
- **CV:** zet `assets/cv-ruben-verwiel.pdf` neer en zet `cvAvailable: true`.

## Lokaal bekijken

```
python3 -m http.server 8000
```

Open daarna http://localhost:8000. De AI-chat werkt alleen op Vercel (daar draait `api/chat.js`).

## Live zetten

De site is statisch en heeft geen build-stap. Elke push naar `main` gaat vanzelf live via Vercel.
