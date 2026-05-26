/* ===========================================================
   Space Intel by EVONA — seed data
   In production these would come from API endpoints backed by
   the daily/weekly fetch jobs described in the brief. Today
   is 2026-05-04 (Mon). All news copy is dry analyst tone.
   =========================================================== */

window.SI_DATA = (function () {

  /* ---------- Top digest (above News feed) ---------- */
  const digest = {
    updated: "2026-05-04 09:00 EDT",
    title: "Week in Orbit",
    summary:
      "Capital is quietly rotating from comms megaconstellations into propulsion and lunar logistics, while DoD continues to write very large cheques for autonomy. SpaceX flew, Blue Origin landed, and SBIR Phase II dollars hit a 12-month high — the analyst class will spend the next two weeks pretending they saw it coming.",
    themes: [
      {
        icon: "▣",
        title: "Propulsion is the new comms",
        body: "Three propulsion rounds closed this week vs. one comms deal — a reversal that's been telegraphed for two quarters. Expect M&A in the hall-thruster cohort by Q3."
      },
      {
        icon: "◉",
        title: "Lunar logistics gets serious",
        body: "Two CLPS-adjacent contracts landed and a third lunar lander startup raised at a flat valuation. The cargo-to-the-Moon market is no longer purely a NASA story."
      },
      {
        icon: "▲",
        title: "Defense primes outperform",
        body: "BA, LMT and NOC outpaced pure-plays this week as space-resilient budget lines firmed up in the FY27 markup. Small-caps remain rate-sensitive."
      },
      {
        icon: "◆",
        title: "Demand has doubled, hit rate too",
        body: "EVONA's job orders are up 2.0× year-over-year, and for the first time in our eight-year history we're placing two new starters per EVONA staff member. Compensation is no longer the gating factor; schedule risk in the primes is."
      }
    ]
  };

  /* ---------- News sources & articles (13 × 5 = 65) ---------- */
  const sources = [
    { id: "spacenews",  name: "SpaceNews",          category: "Space",        url: "https://spacenews.com" },
    { id: "tectonic",   name: "Tectonic Defense",   category: "Defense",      url: "https://tectonicdefense.com" },
    { id: "piratewires",name: "Pirate Wires",       category: "Tech",         url: "https://piratewires.com" },
    { id: "resilience", name: "Resilience Media",   category: "Defense",      url: "https://resilience.media" },
    { id: "tbpn",       name: "TBPN",               category: "Tech",         url: "https://tbpn.com" },
    { id: "ussf",       name: "U.S. Space Force",   category: "Government",   url: "https://www.spaceforce.mil" },
    { id: "dod",        name: "Dept. of Defense",   category: "Government",   url: "https://www.defense.gov" },
    { id: "viasat",     name: "Via Satellite",      category: "Space",        url: "https://www.satellitetoday.com" },
    { id: "spacecom",   name: "Space.com",          category: "Space",        url: "https://www.space.com" },
    { id: "rspace",     name: "r/space",            category: "Space",        url: "https://www.reddit.com/r/space" },
    { id: "nga",        name: "NGA",                category: "Intelligence", url: "https://www.nga.mil" },
    { id: "tnw-deeptech", name: "TNW · Deep Tech",  category: "Tech",         url: "https://thenextweb.com/deep-tech" },
    { id: "nasa",       name: "NASA",               category: "Government",   url: "https://www.nasa.gov" }
  ];

  // Helper: build article objects compactly
  const A = (sourceId, title, summary, daysAgo, link) => ({
    sourceId, title, summary,
    date: dateOffset(daysAgo),
    link: link || "#"
  });

  function dateOffset(days) {
    const d = new Date(Date.UTC(2026, 4, 4));
    d.setUTCDate(d.getUTCDate() - days);
    return d.toISOString().slice(0, 10);
  }

  const articles = [
    /* SpaceNews */
    A("spacenews", "Rocket Lab Neutron static-fires for 12 seconds at Wallops",
      "First integrated stage hot-fire ahead of a maiden flight Beck still insists is 'this year.' The market believes him about 60% of the time.", 0,
      "https://spacenews.com/rocket-lab-neutron-hotfire/"),
    A("spacenews", "Iridium pre-announces NEXT-NEXT contract, says award 'imminent'",
      "Iridium has been saying 'imminent' for nine months. The stock moved 4% anyway, because hope is a strategy.", 1,
      "https://spacenews.com/iridium-next-next/"),
    A("spacenews", "ULA's Vulcan certified for NSSL Phase 3 Lane 2 launches",
      "Tory Bruno can finally stop posting flight-readiness diagrams on LinkedIn. The Space Force gets its second certified heavy lifter.", 2,
      "https://spacenews.com/vulcan-nssl-phase3/"),
    A("spacenews", "Astranis books $250M for MicroGEO production run",
      "Three years after first GEO-light launch, the small-GEO thesis is no longer experimental. Convertibles are reportedly 'aggressive.'", 3,
      "https://spacenews.com/astranis-250m/"),
    A("spacenews", "Varda's fourth re-entry capsule lands in Utah on schedule",
      "Pharma payload returned intact. The hard problem was always re-entry insurance, not chemistry — and Lloyd's appears to have priced it.", 4,
      "https://spacenews.com/varda-fourth-reentry/"),

    /* Tectonic Defense */
    A("tectonic", "Anduril and L3Harris team on tactical SDA constellation bid",
      "Two firms that don't normally play well bid jointly. Read: Pentagon told them to.", 0,
      "https://tectonicdefense.com/anduril-l3harris-sda/"),
    A("tectonic", "FY27 budget markup adds $1.4B to space resilience line",
      "A nontrivial pivot from previous markups, which had quietly trimmed the same line. Re-baselining is the new appropriations.", 1,
      "https://tectonicdefense.com/fy27-markup-space/"),
    A("tectonic", "Hypersonic glide-vehicle test slips again — third quarter in a row",
      "DoD declined to specify the cause. The phrase 'thermal protection' was conspicuously absent from the press call.", 2,
      "https://tectonicdefense.com/hgv-slip-q3/"),
    A("tectonic", "Sierra Space's Dream Chaser DoD variant clears critical design review",
      "An off-ramp from cargo-only into a defense logistics revenue line that, on paper, doesn't exist yet.", 3,
      "https://tectonicdefense.com/dream-chaser-cdr/"),
    A("tectonic", "Palantir wins $480M extension on TITAN ground station program",
      "Terms unchanged from prior expectations. Investors took the calm reaffirmation as the news.", 5,
      "https://tectonicdefense.com/palantir-titan-extension/"),

    /* Pirate Wires */
    A("piratewires", "The Defense-Tech IPO Window Is Cracking Open",
      "Two filings in two weeks after eighteen months of nothing. Whether the window stays open depends entirely on Anduril's print, whenever that arrives.", 0,
      "https://piratewires.com/defense-ipo-window/"),
    A("piratewires", "Why every YC company is suddenly 'AI for Defense'",
      "A cohort that was 'AI for ops' six months ago. The acronym shifted; the deck did not.", 1,
      "https://piratewires.com/yc-defense/"),
    A("piratewires", "Founders Fund's quiet space portfolio review",
      "Marc didn't post about it, which is itself the news.", 2,
      "https://piratewires.com/ff-space-review/"),
    A("piratewires", "Inside the SpaceX secondary — at $470B",
      "The cap table is now a small country. Existing holders are selling slivers; new entrants are paying for narrative, not ownership.", 4,
      "https://piratewires.com/spacex-secondary-470b/"),
    A("piratewires", "DC's new defense-tech lobbying vehicle, explained",
      "A 501(c)(4) with a board you'd recognise from any Series C. It has a slogan and a Substack.", 6,
      "https://piratewires.com/dc-deftech-501c4/"),

    /* Resilience Media */
    A("resilience", "GPS jamming over Eastern Med returns to pre-2024 levels",
      "Commercial aviators are flying with one foot on the brake again. PNT alternatives are no longer 'nice to have.'", 0,
      "https://resilience.media/gps-jamming-medlat/"),
    A("resilience", "True Anomaly raises $190M Series C at $1.6B",
      "Co-orbital servicing thesis intact. The valuation step-up is more about the contract pipeline than the tech demo cadence.", 1,
      "https://resilience.media/true-anomaly-c/"),
    A("resilience", "Slingshot's space domain awareness data hits the .mil cloud",
      "Procurement boilerplate that signals two things: the data is good enough, and the pricing argument is over.", 2,
      "https://resilience.media/slingshot-mil-cloud/"),
    A("resilience", "Allied space-resilience workshop concludes in The Hague",
      "Everyone agreed everyone should do more. The communiqué runs 14 pages and binds nobody.", 3,
      "https://resilience.media/hague-resilience/"),
    A("resilience", "Russian co-orbital activity flagged near commercial GEO slot",
      "Operator declined to name affected satellite. Insurance carriers will name it for them within ten days.", 5,
      "https://resilience.media/co-orbital-geo/"),

    /* TBPN */
    A("tbpn", "Founders mode: SpaceX vs. the rest of aerospace",
      "Two-hour interview with a primes-defector turned founder. Quote of the year: 'They asked me to file a memo about the memo.'", 0,
      "https://tbpn.com/founders-mode-spacex/"),
    A("tbpn", "The bull case for ASTS, in 11 charts",
      "Charts make a strong case for execution risk being the only risk left. Which, depending on your priors, is either everything or nothing.", 1,
      "https://tbpn.com/asts-bull-charts/"),
    A("tbpn", "Why Meta is hiring satellite engineers",
      "It's not for connectivity. Read between the lines and it's compute siting, latency arbitrage and the next decade of edge.", 2,
      "https://tbpn.com/meta-sat-hiring/"),
    A("tbpn", "Klein on Stoke: 'we're three years from a launch oligopoly'",
      "Andy Lapsa walks through manufacturing rate, not flight rate. The bottleneck is no longer the rocket.", 3,
      "https://tbpn.com/stoke-klein-oligopoly/"),
    A("tbpn", "The TBPN deep-tech survey: 1,200 founders weigh in",
      "Half of respondents now identify as 'defense or dual-use' — up from 17% two years ago. Capital follows label.", 5,
      "https://tbpn.com/deeptech-survey-26/"),

    /* U.S. Space Force */
    A("ussf", "Space Force selects three vendors for tactical SATCOM pilot",
      "Awards fall under the new commercial-augmentation framework. The pilot phase is short by Pentagon standards — 14 months.", 0,
      "https://www.spaceforce.mil/News/Article-Display/Article/3001/"),
    A("ussf", "Saltzman: 'We will not own all the spacecraft we operate'",
      "An overdue acknowledgment that commercial buy beats organic build for most missions. Procurement officers nod, then write a 200-page MOU.", 1,
      "https://www.spaceforce.mil/News/Article-Display/Article/3002/"),
    A("ussf", "Vandenberg breaks ground on second commercial pad",
      "Capacity has been the binding constraint for two years. This pad opens for business in late 2027 — assuming permitting, which is a big assumption.", 2,
      "https://www.spaceforce.mil/News/Article-Display/Article/3003/"),
    A("ussf", "USSF stands up dedicated cyber squadron for ground segment",
      "Long argued for, finally funded. The unit will be small, technical and almost certainly understaffed by year-end.", 4,
      "https://www.spaceforce.mil/News/Article-Display/Article/3004/"),
    A("ussf", "Guardians complete first multi-orbit war game with allies",
      "Five-eyes participants, GEO and LEO scenarios. Lessons learned were 'sobering' per the after-action — read: the red team won.", 6,
      "https://www.spaceforce.mil/News/Article-Display/Article/3005/"),

    /* Dept. of Defense */
    A("dod", "DoD releases Commercial Space Integration Strategy 2.0",
      "Less aspirational than v1, more contractual. It quietly eliminates two organic build programs that nobody wants to talk about.", 0,
      "https://www.defense.gov/News/CSIS-2/"),
    A("dod", "DARPA awards Phase 2 of LunA-10 lunar economy study",
      "Eleven contractors continue. The study is not a program of record, but the deliverables are clearly being read as one.", 1,
      "https://www.defense.gov/News/luna10-phase2/"),
    A("dod", "FY27 unfunded priorities list adds $2.1B for resilient PNT",
      "GPS-alternative architectures get real money, not just memos. Three commercial vendors stand to benefit if the list survives markup.", 3,
      "https://www.defense.gov/News/upl-pnt/"),
    A("dod", "OSD memo formalises 'commercial-first' acquisition for SDA payloads",
      "If you build it organically, you must justify why. The default has flipped — quietly, but in writing.", 4,
      "https://www.defense.gov/News/commercial-first-sda/"),
    A("dod", "DoD tightens supply-chain disclosure for space hardware vendors",
      "ITAR-adjacent, but with teeth. Component-level provenance is now expected within 60 days of award.", 5,
      "https://www.defense.gov/News/supply-chain-space/"),

    /* Via Satellite */
    A("viasat", "Eutelsat-OneWeb merger synergy targets pushed to 2027",
      "Integration is harder than the deck claimed. The market has not punished them for it, which is itself notable.", 0,
      "https://www.satellitetoday.com/eutelsat-oneweb-synergy/"),
    A("viasat", "Inmarsat sells L-band aero business for $1.1B",
      "A clean carve-out. Buyer is a strategic, not a sponsor — multiples reflect that.", 1,
      "https://www.satellitetoday.com/inmarsat-aero-sale/"),
    A("viasat", "Starlink direct-to-cell hits 50M devices",
      "Number is unverified. The growth curve, if accurate, makes terrestrial MNO economics look very fragile in low-density geographies.", 2,
      "https://www.satellitetoday.com/starlink-d2c-50m/"),
    A("viasat", "AST SpaceMobile launches three more BlueBirds",
      "On schedule. The market wants flight rate, and the company is, finally, delivering it.", 3,
      "https://www.satellitetoday.com/ast-bluebird-launch/"),
    A("viasat", "Telesat Lightspeed first-launch slips to Q3",
      "Not catastrophic, not great. Lenders are patient; investors are not.", 5,
      "https://www.satellitetoday.com/telesat-lightspeed-q3/"),

    /* Space.com */
    A("spacecom", "JWST detects unexpected methane plume on Enceladus",
      "Caveats abound. The paper, when it lands, will be the most-cited Enceladus result of the decade — and the most-misinterpreted.", 0,
      "https://www.space.com/jwst-enceladus-methane/"),
    A("spacecom", "Solar maximum is here, and HF radio is having a bad week",
      "Auroras visible as far south as Texas. Aviation reroutings are minor; the GEO insurance market is not minor.", 1,
      "https://www.space.com/solar-max-2026/"),
    A("spacecom", "Mars Sample Return architecture cut to two missions",
      "Costed downward, schedule slipped sideways. The rocks, mercifully, are not in a hurry.", 2,
      "https://www.space.com/msr-architecture-cut/"),
    A("spacecom", "China's lunar far-side comms relay reaches operations",
      "Quietly impressive engineering. The strategic implications are louder than the press release.", 4,
      "https://www.space.com/china-far-side-relay/"),
    A("spacecom", "Astronomers find first evidence of a 'dark comet' in Oort cloud",
      "Volatile-poor objects may outnumber classical comets. Planetary defence implications are non-zero.", 5,
      "https://www.space.com/dark-comet-oort/"),

    /* r/space */
    A("rspace", "[OC] Time-lapse of last night's Starship test from South Padre",
      "47k upvotes in 6 hours. The flame trench is now load-bearing in the meme economy.", 0,
      "https://www.reddit.com/r/space/comments/1abc/"),
    A("rspace", "Why does NASA still use the worm logo in some places and the meatball in others?",
      "Top comment, naturally, is from a former PAO who is tired of the question. The answer is, as ever, branding committees.", 1,
      "https://www.reddit.com/r/space/comments/2abc/"),
    A("rspace", "Astrophotographers caught a sprite above Hurricane Bonnie",
      "Beautiful image, mildly terrifying meteorology. Mods stickied it for 18 hours.", 2,
      "https://www.reddit.com/r/space/comments/3abc/"),
    A("rspace", "ELI5: How does Starlink avoid the Iridium 33 / Cosmos 2251 problem?",
      "Long, well-sourced thread; the answer is 'ground autonomy and lots of fuel.' The follow-up question is 'until?'", 3,
      "https://www.reddit.com/r/space/comments/4abc/"),
    A("rspace", "Megathread: Vulcan certification press conference",
      "Civil discussion, mostly. The Boeing-vs-Lockheed flame war was contained to one sub-thread.", 5,
      "https://www.reddit.com/r/space/comments/5abc/"),

    /* NGA */
    A("nga", "NGA opens commercial GEOINT broker contract to small business pool",
      "Set-aside size is meaningful. Three early-stage geospatial firms are quietly relieved.", 0,
      "https://www.nga.mil/news/commercial-geoint-broker-2026/"),
    A("nga", "Director's address at GEOINT 2026: 'data is no longer the bottleneck'",
      "The bottleneck is workflow, integration, and people who can read the output. Vendors are listening — selectively.", 1,
      "https://www.nga.mil/news/director-address-geoint26/"),
    A("nga", "NGA signals shift toward AI-native analyst workflows",
      "RFI dropped quietly last week. The vendors who responded fastest were not the ones with billboards at the conference.", 2,
      "https://www.nga.mil/news/ai-native-rfi/"),
    A("nga", "Joint NGA-NRO foundation data initiative passes pilot phase",
      "Two agencies that historically guard their data pipes are sharing some of them. This is a bigger deal than the press release admits.", 4,
      "https://www.nga.mil/news/foundation-data-pilot/"),
    A("nga", "Open-source intelligence integration framework released to public",
      "GitHub repo went up Friday. The README is more candid than usual.", 6,
      "https://www.nga.mil/news/osint-framework-release/"),

    /* TNW · Deep Tech — deep-tech category from The Next Web */
    A("tnw-deeptech", "European deep-tech raises hit a 12-month high — but the cohort is rotating",
      "VC capital deployed into European deep-tech is up, but the destinations have shifted decisively from B2B SaaS toward defence, energy and dual-use space.", 0,
      "https://thenextweb.com/deep-tech/european-deep-tech-12-month-high/"),
    A("tnw-deeptech", "The orbital data centre arms race, explained",
      "Three pathfinder satellites are testing on-orbit compute this year. The economics only work if you assume Earth-to-orbit bandwidth keeps falling — which, conveniently, it is.", 1,
      "https://thenextweb.com/deep-tech/orbital-data-centre-explained/"),
    A("tnw-deeptech", "Why every European AI startup suddenly has a 'sovereign' angle",
      "EU procurement budgets unlocked sovereign-AI carve-outs this quarter. The angle on the deck didn't exist six months ago. It does now.", 2,
      "https://thenextweb.com/deep-tech/european-ai-sovereign-angle/"),
    A("tnw-deeptech", "Quantum networking pilots quietly cluster around defence customers",
      "Three of four publicly-funded quantum-key distribution pilots in Europe now have an explicit defence end-user. The civil applications are the cover story.", 4,
      "https://thenextweb.com/deep-tech/quantum-networking-defence-pilots/"),
    A("tnw-deeptech", "ESA's accelerator now funds dual-use directly — a small but pointed shift",
      "The 'civil only' framing in early-stage ESA funding has quietly broadened. The MOU is one paragraph; the implication for cap-tables is bigger.", 5,
      "https://thenextweb.com/deep-tech/esa-accelerator-dual-use/"),

    /* NASA */
    A("nasa", "Artemis III crewed lunar landing slips to mid-2027",
      "Hardware drove the slip, not money. The next major milestone is HLS thermal-protection certification.", 0,
      "https://www.nasa.gov/news/artemis-iii-2027/"),
    A("nasa", "NASA awards three CLPS task orders for late-2026 lunar payloads",
      "Cadence is now the goal. Not every lander will succeed, and the program structure assumes that.", 1,
      "https://www.nasa.gov/news/clps-task-2026/"),
    A("nasa", "Europa Clipper completes first deep-space manoeuvre",
      "Spacecraft is healthy. Trajectory is locked in for 2030 Jovian arrival.", 2,
      "https://www.nasa.gov/news/europa-clipper-dsm1/"),
    A("nasa", "ISS deorbit vehicle preliminary design review held with SpaceX",
      "Numbers presented were tight but credible. The hard work is the ground integration, not the burn.", 4,
      "https://www.nasa.gov/news/iss-deorbit-pdr/"),
    A("nasa", "Mars sample return architecture downselect in June",
      "Two competing concepts remain. Whichever wins, the cost line moves to the right.", 5,
      "https://www.nasa.gov/news/msr-downselect-june/")
  ];

  /* ---------- Funding rounds ---------- */
  const fundingRounds = [
    { co: "True Anomaly",        amt: 190, stage: "Series C",   sector: "Defense",     daysAgo: 1,  desc: "Co-orbital security and SDA — DoD pull-through is now the headline.", link: "https://example.com/f1" },
    { co: "Astranis",             amt: 250, stage: "Strategic", sector: "Comms",       daysAgo: 3,  desc: "MicroGEO production capital. Convertibles priced aggressively.",          link: "https://example.com/f2" },
    { co: "Stoke Space",          amt: 260, stage: "Series C",  sector: "Launch",      daysAgo: 5,  desc: "Fully-reusable medium-lift; manufacturing scale-up bridge to first orbital.", link: "https://example.com/f3" },
    { co: "K2 Space",             amt: 110, stage: "Series B",  sector: "Satellites",  daysAgo: 6,  desc: "Megaclass satellite bus for high-power national security missions.",     link: "https://example.com/f4" },
    { co: "Apex",                 amt: 95,  stage: "Series C",  sector: "Satellites",  daysAgo: 9,  desc: "Productised satellite buses; tape-out of next-gen Aries platform.",       link: "https://example.com/f5" },
    { co: "Ursa Major",           amt: 85,  stage: "Series E",  sector: "Propulsion",  daysAgo: 11, desc: "Hadley and Ridley engine production capacity — defense pull is heavy.", link: "https://example.com/f6" },
    { co: "Albedo Space",         amt: 35,  stage: "Series B",  sector: "EO/Data",     daysAgo: 12, desc: "VLEO 10cm imagery operator — first commercial cohort customers active.", link: "https://example.com/f7" },
    { co: "Phase Four",           amt: 42,  stage: "Series C",  sector: "Propulsion",  daysAgo: 14, desc: "RF-thruster line; expanding production to second facility in Texas.",   link: "https://example.com/f8" },
    { co: "Hadrian",              amt: 130, stage: "Series C",  sector: "Manufacturing", daysAgo: 15, desc: "Precision component automation — aerospace is now the lead vertical.", link: "https://example.com/f9" },
    { co: "Castelion",            amt: 175, stage: "Series B",  sector: "Defense",     daysAgo: 17, desc: "Hypersonic strike systems for the affordable-mass thesis.",            link: "https://example.com/f10" },
    { co: "Anduril",              amt: 1500, stage: "Series F", sector: "Defense",     daysAgo: 18, desc: "Pre-IPO; capital pulled forward to fund Roadrunner and ALTIUS lines.", link: "https://example.com/f11" },
    { co: "Impulse Space",        amt: 150, stage: "Series C",  sector: "Propulsion",  daysAgo: 20, desc: "Mira and Helios space tugs — orbital logistics buildout continues.",  link: "https://example.com/f12" },
    { co: "Slingshot Aerospace",  amt: 70,  stage: "Series C",  sector: "EO/Data",     daysAgo: 22, desc: "Space domain awareness — DoD ATO progress drove the round timing.",   link: "https://example.com/f13" },
    { co: "Varda Space",          amt: 120, stage: "Series B",  sector: "In-space MFG",daysAgo: 24, desc: "Pharmaceutical microgravity manufacturing; capsule cadence increases.", link: "https://example.com/f14" },
    { co: "Aetherflux",           amt: 50,  stage: "Series A",  sector: "Power",       daysAgo: 26, desc: "Space-based solar power demo — DoD funded the antecedent study.",     link: "https://example.com/f15" },
    { co: "Pixxel",               amt: 65,  stage: "Series B",  sector: "EO/Data",     daysAgo: 28, desc: "Hyperspectral constellation; first defence customers under contract.", link: "https://example.com/f16" },
    { co: "Ramon.Space",          amt: 45,  stage: "Series C",  sector: "Computing",   daysAgo: 32, desc: "Radiation-hardened space computing — board-level wins with primes.",  link: "https://example.com/f17" },
    { co: "Vast Space",           amt: 240, stage: "Strategic", sector: "Stations",    daysAgo: 35, desc: "Haven-1 follow-on; insider-led with limited new investor allocation.", link: "https://example.com/f18" },
    { co: "Lunar Outpost",        amt: 80,  stage: "Series B",  sector: "Lunar",       daysAgo: 39, desc: "Mobility platforms for CLPS missions; first commercial extension order.", link: "https://example.com/f19" },
    { co: "Firefly Aerospace",    amt: 175, stage: "Strategic", sector: "Launch",      daysAgo: 44, desc: "MLV programme bridge financing; clean-up round before NYSE listing.", link: "https://example.com/f20" },
    { co: "ABL Space",            amt: 60,  stage: "Debt",      sector: "Launch",      daysAgo: 51, desc: "Venture debt facility, RS1 manifest financing.",                     link: "https://example.com/f21" },
    { co: "Quindar",              amt: 22,  stage: "Series A",  sector: "Software",    daysAgo: 58, desc: "Mission-control software; ARR triples year-over-year on commercial deals.", link: "https://example.com/f22" },
    { co: "Loft Orbital",         amt: 200, stage: "Series D",  sector: "Satellites",  daysAgo: 65, desc: "Satellites-as-a-service; defense customer concentration rising.",     link: "https://example.com/f23" },
    { co: "ICEYE",                amt: 110, stage: "Series E",  sector: "EO/Data",     daysAgo: 72, desc: "SAR constellation; allied government contracts dominate revenue mix.", link: "https://example.com/f24" },
    { co: "Sierra Space",         amt: 290, stage: "Series B",  sector: "Vehicles",    daysAgo: 90, desc: "Dream Chaser and inflatable habitat parallel programmes.",            link: "https://example.com/f25" }
  ];

  /* ---------- ETFs (static reference + live prices fetched client-side) ---------- */
  const etfs = [
    { ticker: "ARKX", name: "ARK Space Exploration & Innovation ETF", exch: "NYSE Arca",   er: "0.75%",  notes: "Actively managed, ~$800M AUM" },
    { ticker: "UFO",  name: "Procure Space ETF",                       exch: "NYSE Arca",   er: "0.75%",  notes: "Pure-play space, ~$500M AUM" },
    { ticker: "ROKT", name: "SPDR Kensho Final Frontiers ETF",         exch: "NYSE Arca",   er: "0.45%",  notes: "Space + deep sea focus" },
    { ticker: "NASA", name: "Tema Space Innovators ETF",               exch: "NYSE Arca",   er: "0.75%",  notes: "Pre-IPO SpaceX exposure, launched Mar 2026" },
    { ticker: "ITA",  name: "iShares U.S. Aerospace & Defense ETF",    exch: "Cboe BZX",    er: "0.42%",  notes: "Large-cap defense primes, $14B AUM" },
    { ticker: "XAR",  name: "SPDR S&P Aerospace & Defense ETF",        exch: "NYSE Arca",   er: "0.35%",  notes: "Equal-weight, ~60% small/mid cap" },
    { ticker: "SHLD", name: "Global X Defense Tech ETF",               exch: "NYSE Arca",   er: "0.50%",  notes: "$8.6B AUM, includes Palantir/AI defense" },
    { ticker: "MISL", name: "First Trust Indxx Global Aerospace & Defence UCITS ETF", exch: "LSE", er: "0.65%", notes: "Global mandate" },
    { ticker: "DFNS", name: "VanEck Defense ETF",                       exch: "Xetra",       er: "0.55%",  notes: "European focus, strong 2025 performance" }
  ];

  /* ---------- Stocks: 23 tickers / 8 sectors ---------- */
  const stocks = [
    { ticker: "RKLB", name: "Rocket Lab USA",       sector: "Launch" },
    { ticker: "SPCE", name: "Virgin Galactic",      sector: "Launch" },
    { ticker: "MNTS", name: "Momentus",             sector: "Launch" },
    { ticker: "ASTR", name: "Astra Space",          sector: "Launch" },
    { ticker: "VORB", name: "Virgin Orbit",         sector: "Launch" },

    { ticker: "ASTS", name: "AST SpaceMobile",      sector: "Comms" },
    { ticker: "VSAT", name: "Viasat",               sector: "Comms" },
    { ticker: "GSAT", name: "Globalstar",           sector: "Comms" },

    { ticker: "RDW",  name: "Redwire",              sector: "Satellites" },
    { ticker: "MAXN", name: "Maxar Technologies",   sector: "Satellites" },

    { ticker: "KTOS", name: "Kratos Defense",       sector: "Defense" },

    { ticker: "AJRD", name: "Aerojet Rocketdyne",   sector: "Propulsion" },

    { ticker: "LUNR", name: "Intuitive Machines",   sector: "Lunar" },

    { ticker: "PL",   name: "Planet Labs",          sector: "EO / Data" },
    { ticker: "BKSY", name: "BlackSky Technology",  sector: "EO / Data" },
    { ticker: "SPIR", name: "Spire Global",         sector: "EO / Data" },
    { ticker: "SATL", name: "Satellogic",           sector: "EO / Data" },

    { ticker: "BA",   name: "Boeing",               sector: "Prime Contractors" },
    { ticker: "LMT",  name: "Lockheed Martin",      sector: "Prime Contractors" },
    { ticker: "NOC",  name: "Northrop Grumman",     sector: "Prime Contractors" },
    { ticker: "RTX",  name: "RTX Corp",             sector: "Prime Contractors" },
    { ticker: "GD",   name: "General Dynamics",     sector: "Prime Contractors" },
    { ticker: "HII",  name: "Huntington Ingalls",   sector: "Prime Contractors" }
  ];

  /* ---------- SBIR Phase II awards (Apr 27 – May 3, 2026) ---------- */
  const sbir = [
    { co: "Aetheryx",              loc: "Boulder, CO",     sector: "Space",    amt: 1.85, agency: "USSF", topic: "SF254-D2",
      title: "Radiation-Tolerant Optical Inter-Satellite Link Modem",
      abstract: "Compact OISL modem for crosslink resilience under solar maximum conditions, targeting USSF SDA constellations. Phase II funds qualification testing and integration with two reference buses.",
      link: "https://www.sbir.gov/awards/aetheryx-2026" },
    { co: "Hyperion Vector AI",    loc: "Reston, VA",      sector: "AI/ML",    amt: 1.50, agency: "DARPA", topic: "HR001125-AI",
      title: "Multi-Sensor Fusion for Tactical GEOINT Workflows",
      abstract: "Onboard fusion of EO, SAR and RF emitter data with model compression suitable for tactical edge devices. Phase II delivers a containerised reference workflow to NGA's experimental cloud.",
      link: "https://www.sbir.gov/awards/hyperion-2026" },
    { co: "Stratos Cyber",         loc: "Fort Worth, TX",  sector: "Cyber",    amt: 1.95, agency: "USAF",  topic: "AF253-CY",
      title: "Zero-Trust Telemetry Integrity for Spacecraft TT&C",
      abstract: "Cryptographic provenance of telemetry from antenna to mission ops, with replay-attack hardening on both sides of the air gap. Phase II includes red-team exercise on AFRL ground testbed.",
      link: "https://www.sbir.gov/awards/stratos-2026" },
    { co: "Skyborne Robotics",     loc: "San Diego, CA",   sector: "UAV/Drones", amt: 2.00, agency: "Navy", topic: "N252-D11",
      title: "Persistent Maritime Surveillance UAV Swarm Coordination",
      abstract: "Decentralised tasking and contested-RF resilience for VTOL fleets operating from DDG class. Phase II runs sea trials on a fleet of six air vehicles.",
      link: "https://www.sbir.gov/awards/skyborne-2026" },
    { co: "Helio Propellant Co.",  loc: "Albuquerque, NM", sector: "Aerospace",amt: 1.75, agency: "USSF",  topic: "SF254-PR",
      title: "Green Monopropellant for Long-Duration Orbital Transfer Vehicles",
      abstract: "Non-hydrazine monopropellant qualified for multi-month dormancy in cislunar transfer applications. Phase II matures throttling injector and completes 200-hour life test.",
      link: "https://www.sbir.gov/awards/helio-2026" },
    { co: "Karva Defense",         loc: "Huntsville, AL",  sector: "Defense",  amt: 2.00, agency: "MDA",  topic: "MDA254-001",
      title: "High-Cadence Optical Tracking for Hypersonic Threats",
      abstract: "MWIR sensor module and tracker integration suitable for proliferated LEO architectures. Phase II includes integration onto a flight-representative satellite bus.",
      link: "https://www.sbir.gov/awards/karva-2026" },
    { co: "Vesta Compute",         loc: "Cambridge, MA",   sector: "AI/ML",    amt: 1.40, agency: "DARPA", topic: "HR001125-CO",
      title: "Sparse Inference Accelerator for On-Orbit Edge AI",
      abstract: "Custom ASIC for activation-sparse inference at <8W draw, targeting persistent on-orbit triage of EO data. Phase II tapes out a flight-pathfinder die.",
      link: "https://www.sbir.gov/awards/vesta-2026" },
    { co: "Northwind Aerial",      loc: "Provo, UT",       sector: "UAV/Drones", amt: 1.80, agency: "USAF", topic: "AF253-UA",
      title: "Group 3 UAV Counter-Jamming Autonomy Stack",
      abstract: "Onboard policy for autonomous waypoint replanning under intermittent GPS/SATCOM denial. Phase II delivers flight-tested module on a Group 3 representative airframe.",
      link: "https://www.sbir.gov/awards/northwind-2026" },
    { co: "Cipher Orbit",          loc: "Redondo Beach, CA", sector: "Cyber",  amt: 1.20, agency: "USSF", topic: "SF254-CY",
      title: "Post-Quantum TLS for Spacecraft Command Pathways",
      abstract: "FIPS-validated post-quantum command channel for COTS bus families, with fallback signing for legacy ground stations. Phase II completes interop with three commercial mission-ops platforms.",
      link: "https://www.sbir.gov/awards/cipher-2026" },
    { co: "Solis Robotics",        loc: "Pittsburgh, PA",  sector: "Aerospace", amt: 1.95, agency: "NASA", topic: "Z3-26",
      title: "Lunar Surface Robotic Manipulation for Cargo Offload",
      abstract: "Dexterous end-effector tested under 1/6 g for cargo pallet offload from CLPS-class landers. Phase II completes lunar-thermal vacuum qualification.",
      link: "https://www.sbir.gov/awards/solis-2026" },
    { co: "Echelon Sensors",       loc: "Austin, TX",      sector: "Defense",  amt: 1.65, agency: "Army", topic: "A254-S1",
      title: "Distributed Acoustic Sensing for Forward Operating Base Defense",
      abstract: "Dark-fibre acoustic sensing for 24/7 monitoring with anomaly detection tuned to small-UAV and small-arms signatures. Phase II includes 90-day FOB deployment.",
      link: "https://www.sbir.gov/awards/echelon-2026" },
    { co: "Galileo Edge AI",       loc: "Seattle, WA",     sector: "AI/ML",    amt: 1.75, agency: "Navy", topic: "N252-AI",
      title: "Federated Learning Across Distributed Maritime Sensors",
      abstract: "Bandwidth-aware federated learning across afloat sensor nodes with rigorous on-platform privacy guarantees. Phase II deploys to a CSG environment.",
      link: "https://www.sbir.gov/awards/galileo-2026" },
    { co: "Plasma Field Systems",  loc: "Pasadena, CA",    sector: "Space",    amt: 1.90, agency: "NASA", topic: "Z8-26",
      title: "High-Power Hall Thruster for Cislunar Transfer Vehicles",
      abstract: "20kW Hall-effect thruster cluster qualified for >5,000-hour cislunar duty cycles. Phase II completes life-test article and PCDU integration.",
      link: "https://www.sbir.gov/awards/plasma-2026" },
    { co: "Ironwall Cyber Labs",   loc: "Arlington, VA",   sector: "Cyber",    amt: 1.55, agency: "DARPA", topic: "HR001125-IS",
      title: "Provable Isolation in Mixed-Criticality Spacecraft Compute",
      abstract: "Formally verified separation kernel for next-gen mixed-criticality spacecraft processors. Phase II achieves Common Criteria EAL5+ alignment.",
      link: "https://www.sbir.gov/awards/ironwall-2026" },
    { co: "Aether Vehicles",       loc: "Mojave, CA",      sector: "Aerospace",amt: 2.00, agency: "USAF", topic: "AF253-VL",
      title: "Reusable Sub-Orbital Test Bed for Hypersonic Payloads",
      abstract: "Recoverable sub-orbital vehicle for short-cycle hypersonic test campaigns from established commercial spaceports. Phase II completes pathfinder vehicle.",
      link: "https://www.sbir.gov/awards/aether-2026" }
  ];

  /* ---------- EVONA Jobs ---------- */
  const jobs = [
    { title: "Senior Spacecraft Systems Engineer",  loc: "Long Beach, CA",   type: "permanent", spec: "Upstream",      posted: "2 days ago", link: "https://www.evona.com/spacejobs/senior-spacecraft-systems-engineer/" },
    { title: "Principal RF Engineer (SATCOM)",      loc: "Reston, VA",       type: "permanent", spec: "SATCOM",        posted: "3 days ago", link: "https://www.evona.com/spacejobs/principal-rf-engineer-satcom/" },
    { title: "Director of Geospatial Analytics",    loc: "Washington, DC",   type: "permanent", spec: "Geospatial",    posted: "5 days ago", link: "https://www.evona.com/spacejobs/director-geospatial-analytics/" },
    { title: "Lead GNC Software Engineer",          loc: "Mountain View, CA",type: "permanent", spec: "Upstream",      posted: "1 day ago",  link: "https://www.evona.com/spacejobs/lead-gnc-software-engineer/" },
    { title: "Mission Operations Director",         loc: "Denver, CO",       type: "permanent", spec: "Downstream",    posted: "1 week ago", link: "https://www.evona.com/spacejobs/mission-operations-director/" },
    { title: "Senior Avionics Test Engineer",       loc: "Hawthorne, CA",    type: "contract",  spec: "Upstream",      posted: "today",      link: "https://www.evona.com/spacejobs/senior-avionics-test-engineer/" },
    { title: "Ground Segment Architect",            loc: "Fairfax, VA",      type: "permanent", spec: "Infrastructure",posted: "4 days ago", link: "https://www.evona.com/spacejobs/ground-segment-architect/" },
    { title: "Earth Observation Product Manager",   loc: "London, UK",       type: "permanent", spec: "Downstream",    posted: "6 days ago", link: "https://www.evona.com/spacejobs/eo-product-manager/" },
    { title: "Hall Thruster Test Lead",             loc: "Albuquerque, NM",  type: "permanent", spec: "Upstream",      posted: "2 days ago", link: "https://www.evona.com/spacejobs/hall-thruster-test-lead/" },
    { title: "Senior Antenna RF Engineer",          loc: "Stevenage, UK",    type: "permanent", spec: "SATCOM",        posted: "5 days ago", link: "https://www.evona.com/spacejobs/senior-antenna-rf-engineer/" },
    { title: "Geospatial Software Engineer (SAR)",  loc: "Tysons, VA",       type: "permanent", spec: "Geospatial",    posted: "3 days ago", link: "https://www.evona.com/spacejobs/geospatial-software-engineer-sar/" },
    { title: "Orbital Mechanics Engineer",          loc: "Toulouse, FR",     type: "contract",  spec: "Upstream",      posted: "yesterday",  link: "https://www.evona.com/spacejobs/orbital-mechanics-engineer/" },
    { title: "Launch Site Operations Manager",      loc: "Cape Canaveral, FL", type: "permanent", spec: "Infrastructure", posted: "1 week ago", link: "https://www.evona.com/spacejobs/launch-site-operations-manager/" },
    { title: "Constellation Network Engineer",      loc: "Bothell, WA",      type: "contract",  spec: "SATCOM",        posted: "4 days ago", link: "https://www.evona.com/spacejobs/constellation-network-engineer/" },
    { title: "VP of Business Development — DoD",    loc: "Arlington, VA",    type: "permanent", spec: "Downstream",    posted: "today",      link: "https://www.evona.com/spacejobs/vp-bd-dod/" }
  ];

  return { digest, sources, articles, fundingRounds, etfs, stocks, sbir, jobs };
})();
