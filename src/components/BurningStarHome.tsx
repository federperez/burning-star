"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function BurningStarHome() {
  const layerRef = useRef<HTMLDivElement>(null);
  const signalWindowRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const lastTrailRef = useRef(0);

  const [navOpen, setNavOpen] = useState(false);
  const [signalActive, setSignalActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const notify = (message: string) => {
    setToast({ show: true, message });
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2400) as unknown as number;
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layer = layerRef.current;

    const createParticle = (x: number, y: number, burst: boolean, index = 0) => {
      if (!layer) return;
      const particle = document.createElement("img");
      particle.src = "/assets/burning-star-emblem.svg";
      particle.alt = "";
      particle.className = `brand-particle ${
        burst ? "particle-burst" : "particle-trail"
      } ${index % 3 === 0 ? "particle-red" : ""}`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--dx", `${(Math.random() - 0.5) * (burst ? 190 : 32)}px`);
      particle.style.setProperty("--dy", `${(Math.random() - 0.65) * (burst ? 170 : 38)}px`);
      particle.style.setProperty("--spin", `${Math.random() * 260 - 130}deg`);
      particle.style.setProperty(
        "--size",
        `${burst ? 12 + Math.random() * 24 : 7 + Math.random() * 10}px`
      );
      layer.appendChild(particle);
      window.setTimeout(() => particle.remove(), burst ? 920 : 560);
    };

    const handlePointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);

      if (reduced || event.pointerType === "touch") return;
      const now = performance.now();
      if (now - lastTrailRef.current < 55) return;
      lastTrailRef.current = now;
      createParticle(event.clientX, event.clientY, false, Math.floor(now / 60));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const total = reduced ? 3 : 11;
      for (let index = 0; index < total; index += 1) {
        createParticle(event.clientX, event.clientY, true, index);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const closeNav = () => setNavOpen(false);

  const handleSignalToggle = () => setSignalActive((prev) => !prev);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = emailInputRef.current?.value.trim() ?? "";
    if (!value || !value.includes("@")) {
      notify("INGRESÁ UNA FRECUENCIA VÁLIDA");
      return;
    }
    if (emailInputRef.current) emailInputRef.current.value = "";
    notify("SEÑAL RECIBIDA / WELCOME TO THE BURN");
  };

  return (
    <main id="top">
      <div ref={layerRef} className="particle-layer" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="pointer-light" aria-hidden="true" />

      <div className="status-line">
        <span>BURNING STAR® / OFFICIAL SIGNAL</span>
        <span>BLACKOUT SYSTEM 050505</span>
        <span>BUENOS AIRES / ARG</span>
      </div>

      <header className="site-header">
        <a className="header-mark" href="#top" aria-label="Burning Star — Inicio">
          <img
            className="official-emblem"
            src="/assets/burning-star-emblem.svg"
            alt=""
            aria-hidden="true"
          />
          <span className="header-lockup">
            <span className="official-wordmark" aria-hidden="true">
              <img src="/assets/burning-star-banner.jpg" alt="" />
            </span>
            <small>IDENTITY SYSTEM</small>
          </span>
        </a>

        <nav className={`nav${navOpen ? " open" : ""}`} aria-label="Navegación principal">
          <a href="#archive" onClick={closeNav}>ARCHIVE</a>
          <a href="#code" onClick={closeNav}>THE CODE</a>
          <a href="#signal" onClick={closeNav}>SIGNAL</a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((prev) => !prev)}
        >
          {navOpen ? "CLOSE [×]" : "MENU [=]"}
        </button>

        <a className="header-cta" href="#signal">
          <span>●</span> ENTER SIGNAL
        </a>
      </header>

      <section className="hero">
        <img
          className="hero-banner"
          src="/assets/burning-star-banner.jpg"
          alt="Logo oficial Burning Star: estrella en llamas y wordmark"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-corner corner-tl" aria-hidden="true" />
        <div className="hero-corner corner-br" aria-hidden="true" />

        <div className="hero-data">
          <span className="data-index">[ BS // 001 ]</span>
          <p>BLACK / FIRE / MOVEMENT</p>
          <span className="data-rule" />
          <p>IDENTITY LOCKED</p>
        </div>

        <div className="hero-bottom">
          <div className="hero-copy">
            <span className="eyebrow">TRANSMISSION_001</span>
            <h1>
              DESIGN
              <br />
              <em>TO DEFY.</em>
            </h1>
            <p>
              Una señal en negro, acero y fuego.
              <br />
              <strong>Sin permiso. Sin apagar la intensidad.</strong>
            </p>
            <a className="primary-button" href="#archive">
              ENTER THE ARCHIVE <span>↘</span>
            </a>
          </div>

          <button
            ref={signalWindowRef}
            className={`system-window${signalActive ? " is-active" : ""}`}
            type="button"
            aria-label={signalActive ? "Pausar señal Burning Star" : "Activar señal Burning Star"}
            onClick={handleSignalToggle}
          >
            <span className="system-bar">
              <span>BS_SIGNAL.EXE</span>
              <span>— □ ×</span>
            </span>
            <span className="system-body">
              <span className="system-status">
                <i />
                <span className="system-status-copy">
                  {signalActive ? "TRANSMITTING" : "SIGNAL READY"}
                </span>
              </span>
              <span className="frequency">{signalActive ? "91.1 FM" : "CLICK TO DEFY"}</span>
              <span className="waveform" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <i key={i} style={{ ["--delay" as string]: `${i * 40}ms` }} />
                ))}
              </span>
            </span>
          </button>
        </div>

        <div className="scroll-note">
          <span>SCROLL / EXPLORE</span>
          <i />
        </div>
      </section>

      <section className="brand-marquee" aria-label="Burning Star signal">
        <div>
          <span>[ BURNING STAR ]</span><i>★</i>
          <span>BLACKOUT SYSTEM</span><i>★</i>
          <span>DESIGN TO DEFY</span><i>★</i>
          <span>[ BURNING STAR ]</span><i>★</i>
          <span>BLACKOUT SYSTEM</span><i>★</i>
          <span>DESIGN TO DEFY</span><i>★</i>
        </div>
      </section>

      <section className="archive-section" id="archive">
        <div className="section-intro">
          <div>
            <span className="section-number">01 / ARCHIVE</span>
            <p>IDENTITY COMPONENTS</p>
          </div>
          <h2>
            BURNING
            <br />
            <em>SYSTEM.</em>
          </h2>
          <p className="section-summary">
            Una identidad construida desde el contraste, el movimiento y el fuego.
            Cada elemento responde al mismo código.
          </p>
        </div>

        <div className="archive-grid">
          <Link
            className="archive-card"
            href="/producto/core-identity"
            aria-label="Ver producto Core Identity"
          >
            <div className="card-head">
              <span>[01]</span>
              <span>BS® / FILE</span>
            </div>
            <div className="archive-visual archive-emblem">
              <span className="technical-grid" />
              <span className="target-ring ring-a" />
              <img
                className="official-emblem"
                src="/assets/burning-star-emblem.svg"
                alt=""
                aria-hidden="true"
              />
              <span className="axis axis-x" />
              <span className="axis axis-y" />
            </div>
            <div className="card-info">
              <div>
                <h3>CORE IDENTITY</h3>
                <p>STAR / FLAME / SIGNAL</p>
              </div>
              <span className="card-action" aria-hidden="true">↗</span>
            </div>
          </Link>

          <Link
            className="archive-card"
            href="/producto/broadcast"
            aria-label="Ver producto Broadcast"
          >
            <div className="card-head">
              <span>[02]</span>
              <span>BS® / FILE</span>
            </div>
            <div className="archive-visual archive-banner">
              <img src="/assets/burning-star-banner.jpg" alt="Banner oficial Burning Star" />
              <span className="crop-frame" />
            </div>
            <div className="card-info">
              <div>
                <h3>BROADCAST</h3>
                <p>WEB BANNER / 2026</p>
              </div>
              <span className="card-action" aria-hidden="true">↗</span>
            </div>
          </Link>

          <Link
            className="archive-card"
            href="/producto/burning-object"
            aria-label="Ver producto Burning Object"
          >
            <div className="card-head">
              <span>[03]</span>
              <span>BS® / FILE</span>
            </div>
            <div className="archive-visual archive-red">
              <span className="target-ring ring-a" />
              <span className="target-ring ring-b" />
              <img
                className="official-emblem"
                src="/assets/burning-star-emblem.svg"
                alt=""
                aria-hidden="true"
              />
              <span className="material-code">B91C1C</span>
            </div>
            <div className="card-info">
              <div>
                <h3>BURNING OBJECT</h3>
                <p>SYSTEM MATERIAL / RED</p>
              </div>
              <span className="card-action" aria-hidden="true">↗</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="code-section" id="code">
        <div className="code-visual">
          <img
            className="official-emblem"
            src="/assets/burning-star-emblem.svg"
            alt=""
            aria-hidden="true"
          />
          <span className="code-orbit orbit-one" />
          <span className="code-orbit orbit-two" />
          <span className="coordinate coord-a">X: 050505</span>
          <span className="coordinate coord-b">Y: B91C1C</span>
          <span className="code-crosshair">＋</span>
        </div>

        <div className="code-copy">
          <span className="section-number">02 / THE CODE</span>
          <h2>
            MADE TO
            <br />
            QUESTION. <em>DESIGN TO
            <br />
            DEFY.</em>
          </h2>
          <p>
            Burning Star existe para lo que no se puede suavizar. Negro como base,
            fuego como impulso y una estrella que no funciona como adorno: funciona
            como advertencia.
          </p>
          <div className="code-list">
            <span><b>01</b> NEGRO ESPACIAL / BASE</span>
            <span><b>02</b> BLANCO FRÍO / IMPACTO</span>
            <span><b>03</b> ROJO QUEMADO / SEÑAL</span>
          </div>
        </div>
      </section>

      <section className="manifesto-band">
        <p>
          DESIGN TO DEFY / NO PARA <s>ENCAJAR</s>, PARA DEJAR MARCA.
        </p>
        <img
          className="official-emblem"
          src="/assets/burning-star-emblem.svg"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className="signal-section" id="signal">
        <div className="signal-radar" aria-hidden="true">
          <span /><span /><span /><i />
        </div>
        <span className="section-number">03 / OPEN CHANNEL</span>
        <h2>
          JOIN THE
          <br />
          <em>SIGNAL.</em>
        </h2>
        <p>Acceso a próximos archivos, lanzamientos y transmisiones.</p>
        <form className="signal-form" onSubmit={handleFormSubmit}>
          <label className="sr-only" htmlFor="signal-email">Email</label>
          <span className="input-prefix">MAIL://</span>
          <input
            id="signal-email"
            ref={emailInputRef}
            type="email"
            placeholder="YOUR@EMAIL.COM"
            autoComplete="email"
          />
          <button type="submit">CONNECT ↗</button>
        </form>
        <small>NO SPAM / ONLY SIGNAL / DISCONNECT ANYTIME</small>
      </section>

      <footer>
        <div className="footer-brand">
          <img
            className="official-emblem"
            src="/assets/burning-star-emblem.svg"
            alt=""
            aria-hidden="true"
          />
          <span className="footer-lockup">
            <span className="official-wordmark" aria-hidden="true">
              <img src="/assets/burning-star-banner.jpg" alt="" />
            </span>
            <small>DESIGN TO DEFY</small>
          </span>
        </div>
        <div className="footer-nav">
          <a href="#archive">ARCHIVE</a>
          <a href="#code">CODE</a>
          <a href="#signal">CONTACT</a>
          <a href="#top">INSTAGRAM ↗</a>
        </div>
        <div className="footer-meta">
          <span><i /> SIGNAL ONLINE</span>
          <span>© 2026 / BUENOS AIRES</span>
        </div>
      </footer>

      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        <span>BS://</span> <span className="toast-copy">{toast.message}</span>
      </div>
    </main>
  );
}
