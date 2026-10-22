// App.jsx — Root with routing + Clerk
import React from "react";
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
        <div style={shellStyle}>
          <Navbar />
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
      </SignedIn>
      <SignedOut>
        <div style={{ ...shellStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
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
