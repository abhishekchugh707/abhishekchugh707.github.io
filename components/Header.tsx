"use client";
import { useEffect, useRef, useState } from "react";
import { Ellipsis, Moon, Sun, X } from "lucide-react";
import { asset, site } from "@/lib/data";
import { GitHubLogo, LinkedInLogo, Pieces, WaveIcon } from "./Wave";

const primary = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
const secondary = [
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "CV", href: asset(site.cv), external: true },
  { label: "GitHub", href: site.github, external: true },
];

export default function Header() {
  const [dark, setDark] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("portfolio-theme", next ? "dark" : "light"); } catch {}
  };

  const open = () => dialog.current?.showModal();
  const close = () => {
    const d = dialog.current;
    if (!d || !d.open) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { d.close(); return; }
    d.setAttribute("data-closing", "");
    setTimeout(() => { d.removeAttribute("data-closing"); d.close(); }, 200);
  };

  let n = 0;
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#about" aria-label={`${site.fullName}, home`}>
            <span className="wordmark-text">{site.firstName}</span>
          </a>
          <div className="header-actions">
            <button className="icon-button theme-toggle wave-target" onClick={toggleTheme}
              aria-label="Toggle dark mode" aria-pressed={dark}>
              <WaveIcon>{dark ? <Sun size={18} /> : <Moon size={18} />}</WaveIcon>
            </button>
            <button className="icon-button nav-menu-trigger wave-target" onClick={open}
              aria-label="Navigation menu" aria-haspopup="dialog" aria-controls="navigation-panel">
              <WaveIcon size={24}><Ellipsis size={24} /></WaveIcon>
            </button>
          </div>
        </div>
      </header>

      <dialog id="navigation-panel" className="nav-dialog" ref={dialog} aria-label="Navigation menu"
        onCancel={(e) => { e.preventDefault(); close(); }}
        onClick={(e) => { if (e.target === dialog.current) close(); }}>
        <div className="nav-panel">
          <div className="nav-panel-top">
            <button className="nav-panel-close" onClick={close} aria-label="Close navigation menu">
              <Pieces text="close" />
              <span className="nav-close-circle nav-menu-piece"><X size={23} /></span>
            </button>
          </div>
          <nav className="nav-panel-links" aria-label="Site navigation">
            <div className="nav-menu-primary">
              {primary.map((l) => {
                const s = n; n += l.label.length;
                return <a key={l.href} href={l.href} onClick={close}><Pieces text={l.label} start={s} /></a>;
              })}
            </div>
            <div className="nav-menu-secondary">
              {secondary.map((l) => {
                const s = n; n += l.label.length;
                return (
                  <a key={l.href} href={l.href} onClick={l.external ? undefined : close}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...(l.label === "CV" ? { "data-goatcounter-click": "cv-download", "data-goatcounter-title": "CV download (menu)" } : {})}>
                    <Pieces text={l.label} start={s} />
                  </a>
                );
              })}
            </div>
          </nav>
          <div className="nav-panel-footer">
            <a className="nav-panel-email" href={`mailto:${site.email}`}><Pieces text={site.email} start={n} /></a>
            <div className="nav-panel-socials">
              <a className="nav-menu-piece" href={site.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer"><GitHubLogo /></a>
              <a className="nav-menu-piece" href={site.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedInLogo /></a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
