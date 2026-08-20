/* ============================================================
   Portfolio content — derived from github.com/saiprasanth-git
   ============================================================ */

const ASCII_SAI = `███████╗ █████╗ ██╗
██╔════╝██╔══██╗██║
███████╗███████║██║
╚════██║██╔══██║██║
███████║██║  ██║██║
╚══════╝╚═╝  ╚═╝╚═╝`;

const ASCII_PRASANTH = `██████╗ ██████╗  █████╗ ███████╗ █████╗ ███╗   ██╗████████╗██╗  ██╗
██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║╚══██╔══╝██║  ██║
██████╔╝██████╔╝███████║███████╗███████║██╔██╗ ██║   ██║   ███████║
██╔═══╝ ██╔══██╗██╔══██║╚════██║██╔══██║██║╚██╗██║   ██║   ██╔══██║
██║     ██║  ██║██║  ██║███████║██║  ██║██║ ╚████║   ██║   ██║  ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝`;

const TUX = `      .--.
     |o_o |
     |:_/ |
    //   \\ \\
   (|     | )
  /'\\_   _/\`\\
  \\___)=(___/`;

const IDENTITY = {
  user: 'sai',
  host: 'archbox',
  name: 'Sai Prasanth',
  handle: 'saiprasanth-git',
  role: 'Backend & AI Engineer',
  tagline: 'Production LLM agents, Python services, and safety-critical tooling.',
  location: 'Stafford, Texas, US',
  email: 'prasanthgrandhisiri@gmail.com',
  github: 'https://github.com/saiprasanth-git',
  since: '2019-04-15',
};

const NEOFETCH = [
  ['OS', 'Backend & AI Engineering'],
  ['Kernel', 'Python 3.12 · FastAPI · PostgreSQL'],
  ['Uptime', '7 years on GitHub · since Apr 2019'],
  ['Shell', 'LangChain / Google ADK / AWS Bedrock'],
  ['WM', 'Docker + GitHub Actions'],
  ['Terminal', 'VS Code'],
  ['Host', 'Stafford, Texas, US'],
  ['Repos', '14 public · 10 authored'],
  ['Focus', 'agents · ETL · DO-178C traceability'],
];

/* ---------- projects ---------------------------------------------------- */

const PROJECTS = [
  {
    slug: 'traceguard',
    file: 'traceguard',
    perms: 'drwxr-xr-x',
    size: '62K',
    date: '2026-08-06',
    lang: 'Python',
    featured: true,
    title: 'TraceGuard',
    blurb: 'Requirements traceability gate for safety-critical software — fails the build when requirements, code and verification evidence drift apart.',
    url: 'https://github.com/saiprasanth-git/traceguard',
    demo: null,
    tags: ['Python', 'DO-178C', 'CI gate', 'Static analysis'],
    body: [
      { t: 'p', v: 'TraceGuard reads requirement specifications, the @implements annotations in source code and the @verifies annotations in tests, resolves the bidirectional traceability graph, and fails the build when the trace is broken.' },
      { t: 'p', v: 'It turns "we will do the traceability matrix before the audit" into a CI check that runs on every commit. Everything lives in plain text next to the code, so requirements, code and verification evidence are reviewed together in the same pull request and diff cleanly in Git.' },
      { t: 'code', v: `$ traceguard check --root examples/altitude_hold
TraceGuard 0.1.0 - /repo/examples/altitude_hold
  requirements: 18 (SYS 3 / HLR 5 / LLR 10)
  implementation coverage: 100.0%
  verification coverage: 100.0%
  findings: 0 error(s), 0 warning(s)

OK` },
      { t: 'code', v: `$ traceguard check --root .
  ERROR   TG005-unimplemented-llr [LLR-ALTH-031]
          No source carries an @implements annotation
  ERROR   TG006-unverified-requirement [LLR-ALTH-042]
          No verification case carries @verifies
  WARNING TG014-dal-a-single-method [LLR-ALTH-021]
          DAL B requirement verified by a single method

FAILED (fail_on=error)` },
      { t: 'p', v: 'Built for DO-178C, IEC 62304 and ISO 26262 programmes, where the traceability data is a certification deliverable in its own right.' },
    ],
  },
  {
    slug: 'repomind',
    file: 'repomind',
    perms: 'drwxr-xr-x',
    size: '765K',
    date: '2026-04-07',
    lang: 'TypeScript',
    featured: true,
    title: 'RepoMind',
    blurb: 'Talk to any GitHub repository like it is a senior engineer who knows every file. RAG vs long-context, benchmarked.',
    url: 'https://github.com/saiprasanth-git/repomind',
    demo: null,
    tags: ['FastAPI', 'React', 'PostgreSQL', 'Gemini', 'RAG'],
    body: [
      { t: 'p', v: 'A codebase-aware AI assistant. Paste any public GitHub URL and ask questions about the code in plain English — answers come back with direct citations to exact files and line numbers.' },
      { t: 'p', v: 'It also ships a research experiment comparing two architectures for code understanding: retrieval-augmented generation over embedded chunks, versus sending an entire repository into a 2M-token long-context window.' },
      { t: 'kv', v: [['Stack', 'Python 3.12 · FastAPI 0.115 · React 18 · TypeScript 5 · PostgreSQL 16'], ['Deploy', 'Docker Compose · Google Cloud Run'], ['Indexed', 'fastapi/fastapi — 2,526 files, 12,514 chunks']] },
      { t: 'p', v: 'Documented in three layers: a plain-English explainer, an architecture deep-dive, and the experiment write-up.' },
    ],
  },
  {
    slug: 'quantum-simulator',
    file: 'quantum-simulator',
    perms: 'drwxr-xr-x',
    size: '28K',
    date: '2026-08-10',
    lang: 'Python',
    featured: true,
    title: 'qsim',
    blurb: 'A tiny, optimised, zero-dependency quantum circuit simulator with cross-verified Python and JavaScript engines.',
    url: 'https://github.com/saiprasanth-git/quantum-simulator',
    demo: null,
    tags: ['Python', 'NumPy', 'JavaScript', 'Numerics'],
    body: [
      { t: 'p', v: 'A complete state-vector quantum computer simulator in two forms: a ~400-line Python engine that depends only on NumPy, and a ~130-line browser engine with no dependencies at all.' },
      { t: 'p', v: 'Both engines implement the same algorithm and are cross-verified to agree to 2.2 × 10⁻¹⁶ — machine epsilon — across 10 reference circuits.' },
      { t: 'code', v: `from qsim import Circuit, ghz, grover

c = Circuit(2).h(0).cx(0, 1)
c.probs_dict()      # {'00': 0.5, '11': 0.5}
c.sample(1000)      # {'11': 508, '00': 492}

ghz(20)             # 2^20 amplitudes, 16 MiB, < 1s
grover(10, marked=417).probabilities().max()   # 0.9995` },
      { t: 'kv', v: [['Tests', '19 passing, ~1s'], ['Bench', 'included (bench.py)'], ['UI', 'interactive circuit builder, no build step']] },
    ],
  },
  {
    slug: 'python-etl-pipeline',
    file: 'python-etl-pipeline',
    perms: 'drwxr-xr-x',
    size: '59K',
    date: '2026-01-14',
    lang: 'Python',
    featured: true,
    title: 'python-etl-pipeline',
    blurb: 'Production-style ETL pipeline: structured logging, schema validation, Docker multi-stage build, and a full GitHub Actions matrix.',
    url: 'https://github.com/saiprasanth-git/python-etl-pipeline',
    demo: null,
    tags: ['Python', 'Docker', 'GitHub Actions', 'pytest'],
    body: [
      { t: 'p', v: 'A complete extract / transform / load pipeline with configurable sources, a custom exception hierarchy, and structured logging at every stage instead of print statements.' },
      { t: 'list', v: [
        'Configurable extraction from a sample dataset, CSV or JSON — driven entirely by environment variables',
        'Schema and null validation before transformation, with ExtractionError / ValidationError / TransformationError / LoadError',
        'pytest suite covering happy paths, edge cases and failure modes, with coverage reporting',
        'Multi-stage Dockerfile, non-root runtime user, container healthcheck',
        'CI/CD: black · isort · flake8 · mypy, a Python 3.10–3.12 test matrix, and a cached Docker build stage',
      ] },
    ],
  },
  {
    slug: 'dental-flow-agent',
    file: 'dental-flow-agent',
    perms: 'drwxr-xr-x',
    size: '50K',
    date: '2026-05-15',
    lang: 'Python',
    featured: true,
    title: 'DentalFlow Agent',
    blurb: 'Autonomous agent that monitors a dental practice appointment queue, detects exceptions and resolves them without a human. UiPath AgentHack 2026.',
    url: 'https://github.com/saiprasanth-git/dental-flow-agent',
    demo: null,
    tags: ['Python', 'UiPath Maestro', 'Express', 'Agents'],
    body: [
      { t: 'p', v: 'Built for UiPath AgentHack 2026, Track 1 (Maestro Case). The agent watches the appointment queue and closes the loop on the exceptions a front desk usually chases by phone.' },
      { t: 'list', v: [
        'Insurance verification — auto-verifies coverage via the EHR API and flags pre-auth cases',
        'Provider rescheduling — finds the next available slot when a provider drops out',
        'Appointment confirmation for pending-but-ready appointments',
        'Patient notification over email/SMS',
        'Full audit trail — every action written to the EHR agent action log',
      ] },
      { t: 'code', v: `UiPath Maestro  ──HTTP──▶  DentalFlow Agent (Python)
                                  │
                                  ├─ EHRClient (REST wrapper)
                                  └─ run_once()
                                       ├─ _verify_insurance()
                                       ├─ _reschedule()
                                       ├─ _confirm()
                                       └─ _notify_patient()
                                  │
                           DentalFlow EHR API
                        (Node.js / Express :3001)` },
    ],
  },
  {
    slug: 'snapstore',
    file: 'Snapstore',
    perms: 'drwxr-xr-x',
    size: '38K',
    date: '2026-04-10',
    lang: 'TypeScript',
    featured: true,
    title: 'SnapStore',
    blurb: 'Turn a product photo into a live, shoppable storefront in seconds. AI listing generation plus Stripe checkout.',
    url: 'https://github.com/saiprasanth-git/Snapstore',
    demo: 'https://app-avjuc60bs16p.appmedo.com',
    tags: ['React', 'TypeScript', 'Tailwind', 'Supabase', 'Stripe'],
    body: [
      { t: 'p', v: 'Upload a photo, describe the product, and an LLM writes the title, a 150-word description, a suggested price and five SEO tags. Buyers browse the storefront and pay through Stripe.' },
      { t: 'kv', v: [['Frontend', 'React 18 + TypeScript'], ['Styling', 'Tailwind CSS + Radix UI'], ['Data', 'Supabase'], ['Payments', 'Stripe'], ['Build', 'Vite + Rolldown']] },
      { t: 'list', v: [
        'Seller dashboard with product count, revenue and orders',
        'Editable AI-generated listings before publish',
        'Sidebar cart with add/remove and a payment confirmation page',
      ] },
    ],
  },
  {
    slug: 'coffee-shop',
    file: 'Coffee-Shop',
    perms: 'drwxr-xr-x',
    size: '49K',
    date: '2025-11-19',
    lang: 'TypeScript',
    featured: true,
    title: 'Coffee Shop',
    blurb: 'Full-stack mobile-style ordering app: React + Express + SQLite, with an AI barista that recommends drinks.',
    url: 'https://github.com/saiprasanth-git/Coffee-Shop',
    demo: 'https://coffee-shop-ecru-gamma.vercel.app',
    tags: ['React', 'Vite', 'Express', 'SQLite', 'Gemini'],
    body: [
      { t: 'p', v: 'A React (Vite) frontend against an Express backend with better-sqlite3 persistence, plus a Gemini-powered barista endpoint for recommendations.' },
      { t: 'code', v: `GET  /api/products        list all products
GET  /api/products/:id    single product
POST /api/checkout        cart + total -> order id, points
GET  /api/orders          order history
GET  /api/rewards         reward points for a user
POST /api/barista         ask the AI barista
GET  /api/health          health check` },
      { t: 'p', v: 'Deployed on Vercel with a seeded SQLite database and an environment-driven Gemini key.' },
    ],
  },
  {
    slug: 'solarcraft-redesign-concept',
    file: 'solarcraft-redesign-concept',
    perms: 'drwxr-xr-x',
    size: '—',
    date: '2026-08-20',
    lang: 'Web',
    featured: false,
    title: 'Solarcraft Redesign Concept',
    blurb: 'A redesign concept and UX case study: modernised homepage plus an interactive product filter demo.',
    url: 'https://github.com/saiprasanth-git/solarcraft-redesign-concept',
    demo: null,
    tags: ['UX', 'Case study', 'Frontend'],
    body: [
      { t: 'p', v: 'An unsolicited redesign of Solarcraft.net — a modernised homepage concept alongside a working interactive product filter, framed as a UX case study rather than a pitch deck.' },
    ],
  },
  {
    slug: 'nodejs-cicd-pipeline',
    file: 'nodejs-cicd-pipeline',
    perms: 'drwxr-xr-x',
    size: '18K',
    date: '2026-01-13',
    lang: 'JavaScript',
    featured: false,
    title: 'nodejs-cicd-pipeline',
    blurb: 'Reference CI/CD pipeline for Node.js: automated tests, Docker containerisation and GitHub Actions.',
    url: 'https://github.com/saiprasanth-git/nodejs-cicd-pipeline',
    demo: null,
    tags: ['Node.js', 'Docker', 'GitHub Actions'],
    body: [
      { t: 'p', v: 'The Node.js counterpart to the Python ETL pipeline — a minimal but complete reference for test → build → containerise → publish on every push.' },
    ],
  },
  {
    slug: 'prior-auth-ai-agent',
    file: 'prior-auth-ai-agent',
    perms: 'drwxr-xr-x',
    size: '114M',
    date: '2026-04-10',
    lang: 'Python',
    featured: false,
    title: 'prior-auth-ai-agent',
    blurb: 'Prior authorisation automation agent built on the Prompt Opinion platform — Agents Assemble Hackathon.',
    url: 'https://github.com/saiprasanth-git/prior-auth-ai-agent',
    demo: null,
    tags: ['Python', 'Agents', 'Healthcare'],
    body: [
      { t: 'p', v: 'A hackathon agent that automates the prior-authorisation paperwork loop between providers and payers.' },
    ],
  },
];

/* ---------- stack ------------------------------------------------------- */

const STACK = [
  {
    group: 'core',
    items: [
      { n: 'Python', v: '3.12', p: 95 },
      { n: 'FastAPI', v: '0.115', p: 90 },
      { n: 'PostgreSQL', v: '16', p: 85 },
      { n: 'TypeScript', v: '5.x', p: 78 },
      { n: 'React', v: '18', p: 75 },
      { n: 'Node.js / Express', v: '20', p: 72 },
    ],
  },
  {
    group: 'ai / agents',
    items: [
      { n: 'LangChain', v: 'oss', p: 88 },
      { n: 'Google ADK', v: 'python', p: 84 },
      { n: 'AWS Bedrock', v: '—', p: 78 },
      { n: 'RAG + embeddings', v: 'pgvector', p: 82 },
      { n: 'Gemini / long-context', v: '1.5 Pro', p: 76 },
      { n: 'UiPath Maestro', v: '—', p: 65 },
    ],
  },
  {
    group: 'platform',
    items: [
      { n: 'Docker', v: 'multi-stage', p: 88 },
      { n: 'GitHub Actions', v: 'CI/CD', p: 90 },
      { n: 'AWS', v: '—', p: 74 },
      { n: 'Vercel / Render', v: '—', p: 80 },
      { n: 'Google Cloud Run', v: '—', p: 70 },
      { n: 'Supabase', v: '—', p: 68 },
    ],
  },
  {
    group: 'rigour',
    items: [
      { n: 'pytest + coverage', v: '—', p: 88 },
      { n: 'mypy / flake8 / black', v: '—', p: 85 },
      { n: 'ETL pipeline design', v: '—', p: 86 },
      { n: 'DO-178C / IEC 62304', v: 'traceability', p: 72 },
      { n: 'REXX', v: 'mainframe', p: 60 },
      { n: 'Embedded C/C++', v: '—', p: 58 },
    ],
  },
];

/* ---------- about ------------------------------------------------------- */

const ABOUT = [
  { t: 'h', v: '# whoami' },
  { t: 'p', v: 'I am a backend and AI engineer. Most of my work sits in the unglamorous middle of a system: the service that has to stay up, the pipeline that has to be correct, the agent that has to do the right thing when nobody is watching it.' },
  { t: 'p', v: 'I build production LLM agents with LangChain, Google ADK and AWS Bedrock, served behind FastAPI and backed by PostgreSQL. Around that I build the boring parts properly — ETL with real validation, multi-stage Docker images, a CI pipeline that lints and type-checks and runs a version matrix before anything ships.' },
  { t: 'h', v: '# why the safety-critical detour' },
  { t: 'p', v: 'I keep coming back to correctness. TraceGuard came out of that: a DO-178C-style traceability gate that refuses to let requirements, code and verification evidence drift apart. Same instinct behind qsim — two independent engines, cross-verified to machine epsilon, because "it looks right" is not a test.' },
  { t: 'h', v: '# how I work' },
  { t: 'list', v: [
    'Plain text next to the code. Requirements, docs and evidence should diff cleanly in Git.',
    'Structured logging over print statements. Custom exceptions over bare raises.',
    'Every project gets a README that a non-engineer can read and an architecture doc that an engineer can trust.',
    'Automate the loop before optimising the step.',
  ] },
  { t: 'h', v: '# off the clock' },
  { t: 'p', v: 'Quantum simulators, habit and focus tooling, embedded experiments, and taking apart other people\'s interfaces to see how they would work better.' },
];

const TIMELINE = [
  { y: '2026', v: 'TraceGuard — DO-178C-style traceability gate. qsim quantum simulator. Agent work across UiPath AgentHack and Agents Assemble.' },
  { y: '2026', v: 'RepoMind — codebase-aware assistant on FastAPI + React + PostgreSQL, deployed to Cloud Run. RAG vs long-context benchmarked.' },
  { y: '2026', v: 'ETL and CI/CD reference pipelines in Python and Node.js — Docker, Actions matrices, coverage gates.' },
  { y: '2025', v: 'Full-stack product work: Coffee Shop on Vercel, SnapStore storefront generator. React + TypeScript front ends over Express services.' },
  { y: '2019', v: 'First commit on GitHub.' },
];

/* ---------- activity ---------------------------------------------------- */

const ACTIVITY = [
  { h: 'a1f3c02', d: '2026-08-20', r: 'solarcraft-redesign-concept', m: 'init redesign concept + product filter demo' },
  { h: '7b9e415', d: '2026-08-11', r: 'Coffee-Shop', m: 'wire barista endpoint, seed sqlite on deploy' },
  { h: 'c4d8a77', d: '2026-08-11', r: 'python-etl-pipeline', m: 'harden validation, add 3.12 to matrix' },
  { h: '2e6b930', d: '2026-08-11', r: 'quantum-simulator', m: 'cross-verify js engine against python to 2.2e-16' },
  { h: '9fa1c58', d: '2026-08-06', r: 'traceguard', m: 'public release — TG005/TG006 findings, DAL warnings' },
  { h: 'd53e0b1', d: '2026-05-18', r: 'dental-flow-agent', m: 'audit trail for every agent action' },
  { h: '6c02f8a', d: '2026-04-10', r: 'Snapstore', m: 'stripe checkout + seller dashboard' },
  { h: '81b7d34', d: '2026-04-08', r: 'repomind', m: 'index fastapi/fastapi — 12,514 chunks' },
];
