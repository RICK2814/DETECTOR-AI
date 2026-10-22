// components/Navbar.jsx — Premium responsive app navigation
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Icon } from "./UI";

const NAV = [
  { to: "/", label: "Detect", icon: "scan" },
  { to: "/history", label: "History", icon: "history" },
  { to: "/stats", label: "Insights", icon: "chart" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="detect-navbar">
      <div className="detect-navbar__inner">
        <Link to="/" className="detect-brand" aria-label="DetectAI home">
          <span className="detect-brand__mark" aria-hidden="true">
            <svg className="detect-brand__logo" viewBox="0 0 44 44" fill="none">
              <defs><linearGradient id="detectLogoGradient" x1="5" y1="4" x2="39" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#B7F6FF"/><stop offset=".52" stopColor="#67DDF7"/><stop offset="1" stopColor="#A89AFF"/></linearGradient></defs>
              <circle className="detect-logo__outer" cx="22" cy="22" r="17" stroke="url(#detectLogoGradient)" strokeWidth="1.2" strokeDasharray="3 5"/>
              <circle className="detect-logo__inner" cx="22" cy="22" r="11.5" stroke="url(#detectLogoGradient)" strokeOpacity=".72" strokeWidth="1.3"/>
              <path className="detect-logo__corners" d="M14 19v-5h5M25 14h5v5M30 25v5h-5M19 30h-5v-5" stroke="url(#detectLogoGradient)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle className="detect-logo__core" cx="22" cy="22" r="3.2" fill="url(#detectLogoGradient)"/>
              <path className="detect-logo__beam" d="M22 7v5M37 22h-5M22 37v-5M7 22h5" stroke="url(#detectLogoGradient)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="detect-brand__copy">
            <span className="detect-brand__name"><span className="detect-brand__word">Detect</span><strong>AI</strong></span>
            <span className="detect-brand__caption">Intelligence · Evidence · Clarity</span>
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
                <span className="detect-nav__icon" aria-hidden="true"><Icon name={icon} size={16}/></span>
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
