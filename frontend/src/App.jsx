// App.jsx — Root with routing + Clerk
import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import Navbar       from "./components/Navbar";
import ClerkApiSetup from "./components/ClerkApiSetup";
import Detect       from "./pages/Detect";
import History      from "./pages/History";
import ScanDetail   from "./pages/ScanDetail";
import Stats        from "./pages/Stats";

const shellStyle = {
  minHeight: "100vh",
  background: "var(--bg)",
  backgroundImage: `
    radial-gradient(ellipse 76% 34% at 50% -8%, rgba(86,179,255,0.105) 0%, transparent 68%),
    radial-gradient(ellipse 40% 28% at 96% 22%, rgba(132,117,255,0.045) 0%, transparent 75%),
    repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(125,154,199,0.035) 47px, rgba(125,154,199,0.035) 48px),
    repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(125,154,199,0.027) 47px, rgba(125,154,199,0.027) 48px)
  `,
};

export default function App() {
  return (
    <>
      <MotionDirector />
      <ClerkApiSetup />
      <SignedIn>
        <div className="app-shell" style={shellStyle}>
          <AmbientMotion />
          <Navbar />
          <div className="app-shell__content">
          <Routes>
            <Route path="/"            element={<Detect />}     />
            <Route path="/history"     element={<History />}    />
            <Route path="/history/:id" element={<ScanDetail />} />
            <Route path="/stats"       element={<Stats />}      />
            <Route path="/sign-in/*"   element={<Navigate to="/" replace />} />
            <Route path="/sign-up/*"   element={<Navigate to="/" replace />} />
            <Route path="*"            element={<NotFound />}   />
          </Routes>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="app-shell app-shell--auth" style={{ ...shellStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <AmbientMotion />
          <div className="app-shell__content app-shell__content--auth">
          <Routes>
            <Route
              path="/sign-in/*"
              element={<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />}
            />
            <Route
              path="/sign-up/*"
              element={<SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />}
            />
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--muted)" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>404</div>
      <p style={{ fontFamily: "var(--head)", fontSize: 24, color: "var(--text)" }}>Page not found</p>
    </div>
  );
}


// AmbientMotion — lightweight interactive particle field + reading progress.
function AmbientMotion() {
  const canvasRef = useRef(null);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let lastFrame = 0;
    let particles = [];
    const pointer = { x: -1000, y: -1000, tx: -1000, ty: -1000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(width < 680 ? 14 : 30, Math.max(12, Math.round((width * height) / 48000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.35 + .45,
        phase: Math.random() * Math.PI * 2,
      }));
      if (reduced) render(0);
    };

    const render = (time) => {
      if (!reduced && time - lastFrame < 1000 / 40) { raf = window.requestAnimationFrame(render); return; }
      lastFrame = time;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * .035;
      pointer.y += (pointer.ty - pointer.y) * .035;

      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 300);
      glow.addColorStop(0, "rgba(86, 208, 255, 0.055)");
      glow.addColorStop(1, "rgba(86, 208, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += .012;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
        const pulse = reduced ? .7 : .58 + (Math.sin(p.phase + time * .0003) + 1) * .17;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(154, 226, 255, " + pulse + ")";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 104) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(105, 166, 239, " + ((1 - distance / 104) * .105) + ")";
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
        const mx = p.x - pointer.x;
        const my = p.y - pointer.y;
        const md = Math.hypot(mx, my);
        if (md < 145) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = "rgba(123, 231, 255, " + ((1 - md / 145) * .14) + ")";
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
      if (!reduced && !document.hidden) raf = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
    };
    const onVisibility = () => {
      if (document.hidden) window.cancelAnimationFrame(raf);
      else if (!reduced) raf = window.requestAnimationFrame(render);
    };
    resize();
    if (!reduced) raf = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="motion-canvas" aria-hidden="true" />
      <div className="motion-orb motion-orb--one" aria-hidden="true" />
      <div className="motion-orb motion-orb--two" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: "scaleX(" + progress + ")" }} />
      </div>
    </>
  );
}


// Adds the same scroll-reveal choreography to newly mounted sections/results.
// Scroll reveal + pointer-driven 3D tilt/glass response for every major surface.
function MotionDirector() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return undefined;

    const revealSelector = [
      ".ui-card", ".detection-verdict-card", ".fc-claim-card", ".fc-source-card",
      ".scan-row", ".stat-box", ".detect-hero", ".detect-mode-switcher",
      ".detect-tabs", ".detect-input", ".detect-actions",
      ".scan-page > div:first-child", ".stats-page > div:first-child", ".detail-page > button"
    ].join(",");
    const immersiveSelector = [
      ".detect-navbar", ".detect-hero", ".detect-mode-switcher", ".ui-card",
      ".detection-verdict-card", ".fc-claim-card", ".fc-source-card",
      ".scan-row", ".stat-box", ".detect-actions .analyze-premium-button", ".scan-page > div:first-child",
      ".stats-page > div:first-child", ".detail-page > button",
      ".result-stat-tile", ".result-signal-card", ".signal-bar", ".result-forensic-section"
    ].join(",");

    const revealed = new WeakSet();
    const tiltBound = new WeakSet();
    const tiltBindings = [];
    let sequence = 0, frame = 0, queued = false;

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.06 });

    const bindTilt = element => {
      if (tiltBound.has(element)) return;
      tiltBound.add(element);
      element.classList.add("immersive-3d");
      const originalPosition = element.style.position;
      const addedRelativePosition = window.getComputedStyle(element).position === "static";
      if (addedRelativePosition) element.style.position = "relative";

      const glare = document.createElement("span");
      glare.className = "immersive-3d__glare";
      glare.setAttribute("aria-hidden", "true");
      element.insertBefore(glare, element.firstChild);

      const move = event => {
        if (event.pointerType === "touch") return;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        const amp = element.matches(".scan-row, .detect-navbar, .detect-mode-switcher") ? 1.5
          : element.matches(".detect-hero") ? 2.7
          : element.matches(".stat-box, .fc-claim-card, .detection-verdict-card") ? 3.7 : 2.4;
        element.style.setProperty("--immersive-rotate-x", (-ny * amp).toFixed(2) + "deg");
        element.style.setProperty("--immersive-rotate-y", (nx * amp).toFixed(2) + "deg");
        element.style.setProperty("--immersive-glare-x", ((nx + 1) * 50).toFixed(1) + "%");
        element.style.setProperty("--immersive-glare-y", ((ny + 1) * 50).toFixed(1) + "%");
        element.classList.add("immersive-3d--active");
      };
      const leave = () => {
        element.classList.remove("immersive-3d--active");
        element.style.setProperty("--immersive-rotate-x", "0deg");
        element.style.setProperty("--immersive-rotate-y", "0deg");
        element.style.setProperty("--immersive-glare-x", "50%");
        element.style.setProperty("--immersive-glare-y", "50%");
      };
      element.addEventListener("pointermove", move, { passive: true });
      element.addEventListener("pointerleave", leave, { passive: true });
      tiltBindings.push({ element, move, leave, glare, originalPosition, addedRelativePosition });
    };

    const scan = () => {
      queued = false;
      document.querySelectorAll(revealSelector).forEach(element => {
        if (revealed.has(element)) return;
        revealed.add(element);
        element.classList.add("motion-reveal");
        element.style.setProperty("--motion-delay", (Math.min(sequence++ % 5, 4) * 38) + "ms");
        revealObserver.observe(element);
      });
      document.querySelectorAll(immersiveSelector).forEach(bindTilt);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(scan);
    };

    scan();
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      tiltBindings.forEach(({ element, move, leave, glare, originalPosition, addedRelativePosition }) => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", leave);
        glare.remove();
        element.classList.remove("immersive-3d", "immersive-3d--active");
        if (addedRelativePosition) element.style.position = originalPosition;
      });
    };
  }, []);
  return null;
}
