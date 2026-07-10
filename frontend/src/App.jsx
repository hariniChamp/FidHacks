import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Sprout, Sun, Moon, Home as HomeIcon, Languages, Flower2, MessageCircle, Sparkles,
  ArrowRight, ChevronDown, ChevronUp, Send, ShieldCheck, TrendingUp, BookOpen,
  Heart, X, Leaf, RefreshCw, User, Lightbulb, PieChart, Wallet, CheckCircle2,
  AlertTriangle, Link2, Database, HelpCircle, Briefcase
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ */
/*  THEME TOKENS                                                       */
/* ------------------------------------------------------------------ */
const DAY = {
  name: "day",
  bg: "#F5F6EF", surface: "#FFFFFF", ink: "#1B2A1E", sub: "#5C6B5E",
  green: "#3F7D20", greenDeep: "#2C5A16", lime: "#A9D05B", limeSoft: "#EDF4DA",
  rose: "#B4557E", roseSoft: "#F7E9F0", amber: "#B98A2E", amberSoft: "#F6EEDA",
  border: "#E2E6D6", chip: "#F0F3E4",
  hero: "linear-gradient(130deg, #2C5A16 0%, #3F7D20 42%, #57923B 72%, #2E6FA3 135%)",
  card: "0 1px 2px rgba(27,42,30,0.06), 0 8px 24px -12px rgba(27,42,30,0.18)",
};
const NIGHT = {
  name: "night",
  bg: "#131126", surface: "#1D1A36", ink: "#F0EBFF", sub: "#A69ECC",
  green: "#B5D96B", greenDeep: "#CBE68E", lime: "#B5D96B", limeSoft: "#28244A",
  rose: "#E7A6C4", roseSoft: "#33204058", amber: "#E5C06B", amberSoft: "#2E284A",
  border: "#2F2A52", chip: "#262247",
  hero: "linear-gradient(130deg, #221E44 0%, #2C2554 55%, #3A2B63 100%)",
  card: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px -12px rgba(0,0,0,0.6)",
};

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */
const NEWS = [
  { id: "spacex", tag: "IPO Watch", headline: "SpaceX signals plans for a 2027 IPO" },
  { id: "fed", tag: "The Fed", headline: "Fed meets tomorrow, rate cut on the table" },
  { id: "canva", tag: "Women-led", headline: "Canva, co-founded by Melanie Perkins, expands its enterprise push" },
];

const COLLECTIONS = [
  {
    id: "helm", icon: "👩‍💼", title: "Women at the Helm", blurb: "Public companies led by women CEOs.",
    items: [
      { t: "AMD", s: "Semiconductors", who: "Lisa Su, CEO, led one of tech's most famous turnarounds." },
      { t: "GM", s: "Autos & EVs", who: "Mary Barra, CEO, first woman to lead a major global automaker." },
      { t: "Accenture", s: "Consulting & AI services", who: "Julie Sweet, CEO, steering a 700k-person firm into AI." },
      { t: "Vertex", s: "Biotech", who: "Reshma Kewalramani, CEO, physician-scientist leading rare-disease breakthroughs." },
    ],
  },
  {
    id: "founded", icon: "🌱", title: "Founded by Women", blurb: "Companies started by female founders.",
    items: [
      { t: "Bumble", s: "Consumer tech", who: "Founded by Whitney Wolfe Herd, youngest woman to take a company public." },
      { t: "Canva", s: "Design software (private)", who: "Co-founded by Melanie Perkins, watch for a future IPO." },
      { t: "23andMe", s: "Genomics", who: "Co-founded by Anne Wojcicki, a case study in both innovation and risk." },
      { t: "Spanx", s: "Consumer (private)", who: "Founded by Sara Blakely, bootstrapped to a billion-dollar brand." },
    ],
  },
  {
    id: "funds", icon: "🧺", title: "Funds that Back Women", blurb: "One purchase = a whole basket of companies.",
    items: [
      { t: "FWOMX", s: "Fidelity Women's Leadership Fund", who: "Fidelity's own fund prioritizing companies that advance women's leadership." },
      { t: "SHE", s: "SPDR Gender Diversity ETF", who: "Tracks large U.S. companies with more women in senior leadership." },
      { t: "WOMN", s: "Impact Shares Women's Empowerment ETF", who: "Screens for gender equity; profits support the YWCA." },
    ],
  },
  {
    id: "health", icon: "🩺", title: "Women in Healthcare", blurb: "Health companies with women leaders or women-first products.",
    items: [
      { t: "Vertex", s: "Biotech", who: "Reshma Kewalramani, CEO." },
      { t: "Maven Clinic", s: "Women's health (private)", who: "Founded by Kate Ryder, largest virtual clinic for women's and family health." },
      { t: "Hologic", s: "Medical devices", who: "Focused on women's diagnostics, a 'products for women' angle on the theme." },
    ],
  },
];

const FIT = {
  AMD: { level: "high", note: "Moves closely with the NVIDIA you already own, you'd be doubling chip exposure." },
  GM: { level: "medium", note: "Adds an industrial flavor, though it rhymes with your Tesla position." },
  Accenture: { level: "medium", note: "Tech-adjacent services, useful, with some overlap to your tech tilt." },
  Vertex: { level: "low", note: "Biotech often moves independently of tech, a genuine diversifier." },
  Bumble: { level: "medium", note: "Consumer tech; smaller company, bigger swings than your current names." },
  Canva: { level: "na", note: "Still private, nothing to buy yet, but this is what IPO watchlists are for." },
  "23andMe": { level: "low", note: "Low overlap with your holdings, but high single-company risk. Read first." },
  Spanx: { level: "na", note: "Private company, a learning story more than a buying option today." },
  FWOMX: { level: "low", note: "Women-led large caps across many sectors, complements a tech-heavy mix." },
  SHE: { level: "medium", note: "Some overlap with your VTI core, but adds the gender-diversity lens." },
  WOMN: { level: "low", note: "Broad equity with a gender-equity screen; modest overlap with VTI." },
  "Maven Clinic": { level: "na", note: "Private, one to watch as women's health investment grows." },
  Hologic: { level: "low", note: "Women's-health devices; barely correlated with your tech names." },
};
const FIT_BADGE = {
  low: { label: "Complements you", tone: "green" },
  medium: { label: "Some overlap", tone: "amber" },
  high: { label: "High overlap", tone: "rose" },
  na: { label: "Private / watch", tone: "sub" },
};

const HOLDINGS = [
  { t: "VTI", name: "Total Market ETF", value: 1240, gain: 8.2 },
  { t: "AAPL", name: "Apple", value: 610, gain: 4.1 },
  { t: "NVDA", name: "NVIDIA", value: 462, gain: 21.5 },
  { t: "TSLA", name: "Tesla", value: 295, gain: -6.3 },
  { t: "Cash", name: "Core position", value: 240, gain: 0 },
];
const PORT_TOTAL = HOLDINGS.reduce((a, h) => a + h.value, 0);
const DAILY = { amt: 12.63, pct: 0.44 };
const EARNING_POWER = 46000;
const CORR_TICKS = ["VTI", "AAPL", "NVDA", "TSLA"];
const CORR = [
  [1, 0.78, 0.71, 0.55],
  [0.78, 1, 0.68, 0.5],
  [0.71, 0.68, 1, 0.58],
  [0.58, 0.5, 0.58, 1],
];
const MESH_SCORE = (() => {
  let s = 0, n = 0;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { s += CORR[i][j]; n++; }
  return Math.round(100 - (s / n) * 72);
})();
const HISTORY = [2412, 2455, 2390, 2510, 2568, 2540, 2622, 2698, 2660, 2744, 2801, PORT_TOTAL];

const DECODER = ["ETF", "IPO", "Dividend", "P/E ratio", "Index fund", "Roth IRA", "401(k) match", "Short selling", "Market cap", "Compound interest"];

const SEED_POSTS = [
  { who: "night_owl_investor", text: "Just made my first index fund purchase at 1am. $25. Heart absolutely pounding lol", hearts: 14 },
  { who: "quietgrower", text: "Anyone else nod along in work money talks while secretly googling? The decoder tab is saving me.", hearts: 9 },
  { who: "firstgen_saver", text: "Lost $80 on a meme stock last year and quit. Trying again, the slow, boring way this time.", hearts: 21 },
];

/* ------------------------------------------------------------------ */
/*  AI + RAG LAYER (retrieval mocked for demo; pipeline shown in UI)   */
/* ------------------------------------------------------------------ */
/* AI + RAG LAYER
   Chat requests go to the Flourish Java backend, which holds the
   Anthropic API key server-side and proxies to the Anthropic API.
   Set VITE_API_BASE if the backend runs somewhere other than :8080. */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function askClaude(system, messages) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

function profileLine(p) {
  if (!p) return "";
  return `The user's name is ${p.name || "friend"}. Investing experience: ${p.exp}. Main goal: ${p.goal}. Money situation: ${p.stage}.`;
}
function portfolioLine(connected, interests) {
  const ints = interests.length ? ` Saved interests from the Discover hub: ${interests.map(i => i.t).join(", ")}.` : "";
  if (!connected) return `The user has not linked a Fidelity account yet.${ints}`;
  return `The user linked a demo Fidelity portfolio (total $${PORT_TOTAL.toLocaleString()}): VTI $1,240 · AAPL $610 · NVDA $462 · TSLA $295 · cash $240. Mesh (diversification) score ${MESH_SCORE}/100, tech-concentrated; NVDA/AAPL overlap the VTI core and correlate highly with each other. Estimated earning power ~$${EARNING_POWER.toLocaleString()}/yr.${ints}`;
}

const COACH_SYSTEM = (p, dark, portCtx) => `You are Flourish Coach, the educational AI inside "Flourish", a Fidelity hackathon prototype helping early-career women build financial confidence. ${profileLine(p)} ${portCtx}
Rules: Be warm, plain-spoken and jargon-free, define any term you use in one clause. Keep answers under 160 words, in short paragraphs. You give financial EDUCATION and scenario exploration only: never personalized investment advice, never "buy X" or "sell Y" or specific allocations. When asked "how do I go from here", lay out educational next steps referencing their actual portfolio and interests. If asked to practice salary negotiation, role-play as a friendly hiring manager, keep exchanges short, and give one piece of warm feedback after each of the user's attempts. Encourage small, safe steps. Never use em dashes in your writing; use commas or periods instead.${dark ? `
It is After Dark mode: the user may feel anxious, embarrassed, or behind. Lead with genuine reassurance, normalize the feeling in one sentence, then offer one small concrete step. Be gentle, never preachy.` : ""}`;

const TRANSLATE_SYSTEM = (p, level) => `You are the AI News Translator in "Flourish", a Fidelity hackathon prototype for early-career women investors. ${profileLine(p)}
Explain the financial headline the user gives you for a reader at level: "${level}".
Respond in plain text using exactly these bolded labels, each on its own line followed by 1-3 short sentences:
**What happened**
**Why it matters for you**
**Terms decoded** (define 1-3 jargon words from the story in plain English)
**One thing to watch**
Under 170 words total. Educational only, no advice to buy or sell anything. Never use em dashes in your writing; use commas or periods instead.`;

const FALLBACK = "I couldn't reach the AI service just now (demo networks can be moody!). Here's the short version: start small, favor broad diversified funds over single stocks while you learn, and remember an employer 401(k) match is free money. Try me again in a moment.";

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */
function Rich({ text, theme }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
          seg.startsWith("**") && seg.endsWith("**")
            ? <strong key={j} style={{ color: theme.green, fontWeight: 600 }}>{seg.slice(2, -2)}</strong>
            : <span key={j}>{seg}</span>
        );
        return <p key={i} style={{ margin: "0 0 7px", lineHeight: 1.55 }}>{parts}</p>;
      })}
    </div>
  );
}

/* RAG source attribution shown under AI output */
function Sources({ items, theme }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-1 text-xs" style={{ color: theme.sub }}>
        <Database size={10} /> RAG:
      </span>
      {items.map(s => (
        <span key={s} className="rounded-full px-2 py-0.5" style={{ background: theme.chip, color: theme.sub, fontSize: 10.5, border: `1px solid ${theme.border}` }}>
          {s}
        </span>
      ))}
    </div>
  );
}

function Plant({ pct, theme }) {
  const stage = pct >= 75 ? 3 : pct >= 45 ? 2 : pct >= 20 ? 1 : 0;
  const stem = theme.name === "night" ? "#B5D96B" : "#3F7D20";
  const leaf = theme.name === "night" ? "#CBE68E" : "#57923B";
  const petal = theme.rose;
  return (
    <svg width="30" height="34" viewBox="0 0 40 46" aria-hidden="true">
      <ellipse cx="20" cy="42" rx="12" ry="3.4" fill={stem} opacity="0.25" />
      {stage === 0 && (<>
        <circle cx="20" cy="39" r="3.4" fill={stem} />
        <path d="M20 39 C20 34, 22 32, 24 31" stroke={leaf} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </>)}
      {stage >= 1 && (<>
        <path d={stage === 1 ? "M20 42 C20 34, 20 30, 20 26" : "M20 42 C20 32, 20 24, 20 14"} stroke={stem} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M20 33 C15 32, 12 29, 11 25 C16 25, 19 28, 20 33" fill={leaf} />
        <path d="M20 30 C25 29, 28 26, 29 22 C24 22, 21 25, 20 30" fill={leaf} />
      </>)}
      {stage >= 2 && (<>
        <path d="M20 23 C15 22, 12.5 19, 12 15.5 C17 16, 19.5 19, 20 23" fill={leaf} />
        <path d="M20 20 C25 19, 27.5 16, 28 12.5 C23 13, 20.5 16, 20 20" fill={leaf} />
      </>)}
      {stage === 3 && (<>
        {[0, 60, 120, 180, 240, 300].map(a => (
          <ellipse key={a} cx="20" cy="9.5" rx="3.1" ry="5.4" fill={petal}
            transform={`rotate(${a} 20 9.5) translate(0 -4)`} opacity="0.95" />
        ))}
        <circle cx="20" cy="9.5" r="3.4" fill="#F4C46A" />
      </>)}
    </svg>
  );
}

function ConfidencePill({ conf, theme }) {
  return (
    <div title="Your Financial Confidence, grows as you learn"
      className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1"
      style={{ background: theme.limeSoft, border: `1px solid ${theme.border}` }}>
      <Plant pct={conf} theme={theme} />
      <div className="text-left">
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, color: theme.ink, lineHeight: 1 }}>{conf}%</div>
        <div style={{ fontSize: 9.5, color: theme.sub, letterSpacing: "0.06em", textTransform: "uppercase" }}>Confidence</div>
      </div>
    </div>
  );
}

function Toast({ toast, theme }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg"
      style={{ transform: "translateX(-50%)", background: theme.name === "night" ? "#CBE68E" : "#1B2A1E", color: theme.name === "night" ? "#1B2A1E" : "#EDF4DA", fontSize: 13.5, fontWeight: 500, animation: "rise .35s ease" }}>
      <Sprout size={15} /> {toast}
    </div>
  );
}

function Card({ theme, children, className = "", style = {} }) {
  return (
    <div className={"rounded-2xl " + className}
      style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.card, ...style }}>
      {children}
    </div>
  );
}

function LevelChip({ active, label, onClick, theme }) {
  return (
    <button onClick={onClick} className="rounded-full px-3 py-1.5 text-sm transition-all"
      style={{
        background: active ? theme.green : theme.chip,
        color: active ? (theme.name === "night" ? "#1B2A1E" : "#fff") : theme.ink,
        border: `1px solid ${active ? theme.green : theme.border}`,
        fontWeight: active ? 600 : 450,
      }}>{label}</button>
  );
}

function FitBadge({ level, theme }) {
  const b = FIT_BADGE[level];
  const tones = {
    green: { bg: theme.limeSoft, fg: theme.name === "night" ? theme.lime : theme.greenDeep },
    amber: { bg: theme.amberSoft, fg: theme.amber },
    rose: { bg: theme.roseSoft, fg: theme.rose },
    sub: { bg: theme.chip, fg: theme.sub },
  }[b.tone];
  return (
    <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: tones.bg, color: tones.fg }}>
      {b.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ONBOARDING                                                         */
/* ------------------------------------------------------------------ */
function Onboarding({ onDone }) {
  const t = DAY;
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exp, setExp] = useState(null);
  const [goal, setGoal] = useState(null);
  const [stage, setStage] = useState(null);

  const EXPS = ["Total beginner", "I know some basics", "Getting confident"];
  const GOALS = ["Start investing", "Build an emergency fund", "Save for grad school", "Grow long-term wealth", "Negotiate my salary"];
  const STAGES = ["Student / part-time", "First full-time job", "A few years into my career"];

  const steps = [
    {
      title: "What should we call you?",
      sub: "Flourish personalizes everything, starting with your name.",
      body: (
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Your first name"
          className="w-full rounded-xl px-4 py-3 text-lg outline-none"
          style={{ border: `1.5px solid ${t.border}`, background: "#fff", color: t.ink, fontFamily: "'Instrument Sans',sans-serif" }}
          onKeyDown={e => e.key === "Enter" && name.trim() && setStep(1)} />
      ),
      ok: name.trim().length > 0,
    },
    {
      title: "How does investing feel right now?",
      sub: "No wrong answers, this tunes how we explain things.",
      body: (<div className="flex flex-wrap gap-2">{EXPS.map(x => <LevelChip key={x} theme={t} label={x} active={exp === x} onClick={() => setExp(x)} />)}</div>),
      ok: !!exp,
    },
    {
      title: "What's the first money move you care about?",
      sub: "We'll shape your insights and learning path around it.",
      body: (<div className="flex flex-wrap gap-2">{GOALS.map(x => <LevelChip key={x} theme={t} label={x} active={goal === x} onClick={() => setGoal(x)} />)}</div>),
      ok: !!goal,
    },
    {
      title: "And where are you in your career?",
      sub: "Context helps the AI coach meet you where you are.",
      body: (<div className="flex flex-wrap gap-2">{STAGES.map(x => <LevelChip key={x} theme={t} label={x} active={stage === x} onClick={() => setStage(x)} />)}</div>),
      ok: !!stage,
    },
  ];
  const cur = steps[step];
  const finish = () => onDone({ name: name.trim(), exp, goal, stage }, exp === "Total beginner" ? 12 : exp === "I know some basics" ? 24 : 36);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6" style={{ background: t.hero }}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(4px)" }}>
              <Flower2 size={24} color="#EDF4DA" />
            </div>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>Flourish</span>
          </div>
          <p style={{ color: "#E8F1D8", fontSize: 15.5, fontStyle: "italic", fontFamily: "'Fraunces',serif" }}>Females investing in females.</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12.5, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>A Fidelity Smart Money Moves concept</p>
        </div>

        <div className="rounded-3xl p-7" style={{ background: "#FDFDF9", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.45)" }}>
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= step ? t.green : t.border, transition: "background .3s" }} />
            ))}
          </div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: t.ink, marginBottom: 6 }}>{cur.title}</h2>
          <p style={{ color: t.sub, fontSize: 14, marginBottom: 18 }}>{cur.sub}</p>
          {cur.body}
          <div className="mt-7 flex items-center justify-between">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="text-sm" style={{ color: step === 0 ? t.border : t.sub }}>Back</button>
            <button
              onClick={() => (step === steps.length - 1 ? finish() : setStep(step + 1))}
              disabled={!cur.ok}
              className="flex items-center gap-2 rounded-full px-6 py-2.5 font-semibold transition-transform hover:scale-105"
              style={{ background: cur.ok ? t.green : t.border, color: "#fff", fontSize: 15 }}>
              {step === steps.length - 1 ? "Grow with Flourish" : "Continue"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME, portfolio-first, approachable, progressive disclosure       */
/* ------------------------------------------------------------------ */
function Home({ theme, profile, dark, earn, conf, connected, onConnect, interests, removeInterest, askCoach, goDiscover, goTranslate, focus, onFocusHandled }) {
  const [linking, setLinking] = useState(false);
  const [holdings, setHoldings] = useState(HOLDINGS);
  const [whatsReturn, setWhatsReturn] = useState(false);
  const [openInsight, setOpenInsight] = useState(null);
  const [dataOpen, setDataOpen] = useState(false);
  const [monthly, setMonthly] = useState(50);
  const [raise, setRaise] = useState(0);
  const [tweaked, setTweaked] = useState(false);
  const [aiRead, setAiRead] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const dataRef = useRef(null);
  const fmt = n => "$" + Math.round(n).toLocaleString();

  useEffect(() => {
    if (focus === "data") {
      setDataOpen(true);
      onFocusHandled();
      setTimeout(() => dataRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
    }
  }, [focus]);

  const hour = new Date().getHours();
  const greet = dark ? `Late night, ${profile.name}? No judgment here.` :
    hour < 12 ? `Good morning, ${profile.name}` : hour < 18 ? `Good afternoon, ${profile.name}` : `Good evening, ${profile.name}`;

  const link = () => {
    setLinking(true);
    // Pull the client's data from the Java backend (mock Fidelity account);
    // fall back silently to the built-in sample if the backend is offline.
    fetch(`${API_BASE}/api/client/maya`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && d.holdings) setHoldings(d.holdings); })
      .catch(() => {});
    setTimeout(() => { setLinking(false); onConnect(); earn("portfolio", 10, "Linked your Fidelity account"); }, 1400);
  };

  const openData = () => {
    setDataOpen(true);
    setTimeout(() => dataRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  const data = useMemo(() => {
    const rows = [];
    const labels = ["11m", "10m", "9m", "8m", "7m", "6m", "5m", "4m", "3m", "2m", "1m", "Now"];
    HISTORY.forEach((v, i) => rows.push({ x: labels[i], history: v }));
    const r = 0.072, band = tweaked ? 0.028 : 0.048;
    const extra = (raise * 0.5) / 12; // invest half of a negotiated raise
    const fv = (rate, y) => {
      const i = rate / 12, n = y * 12, c = monthly + extra;
      return PORT_TOTAL * Math.pow(1 + i, n) + (i === 0 ? c * n : c * ((Math.pow(1 + i, n) - 1) / i));
    };
    for (let y = 1; y <= 5; y++) {
      rows.push({
        x: `+${y}y`,
        expected: Math.round(fv(r, y)),
        optimistic: Math.round(fv(r + band, y)),
        conservative: Math.round(fv(Math.max(0.01, r - band), y)),
      });
    }
    rows[11].expected = PORT_TOTAL; rows[11].optimistic = PORT_TOTAL; rows[11].conservative = PORT_TOTAL;
    return rows;
  }, [monthly, tweaked, raise]);
  const last = data[data.length - 1];
  const raiseBoost = useMemo(() => {
    if (!raise) return 0;
    const i = 0.072 / 12, n = 60, c = (raise * 0.5) / 12;
    return Math.round(c * ((Math.pow(1 + i, n) - 1) / i));
  }, [raise]);

  const healthRead = async () => {
    setAiLoading(true); setAiRead("");
    try {
      const r = await askClaude(
        `You are the portfolio educator in "Flourish", a Fidelity hackathon prototype for early-career women investors. ${profileLine(profile)} ${portfolioLine(true, interests)}
In under 130 words of plain text with **bold** mini-labels: give a friendly health read of this portfolio, what's working, where it's concentrated, and 2 educational ideas for making the pieces mesh better (concepts/categories, never "buy X"). End with one encouraging sentence. Never use em dashes in your writing; use commas or periods instead.`,
        [{ role: "user", content: "Give me the health read of my linked portfolio." }]
      );
      setAiRead(r);
    } catch { setAiRead(FALLBACK); }
    setAiLoading(false);
  };

  const corrColor = (c, diag) => {
    if (diag) return { bg: theme.chip, fg: theme.sub };
    if (c >= 0.7) return { bg: theme.name === "night" ? "#4A2A44" : "#EFCEDD", fg: theme.rose };
    if (c >= 0.55) return { bg: theme.amberSoft, fg: theme.amber };
    return { bg: theme.limeSoft, fg: theme.name === "night" ? theme.lime : theme.greenDeep };
  };

  const tasks = [
    { id: "portfolio", label: "Link account", pts: 10 },
    { id: "read1", label: "Read an insight", pts: 4 },
    { id: "translate", label: "Translate news", pts: 8 },
    { id: "discover", label: "Save an interest", pts: 5 },
    { id: "chat", label: "Ask the coach", pts: 6 },
  ];

  const banner = (
    <div className="rounded-3xl p-6 md:p-7 relative overflow-hidden" style={{ background: theme.hero, boxShadow: theme.card }}>
      <div className="relative z-10">
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.4vw,32px)", fontWeight: 600, color: "#fff", lineHeight: 1.15 }}>{greet}</h1>
        <p style={{ color: "rgba(255,255,255,0.88)", marginTop: 6, fontSize: 14.5, maxWidth: 560 }}>
          {connected
            ? (dark ? "The market's asleep. Your plan doesn't have to be perfect tonight." : "Here's your money, in plain English. No jargon before coffee.")
            : "One link, and Flourish turns your real portfolio into plain English."}
        </p>
      </div>
      <Flower2 size={160} style={{ position: "absolute", right: -26, bottom: -36, color: "rgba(255,255,255,0.10)" }} />
    </div>
  );

  if (!connected) {
    return (
      <div className="space-y-5">
        {banner}
        <div className="mx-auto max-w-2xl">
          <Card theme={theme} className="p-8 text-center">
            <Wallet size={36} color={theme.green} style={{ margin: "0 auto" }} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 600, color: theme.ink, marginTop: 10 }}>
              Bring your first money moves into the light
            </h2>
            <p style={{ color: theme.sub, fontSize: 14, marginTop: 8, maxWidth: 440, margin: "8px auto 0", lineHeight: 1.55 }}>
              You made your first moves the way most of us do, buying names you'd heard of. Link your Fidelity account and
              Flourish shows what you actually own, how it meshes, and where it could grow.
            </p>
            <button onClick={link} disabled={linking}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold transition-transform hover:scale-105"
              style={{ background: theme.green, color: theme.name === "night" ? "#1B2A1E" : "#fff", fontSize: 15 }}>
              {linking ? <RefreshCw size={16} className="animate-spin" /> : <Link2 size={16} />}
              {linking ? "Securely linking…" : "Connect my Fidelity account"}
            </button>
            <p style={{ color: theme.sub, fontSize: 11.5, marginTop: 12 }}>Demo link, loads a sample starter portfolio. No real credentials involved.</p>
          </Card>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { icon: TrendingUp, t: "Daily return, decoded", d: "What today meant, minus the jargon." },
              { icon: PieChart, t: "Mesh check", d: "Do your investments make sense together?" },
              { icon: Sparkles, t: "Flourish forecast", d: "Where steady habits could take it." },
            ].map(f => (
              <Card key={f.t} theme={theme} className="p-4 text-center">
                <f.icon size={20} color={theme.green} style={{ margin: "0 auto" }} />
                <p style={{ fontWeight: 600, fontSize: 14, color: theme.ink, marginTop: 8 }}>{f.t}</p>
                <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 4 }}>{f.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const insights = [
    {
      id: "corr",
      icon: "🫂",
      title: "Your stocks are close friends",
      one: "Apple, NVIDIA and Tesla move together most of the time, which isn't helping you.",
      detail: "When tech sneezes, all three catch a cold: they're correlated 50-78%. And Apple & NVIDIA already live inside your VTI fund, so you quietly own them twice. Your mesh score is " + MESH_SCORE + "/100, great core, crowded toppings.",
      actions: [
        { label: "See the matrix", fn: openData },
        { label: "Ask coach", fn: () => askCoach(`My stocks are highly correlated (mesh score ${MESH_SCORE}/100, all tech). Why does that matter and how do I go from here?`) },
      ],
    },
    {
      id: "explore",
      icon: "🌸",
      title: "Worth a wander",
      one: interests.length
        ? `Your saved interests (${interests.slice(0, 2).map(i => i.t).join(", ")}${interests.length > 2 ? "…" : ""}) could balance your tech tilt.`
        : "Healthcare and women-led funds tend to zig when your tech zags.",
      detail: interests.length
        ? "Several of your hearts from Discover, especially the low-overlap ones, would add pieces your portfolio doesn't have yet. Check their fit-badges in the data section below."
        : "You haven't saved any interests yet. The Discover hub curates women-led companies and funds, tap a ♥ and Flourish fit-checks it against what you own.",
      actions: [{ label: "Open Discover", fn: goDiscover }],
    },
    {
      id: "career",
      icon: "💼",
      title: "Your biggest asset isn't listed here",
      one: `Your earning power (~$${(EARNING_POWER / 1000).toFixed(0)}k/yr) dwarfs this portfolio, and it's negotiable.`,
      detail: "A $3,000 raise, half of it invested, adds roughly $9,000 to this portfolio in 5 years, outperforming every stock you own. Try the raise ripple below, or rehearse the ask with your coach before the real conversation.",
      actions: [
        { label: "Try the raise ripple", fn: openData },
        { label: "Practice negotiating", fn: () => askCoach("Can we practice salary negotiation? Play a friendly hiring manager and let me rehearse asking for more.") },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {banner}

      {/* Portfolio at a glance */}
      <Card theme={theme} className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your portfolio</p>
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: theme.limeSoft, color: theme.name === "night" ? theme.lime : theme.greenDeep }}>
                <CheckCircle2 size={11} /> Fidelity linked
              </span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 32, color: theme.ink, marginTop: 4 }}>{fmt(PORT_TOTAL)}</p>
            <p style={{ fontSize: 14, color: theme.green, fontWeight: 600, marginTop: 2 }}>
              +${DAILY.amt.toFixed(2)} today <span style={{ color: theme.sub, fontWeight: 400 }}>(+{DAILY.pct}%)</span>
              <button onClick={() => setWhatsReturn(!whatsReturn)} className="ml-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: theme.rose }}>
                <HelpCircle size={12} /> what's a return?
              </button>
            </p>
            {whatsReturn && (
              <div className="mt-2 rounded-xl p-3" style={{ background: theme.roseSoft, maxWidth: 380 }}>
                <p style={{ fontSize: 12.5, color: theme.ink, lineHeight: 1.55 }}>
                  A <strong>return</strong> is just how much your money changed. Today, every $100 you'd invested became $100.44.
                  Green days and red days both happen, the long trend is what matters, not any single Tuesday.
                </p>
              </div>
            )}
          </div>
          <div className="flex-1" style={{ minWidth: 220, maxWidth: 380 }}>
            {holdings.map(h => (
              <div key={h.t} className="flex items-center gap-2 py-0.5">
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 12, color: theme.ink, width: 44 }}>{h.t}</span>
                <div className="h-1.5 flex-1 rounded-full" style={{ background: theme.chip }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(h.value / PORT_TOTAL) * 100}%`, background: h.t === "Cash" ? theme.sub : `linear-gradient(90deg, ${theme.green}, ${theme.lime})` }} />
                </div>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11.5, color: theme.sub, width: 44, textAlign: "right" }}>{fmt(h.value)}</span>
              </div>
            ))}
            <button onClick={healthRead} className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
              style={{ background: theme.roseSoft, color: theme.rose, border: `1px solid ${theme.rose}44` }}>
              <Sparkles size={12} /> {aiLoading ? "Reading…" : "AI health read"}
            </button>
          </div>
        </div>
        {aiRead && (
          <div className="mt-3 rounded-xl p-3.5" style={{ background: theme.limeSoft, fontSize: 13.5, color: theme.ink }}>
            <Rich text={aiRead} theme={theme} />
            <Sources theme={theme} items={["Your holdings db", "Correlation engine", "Fidelity Learn"]} />
          </div>
        )}
      </Card>

      {/* Insights, plain English first */}
      <div>
        <p className="mb-2 text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.1em", textTransform: "uppercase" }}>Today's insights, in plain English</p>
        <div className="grid gap-3 md:grid-cols-3">
          {insights.map(ins => {
            const isOpen = openInsight === ins.id;
            return (
              <Card key={ins.id} theme={theme} className="p-4 cursor-pointer transition-transform hover:-translate-y-0.5">
                <div onClick={() => { setOpenInsight(isOpen ? null : ins.id); if (!isOpen) earn("read1", 4, "Read an insight"); }}>
                  <div className="flex items-start justify-between gap-2">
                    <span style={{ fontSize: 22 }}>{ins.icon}</span>
                    {isOpen ? <ChevronUp size={15} color={theme.sub} /> : <ChevronDown size={15} color={theme.sub} />}
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16.5, fontWeight: 600, color: theme.ink, marginTop: 6, lineHeight: 1.3 }}>{ins.title}</h3>
                  <p style={{ fontSize: 13, color: theme.sub, marginTop: 4, lineHeight: 1.5 }}>{ins.one}</p>
                </div>
                {isOpen && (
                  <div className="mt-3 pt-3" style={{ borderTop: `1px dashed ${theme.border}` }}>
                    <p style={{ fontSize: 13, color: theme.ink, lineHeight: 1.55 }}>{ins.detail}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ins.actions.map(a => (
                        <button key={a.label} onClick={a.fn}
                          className="rounded-full px-3 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
                          style={{ background: theme.green, color: theme.name === "night" ? "#1B2A1E" : "#fff" }}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                    <Sources theme={theme} items={["Your holdings db", "Fidelity Learn"]} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Progressive disclosure: the data */}
      <div ref={dataRef}>
        <button onClick={() => setDataOpen(!dataOpen)}
          className="flex w-full items-center justify-between rounded-2xl px-5 py-4 transition-transform hover:scale-105"
          style={{ background: theme.surface, border: `1.5px dashed ${theme.border}` }}>
          <span className="flex items-center gap-2" style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, color: theme.ink }}>
            📊 Want to see the data? <span style={{ fontSize: 12.5, fontFamily: "'Instrument Sans',sans-serif", fontWeight: 400, color: theme.sub }}>charts, the matrix & every explanation</span>
          </span>
          {dataOpen ? <ChevronUp size={18} color={theme.sub} /> : <ChevronDown size={18} color={theme.sub} />}
        </button>

        {dataOpen && (
          <div className="mt-4 space-y-4">
            {/* Forecast */}
            <Card theme={theme} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Flourish forecast</p>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: theme.ink, marginTop: 2 }}>
                    Solid line = your real last 12 months. The rest = scenario.
                  </p>
                </div>
                <div className="flex gap-2">
                  <LevelChip theme={theme} label="Current mix" active={!tweaked} onClick={() => setTweaked(false)} />
                  <LevelChip theme={theme} label="With suggested tweaks" active={tweaked} onClick={() => setTweaked(true)} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs" style={{ color: theme.sub }}>Expected in 5 yrs</p>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 21, color: theme.green }}>{fmt(last.expected)}</p>
                </div>
                <div className="flex-1" style={{ minWidth: 160 }}>
                  <div className="flex items-baseline justify-between">
                    <label className="text-xs" style={{ color: theme.sub }}>Adding monthly</label>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: theme.green, fontSize: 13 }}>${monthly}</span>
                  </div>
                  <input type="range" min="0" max="500" step="10" value={monthly} onChange={e => setMonthly(+e.target.value)} className="w-full" style={{ accentColor: theme.green }} />
                </div>
                <div className="flex-1" style={{ minWidth: 160 }}>
                  <div className="flex items-baseline justify-between">
                    <label className="flex items-center gap-1 text-xs" style={{ color: theme.sub }}><Briefcase size={11} /> Raise ripple</label>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: theme.rose, fontSize: 13 }}>+${raise.toLocaleString()}/yr</span>
                  </div>
                  <input type="range" min="0" max="5000" step="500" value={raise} onChange={e => setRaise(+e.target.value)} className="w-full" style={{ accentColor: theme.rose }} />
                </div>
              </div>

              <div className="mt-2" style={{ width: "100%", height: 240 }}>
                <ResponsiveContainer>
                  <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.rose} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={theme.rose} stopOpacity={0.03} />
                      </linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.green} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={theme.green} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={theme.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="x" tick={{ fill: theme.sub, fontSize: 11 }} tickLine={false} axisLine={{ stroke: theme.border }} interval={1} />
                    <YAxis tick={{ fill: theme.sub, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${Math.round(v / 1000)}k`} width={44} />
                    <Tooltip
                      formatter={(v, k) => [fmt(v), { history: "Actual value", expected: "Expected", optimistic: "Optimistic", conservative: "Conservative" }[k]]}
                      contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12, fontSize: 12.5, color: theme.ink }} />
                    <Area type="monotone" dataKey="history" stroke={theme.rose} strokeWidth={2.4} fill="url(#gHist)" connectNulls={false} />
                    <Area type="monotone" dataKey="optimistic" stroke={theme.lime} strokeWidth={1.5} strokeDasharray="4 4" fill="none" connectNulls={false} />
                    <Area type="monotone" dataKey="expected" stroke={theme.green} strokeWidth={2.5} fill="url(#gExp)" connectNulls={false} />
                    <Area type="monotone" dataKey="conservative" stroke={theme.sub} strokeWidth={1.5} strokeDasharray="4 4" fill="none" connectNulls={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 rounded-xl p-3" style={{ background: tweaked ? theme.limeSoft : theme.chip }}>
                <p style={{ fontSize: 13, color: theme.ink, lineHeight: 1.5 }}>
                  {tweaked
                    ? <><strong style={{ color: theme.green }}>With suggested tweaks:</strong> the dotted lines hug the middle, diversifying doesn't promise higher returns, it buys a steadier climb.</>
                    : <><strong style={{ color: theme.amber }}>Current mix:</strong> a tech-heavy portfolio has a wide range of outcomes, the gap between dotted lines is the price of concentration.</>}
                  {raise > 0 && <> <strong style={{ color: theme.rose }}>Raise ripple:</strong> negotiating +${raise.toLocaleString()} and investing half adds ≈ {fmt(raiseBoost)} by year 5, one conversation, working for years.</>}
                </p>
              </div>
              <p className="mt-2 text-xs" style={{ color: theme.sub }}>Scenarios use simplified long-run historical averages. Educational, not a prediction or advice.</p>
            </Card>

            {/* Matrix */}
            <Card theme={theme} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>The friendship matrix</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 24, color: theme.amber }}>{MESH_SCORE}/100</span>
                    <span style={{ fontSize: 13, color: theme.sub }}>mesh score, how well your pieces complement each other</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `56px repeat(${CORR_TICKS.length}, 56px)` }}>
                  <div />
                  {CORR_TICKS.map(t2 => (
                    <div key={t2} className="text-center text-xs font-semibold py-1" style={{ color: theme.sub, fontFamily: "'Space Grotesk',sans-serif" }}>{t2}</div>
                  ))}
                  {CORR_TICKS.map((row, i) => (
                    <React.Fragment key={row}>
                      <div className="flex items-center text-xs font-semibold" style={{ color: theme.sub, fontFamily: "'Space Grotesk',sans-serif" }}>{row}</div>
                      {CORR_TICKS.map((col, j) => {
                        const c = CORR[i][j]; const col2 = corrColor(c, i === j);
                        return (
                          <div key={col} className="flex h-9 items-center justify-center rounded-lg text-xs font-semibold"
                            style={{ background: col2.bg, color: col2.fg, fontFamily: "'Space Grotesk',sans-serif" }}>
                            {i === j ? "·" : c.toFixed(2)}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs" style={{ color: theme.sub }}>
                Correlation = how often two holdings move together (1 = lockstep). Warm cells mean your eggs share a basket; green cells are true diversifiers.
              </p>
            </Card>

            {/* Suggestions + interests */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card theme={theme} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} color={theme.green} />
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: theme.ink }}>Could supplement your mix</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    ...(interests.filter(i => FIT[i.t]?.level === "low").slice(0, 2).map(i => ({ t: i.t, d: `From your interests, ${FIT[i.t].note}` }))),
                    { t: "Healthcare exposure", d: "Health stocks often zig when tech zags, a classic diversifier." },
                    { t: "Bond / income fund", d: "A stabilizer that softens the rough months while you learn." },
                  ].slice(0, 3).map(s => (
                    <div key={s.t} className="rounded-xl p-3" style={{ background: theme.limeSoft }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: theme.name === "night" ? theme.lime : theme.greenDeep }}>{s.t}</p>
                      <p style={{ fontSize: 12.5, color: theme.name === "night" ? theme.ink : theme.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</p>
                    </div>
                  ))}
                </div>
                <button onClick={goDiscover} className="mt-3 text-xs font-semibold" style={{ color: theme.green }}>Discover more →</button>
              </Card>

              <Card theme={theme} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={15} color={theme.amber} />
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: theme.ink }}>Worth a second look</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { t: "NVDA, owned twice", d: "It's already inside your VTI fund, and moves with AAPL 68% of the time." },
                    { t: "TSLA, the wild card", d: "Your most volatile holding; one rough week can swing the whole garden." },
                  ].map(s => (
                    <div key={s.t} className="rounded-xl p-3" style={{ background: theme.amberSoft }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: theme.amber }}>{s.t}</p>
                      <p style={{ fontSize: 12.5, color: theme.name === "night" ? theme.ink : theme.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs" style={{ color: theme.sub }}>Flags to research and ask about, never sell orders.</p>
              </Card>

              <Card theme={theme} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={15} color={theme.rose} />
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: theme.ink }}>Your interests, fit-checked</h3>
                </div>
                {interests.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: theme.sub, lineHeight: 1.5 }}>
                    Nothing saved yet. Tap the ♥ on anything in <strong>Discover</strong> and it lands here with a portfolio fit-check.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {interests.map(i => {
                      const fit = FIT[i.t] || { level: "na", note: "We'll analyze this one soon." };
                      return (
                        <div key={i.t} className="rounded-xl p-3" style={{ background: theme.chip }}>
                          <div className="flex items-center justify-between gap-2">
                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, color: theme.ink }}>{i.t}</span>
                            <div className="flex items-center gap-1.5">
                              <FitBadge level={fit.level} theme={theme} />
                              <button onClick={() => removeInterest(i.t)} title="Remove"><X size={13} color={theme.sub} /></button>
                            </div>
                          </div>
                          <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 3, lineHeight: 1.45 }}>{fit.note}</p>
                          <button onClick={() => askCoach(`I'm interested in ${i.t} and my portfolio is tech-heavy (mesh score ${MESH_SCORE}/100). How do I go from here?`)}
                            className="mt-2 text-xs font-semibold" style={{ color: theme.green }}>
                            Ask coach about this →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom strip: headlines + garden */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card theme={theme} className="p-4">
          <p className="text-xs font-semibold mb-2" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Today, translated</p>
          <div className="flex flex-wrap gap-2">
            {NEWS.map(n => (
              <button key={n.id} onClick={() => goTranslate(n.headline)}
                className="rounded-full px-3 py-1.5 text-xs transition-transform hover:scale-105"
                style={{ background: n.id === "canva" ? theme.roseSoft : theme.chip, color: theme.ink, border: `1px solid ${theme.border}` }}>
                {n.headline.length > 46 ? n.headline.slice(0, 46) + "…" : n.headline}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs" style={{ color: theme.sub }}>Tap any story and the AI rewrites it in your language.</p>
        </Card>

        <Card theme={theme} className="p-4">
          <div className="flex items-center gap-2">
            <Plant pct={conf.value} theme={theme} />
            <div className="flex-1">
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 15.5, fontWeight: 600, color: theme.ink }}>Confidence garden · {conf.value}%</p>
              <div className="h-2 w-full rounded-full mt-1" style={{ background: theme.chip }}>
                <div className="h-2 rounded-full" style={{ width: `${conf.value}%`, background: `linear-gradient(90deg, ${theme.green}, ${theme.lime})`, transition: "width .6s ease" }} />
              </div>
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tasks.map(x => {
              const isDone = conf.done.has(x.id);
              return (
                <span key={x.id} className="rounded-full px-2.5 py-1 text-xs"
                  style={{
                    background: isDone ? theme.limeSoft : "transparent",
                    border: `1px solid ${isDone ? "transparent" : theme.border}`,
                    color: isDone ? (theme.name === "night" ? theme.lime : theme.greenDeep) : theme.sub,
                    textDecoration: isDone ? "line-through" : "none",
                  }}>
                  {isDone ? "✓ " : `+${x.pts} `}{x.label}
                </span>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: TRANSLATE                                                  */
/* ------------------------------------------------------------------ */
function Translate({ theme, profile, seed, earn }) {
  const [text, setText] = useState(seed || "SpaceX signals plans for a 2027 IPO");
  const [level, setLevel] = useState("I'm new to investing");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (seed) setText(seed); }, [seed]);

  const LEVELS = ["Explain like I'm 18", "I'm new to investing", "I'm building wealth"];

  const run = async () => {
    if (!text.trim() || loading) return;
    setLoading(true); setOut(null);
    try {
      const r = await askClaude(TRANSLATE_SYSTEM(profile, level), [{ role: "user", content: `Headline: "${text.trim()}"` }]);
      setOut(r);
    } catch {
      setOut("**What happened**\nWe couldn't reach the live AI right now, demo networks can be moody.\n**Why it matters for you**\nIn the live product this panel turns any headline into plain English in seconds.\n**Terms decoded**\nIPO: a private company selling shares to the public for the first time.\n**One thing to watch**\nTry the button again in a moment!");
    }
    setLoading(false);
    earn("translate", 8, "Translated a headline");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: theme.ink }}>News, translated</h1>
          <p style={{ color: theme.sub, fontSize: 14.5, marginTop: 4 }}>
            Financial headlines are written for insiders. Paste one, Flourish rewrites it for <em>you</em>.
          </p>
        </div>
        <Card theme={theme} className="p-4">
          <label className="text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Headline or story</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            className="mt-2 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
            style={{ border: `1.5px solid ${theme.border}`, background: theme.name === "night" ? theme.chip : "#FCFDF8", color: theme.ink }} />
          <label className="mt-3 block text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Explain it for…</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {LEVELS.map(l => <LevelChip key={l} theme={theme} label={l} active={level === l} onClick={() => setLevel(l)} />)}
          </div>
          <button onClick={run} disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-semibold transition-transform hover:scale-105"
            style={{ background: theme.green, color: theme.name === "night" ? "#1B2A1E" : "#fff", opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "Translating…" : "Translate with AI"}
          </button>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card theme={theme} className="p-6 min-h-full" style={{ minHeight: 340 }}>
          {!out && !loading && (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <Languages size={38} color={theme.border} />
              <p style={{ color: theme.sub, fontSize: 14.5, marginTop: 12, maxWidth: 300 }}>
                Your plain-English translation appears here, what happened, why you should care, and the jargon decoded.
              </p>
            </div>
          )}
          {loading && (
            <div className="flex h-full flex-col items-center justify-center py-16">
              <RefreshCw size={26} color={theme.green} className="animate-spin" />
              <p style={{ color: theme.sub, fontSize: 14, marginTop: 12 }}>Claude is reading the story for you…</p>
            </div>
          )}
          {out && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: theme.limeSoft, color: theme.name === "night" ? theme.lime : theme.greenDeep }}>
                  AI translation · {level}
                </span>
              </div>
              <div style={{ fontSize: 14.5, color: theme.ink }}>
                <Rich text={out} theme={theme} />
              </div>
              <Sources theme={theme} items={["Fidelity Learn: market basics", "Newsroom snapshot", "Your reading-level profile"]} />
              <p className="mt-3 text-xs" style={{ color: theme.sub }}>Educational explanation, not investment advice.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: DISCOVER                                                   */
/* ------------------------------------------------------------------ */
function Discover({ theme, profile, earn, interests, onInterest }) {
  const [openC, setOpenC] = useState("helm");
  const [aiFor, setAiFor] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const saved = new Set(interests.map(i => i.t));

  const explain = async (item) => {
    setAiFor(item.t); setAiText(""); setLoading(true);
    try {
      const r = await askClaude(
        `You are the discovery guide in "Flourish", a Fidelity hackathon prototype for early-career women investors. ${profileLine(profile)} In under 110 words of plain text: explain what this company/fund does, why it's notable for the "women investing in women" theme, and one honest risk or caveat a beginner should know. Educational only, never advice to buy. Never use em dashes in your writing; use commas or periods instead.`,
        [{ role: "user", content: `${item.t}, ${item.s}. Context: ${item.who}` }]
      );
      setAiText(r);
    } catch { setAiText(FALLBACK); }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl p-6 md:p-7 relative overflow-hidden"
        style={{ background: `linear-gradient(120deg, ${theme.roseSoft}, ${theme.limeSoft})`, border: `1px solid ${theme.border}` }}>
        <p className="text-xs font-semibold" style={{ color: theme.rose, letterSpacing: "0.1em", textTransform: "uppercase" }}>Women invest in women</p>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 600, color: theme.ink, marginTop: 6 }}>
          Discover companies that look like your future
        </h1>
        <p style={{ color: theme.sub, fontSize: 14.5, marginTop: 6, maxWidth: 620 }}>
          Tap the heart on anything intriguing, Flourish fit-checks it against your real portfolio and carries it to your coach,
          so discovery turns into next steps instead of a forgotten tab.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COLLECTIONS.map(c => (
          <button key={c.id} onClick={() => setOpenC(c.id)} className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: openC === c.id ? theme.green : theme.surface,
              color: openC === c.id ? (theme.name === "night" ? "#1B2A1E" : "#fff") : theme.ink,
              border: `1px solid ${openC === c.id ? theme.green : theme.border}`,
            }}>
            {c.icon} {c.title}
          </button>
        ))}
      </div>

      {COLLECTIONS.filter(c => c.id === openC).map(c => (
        <div key={c.id}>
          <p style={{ color: theme.sub, fontSize: 14, marginBottom: 12 }}>{c.blurb}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {c.items.map(item => {
              const isSaved = saved.has(item.t);
              return (
                <Card key={item.t} theme={theme} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 17, color: theme.ink }}>{item.t}</span>
                        <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: theme.chip, color: theme.sub }}>{item.s}</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: theme.sub, marginTop: 6, lineHeight: 1.5 }}>{item.who}</p>
                    </div>
                    <button onClick={() => { if (!isSaved) { onInterest(item); earn("discover", 5, "Saved an interest"); } }}
                      title={isSaved ? "Saved to your interests" : "I'm interested"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110"
                      style={{ background: isSaved ? theme.rose : theme.roseSoft, border: `1px solid ${theme.rose}55` }}>
                      <Heart size={16} color={isSaved ? "#fff" : theme.rose} fill={isSaved ? "#fff" : "none"} />
                    </button>
                  </div>
                  <button onClick={() => explain(item)}
                    className="mt-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
                    style={{ background: theme.limeSoft, color: theme.name === "night" ? theme.lime : theme.greenDeep, border: `1px solid ${theme.border}` }}>
                    <Sparkles size={13} /> AI brief me
                  </button>
                  {aiFor === item.t && (
                    <div className="mt-3 rounded-xl p-3" style={{ background: theme.chip, fontSize: 13.5, color: theme.ink }}>
                      {loading ? <span style={{ color: theme.sub }}>Thinking…</span> : (<>
                        <Rich text={aiText} theme={theme} />
                        {!loading && <Sources theme={theme} items={["Fidelity research snapshot", "Company filings digest"]} />}
                      </>)}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Card theme={theme} className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} color={theme.green} />
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600, color: theme.ink }}>Wall Street Decoder</h3>
          <span className="text-xs" style={{ color: theme.sub }}>,  the jargon behind "male-dominated" money talk</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DECODER.map(d => (
            <span key={d} className="rounded-full px-3 py-1.5 text-xs" style={{ background: theme.chip, color: theme.ink, border: `1px solid ${theme.border}` }}>{d}</span>
          ))}
        </div>
        <p className="mt-3 text-xs" style={{ color: theme.sub }}>Ask the coach about any of these, no question is too basic.</p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COACH KNOWLEDGE BASE, the corpus the coach retrieves from         */
/* ------------------------------------------------------------------ */
const KB = [
  {
    cat: "Investing basics",
    items: [
      { t: "ETFs & index funds", d: "One purchase, hundreds of companies, the beginner's workhorse.", q: "What's an ETF and why do beginners start there?" },
      { t: "Risk & diversification", d: "Why your eggs need different baskets (and what correlation means).", q: "Explain diversification and why correlation matters, using my portfolio." },
      { t: "Compound interest", d: "The quiet math that makes small early habits huge later.", q: "How does compound interest actually work?" },
      { t: "IPOs, decoded", d: "What happens when a private company goes public, and why hype is risky.", q: "What is an IPO and should beginners care about them?" },
    ],
  },
  {
    cat: "Career & pay",
    items: [
      { t: "Salary negotiation", d: "Scripts, timing, and why the first number matters.", q: "Practice salary negotiation with me, play the hiring manager." },
      { t: "401(k) & the match", d: "The free money most first jobs quietly offer.", q: "Explain a 401(k) match like I'm brand new." },
      { t: "RSUs & equity pay", d: "When your pay comes in shares, what vesting means.", q: "What are RSUs and what does vesting mean?" },
      { t: "Benefits, decoded", d: "HSA, FSA, insurance tiers, the offer-letter alphabet.", q: "Decode the benefits section of a typical offer letter." },
    ],
  },
  {
    cat: "Women & money",
    items: [
      { t: "The investing gap", d: "Women invest less and later, and why that's changeable.", q: "Why do women tend to invest less, and how do I avoid that gap?" },
      { t: "Women-led funds", d: "FWOMX, SHE, WOMN, investing with a gender lens.", q: "What are women-led funds like FWOMX and SHE?" },
      { t: "Talking money out loud", d: "Joining (and steering) money conversations with confidence.", q: "How do I join money conversations at work confidently?" },
    ],
  },
  {
    cat: "Market literacy",
    items: [
      { t: "The Fed & rates", d: "Why one meeting moves your loans, savings, and stocks.", q: "How do Fed rate decisions affect me personally?" },
      { t: "Earnings season", d: "Quarterly report cards and why prices jump around them.", q: "What is earnings season?" },
      { t: "Market corrections", d: "Red weeks happen, what they mean and don't mean.", q: "What's a market correction and how should a beginner react?" },
    ],
  },
];

function KnowledgeBase({ theme, onAsk }) {
  const [cat, setCat] = useState(KB[0].cat);
  const active = KB.find(k => k.cat === cat);
  return (
    <Card theme={theme} className="p-5">
      <div className="flex items-start gap-2">
        <Database size={16} color={theme.green} style={{ marginTop: 2 }} />
        <div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: theme.ink }}>What your coach knows</h3>
          <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 2, lineHeight: 1.5 }}>
            This is the vetted knowledge base the coach retrieves from (RAG), Fidelity Learn, Investor.gov and curated guides.
            Tap any topic to pull it into chat.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {KB.map(k => <LevelChip key={k.cat} theme={theme} label={k.cat} active={cat === k.cat} onClick={() => setCat(k.cat)} />)}
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {active.items.map(item => (
          <div key={item.t} className="rounded-xl p-3.5" style={{ background: theme.chip, border: `1px solid ${theme.border}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: theme.ink }}>{item.t}</p>
            <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 3, lineHeight: 1.5 }}>{item.d}</p>
            <button onClick={() => onAsk(item.q)} className="mt-2 flex items-center gap-1 text-xs font-semibold transition-transform hover:scale-105"
              style={{ color: theme.green }}>
              Ask the coach <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  QUICK PREP, pocket cheat-sheet for a money conversation           */
/* ------------------------------------------------------------------ */
const PREP_SCENARIOS = ["Salary negotiation", "Money talk with coworkers", "Meeting a financial advisor", "Networking event", "Family money conversation", "Friends talking stocks"];
const PREP_FALLBACK = `• Lead with curiosity: "How did you get started with investing?"
• Ask one clarifying question before answering anything, it buys time and reads as confidence.
• Phrase to keep in your pocket: "I'd love to think that over and follow up tomorrow."
• If numbers come up, don't agree on the spot, "Let me run that against my plan."
• Avoid pretending to know a term, "Decode that for me?" is a power move.
• Breathe. Nobody in the room knows everything either.`;

function QuickPrep({ theme, profile, dark, portCtx, earn, onPractice }) {
  const [scenario, setScenario] = useState(PREP_SCENARIOS[0]);
  const [details, setDetails] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (loading) return;
    setLoading(true); setOut(null); setCopied(false);
    try {
      const r = await askClaude(
        `You are Quick Prep inside "Flourish", a Fidelity hackathon prototype for early-career women. The user has a money-related conversation coming up soon and little time. ${profileLine(profile)} ${portCtx}
Scenario: ${scenario}. ${details.trim() ? `Extra context from the user: "${details.trim()}".` : ""}
Return ONLY a pocket cheat-sheet in plain text: 6-8 lines, each starting with "• ", covering 2-3 ways to engage or smart questions to ask, 1-2 exact phrases they can say verbatim (in quotes), one thing to avoid, and one calming reminder. No intro, no outro, under 130 words. Never use em dashes in your writing; use commas or periods instead.${dark ? " It's After Dark: make the calming reminder extra warm, she may be nervous right now." : ""}`,
        [{ role: "user", content: `Prep me for: ${scenario}` }]
      );
      setOut(r);
    } catch { setOut(PREP_FALLBACK); }
    setLoading(false);
    earn("prep", 6, "Prepped for a money conversation");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable in some sandboxes */ }
  };

  return (
    <Card theme={theme} className="p-5">
      <div className="flex items-start gap-2">
        <span style={{ fontSize: 18 }}>⚡</span>
        <div>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: theme.ink }}>
            {dark ? "No time? No panic." : "Conversation coming up?"}
          </h3>
          <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 2, lineHeight: 1.5 }}>
            Running late to a money talk or nervous about one tomorrow? Get a pocket cheat-sheet in 30 seconds, ways to engage, questions to ask, exact phrases to use.
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>What's the situation?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PREP_SCENARIOS.map(s => <LevelChip key={s} theme={theme} label={s} active={scenario === s} onClick={() => setScenario(s)} />)}
      </div>

      <input value={details} onChange={e => setDetails(e.target.value)}
        onKeyDown={e => e.key === "Enter" && run()}
        placeholder={`Anything specific? e.g. "they offered $65k" or "it's in 20 minutes"`}
        className="mt-3 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
        style={{ border: `1.5px solid ${theme.border}`, background: theme.name === "night" ? theme.chip : "#FCFDF8", color: theme.ink }} />

      <button onClick={run} disabled={loading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-semibold transition-transform hover:scale-105"
        style={{ background: theme.green, color: theme.name === "night" ? "#1B2A1E" : "#fff", opacity: loading ? 0.7 : 1 }}>
        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? "Prepping you…" : "Prep me fast"}
      </button>

      {out && (
        <div className="mt-4 rounded-2xl p-4" style={{ background: theme.limeSoft, border: `1px dashed ${theme.green}55` }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold" style={{ color: theme.name === "night" ? theme.lime : theme.greenDeep, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Your pocket card · {scenario}
            </p>
            <button onClick={copy} className="text-xs font-semibold" style={{ color: theme.green }}>{copied ? "Copied ✓" : "Copy"}</button>
          </div>
          <div className="mt-2" style={{ fontSize: 13.5, color: theme.ink }}>
            <Rich text={out} theme={theme} />
          </div>
          <Sources theme={theme} items={["Fidelity Learn", "Negotiation guides", "Your profile db"]} />
          <button onClick={() => onPractice(scenario)}
            className="mt-3 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-transform hover:scale-105"
            style={{ background: theme.roseSoft, color: theme.rose, border: `1px solid ${theme.rose}44` }}>
            <MessageCircle size={13} /> Rehearse it in chat
          </button>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN: COACH                                                      */
/* ------------------------------------------------------------------ */
function Coach({ theme, profile, dark, setDark, msgs, setMsgs, earn, portCtx, seed, onSeedUsed }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("chat");
  const endRef = useRef(null);
  const seedRef = useRef(false);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const dayChips = ["How do I go from here?", "What's an ETF, honestly?", "Practice salary negotiation with me", "How do I start with $100?"];
  const nightChips = ["I'm scared to invest", "Everyone gets this but me", "I only have $20", "I lost money once and quit"];
  const chips = dark ? nightChips : dayChips;

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next = [...msgs, { role: "user", content }];
    setMsgs(next);
    setLoading(true);
    earn("chat", 6, "Asked the coach a question");
    try {
      const r = await askClaude(COACH_SYSTEM(profile, dark, portCtx), next.map(m => ({ role: m.role, content: m.content })));
      setMsgs([...next, { role: "assistant", content: r }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: FALLBACK }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (seed && !seedRef.current) {
      seedRef.current = true;
      onSeedUsed();
      setView("chat");
      send(seed);
    }
  }, [seed]);

  const askInChat = (q) => { setView("chat"); send(q); };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl p-6 mb-4 relative overflow-hidden" style={{ background: theme.hero, boxShadow: theme.card }}>
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {dark ? "After Dark · judgment-free zone" : "Your AI money coach"}
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 600, color: "#fff", marginTop: 4 }}>
              {dark ? `The questions you'd never ask out loud` : `Ask anything, ${profile.name}`}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5, marginTop: 6, maxWidth: 460 }}>
              {dark
                ? "It's late, it's quiet, and nothing here is a dumb question. The coach softens after dark, more reassurance, smaller steps."
                : "Plain-English answers grounded in your portfolio, interests and level, it can even role-play your next salary negotiation."}
            </p>
          </div>
          <button onClick={() => setDark(!dark)}
            className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />} {dark ? "Daylight" : "After Dark"}
          </button>
        </div>
        {dark && <Moon size={140} style={{ position: "absolute", right: -20, bottom: -46, color: "rgba(255,255,255,0.07)" }} />}
      </div>

      {/* Section switcher */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: "chat", label: "💬 Chat" },
          { id: "kb", label: "📚 Knowledge base" },
          { id: "prep", label: "⚡ Quick prep" },
        ].map(v => (
          <LevelChip key={v.id} theme={theme} label={v.label} active={view === v.id} onClick={() => setView(v.id)} />
        ))}
      </div>

      {view === "kb" && <KnowledgeBase theme={theme} onAsk={askInChat} />}
      {view === "prep" && (
        <QuickPrep theme={theme} profile={profile} dark={dark} portCtx={portCtx} earn={earn}
          onPractice={(s) => askInChat(`Let's rehearse my ${s.toLowerCase()} right now, play the other person and let me practice.`)} />
      )}

      {view === "chat" && (<>
      <Card theme={theme} className="flex flex-col" style={{ height: 440 }}>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center px-6">
              <MessageCircle size={34} color={theme.border} />
              <p style={{ color: theme.sub, fontSize: 14, marginTop: 10 }}>
                {dark ? "Whatever's on your mind tonight, start there." : "Start with a starter question below, or type your own."}
              </p>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div className="rounded-2xl px-4 py-2.5" style={{
                maxWidth: "85%",
                background: m.role === "user" ? theme.green : theme.chip,
                color: m.role === "user" ? (theme.name === "night" ? "#1B2A1E" : "#fff") : theme.ink,
                fontSize: 14, lineHeight: 1.55,
                borderBottomRightRadius: m.role === "user" ? 6 : 16,
                borderBottomLeftRadius: m.role === "user" ? 16 : 6,
              }}>
                {m.role === "assistant" ? (<>
                  <Rich text={m.content} theme={theme} />
                  <Sources theme={theme} items={["Fidelity Learn", "Your profile & portfolio db"]} />
                </>) : m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5" style={{ background: theme.chip, color: theme.sub, fontSize: 14 }}>
                {dark ? "Taking a breath…" : "Thinking…"}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="p-3" style={{ borderTop: `1px solid ${theme.border}` }}>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {chips.map(c => (
              <button key={c} onClick={() => send(c)} className="rounded-full px-3 py-1.5 text-xs transition-transform hover:scale-105"
                style={{ background: dark ? theme.roseSoft : theme.limeSoft, color: dark ? theme.rose : (theme.name === "night" ? theme.lime : theme.greenDeep), border: `1px solid ${theme.border}` }}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={dark ? "It's just us…" : "Ask your money question…"}
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
              style={{ border: `1.5px solid ${theme.border}`, background: theme.name === "night" ? theme.chip : "#FCFDF8", color: theme.ink }} />
            <button onClick={() => send()} className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{ background: theme.green, color: theme.name === "night" ? "#1B2A1E" : "#fff" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </Card>
      <p className="mt-3 text-center text-xs" style={{ color: theme.sub }}>
        <ShieldCheck size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }} />
        Flourish Coach offers education and encouragement, not personalized investment advice.
      </p>
      </>)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FIND YOUR LIGHT, After Dark community                             */
/* ------------------------------------------------------------------ */
function FindYourLight({ theme, posts, addPost, onClose }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" style={{ background: "rgba(8,6,20,0.6)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.card }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb size={18} color="#F4C46A" />
              <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: theme.ink }}>Find your light</h3>
            </div>
            <p style={{ fontSize: 12.5, color: theme.sub, marginTop: 3 }}>You're not the only one awake. Anonymous, kind, moderated.</p>
          </div>
          <button onClick={onClose}><X size={18} color={theme.sub} /></button>
        </div>
        <div className="mt-4 space-y-3 overflow-y-auto" style={{ maxHeight: 300 }}>
          {posts.map((p, i) => (
            <div key={i} className="rounded-2xl p-3.5" style={{ background: theme.chip }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F4C46A", fontFamily: "'Space Grotesk',sans-serif" }}>@{p.who}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: theme.rose }}><Heart size={11} fill={theme.rose} /> {p.hearts}</span>
              </div>
              <p style={{ fontSize: 13.5, color: theme.ink, marginTop: 5, lineHeight: 1.5 }}>{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && draft.trim()) { addPost(draft.trim()); setDraft(""); } }}
            placeholder="Share a small win or a worry…"
            className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
            style={{ border: `1.5px solid ${theme.border}`, background: theme.chip, color: theme.ink }} />
          <button onClick={() => { if (draft.trim()) { addPost(draft.trim()); setDraft(""); } }}
            className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#F4C46A", color: "#1B2A1E" }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NEXT STEPS POPUP                                                   */
/* ------------------------------------------------------------------ */
function NextSteps({ theme, item, onClose, goHomeData, goCoach }) {
  const fit = FIT[item.t] || { level: "na", note: "" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,20,12,0.5)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.card, animation: "pop .25s ease" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: theme.roseSoft }}>
            <Heart size={18} color={theme.rose} fill={theme.rose} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 600, color: theme.ink }}>{item.t} saved!</h3>
            <div className="mt-0.5"><FitBadge level={fit.level} theme={theme} /></div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: theme.sub, marginTop: 10, lineHeight: 1.5 }}>{fit.note}</p>
        <p className="mt-4 text-xs font-semibold" style={{ color: theme.sub, letterSpacing: "0.08em", textTransform: "uppercase" }}>Next steps</p>
        <div className="mt-2 space-y-2">
          <button onClick={goHomeData} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: theme.limeSoft, color: theme.name === "night" ? theme.lime : theme.greenDeep }}>
            See how it fits your portfolio <PieChart size={15} />
          </button>
          <button onClick={goCoach} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-105"
            style={{ background: theme.roseSoft, color: theme.rose }}>
            Ask coach: how do I go from here? <MessageCircle size={15} />
          </button>
          <button onClick={onClose} className="w-full rounded-xl px-4 py-2.5 text-sm" style={{ color: theme.sub }}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOW FLOURISH THINKS, AI + RAG pipeline modal                      */
/* ------------------------------------------------------------------ */
function HowItWorks({ theme, onClose }) {
  const steps = [
    { n: "1", t: "Retrieve (RAG)", d: "Your question triggers retrieval over a vetted knowledge base, Fidelity Learn articles, Investor.gov explainers, and curated women-led company research, so answers are grounded, not guessed." },
    { n: "2", t: "Personalize (user db)", d: "Your profile, linked portfolio holdings, and saved interests are stored in a user database and injected as context, the same question gets a different answer for a different woman." },
    { n: "3", t: "Generate", d: "Claude writes the plain-English answer at your reading level, citing the retrieved sources you see under every response." },
    { n: "4", t: "Guardrails", d: "An education-only filter keeps output compliant: concepts and scenarios, never 'buy X', the line Fidelity has to hold." },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,20,12,0.5)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl p-6" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.card, animation: "pop .25s ease" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Database size={18} color={theme.green} />
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: theme.ink }}>How Flourish thinks</h3>
          </div>
          <button onClick={onClose}><X size={18} color={theme.sub} /></button>
        </div>
        <div className="mt-4 space-y-3">
          {steps.map(s => (
            <div key={s.n} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold" style={{ background: theme.limeSoft, color: theme.name === "night" ? theme.lime : theme.greenDeep, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif" }}>{s.n}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: theme.ink }}>{s.t}</p>
                <p style={{ fontSize: 12.5, color: theme.sub, lineHeight: 1.5, marginTop: 2 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: theme.sub }}>Prototype note: generation is live; the retrieval layer is mocked with curated sources for the demo.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP SHELL                                                          */
/* ------------------------------------------------------------------ */
export default function FlourishApp() {
  const [profile, setProfile] = useState(null);
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState("home");
  const [confVal, setConfVal] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const [seed, setSeed] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [interests, setInterests] = useState([]);
  const [connected, setConnected] = useState(false);
  const [coachSeed, setCoachSeed] = useState(null);
  const [popup, setPopup] = useState(null);
  const [acctOpen, setAcctOpen] = useState(false);
  const [lightOpen, setLightOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [homeFocus, setHomeFocus] = useState(null);
  const [posts, setPosts] = useState(SEED_POSTS);
  const theme = dark ? NIGHT : DAY;

  const earn = (id, pts, label) => {
    if (done.has(id)) return;
    setDone(prev => new Set([...prev, id]));
    setConfVal(v => Math.min(100, v + pts));
    setToast(`+${pts} confidence · ${label}`);
    setTimeout(() => setToast(null), 2600);
  };

  const askCoach = (q) => { setCoachSeed(q); setScreen("coach"); };
  const addInterest = (item) => {
    setInterests(prev => {
      if (prev.some(i => i.t === item.t)) return prev;
      const next = [...prev, item];
      // Persist to the Java backend's data store (fire-and-forget)
      fetch(`${API_BASE}/api/client/maya/interests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: next.map(i => i.t) }),
      }).catch(() => {});
      return next;
    });
    setPopup(item);
  };

  const NAV = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "translate", label: "Translate", icon: Languages },
    { id: "discover", label: "Discover", icon: Flower2 },
    { id: "coach", label: "Coach", icon: MessageCircle },
  ];

  if (!profile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Instrument+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');
          * { box-sizing: border-box; } body { margin: 0; font-family: 'Instrument Sans', sans-serif; }
        `}</style>
        <Onboarding onDone={(p, startConf) => { setProfile(p); setConfVal(startConf); setToast(`Welcome, ${p.name}, your garden is planted 🌱`); setTimeout(() => setToast(null), 2800); }} />
        <Toast toast={toast} theme={DAY} />
      </>
    );
  }

  const portCtx = portfolioLine(connected, interests);

  return (
    <div className="min-h-screen w-full" style={{ background: theme.bg, fontFamily: "'Instrument Sans', sans-serif", transition: "background .45s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Instrument+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        @keyframes rise { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes pop { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
        button { cursor: pointer; font-family: inherit; border: none; background: none; padding: 0; }
        button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid ${theme.green}; outline-offset: 2px; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 99px; background: ${theme.chip}; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: ${theme.green}; border: 3px solid ${theme.surface}; box-shadow: 0 1px 4px rgba(0,0,0,.25); }
        ::placeholder { color: ${theme.sub}; opacity: .7; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      {/* Top bar */}
      <header className="sticky top-0 z-40 w-full" style={{ background: theme.bg + "F2", backdropFilter: "blur(8px)", borderBottom: `1px solid ${theme.border}` }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: theme.green }}>
              <Flower2 size={19} color={theme.name === "night" ? "#1B2A1E" : "#fff"} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 20, color: theme.ink, letterSpacing: "-0.01em" }}>Flourish</span>
                <span className="hidden sm:inline text-xs" style={{ color: theme.sub }}>by Fidelity · concept</span>
              </div>
              <p className="hidden md:block" style={{ fontSize: 10.5, color: theme.rose, fontStyle: "italic", fontFamily: "'Fraunces',serif", marginTop: -2 }}>
                Females investing in females.
              </p>
            </div>
          </div>

          <nav className="hidden md:flex flex-1 items-center gap-8 pl-8">
            {NAV.map(n => {
              const active = screen === n.id;
              return (
                <button key={n.id} onClick={() => setScreen(n.id)}
                  className="text-sm transition-all"
                  style={{
                    color: active ? theme.green : theme.ink,
                    fontWeight: active ? 650 : 480,
                    letterSpacing: "0.01em",
                    borderBottom: active ? `2px solid ${theme.green}` : "2px solid transparent",
                    paddingBottom: 2,
                  }}>
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} title={dark ? "Back to daylight" : "After Dark mode"}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-transform hover:scale-105 sm:px-4"
              style={{ border: `1.5px solid ${theme.green}`, color: dark ? "#F4C46A" : theme.green, background: "transparent" }}>
              {dark ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden sm:inline">{dark ? "Daylight" : "After Dark"}</span>
            </button>
            <ConfidencePill conf={confVal} theme={theme} />
            <div className="relative">
              <button onClick={() => setAcctOpen(!acctOpen)} title="Your account"
                className="flex h-9 w-9 items-center justify-center rounded-full font-semibold transition-transform hover:scale-110"
                style={{ background: theme.rose, color: "#fff", fontSize: 14, fontFamily: "'Space Grotesk',sans-serif" }}>
                {profile.name ? profile.name[0].toUpperCase() : <User size={15} />}
              </button>
              {acctOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}`, boxShadow: theme.card }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full font-semibold" style={{ background: theme.rose, color: "#fff", fontFamily: "'Space Grotesk',sans-serif" }}>
                      {profile.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14.5, color: theme.ink }}>{profile.name}</p>
                      <p style={{ fontSize: 11.5, color: theme.sub }}>{profile.stage}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl p-2.5" style={{ background: theme.chip }}>
                    <p style={{ fontSize: 11, color: theme.sub, letterSpacing: "0.06em", textTransform: "uppercase" }}>Goal</p>
                    <p style={{ fontSize: 13, color: theme.ink, fontWeight: 500 }}>{profile.goal}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-xl p-2.5" style={{ background: theme.chip }}>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: connected ? theme.green : theme.sub }} />
                      <span style={{ fontSize: 12.5, color: theme.ink }}>Fidelity account</span>
                    </div>
                    {connected
                      ? <span className="text-xs font-semibold" style={{ color: theme.green }}>Linked ✓</span>
                      : <button onClick={() => { setAcctOpen(false); setScreen("home"); }} className="text-xs font-semibold" style={{ color: theme.green }}>Connect →</button>}
                  </div>
                  <button onClick={() => { setAcctOpen(false); setHowOpen(true); }}
                    className="mt-2 flex w-full items-center gap-2 rounded-xl p-2.5 text-left" style={{ background: theme.chip }}>
                    <Database size={13} color={theme.green} />
                    <span style={{ fontSize: 12.5, color: theme.ink }}>How Flourish thinks (AI + RAG)</span>
                  </button>
                  <p className="mt-2 text-xs" style={{ color: theme.sub }}>Demo profile · {interests.length} saved interest{interests.length === 1 ? "" : "s"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden sticky z-30 flex justify-around px-2 py-2" style={{ top: 65, background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        {NAV.map(n => {
          const A = n.icon; const active = screen === n.id;
          return (
            <button key={n.id} onClick={() => setScreen(n.id)} className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1"
              style={{ color: active ? theme.green : theme.sub }}>
              <A size={18} /><span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{n.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-20" onClick={() => acctOpen && setAcctOpen(false)}>
        {screen === "home" && <Home theme={theme} profile={profile} dark={dark} earn={earn} conf={{ value: confVal, done }}
          connected={connected} onConnect={() => setConnected(true)}
          interests={interests} removeInterest={(t) => setInterests(prev => prev.filter(i => i.t !== t))}
          askCoach={askCoach} goDiscover={() => setScreen("discover")}
          goTranslate={(h) => { setSeed(h); setScreen("translate"); }}
          focus={homeFocus} onFocusHandled={() => setHomeFocus(null)} />}
        {screen === "translate" && <Translate theme={theme} profile={profile} seed={seed} earn={earn} />}
        {screen === "discover" && <Discover theme={theme} profile={profile} earn={earn} interests={interests} onInterest={addInterest} />}
        {screen === "coach" && <Coach theme={theme} profile={profile} dark={dark} setDark={setDark} msgs={msgs} setMsgs={setMsgs} earn={earn} portCtx={portCtx} seed={coachSeed} onSeedUsed={() => setCoachSeed(null)} />}
      </main>

      {/* After Dark: Find your light */}
      {dark && (
        <button onClick={() => setLightOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold shadow-lg transition-transform hover:scale-105"
          style={{ background: "#F4C46A", color: "#1B2A1E", fontSize: 13.5 }}>
          <Lightbulb size={16} /> Find your light
        </button>
      )}
      {lightOpen && dark && (
        <FindYourLight theme={theme} posts={posts} onClose={() => setLightOpen(false)}
          addPost={(text) => setPosts(prev => [{ who: profile.name.toLowerCase() + "_grows", text, hearts: 0 }, ...prev])} />
      )}

      {popup && (
        <NextSteps theme={theme} item={popup}
          onClose={() => setPopup(null)}
          goHomeData={() => { setPopup(null); setHomeFocus("data"); setScreen("home"); }}
          goCoach={() => { const t = popup.t; setPopup(null); askCoach(`I just saved ${t} to my interests. How do I go from here?`); }} />
      )}

      {howOpen && <HowItWorks theme={theme} onClose={() => setHowOpen(false)} />}

      <Toast toast={toast} theme={theme} />
    </div>
  );
}
