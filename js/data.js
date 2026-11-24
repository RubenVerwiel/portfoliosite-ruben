/* ==========================================================================
   ALLE INHOUD VAN DE SITE STAAT HIER
   --------------------------------------------------------------------------
   Wil je iets toevoegen of aanpassen? Dat doe je in dit bestand.
   De pagina's bouwen zichzelf op uit deze gegevens.

   - Nieuw werk?        → voeg een blok toe aan `projects`
   - Link erbij?        → vul `links` van dat project
   - Minor-reflectie?   → vul `text` in bij de juiste fase in `minor`
   - Toekomstplan?      → vul `text` in bij `future.horizons`
   - Nieuw idee?        → voeg een regel toe aan `ideas`
   ========================================================================== */

// Werkt in de browser (window) én in de chat-API op de server (globalThis)
(typeof window !== 'undefined' ? window : globalThis).SITE = {
  person: {
    name: 'Ruben Verwiel',
    role: 'Commerciële Economie × AI',
    city: 'Utrecht',
    linkedin: 'https://www.linkedin.com/in/ruben-verwiel-782ab424a',
    // Zet op true zodra assets/cv-ruben-verwiel.pdf bestaat
    cvAvailable: false,
    cvPath: 'assets/cv-ruben-verwiel.pdf',
  },

  /* ------------------------------------------------------------------------
     WERK
     type:    'Project' | 'Opdracht' | 'Minor' | 'Stage'   (filters op Werk-pagina)
     status:  'Live' | 'In ontwikkeling' | 'Afgerond'
     image:   pad naar afbeelding in assets/ (of null)
     links:   { label, url, kind }  kind = 'live' | 'github' | 'video' | 'doc' | 'link'
     ------------------------------------------------------------------------ */
  projects: [
    {
      slug: 'ai-koninkrijk',
      title: 'AI-koninkrijk',
      type: 'Project',
      status: 'In ontwikkeling',
      year: '2026',
      featured: true,
      summary: 'Een middeleeuws stadje in de browser waarin AI-medewerkers klanten zoeken voor mijn videobedrijf, pitches schrijven en alles eerst aan mij voorleggen. Zonder mijn goedkeuring gaat er niets de deur uit.',
      tags: ['Claude Code', 'Next.js', 'AI-agents', 'Ollama', 'Claude', 'Telegram', 'ffmpeg'],
      image: null,
      sections: [
        { title: 'Het idee', text: 'Klanten zoeken, een pitch schrijven, opvolgen en factureren is veel werk. Ik wilde zien of een team van AI-agents dat kan overnemen, met mij als eindbaas die alles goedkeurt.' },
        { title: 'De bewoners', list: [
          'Kasteel, Koning Benno: de hoofdmanager die alles controleert, problemen oplost en vragen beantwoordt.',
          'Rechtshuis, Meester Aurelius: toetst elke mail aan de AVG en de regels per land, en houdt de afmeldlijst bij.',
          'Uitkijktoren, Morse: brengt goedkeuringsverzoeken via Telegram naar mij, met duiven als animatie.',
          'Bootverhuur, Airbnb en Koetshuis: per markt scouts, een creator en sales voor luxe boten, vakantiewoningen en klassieke auto\'s.',
          'Kelder, Penningmeester Florijn: berekent na een deal de btw en maakt de factuur.',
        ] },
        { title: 'Hoe een ronde loopt', text: 'Scout → juridische toets → creator → sales → toets van de pitch → Koning → ik keur goed → mail gaat eruit. Na een deal wordt van de foto\'s van de klant lokaal een video gemaakt, en ook de levering en factuur gaan weer langs de toets en langs mij.' },
        { title: 'Veiligheid', list: [
          'Een schakelaar met drie standen: test, naar mezelf, en live (pas na bevestiging).',
          'Een daglimiet voor het aantal pitches en een afmeldregel in elke pitch.',
          'Gegevens van leads zonder deal worden automatisch gewist.',
        ] },
        { title: 'Gebruikte tools', list: [
          'Claude Code: het hele koninkrijk gebouwd.',
          'Next.js: de app in de browser.',
          'Ollama: lokale AI voor de medewerkers.',
          'Claude en het web: wetgeving van onbekende landen opzoeken.',
          'Telegram: goedkeuringen op mijn telefoon.',
          'ffmpeg: video\'s maken van foto\'s, lokaal en gratis.',
        ] },
        { title: 'Status', text: 'In ontwikkeling. De scouts werken nog met fictieve data, en echt mailen en de Telegram-knoppen zijn nog niet aangesloten.' },
      ],
      links: [],
    },
    {
      slug: 'briefing-agent',
      title: 'Briefing agent',
      type: 'Project',
      status: 'Live',
      year: '2026',
      featured: true,
      summary: 'Een webapp die vóór een gesprek een briefing over een bedrijf maakt, voor een verkoopgesprek of een sollicitatie. Na het gesprek voeg ik notities toe, zodat er per bedrijf een dossier ontstaat.',
      tags: ['Claude Code', 'Next.js', 'Supabase', 'Vercel', 'AI'],
      image: null,
      sections: [
        { title: 'Het probleem', text: 'Een goed gesprek begint met goede voorbereiding, maar uitzoeken wat een bedrijf doet en wat je wilt vragen kost veel tijd.' },
        { title: 'Mijn aanpak', list: [
          'Modus potentiële klant: ik vul de bedrijfsnaam of website in, het doel van het gesprek, optioneel de gesprekspartner, en kies een profiel met wat ik aanbied.',
          'Modus sollicitatie: bedrijfsnaam of website plus de vacaturetekst.',
          'De app maakt een briefing met bronnen. Na het gesprek voeg ik notities toe, zodat er per bedrijf een dossier ontstaat.',
        ] },
        { title: 'Gebruikte tools', list: [
          'Claude Code: de app in fases gebouwd.',
          'Next.js: de webapp.',
          'Supabase: database en login, met Row Level Security op alle tabellen.',
          'Vercel: live gezet, en op je telefoon te installeren als app.',
        ] },
        { title: 'Status', text: 'Live, alleen ik kan inloggen. Ik bouw hem in fases verder uit.' },
      ],
      links: [],
    },
    {
      slug: 'portfoliosite',
      title: 'Deze portfoliosite',
      type: 'Project',
      status: 'Live',
      year: '2026',
      featured: false,
      summary: 'Mijn eigen portfolio, van kleurenschema tot AI-chatbot, zelf gebouwd en live gezet. Inclusief scroll-animaties, smooth scrolling en een AI-assistent.',
      tags: ['Claude Code', 'GSAP', 'Lenis', 'Gemini API', 'Supabase', 'Vercel'],
      image: null,
      sections: [
        { title: 'Het probleem', text: 'Een portfolio moet niet alleen vertellen dat ik AI en commercie combineer, maar het ook laten zien. Een statische pagina doet dat onvoldoende.' },
        { title: 'Mijn aanpak', text: 'Ik heb deze site zelf gebouwd en doorontwikkeld in Visual Studio Code, samen met Claude Code. Denk aan het thema, de AI-chatwidget die vragen beantwoordt, een database die gesprekken onthoudt, en animaties met GSAP en Lenis.' },
        { title: 'Gebruikte tools', list: [
          'Visual Studio Code + Claude Code: ontwikkelomgeving en AI-hulp bij het bouwen.',
          'GSAP + Lenis: scroll-animaties en vloeiend scrollen.',
          'React Bits: inspiratie voor de bewegende effecten, nagebouwd in gewone JavaScript.',
          'Gemini API: de AI-chatbot op de site.',
          'Supabase: database om gesprekken per bezoeker te bewaren.',
          'Vercel: hosting en live-omgeving.',
        ] },
        { title: 'Resultaat & wat ik leerde', text: 'Een site die niet alleen vertelt wat ik kan, maar het ook toont, en die ik blijf uitbreiden naarmate ik meer leer over bouwen met AI.' },
      ],
      // Bouwlog: hoe deze site stap voor stap is gebouwd (nieuwste onderaan)
      log: [
        { date: '2026-09-08', text: 'Eerste versie van de portfoliosite gebouwd en live gezet op Vercel.' },
        { date: '2026-09-15', text: 'Kleuren aangepast voor beter contrast.' },
        { date: '2026-09-15', text: 'AI-chatwidget toegevoegd: Gemini beantwoordt vragen, Supabase bewaart de gesprekken per bezoeker.' },
        { date: '2026-09-15', text: 'Chatwidget verbeterd met typ-indicator, laadstatus en een knop om het gesprek te wissen.' },
        { date: '2026-09-15', text: 'Licht en donker thema toegevoegd, projecten bijgewerkt en profielfoto in de hero gezet.' },
        { date: '2026-11-24', text: 'Grote update: zes pagina\'s, animaties met GSAP en Lenis, effecten naar React Bits, ⌘K-zoekmenu en paginaovergangen.' },
        { date: '2026-11-24', text: 'De AI-chatbot kent nu mijn projecten en achtergrond.' },
      ],
      links: [
        // { label: 'Bekijk live', url: 'https://...', kind: 'live' },
        // { label: 'Code op GitHub', url: 'https://github.com/...', kind: 'github' },
      ],
    },
    {
      slug: 'lead-generation-bot',
      title: 'Lead generation bot',
      type: 'Project',
      status: 'In ontwikkeling',
      year: '2026',
      featured: false,
      summary: 'Een systeem dat automatisch bedrijven vindt, beoordeelt en in een eigen CRM zet, zodat er meer tijd overblijft voor het echte verkoopgesprek.',
      tags: ['Claude Code', 'n8n', 'Supabase', 'Google Places', 'Serper', 'Claude API', 'Gmail'],
      image: null,
      sections: [
        { title: 'Het probleem', text: 'Leads handmatig zoeken, beoordelen en bijhouden kost veel tijd die beter aan het verkoopgesprek besteed kan worden.' },
        { title: 'Mijn aanpak', text: 'Workflows in n8n zoeken bedrijven via Google Places en Serper en gebruiken Claude om ze te verwerken. Alles komt in een eigen CRM in Supabase, met mappen, notities, mailhistorie en een automatische statusgeschiedenis per lead. Mails gaan via Gmail de deur uit, en n8n praat met het systeem via een eigen bot-API met acht endpoints.' },
        { title: 'Slim en veilig', list: [
          'Kostenrem: per dienst een dag- en maandlimiet, die ook bij gelijktijdige aanvragen standhoudt (getest).',
          'Dezelfde lead kan er maar één keer in, op e-mail, domein of Google-plaats.',
          'De database is afgeschermd met Row Level Security en zonder publieke toegang.',
          'Eerst een testfase met 97 leads, daarna een aparte productieomgeving.',
        ] },
        { title: 'Gebruikte tools', list: [
          'Claude Code: bouwen van de database, de API en de workflows.',
          'n8n: de automatische workflows.',
          'Supabase: database en CRM.',
          'Google Places, Serper en Claude (Anthropic): bedrijven vinden en verwerken.',
          'Gmail: mails versturen.',
        ] },
        { title: 'Status', text: 'In ontwikkeling. Volgende stappen: antwoorden uit Gmail binnenhalen in de CRM, laten zien welke mails niet aankwamen, en automatische herinneringen om op te volgen.' },
      ],
      links: [],
    },
  ],

  /* ------------------------------------------------------------------------
     OVER MIJ: ervaring & opleiding
     ------------------------------------------------------------------------ */
  experience: [
    { period: 'okt 2025 – heden', role: 'Parttime medewerker', place: 'Wonderwoods · Utrecht' },
    { period: 'sep 2023 – jun 2027', role: 'Hogeschool Utrecht — Commerciële Economie', place: 'Bacheloropleiding · Inclusief minor AI' },
    { period: 'feb 2023 – jul 2023', role: 'Stagiair Sales & Marketing', place: 'Poolmanager · Rotterdam',
      text: 'Poolmanager is een softwareplatform voor organisaties met flexibel inzetbaar personeel: planning, poolbeheer, urenregistratie en koppelingen met HR-systemen in één omgeving. Binnen het salesteam richtte ik me op klantrelaties, het versnellen van commerciële processen en leadgeneratie.' },
    { period: 'sep 2022 – jun 2023', role: 'Avans Hogeschool — Propedeuse Economie', place: 'Propedeuse behaald' },
  ],

  skills: ['Claude', 'Claude Code', 'Gemini', 'ChatGPT', 'GitHub', 'Vercel', 'Supabase', 'GSAP', 'Leadgeneratie', 'Sales', 'Marketing'],

  /* ------------------------------------------------------------------------
     MINOR-REIS
     Vul per fase `text` in (mag meerdere alinea's: gebruik een lijst van strings).
     Zolang `text` leeg is, toont de site de hulpvragen als "nog in te vullen".
     ------------------------------------------------------------------------ */
  minor: [
    {
      key: 'begin',
      label: 'Begin',
      title: 'Wat ik verwachtte',
      when: 'Start van de minor',
      prompts: [
        'Waarom koos ik voor de minor AI?',
        'Wat hoopte ik te leren?',
        'Waar was ik onzeker over?',
        'Wat wilde ik aan het eind kunnen?',
      ],
      text: [
        'Ik koos de minor AI omdat ik sterk het gevoel kreeg dat je moet leren werken met AI, anders gaat het tegen je werken. Denk aan mijn baan later: daar kan ik AI veel gebruiken om tijd te besparen, en ik wil niet degene zijn die vervangen wordt.',
        'Ik wilde ook testen wat ik in een half jaar met AI kon bereiken, als iemand die alleen nog standaard prompts schreef en nog nooit iets had gecodeerd.',
        'Ik hoopte vooral op commercieel gebied dingen te vinden die ik kon versnellen, en te leren hoe ik dat bouw, zodat ik het later kan toepassen.',
        'Ik ging de minor heel openminded in en dacht eigenlijk dat ik in een half jaar hooguit een paar projecten kon maken, maar dat liep toch even anders.....',
      ],
    },
    {
      key: 'tussen',
      label: 'Tussentijds',
      title: 'Waar ik nu sta',
      when: 'Halverwege de minor',
      prompts: [
        'Wat heb ik tot nu toe geleerd?',
        'Wat viel mee, en wat viel tegen?',
        'Klopt mijn verwachting nog?',
        'Wat stel ik bij voor de tweede helft?',
      ],
      text: [
        'Vooral grote verbazing over wat er allemaal mogelijk is. Door het bouwen van mijn eigen programma\'s, zoals de leadgenerator en het AI-koninkrijk, ben ik nog enthousiaster geworden dan toen ik begon.',
        'Ik vind het erg leuk om te bouwen en met AI te sparren om tot een geweldig resultaat te komen. De snelheid en de kansen op dit gebied zijn ongekend, en ik kan niet wachten om weer iets nieuws te bouwen.',
        'Ik ben benieuwd waar ik sta na het halve jaar, en hoop nog veel tools en ecosystemen te bouwen die mijn commerciële leven later nog sneller en slimmer maken.',
      ],
    },
    {
      key: 'eind',
      label: 'Einde',
      title: 'Wat ik heb bereikt',
      when: 'Afronding van de minor',
      prompts: [
        'Wat heb ik gebouwd en bereikt?',
        'Hoe verhoudt dat zich tot mijn verwachting aan het begin?',
        'Wat was mijn grootste les?',
        'Wat neem ik mee naar mijn werk en studie?',
      ],
      text: [],
    },
  ],

  /* ------------------------------------------------------------------------
     TOEKOMST
     ------------------------------------------------------------------------ */
  future: {
    horizons: [
      { when: 'Komend jaar', title: 'Korte termijn', prompts: ['Wat wil ik dit studiejaar nog bereiken?', 'Welk project wil ik afmaken?'], text: [] },
      { when: 'Na mijn afstuderen', title: 'Middellange termijn', prompts: ['In wat voor rol en bedrijf zie ik mezelf?', 'Welke rol speelt AI daarin?'], text: [] },
      { when: 'Over 5 jaar', title: 'Lange termijn', prompts: ['Waar wil ik staan?', 'Wat wil ik dan gebouwd of opgezet hebben?'], text: [
        'Over vijf jaar hoop ik een echte ervaringsdeskundige te zijn op het gebied van AI, en in mijn werk processen te verbeteren en te versnellen.',
        'Ik hoop de sneltrein van AI goed bij te houden en met mijn eigen blik op de toekomst te blijven doorbouwen.',
      ] },
    ],
    // Dingen die je nog wilt leren. Leeg = placeholder.
    learn: [],
  },

  /* ------------------------------------------------------------------------
     IDEEËN / TO-DO
     status: 'idee' | 'bezig' | 'klaar'
     ------------------------------------------------------------------------ */
  ideas: [
    { title: 'Portfolio wow-update', note: 'Nieuwe pagina\'s, animaties met GSAP en Lenis, effecten uit React Bits.', status: 'bezig', tag: 'Portfolio' },
    { title: 'Lead generation bot afmaken', note: 'Antwoorden uit Gmail in de CRM, bounces zien en automatische herinneringen.', status: 'bezig', tag: 'Project' },
    { title: 'AI-koninkrijk aansluiten op de echte wereld', note: 'Scouts op echte data, echt mailen en de Telegram-knoppen werkend.', status: 'bezig', tag: 'Project' },
    { title: 'CV toevoegen aan de site', note: 'PDF in assets/ zetten en de downloadknop aanzetten.', status: 'idee', tag: 'Portfolio' },
    { title: 'Screenshots bij mijn projecten', note: 'Elk project een beeld geven, zodat het tastbaar wordt.', status: 'idee', tag: 'Portfolio' },
    { title: 'Chatbot laten weten wie ik ben', note: 'De AI-assistent kent nu mijn projecten en achtergrond, en alleen die.', status: 'klaar', tag: 'AI' },
    { title: 'Minor-reflecties invullen', note: 'Begin en tussentijds staan erop, het einde volgt na de minor.', status: 'bezig', tag: 'Minor' },
    { title: 'Links bij mijn werk zetten', note: 'Aan het einde van de minor, als de projecten stabiel zijn.', status: 'idee', tag: 'Portfolio' },
    { title: 'Eigen domeinnaam', note: 'Een eigen adres voor de site.', status: 'idee', tag: 'Portfolio' },
    { title: 'AI-chatwidget met opgeslagen gesprekken', note: 'Gemini + Supabase, gesprekken blijven bewaard per bezoeker.', status: 'klaar', tag: 'Portfolio' },
    { title: 'Licht en donker thema', note: 'Bezoeker kiest zelf, de site onthoudt de keuze.', status: 'klaar', tag: 'Portfolio' },
  ],
};
