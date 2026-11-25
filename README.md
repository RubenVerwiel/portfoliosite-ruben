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

## AI-chat: limiet en privacy

- Max. **20 vragen per uur per bezoeker** en **300 per dag voor de hele site** (aan te passen met `CHAT_LIMIT_PER_HOUR` en `CHAT_LIMIT_PER_DAY` in Vercel). Pas als de limiet "ja" zegt, wordt Gemini aangeroepen. Vragen langer dan 1000 tekens worden geweigerd, en alleen de laatste 20 berichten gaan mee naar Gemini.
- Bezoekers worden geteld op een **hash van hun IP-adres**; het echte adres wordt nergens opgeslagen. Tellingen ouder dan 2 dagen worden automatisch gewist. Optioneel: zet een geheime `CHAT_IP_SALT` in Vercel.
- De API praat met Supabase via de functies `chat_allow`, `chat_get`, `chat_save` en `chat_clear` (zie `supabase/migrations/`). Een bezoeker ziet en wist alleen zijn eigen gesprek, met de willekeurige id uit zijn browser.
- Zonder `SUPABASE_URL` en `SUPABASE_PUBLISHABLE_KEY` weigert de chat (dan kan de limiet niet bewaakt worden).
- De Gemini-key gaat in een header mee, niet in de URL, zodat hij niet in logs belandt.

## Live zetten

De site is statisch en heeft geen build-stap. Elke push naar `main` gaat vanzelf live via Vercel.
