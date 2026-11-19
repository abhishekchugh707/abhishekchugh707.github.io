"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { asset, bio, heroCode, site } from "@/lib/data";
import { WaveText } from "./Wave";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Faint code behind the title, with a slow wave of brightness moving through it. */
function CodeBackground() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = host.current!, cv = canvas.current!, ctx = cv.getContext("2d")!;
    const lines = heroCode.split("\n");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, fs = 12, lh = 20, cw = 7, raf = 0, visible = true, last = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = el.clientWidth; h = el.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fs = w < 700 ? 10 : 12; lh = fs * 1.7;
      ctx.font = `500 ${fs}px "Space Grotesk Variable", monospace`;
      cw = ctx.measureText("M").width * 0.92;
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#141414";
      ctx.fillStyle = ink;
      const rows = Math.ceil(h / lh) + 1;
      for (let r = 0; r < rows; r++) {
        const line = lines[r % lines.length];
        const y = 16 + r * lh;
        for (let c = 0; c < line.length; c++) {
          const ch = line[c];
          if (ch === " ") continue;
          const x = 20 + c * cw;
          if (x > w) break;
          const wave = Math.sin(x * 0.006 + y * 0.004 - t * 0.0006) * Math.sin(y * 0.011 - t * 0.0004 + x * 0.002);
          ctx.globalAlpha = 0.035 + Math.max(0, wave) * 0.13;
          ctx.fillText(ch, x, y);
        }
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (visible && !document.hidden && t - last > 40) { draw(t); last = t; }
      raf = requestAnimationFrame(loop);
    };
    resize();
    const start = () => (reduce ? draw(0) : (raf = requestAnimationFrame(loop)));
    document.fonts?.ready.then(() => { resize(); start(); }) ?? start();
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const themeObs = new MutationObserver(() => draw(performance.now()));
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); themeObs.disconnect(); };
  }, []);
  return (
    <div className="hero-code-background" ref={host} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}

function Terminal({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span className="terminal-text">
      <span aria-hidden="true">{"{{ "}</span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
      <span className="terminal-caret" aria-hidden="true" />
      <span aria-hidden="true">{" }}"}</span>
    </span>
  );
}

function TitleLine({ word, start, mark }: { word: string; start: number; mark: "open" | "close" }) {
  return (
    <span className="title-line" aria-hidden="true">
      <span className="hero-word">
        <span className={`hero-code-mark hero-code-${mark}`}>
          {mark === "open" ? (
            <svg viewBox="20 0 110 160" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square">
              <path opacity=".16" d="M105 30 48 80 105 130" transform="translate(5 6)" />
              <path d="M105 30 48 80 105 130" />
            </svg>
          ) : (
            <svg viewBox="0 0 180 160" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square">
              <path opacity=".16" d="M65 30 25 130M100 30 157 80 100 130" transform="translate(5 6)" />
              <path d="M65 30 25 130M100 30 157 80 100 130" />
            </svg>
          )}
        </span>
        {Array.from(word).map((c, i) => (
          <span className="hero-letter-window" key={i}>
            <span className="hero-letter" style={{ ["--i" as string]: start + i, transformOrigin: mark === "open" ? "50% 100%" : "50% 0%" }}>{c}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function About() {
  const section = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLAnchorElement>(null);
  const bioImg = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const desc = useRef<HTMLDivElement>(null);
  const [words] = useState(() => site.role.toUpperCase().split(" "));

  // Title letters rise in once the font is ready.
  useEffect(() => {
    const el = hero.current!;
    const go = () => el.setAttribute("data-intro", "play");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.setAttribute("data-intro", "done"); return; }
    const t = setTimeout(go, 900);
    document.fonts?.ready.then(() => { clearTimeout(t); go(); });
    return () => clearTimeout(t);
  }, []);

  // The portrait card travels from the hero to the bio, turning over on the way.
  useEffect(() => {
    const sec = section.current!, j = journey.current!, c = card.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      [intro.current, desc.current].forEach((e) => e && (e.style.opacity = "1"));
      return;
    }
    sec.classList.add("portrait-motion-ready");
    let S = { x: 0, y: 0, w: 0, h: 0 }, E = { x: 0, y: 0, w: 0, h: 0 }, endY = 1, raf = 0;
    const docRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    };
    const layout = () => {
      const top = sec.getBoundingClientRect().top + scrollY;
      S = docRect(heroImg.current!); E = docRect(bioImg.current!);
      S.y -= top; E.y -= top;
      endY = Math.max(1, E.y - (innerHeight - E.h) / 2);
      j.style.height = `${endY + innerHeight}px`;
      sec.classList.add("portrait-motion-active");
      read();
    };
    const read = () => {
      const top = sec.getBoundingClientRect().top + scrollY;
      const y = scrollY - top;
      const raw = clamp01(y / endY);
      const p = ease(raw);
      const ey = E.y - endY;
      const x = S.x + (E.x - S.x) * p, yy = S.y + (ey - S.y) * p;
      const w = S.w + (E.w - S.w) * p, h = S.h + (E.h - S.h) * p;
      c.style.left = `${x}px`; c.style.top = `${yy}px`;
      c.style.width = `${w}px`; c.style.height = `${h}px`;
      c.style.borderRadius = `${9 + 7 * p}px`;
      const lift = Math.sin(raw * Math.PI);
      c.style.transform = `perspective(1200px) rotateY(${(180 * p).toFixed(2)}deg) scale(${(1 - 0.12 * lift).toFixed(4)})`;
      const fade = clamp01((raw - 0.55) / 0.4);
      if (intro.current) intro.current.style.opacity = fade.toFixed(3);
      if (desc.current) desc.current.style.opacity = fade.toFixed(3);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(read); };
    let lastW = innerWidth;
    const onResize = () => { if (innerWidth !== lastW || innerWidth > 860) { lastW = innerWidth; layout(); } };
    const img = bioImg.current!.querySelector("img")!;
    if (img.complete) layout(); else img.addEventListener("load", layout, { once: true });
    document.fonts?.ready.then(layout);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  const photo = asset("/me.jpg");
  const cutout = asset("/me-cutout.webp");
  return (
    <section id="about" className="about-section" ref={section}>
      <div className="portrait-journey" ref={journey} aria-hidden="true">
        <div className="portrait-sticky-stage">
          <div className="portrait-card" ref={card}>
            <div className="portrait-face portrait-face-front"><img src={cutout} alt="" /></div>
            <div className="portrait-face portrait-face-back"><img src={photo} alt="" /></div>
          </div>
        </div>
      </div>

      <div className="hero wrap" ref={hero} data-intro="pending">
        <CodeBackground />
        <a href="#biography" className="hero-portrait-link" ref={heroImg} aria-label={`About ${site.fullName}`}>
          <img src={cutout} alt={`${site.fullName} in black and white`} width={760} height={893} />
        </a>
        <div className="hero-heading-composition">
          <h1 className="hero-title" aria-label={site.role}>
            <TitleLine word={words[0]} start={0} mark="open" />
            <TitleLine word={words[1] ?? ""} start={words[0].length} mark="close" />
          </h1>
        </div>
        <div className="hero-footer">
          <span className="hero-year">©{new Date().getFullYear()}</span>
          <span className="hero-focus"><Terminal text={site.focus} /></span>
        </div>
      </div>

      <div id="biography" className="biography wrap">
        <div className="bio-introduction" ref={intro} style={{ opacity: 0 }}>
          <h2>Hi, I&apos;m<br /> {site.firstName}.</h2>
          <p className="bio-role">{site.role} <span>{site.roleLong}.</span></p>
          <div className="bio-current">
            <span className="bio-status">{bio.status}</span>
            <span>Most recently at</span>
            <p><strong>{bio.latest.org}</strong><br />{bio.latest.title}<br /><span>{bio.latest.place}</span></p>
          </div>
        </div>
        <figure className="bio-portrait" ref={bioImg}>
          <img src={photo} alt={`Portrait of ${site.fullName}`} width={760} height={893} />
        </figure>
        <div className="bio-description" ref={desc} style={{ opacity: 0 }}>
          <p className="bio-lead">
            {bio.lead.map((s, i) => (s.b ? <strong key={i}>{s.t}</strong> : <span key={i}>{s.t}</span>))}
          </p>
          <div className="bio-actions">
            <a className="bio-projects wave-target" href="#projects">
              <WaveText>Explore projects</WaveText><ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <a className="bio-cv wave-target" href={`mailto:${site.email}`}>
              <WaveText>Email me</WaveText><ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
