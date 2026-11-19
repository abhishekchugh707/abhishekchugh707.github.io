"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { asset, site } from "@/lib/data";
import { WaveText } from "./Wave";

const COLS = 5, ROWS = 3;

type Sprite = { sx: number; sy: number; sw: number; sh: number; canvas: HTMLCanvasElement; faded: HTMLCanvasElement };
type Walker = {
  sprite: number; layer: "back" | "front"; dir: 1 | -1;
  h: number; speed: number; phase: number; bob: number; x0: number; sink: number;
};

/** Cut the sheet into 15 cells and trim each figure to its painted pixels. */
function sliceSheet(img: HTMLImageElement): Sprite[] | string {
  const W = img.naturalWidth, H = img.naturalHeight;
  if (!W || !H) return "crowd.png did not load";
  const cw = W / COLS, ch = H / ROWS;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, W, H).data;
  const alpha = (x: number, y: number) => data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3];
  // An opaque sheet (drawn checkerboard or white fill) shows up as solid corners.
  const corners = [alpha(2, 2), alpha(W - 3, 2), alpha(2, H - 3), alpha(W - 3, H - 3)];
  if (corners.filter((a) => a > 200).length >= 3) return "crowd.png background is not transparent";
  const sprites: Sprite[] = [];
  for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++) {
    const x0 = Math.round(col * cw), y0 = Math.round(r * ch), x1 = Math.round((col + 1) * cw), y1 = Math.round((r + 1) * ch);
    let minX = x1, minY = y1, maxX = x0, maxY = y0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 24) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (maxX <= minX || maxY <= minY) return `cell ${r * COLS + col + 1} of crowd.png is empty`;
    // Copy each figure onto its own padded canvas, so scaling never blends in
    // pixels from the neighbouring cell.
    const sw = Math.min(x1, maxX + 2) - minX, sh = Math.min(y1, maxY + 2) - minY, P = 2;
    const own = document.createElement("canvas");
    own.width = sw + P * 2; own.height = sh + P * 2;
    own.getContext("2d")!.drawImage(c, minX, minY, sw, sh, P, P, sw, sh);
    // Back-row copy: the lower body fades out, since the front row stands in front of it.
    const faded = document.createElement("canvas");
    faded.width = own.width; faded.height = own.height;
    const fx = faded.getContext("2d")!;
    fx.drawImage(own, 0, 0);
    fx.globalCompositeOperation = "destination-out";
    const g = fx.createLinearGradient(0, own.height * 0.55, 0, own.height);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
    fx.fillStyle = g; fx.fillRect(0, 0, own.width, own.height);
    sprites.push({ sx: P, sy: P, sw, sh, canvas: own, faded });
  }
  return sprites;
}

/** A shuffled cast where nobody stands next to their own twin. */
function cast(n: number, rand: () => number) {
  const out: number[] = [];
  let pool: number[] = [];
  while (out.length < n) {
    if (!pool.length) pool = Array.from({ length: COLS * ROWS }, (_, i) => i).sort(() => rand() - 0.5);
    const i = pool.findIndex((s) => s !== out[out.length - 1] && s !== out[out.length - 2]);
    out.push(pool.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return out;
}

function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function CrowdFooter() {
  const scene = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const nameEl = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [canvasOk, setCanvasOk] = useState(true);
  const pausedRef = useRef(false);
  const name = `${site.firstName.toUpperCase()}.`;

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const el = scene.current!, cb = back.current!, cf = front.current!;
    const bctx = cb.getContext("2d")!, fctx = cf.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sprites: Sprite[] = [], walkers: Walker[] = [], W = 0, H = 0, charH = 0;
    let raf = 0, clock = 0, lastNow = 0, onScreen = false, alive = true;
    const img = new Image();

    const fitName = () => {
      const n = nameEl.current;
      if (!n) return;
      n.style.fontSize = "";
      const max = el.clientWidth * 0.97;
      const w = n.scrollWidth;
      if (w > max) n.style.fontSize = `${(parseFloat(getComputedStyle(n).fontSize) * max) / w}px`;
    };

    const build = () => {
      const rand = mulberry(20261119);
      const mobile = W < 600;
      const nBack = mobile ? 7 : 25, nFront = mobile ? 3 : 16;
      const ids = cast(nBack + nFront, rand);
      walkers = ids.map((sprite, i) => {
        const isBack = i < nBack;
        const h = charH * (isBack ? 0.46 + rand() * 0.05 : 0.6 + rand() * 0.07);
        return {
          sprite,
          // a few rear walkers are painted on the front canvas so they overlap you too
          layer: isBack ? (rand() < 0.15 ? "front" : "back") : "front",
          dir: isBack ? 1 : -1,
          h,
          speed: 1 / (10 + rand() * 6),          // crossings per second
          phase: isBack ? i / nBack + rand() * 0.03 : (i - nBack) / nFront + rand() * 0.04,
          bob: rand() * 10,
          x0: rand() * Math.PI * 2,
          // back row: head offset from the character's head line; front row: share hidden below the frame
          sink: isBack ? -0.04 + rand() * 0.1 : -0.04 + rand() * 0.08,
        } as Walker;
      }).sort((a, b) => (a.dir === b.dir ? a.h - b.h : a.dir === 1 ? -1 : 1));
    };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.clientWidth; H = el.clientHeight;
      for (const c of [cb, cf]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      charH = portrait.current?.clientHeight || Math.min(365, H - 24);
      fitName();
      if (sprites.length) { build(); draw(); }
    };

    const draw = () => {
      bctx.clearRect(0, 0, W, H); fctx.clearRect(0, 0, W, H);
      const t = clock;
      for (const w of walkers) {
        const s = sprites[w.sprite];
        const dh = w.h, dw = (s.sw / s.sh) * dh;
        const span = W + dw;
        let p = (w.phase + t * w.speed) % 1;
        if (p < 0) p += 1;
        const x = w.dir === 1 ? -dw + p * span : W - p * span;
        const bob = reduce ? 0 : Math.abs(Math.sin(t * Math.PI * 2 + w.x0)) * w.bob;
        const isBack = w.dir === 1;
        const headLine = H - 12 - charH;                     // the character's head
        const y = isBack ? headLine + w.sink * charH - bob : H - dh * (1 - w.sink) - bob;
        const ctx = w.layer === "back" ? bctx : fctx;
        const art = isBack ? s.faded : s.canvas;
        if (w.dir === -1) {
          ctx.save(); ctx.translate(x + dw, 0); ctx.scale(-1, 1);
          ctx.drawImage(art, s.sx, s.sy, s.sw, s.sh, 0, y, dw, dh);
          ctx.restore();
        } else {
          ctx.drawImage(art, s.sx, s.sy, s.sw, s.sh, x, y, dw, dh);
        }
      }
    };

    const loop = (now: number) => {
      if (!alive) return;
      const dt = lastNow ? Math.min((now - lastNow) / 1000, 0.1) : 0;
      lastNow = now;
      if (!pausedRef.current) { clock += dt; draw(); }
      raf = onScreen && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (reduce || raf || !sprites.length || !onScreen || document.hidden) return;
      lastNow = 0; raf = requestAnimationFrame(loop);
    };

    img.onload = () => {
      const res = sliceSheet(img);
      if (typeof res === "string") {
        console.warn(`[crowd footer] ${res}. Please generate a corrected crowd.png (5 columns × 3 rows, transparent background).`);
        setCanvasOk(false);
        return;
      }
      sprites = res;
      resize();
      clock = 3.7;
      draw();
      start();
    };
    img.onerror = () => { console.warn("[crowd footer] could not load crowd.webp"); setCanvasOk(false); };
    // Fetch the crowd only once the visitor is within ~2 screens of the footer,
    // so it never competes with the top of the page but is ready on arrival.
    const pre = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { img.src = asset("/footer/crowd.webp"); pre.disconnect(); }
    }, { rootMargin: "200% 0px" });
    pre.observe(el);

    const ro = new ResizeObserver(() => resize());
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) start(); });
    io.observe(el);
    const vis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", vis);
    document.fonts?.ready.then(fitName);
    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); pre.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    try { history.replaceState(null, "", location.pathname); } catch {}
  };

  const links = [
    ["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"],
    ["Experience", "#experience"], ["Contact", "#contact"], ["CV", asset(site.cv)], ["GitHub", site.github],
  ];

  return (
    <footer className="site-footer">
      <div className="footer-top wrap">
        <div className="footer-identity">
          <h2>{site.firstName}.</h2>
          <p>{site.role}<br />{site.roleLong}.</p>
        </div>
        <nav aria-label="Footer navigation">
          <p>Explore</p>
          <div>
            {links.map(([l, h]) => (
              <a key={l} className="wave-target" href={h} {...(!h.startsWith("#") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l === "CV" ? { "data-goatcounter-click": "cv-download", "data-goatcounter-title": "CV download (footer)" } : {})}>
                <WaveText>{l}</WaveText>
              </a>
            ))}
          </div>
        </nav>
        <div className="footer-contact">
          <p>Get in touch</p>
          <a className="wave-target" href={`mailto:${site.email}`}><WaveText>{site.email}</WaveText><ArrowUpRight size={16} aria-hidden="true" /></a>
          <span>© {new Date().getFullYear()} {site.fullName}</span>
        </div>
      </div>
      <div className="footer-finale">
        <div className="footer-finale-heading wrap">
          <p>See you around.</p>
          <a href="#" onClick={toTop}>Back to top <ArrowUp size={16} aria-hidden="true" /></a>
        </div>
        <p id="crowd-desc" className="sr-only">
          An illustrated crowd of pedestrians walking past. {site.firstName} stands still among them in a black shirt and yellow sneakers while people pass in front of him.
        </p>
        <button type="button" className="footer-crowd-scene" ref={scene} aria-pressed={paused}
          aria-label={`${name} ${paused ? "Resume" : "Pause"} crowd animation`} aria-describedby="crowd-desc"
          onClick={() => setPaused((p) => !p)}>
          <span className="footer-crowd-name" ref={nameEl} aria-hidden="true">{name}</span>
          {canvasOk && <canvas className="footer-crowd-layer footer-crowd-back" ref={back} aria-hidden="true" />}
          <img className="footer-crowd-portrait" ref={portrait} src={asset("/footer/character.webp")} alt="" loading="lazy" />
          {canvasOk && <canvas className="footer-crowd-layer footer-crowd-front" ref={front} aria-hidden="true" />}
          <span className="footer-crowd-paused" aria-hidden="true">Paused</span>
        </button>
        <div className="footer-scene-bottom wrap">
          <small>Finally, some traffic on my website.</small>
        </div>
      </div>
    </footer>
  );
}
