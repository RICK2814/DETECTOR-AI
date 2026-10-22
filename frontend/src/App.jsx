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
      const count = Math.min(width < 680 ? 26 : 58, Math.max(18, Math.round((width * height) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.35 + .45,
        phase: Math.random() * Math.PI * 2,
      }));
      render(0);
    };

    const render = (time) => {
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
          if (distance < 112) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(105, 166, 239, " + ((1 - distance / 112) * .12) + ")";
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
        const mx = p.x - pointer.x;
        const my = p.y - pointer.y;
        const md = Math.hypot(mx, my);
        if (md < 155) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = "rgba(123, 231, 255, " + ((1 - md / 155) * .16) + ")";
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
