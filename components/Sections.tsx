"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Copy, Check, FileText, X } from "lucide-react";
import { asset, experience, projects, site, skills, type Project } from "@/lib/data";
import { GitHubLogo, LinkedInLogo, WaveIcon, WaveText } from "./Wave";

/** Fade sections in once as they enter the viewport. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Tech stack ---------- */
export function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="wrap" data-reveal>
        <div className="skills-heading">
          <h2>Tech Stack</h2>
          <p>The tools behind<br /> my work.</p>
        </div>
        <div className="skills-specimens">
          {skills.map((g) => (
            <article className="skills-specimen" key={g.id} aria-labelledby={`skills-${g.id}`}>
              <h3 id={`skills-${g.id}`}>{g.title}</h3>
              <p className="skills-specimen-note">{g.note}</p>
              <ul className="skills-type-mosaic">{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- project art (in place of screenshots) ---------- */
function ProjectArt({ icon, large = false }: { icon: Project["icon"]; large?: boolean }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: large ? 2 : 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "chart")
    return (
      <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
        {[30, 60, 90, 120].map((y) => <line key={y} x1="20" x2="225" y1={y} y2={y} stroke="currentColor" opacity=".12" />)}
        <path {...s} opacity=".35" strokeDasharray="4 5" d="M20 105 C45 100 55 60 80 62 S115 98 140 88 170 40 195 42 215 70 225 66" />
        <path {...s} d="M20 108 C45 98 55 64 80 66 S115 94 140 84 170 46 195 46 215 66 225 62" />
        <circle cx="195" cy="46" r="5" fill="currentColor" />
        <text x="20" y="20" fontSize="11" fontWeight="600" fill="currentColor">forecast · R² 0.97</text>
      </svg>
    );
  if (icon === "shield")
    return (
      <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
        <path {...s} d="M120 18 L160 32 V68 C160 96 142 114 120 124 C98 114 80 96 80 68 V32 Z" />
        <rect x="104" y="62" width="32" height="26" rx="4" {...s} />
        <path {...s} d="M110 62 V54 a10 10 0 0 1 20 0 V62" />
        {[[30, 40], [30, 100], [210, 40], [210, 100]].map(([x, y], i) => (
          <g key={i}><circle cx={x} cy={y} r="9" {...s} /><line x1={x < 120 ? x + 9 : x - 9} y1={y} x2={x < 120 ? 78 : 162} y2={70} {...s} strokeDasharray="3 5" opacity=".5" /></g>
        ))}
      </svg>
    );
  if (icon === "graph")
    return (
      <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
        {[[40, 40, 100, 70], [100, 70, 160, 35], [100, 70, 130, 115], [160, 35, 205, 75], [130, 115, 205, 75], [40, 40, 55, 105], [55, 105, 130, 115]].map(([a, b, c, d], i) => (
          <line key={i} x1={a} y1={b} x2={c} y2={d} {...s} opacity=".55" />
        ))}
        {[[40, 40, 9], [100, 70, 13], [160, 35, 9], [130, 115, 9], [205, 75, 11], [55, 105, 7]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} {...s} fill={i === 1 ? "currentColor" : "#fff"} />
        ))}
      </svg>
    );
  if (icon === "agent")
    return (
      <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
        <rect x="24" y="24" width="96" height="36" rx="10" {...s} />
        <line x1="38" x2="104" y1="38" y2="38" {...s} opacity=".45" /><line x1="38" x2="84" y1="48" y2="48" {...s} opacity=".45" />
        <rect x="120" y="78" width="96" height="36" rx="10" fill="currentColor" />
        <circle cx="140" cy="96" r="4" fill="#fff" /><circle cx="156" cy="96" r="4" fill="#fff" /><circle cx="172" cy="96" r="4" fill="#fff" />
        <path {...s} opacity=".55" strokeDasharray="4 5" d="M120 42 C160 42 168 60 168 78" />
        {[[44, 104], [78, 104]].map(([x, y], i) => <rect key={i} x={x - 14} y={y - 12} width="28" height="24" rx="4" {...s} />)}
        <path {...s} opacity=".55" d="M58 104 H64 M92 104 H120" />
      </svg>
    );
  if (icon === "radar")
    return (
      <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
        {[54, 38, 22].map((r) => <circle key={r} cx="120" cy="72" r={r} {...s} opacity=".35" />)}
        <path d="M120 72 L120 18 A54 54 0 0 1 166 44 Z" fill="currentColor" opacity=".18" />
        <line x1="120" y1="72" x2="166" y2="44" {...s} />
        {[[146, 52, 5], [98, 48, 4], [138, 104, 4], [84, 88, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="currentColor" />)}
        <circle cx="120" cy="72" r="3" fill="currentColor" />
      </svg>
    );
  return (
    <svg className="art" viewBox="0 0 240 140" aria-hidden="true">
      <rect x="30" y="20" width="110" height="100" rx="6" {...s} />
      {[40, 52, 64, 76, 88, 100].map((y, i) => <line key={y} x1="42" x2={i % 3 === 2 ? 100 : 128} y1={y} y2={y} {...s} opacity=".45" />)}
      {[["+", 32], ["~", 66], ["−", 100]].map(([t, y], i) => (
        <g key={i}><rect x="160" y={(y as number) - 12} width={[56, 34, 20][i]} height="16" rx="3" fill="currentColor" opacity={[0.9, 0.5, 0.25][i]} />
          <text x="150" y={(y as number) + 1} fontSize="13" fontWeight="700" fill="currentColor">{t}</text></g>
      ))}
    </svg>
  );
}

/** The project's picture if one exists in public/projects/, otherwise the drawn icon. */
function ProjectVisual({ p, large = false }: { p: Project; large?: boolean }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!p.image) return;
    const img = new Image();
    img.onload = () => setOk(true);
    img.src = asset(p.image);
  }, [p.image]);
  if (ok && p.image) return <img className="project-photo" src={asset(p.image)} alt="" />;
  return <ProjectArt icon={p.icon} large={large} />;
}

/* ---------- GenPro pipeline diagram ---------- */
function Pipeline() {
  const [route, setRoute] = useState<"train" | "serve">("train");
  const steps = [
    { k: "ingest", t: "Ingest", d: "Plant + weather data into TimescaleDB" },
    { k: "train", t: "Train & select", d: "9 models tracked in MLflow, best one wins" },
    { k: "api", t: "Forecast API", d: "FastAPI microservice, shared ORM layer" },
    { k: "ui", t: "Dashboard", d: "Angular + ECharts, Keycloak auth" },
  ];
  const active = route === "train" ? ["ingest", "train"] : ["api", "ui"];
  return (
    <div className="pipeline">
      <div className="route-switch" role="group" aria-label="Explore the GenPro pipeline">
        <button className="wave-target" aria-pressed={route === "train"} onClick={() => setRoute("train")}><WaveText>Training path</WaveText></button>
        <button className="wave-target" aria-pressed={route === "serve"} onClick={() => setRoute("serve")}><WaveText>Serving path</WaveText></button>
      </div>
      <div className="pipe-steps">
        {steps.map((s) => (
          <div key={s.k} className={`pipe-step${active.includes(s.k) ? " is-active" : ""}`}>
            <strong>{s.t}</strong><span>{s.d}</span>
          </div>
        ))}
      </div>
      <p className="pipe-note" aria-live="polite">
        <ArrowRight size={16} aria-hidden="true" />
        {route === "train"
          ? "Automated model selection across 4 Transformer and 5 scikit-learn variants, reproducible in MLflow."
          : "Forecasts served over REST to operators, with real-time charts and an EV charging simulator under 200 ms."}
      </p>
    </div>
  );
}

/* ---------- Projects ---------- */
export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.id === openId);

  const open = (id: string) => {
    setOpenId(id === openId ? null : id);
    if (id !== openId) requestAnimationFrame(() => {
      panel.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  };

  return (
    <section id="projects" className="projects-section wrap section-pad">
      <div data-reveal>
        <div className="section-heading">
          <h2>Featured<br />Projects</h2>
          <a className="text-link wave-target" href={site.github} target="_blank" rel="noopener noreferrer">
            <WaveText>GitHub</WaveText> <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <p className="projects-intro">Professional work, research and side builds. Open a folder to explore a project.</p>
        <div className="project-folder-grid">
          {projects.map((p) => (
            <button key={p.id} type="button" className="project-folder" onClick={() => open(p.id)}
              aria-expanded={openId === p.id} aria-controls="project-details-panel">
              <span className="sr-only">{p.name}</span>
              <span className="folder-scene" aria-hidden="true">
                <span className="folder-back" />
                <span className="folder-paper folder-paper-back"><FileText size={18} /><span>Overview</span><span className="folder-paper-lines" /></span>
                <span className="folder-paper folder-paper-preview">
                  <span className="folder-preview-art" style={{ background: p.tint }}><ProjectVisual p={p} /></span>
                  <span>{p.name}</span>
                </span>
                <span className="folder-paper folder-paper-front"><FileText size={18} /><span>Details & stack</span><span className="folder-paper-lines" /></span>
                <span className="folder-front">
                  <span className="folder-front-title">{p.name}</span>
                  <span className="folder-open-icon"><ArrowUpRight size={20} /></span>
                </span>
              </span>
              <span className="folder-caption" aria-hidden="true">
                <span>{p.caption}</span>
                <span className="folder-caption-action">{p.action} <ArrowUpRight size={15} /></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div id="project-details-panel" className="project-details-panel" ref={panel} tabIndex={-1} role="region"
        aria-label="Project details" hidden={!project}>
        {project && (
          <>
            <div className="project-panel-toolbar">
              <span>Project details</span>
              <button className="icon-button wave-target" aria-label="Close project details" onClick={() => setOpenId(null)}>
                <WaveIcon><X size={20} /></WaveIcon>
              </button>
            </div>
            <article className="project-study" key={project.id} aria-labelledby={`${project.id}-title`}>
              <div className="project-visual" style={{ background: project.tint }}><ProjectVisual p={project} large /></div>
              <div className="study-content">
                <h3 id={`${project.id}-title`}>{project.name}</h3>
                <p className="project-category">{project.category}</p>
                <p className="study-summary">{project.summary}</p>
                <dl className="study-stats">
                  {project.stats.map((x) => <div key={x.k}><dd>{x.v}</dd><dt>{x.k}</dt></div>)}
                </dl>
                <div className="stack-list">{project.stack.map((x) => <span key={x}>{x}</span>)}</div>
                <dl className="case-facts">
                  {project.facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
                </dl>
                {project.id === "genpro" && <Pipeline />}
                <h4 className="detail-heading">What I did</h4>
                <ol className="detail-list">{project.body.map((b) => <li key={b}>{b}</li>)}</ol>
                {project.links && (
                  <div className="project-links">
                    {project.links.map((l) => (
                      <a key={l.href} className="text-link wave-target" href={l.href} target="_blank" rel="noopener noreferrer">
                        <WaveText>{l.label}</WaveText> <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- Experience road ---------- */
export function Experience() {
  const map = useRef<HTMLDivElement>(null);
  const [d, setD] = useState("");
  const [box, setBox] = useState("0 0 1180 400");

  useLayoutEffect(() => {
    const el = map.current!;
    const build = () => {
      const r = el.getBoundingClientRect();
      const pts = Array.from(el.querySelectorAll<HTMLElement>(".journey-stop-marker")).map((m) => {
        const b = m.getBoundingClientRect();
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
      });
      setBox(`0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
      if (pts.length < 2) return;
      let path = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
        path += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
      }
      setD(path);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    document.fonts?.ready.then(build);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.dataset.drawn = "true"; io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <section id="experience" className="experience-section">
      <div className="wrap" data-reveal>
        <div className="experience-heading">
          <h2>Experience.</h2>
          <p>Where I&apos;ve built things.<br /> And where I learned.</p>
        </div>
        <div className="journey-roadmap" ref={map} data-drawn="false">
          <svg className="journey-road" viewBox={box} preserveAspectRatio="none" aria-hidden="true">
            <path className="journey-road-base" d={d} />
            <path className="journey-road-ink" d={d} pathLength={1} />
          </svg>
          {experience.map((x, i) => (
            <article key={x.id} className={`journey-stop${i === 0 ? " journey-now" : ""}`} aria-labelledby={`${x.id}-title`}
              style={{ ["--i" as string]: i }}>
              <span className="journey-stop-marker" aria-hidden="true"><span /></span>
              <div className="journey-stop-content">
                <p className="journey-date">{x.badge && <span className="journey-current">{x.badge}</span>}{x.date}</p>
                <h3 id={`${x.id}-title`}>{x.title}</h3>
                <p className="journey-place">{x.place}{x.city && <span>{x.city}</span>}</p>
                <p className="journey-description">{x.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [draftCopied, setDraftCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  const mailto = (d: { subject: string; body: string }) =>
    `mailto:${site.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
  const gmail = (d: { subject: string; body: string }) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = {
      subject: `Hello from ${f.get("name")}`,
      body: `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`,
    };
    setDraft(d);
    setDraftCopied(false);
    // Try the visitor's email app straight away; the box below covers the cases where nothing opens.
    try { window.location.href = mailto(d); } catch {}
  };
  const copyDraft = async () => {
    if (!draft) return;
    try { await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${draft.subject}\n\n${draft.body}`); setDraftCopied(true); } catch {}
  };
  return (
    <section id="contact" className="contact-section">
      <div className="wrap" data-reveal>
        <div className="contact-layout">
          <div className="contact-opening">
            <h2>Let&apos;s talk.</h2>
            <p>Open to full-time roles in backend, DevOps, full-stack and ML. My inbox is open.</p>
            <div className="contact-details">
              <div className="email-block">
                <a className="email-link wave-target" href={`mailto:${site.email}`}>
                  <WaveText>{site.email}</WaveText><ArrowUpRight size={20} aria-hidden="true" />
                </a>
                <button className="icon-button copy-email wave-target" onClick={copy} aria-label="Copy email address">
                  <WaveIcon>{copied ? <Check size={18} /> : <Copy size={18} />}</WaveIcon>
                </button>
              </div>
              <span className="copy-status" role="status">{copied ? "Copied to clipboard" : ""}</span>
            </div>
            <div className="social-links">
              <a className="wave-target" href={site.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInLogo /><WaveText>LinkedIn</WaveText></a>
              <a className="wave-target" href={site.github} target="_blank" rel="noopener noreferrer"><GitHubLogo /><WaveText>GitHub</WaveText></a>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-field">
              <label htmlFor="inq-name">Your name</label>
              <input id="inq-name" name="name" placeholder="What should I call you?" autoComplete="name" required />
            </div>
            <div className="contact-field">
              <label htmlFor="inq-email">Email address</label>
              <input id="inq-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
            </div>
            <div className="contact-field contact-message">
              <label htmlFor="inq-msg">What do you have in mind?</label>
              <textarea id="inq-msg" name="message" rows={4} placeholder="A little about the role or project…" required />
            </div>
            <div className="contact-submit">
              <button className="draft-button wave-target" type="submit">
                <WaveText>Create email draft</WaveText><ArrowUpRight size={22} aria-hidden="true" />
              </button>
            </div>
            {draft && (
              <div className="draft-ready" role="status">
                <p>Your draft is ready. Send it from:</p>
                <div className="draft-actions">
                  <a className="draft-link wave-target" href={gmail(draft)} target="_blank" rel="noopener noreferrer">
                    <WaveText>Open in Gmail</WaveText><ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <a className="draft-link wave-target" href={mailto(draft)}>
                    <WaveText>Open email app</WaveText><ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <button type="button" className="draft-link wave-target" onClick={copyDraft}>
                    <WaveText>{draftCopied ? "Copied" : "Copy message"}</WaveText>{draftCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
