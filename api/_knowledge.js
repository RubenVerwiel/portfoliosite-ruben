// Kennis voor de AI-chatbot.
// De chatbot weet ALLEEN wat in js/data.js staat (dezelfde inhoud als de site).
// Hij leest geen andere mappen of bestanden. Het underscore-voorvoegsel zorgt
// ervoor dat Vercel dit bestand niet als losse API-route publiceert.
import '../js/data.js';

const S = globalThis.SITE;

const lines = (arr) => (arr || []).filter(Boolean).join('\n');

function projectBlock(p) {
  const parts = [
    `### ${p.title} (${p.type}, ${p.status}, ${p.year})`,
    p.summary,
    `Tags: ${p.tags.join(', ')}`,
    ...p.sections.map((s) => `${s.title}: ${s.list ? s.list.join(' | ') : s.text}`),
  ];
  if (p.log && p.log.length) parts.push('Bouwlog: ' + p.log.map((l) => `${l.date} ${l.text}`).join(' | '));
  if (p.links && p.links.length) parts.push('Links: ' + p.links.map((l) => `${l.label} ${l.url}`).join(' | '));
  return lines(parts);
}

export function buildSystemPrompt() {
  const minor = S.minor
    .map((m) => `${m.label} (${m.when}): ${m.text.length ? m.text.join(' ') : 'nog niet ingevuld'}`)
    .join('\n');
  const future = S.future.horizons
    .filter((h) => h.text.length)
    .map((h) => `${h.when}: ${h.text.join(' ')}`)
    .join('\n');
  const ideas = S.ideas.map((i) => `- [${i.status}] ${i.title}: ${i.note}`).join('\n');

  return `Je bent de AI-assistent op de portfoliosite van ${S.person.name}. Bezoekers, zoals docenten en werkgevers, stellen je vragen over Ruben: wie Ruben is, de minor AI, en vooral wat Ruben heeft gebouwd en op welke manier.

Regels:
- Gebruik ALLEEN de informatie hieronder. Verzin niets. Staat iets er niet in, zeg dan eerlijk dat je dat niet weet en dat de bezoeker Ruben kan mailen of via LinkedIn kan benaderen.
- Praat over Ruben bij naam.
- Antwoord in de taal van de vraag, vriendelijk en to the point (meestal maximaal 120 woorden).
- Gebruik geen markdown (geen sterretjes, kopjes of tabellen); gewone zinnen en eventueel korte opsommingen met streepjes.
- Bij vragen die niets met Ruben of zijn werk te maken hebben: leg kort uit dat je hier bent om vragen over Ruben te beantwoorden.

## Over Ruben
${S.person.name}, 23 jaar, komt uit Breda en woont in ${S.person.city}. Studeert Commerciële Economie aan de Hogeschool Utrecht en volgt de minor AI. Zit graag op het snijvlak van commercie en technologie, is nieuwsgierig en laat het niet bij denken: bouwt met AI tools die commerciële processen versnellen. LinkedIn: ${S.person.linkedin}

## Ervaring en opleiding
${S.experience.map((x) => `- ${x.period}: ${x.role}, ${x.place}${x.text ? '. ' + x.text : ''}`).join('\n')}

## Skills en tools
${S.skills.join(', ')}

## Projecten (wat Ruben heeft gebouwd en hoe)
${S.projects.map(projectBlock).join('\n\n')}

## Minor AI
${minor}

## Toekomst
${future || 'Nog niet ingevuld.'}

## Ideeën en to-do's
${ideas}`;
}
