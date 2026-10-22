// components/Navbar.jsx — Premium responsive app navigation
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const NAV = [
  { to: "/", label: "Detect", icon: "⌕" },
  { to: "/history", label: "History", icon: "◷" },
  { to: "/stats", label: "Insights", icon: "▥" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="detect-navbar">
      <div className="detect-navbar__inner">
        <Link to="/" className="detect-brand" aria-label="DetectAI home">
          <span className="detect-brand__mark" aria-hidden="true">⌕</span>
          <span>
            <span className="detect-brand__name">Detect<strong>AI</strong></span>
            <span className="detect-brand__caption">Signal · Evidence · Clarity</span>
          </span>
        </Link>

        <nav className="detect-nav" aria-label="Main navigation">
          {NAV.map(({ to, label, icon }) => {
            const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`detect-nav__link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="detect-nav__icon" aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="detect-navbar__actions">
          <span className="detect-beta"><span className="detect-beta__dot" /> BETA ACCESS</span>
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: { width: 36, height: 36, border: "1px solid rgba(123,231,255,.3)", boxShadow: "0 0 18px rgba(123,231,255,.08)" },
                userButtonPopoverCard: { background: "#0c1422", border: "1px solid rgba(128,157,201,.2)" }
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
