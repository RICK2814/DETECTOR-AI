// components/FactCheckResults.jsx
import React from "react";
import { Card, CardHeader, Button } from "./UI";

const verdictStyle = verdict => {
  switch (verdict) {
    case "TRUE":
      return { color: "var(--accent3)", background: "rgba(109,255,179,0.10)", label: "TRUE", icon: "✓" };
    case "FALSE":
      return { color: "var(--accent2)", background: "rgba(255,60,110,0.10)", label: "FALSE", icon: "✕" };
    case "MIXED":
      return { color: "var(--warn)", background: "rgba(255,184,48,0.10)", label: "MIXED / MISLEADING", icon: "⚠" };
    case "SATIRE":
      return { color: "var(--warn)", background: "rgba(255,184,48,0.14)", label: "SATIRE / HUMOR", icon: "✦" };
    default:
      return { color: "var(--muted)", background: "rgba(150,160,175,0.08)", label: "UNVERIFIED", icon: "?" };
  }
};

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function FactCheckResults({ result, onReset }) {
  const claims = Array.isArray(result?.results) ? result.results : [];

  return (
    <div className="fc-results" style={{ animation: "fadeUp 0.4s ease" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fc-source-link { color:var(--accent); text-decoration:none; }
        .fc-source-link:hover { text-decoration:underline; }
      `}</style>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>NEWS FACT-CHECK RESULTS</CardHeader>
        <div style={{ padding: 16, color: "var(--muted)", fontSize: 12, lineHeight: 1.7 }}>
          {claims.length} claim{claims.length === 1 ? "" : "s"} reviewed against retrieved news coverage{result?.factCheckDatabaseAvailable ? " and published fact-checks" : ""}.
          <div style={{ marginTop: 4 }}>
            Independent web/news sources: {Number(result?.liveNewsSourceCount || 0)} · Published fact-checks: {Number(result?.publishedFactCheckSourceCount || 0)}.
          </div>
          <div style={{ marginTop: 4 }}>
            TRUE/FALSE labels require supporting evidence. UNVERIFIED means the available sources were insufficient or did not match the claim well enough.
            {result?.sourceClassification === "satire" && (
              <div style={{ marginTop: 8, color: "var(--warn)", fontWeight: 700 }}>
                SATIRICAL PUBLISHER DETECTED: {result.sourcePublisher}. Claims from this article are marked as satire rather than literal news facts.
              </div>
            )}
          </div>
        </div>
      </Card>

      {result?.factCheckDatabaseStatus && result.factCheckDatabaseStatus !== "working_with_matches" && !(result?.sourceClassification === "satire" && result?.factCheckDatabaseStatus === "working_no_matches") && (
        <Card style={{ marginBottom: 16, padding: 14, border: `1px solid ${result.factCheckDatabaseStatus === "working_no_matches" ? "var(--border)" : "var(--warn)"}` }}>
          <div style={{ color: result.factCheckDatabaseStatus === "working_no_matches" ? "var(--muted)" : "var(--warn)", fontSize: 11, fontWeight: 800, marginBottom: 6 }}>
            {result.factCheckDatabaseStatus === "not_configured" ? "PUBLISHED FACT-CHECK SEARCH NOT CONFIGURED" : result.factCheckDatabaseStatus === "working_no_matches" ? "PUBLISHED FACT-CHECK DATABASE: NO MATCH" : "GOOGLE FACT-CHECK API NEEDS ATTENTION"}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.7 }}>
            {result.factCheckDatabaseStatus === "not_configured"
              ? "Live news-source searches are still used, but the published fact-check API is not configured."
              : result.factCheckDatabaseStatus === "working_no_matches"
                ? `No previously published fact-check matched these claims. This is not a verdict. Live web/news search still runs and found ${Number(result?.liveNewsSourceCount || 0)} independent source link(s); ${Number(result?.publishedFactCheckSourceCount || 0)} existing fact-check link(s) matched.`
                : result.factCheckDatabaseStatus === "invalid_key_or_request"
                  ? "Google rejected the key or request. Check the API key and request configuration."
                  : result.factCheckDatabaseStatus === "api_disabled_or_key_restricted"
                    ? "Google returned a permission error. Enable Fact Check Tools API in the same project and check key restrictions."
                    : result.factCheckDatabaseStatus === "quota_exceeded"
                      ? "Google Fact Check API quota or rate limit was reached."
                      : "The Google Fact Check API request failed. Check the Vercel Function Logs."}
            {result.factCheckDatabaseDetail ? " Details: " + result.factCheckDatabaseDetail : ""}
          </div>
        </Card>
      )}

      {claims.length === 0 && (
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ color: "var(--text)", fontWeight: 700, marginBottom: 8 }}>No verifiable claims found</div>
          <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
            Try a news article containing specific statements, names, dates, numbers, events, or other factual claims.
          </div>
        </Card>
      )}

      {claims.map((item, index) => {
        const badge = verdictStyle(item.verdict);
        return (
          <Card key={item.id || index} className="fc-claim-card" style={{ marginBottom: 16, border: `1px solid ${badge.color}55` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 18, borderBottom: "1px solid var(--border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                  Claim {index + 1}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text)", fontWeight: 650 }}>
                  {item.claim}
                </div>
              </div>
              <div style={{
                flexShrink: 0, padding: "7px 10px", borderRadius: 6,
                color: badge.color, background: badge.background,
                border: `1px solid ${badge.color}66`,
                fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                <span>{badge.icon}</span>{badge.label}
              </div>
            </div>

            <div style={{ padding: 18 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                  Confidence
                </span>
                <strong style={{ color: "var(--text)", fontSize: 11 }}>{item.confidence || "LOW"}</strong>
                <span style={{ color: "var(--muted)", fontSize: 11 }}>
                  · Evidence-based assessment, not a guarantee
                </span>
              </div>

              <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.8, color: "var(--text)" }}>
                {item.explanation || "There is not enough accessible evidence to assess this claim reliably."}
              </p>

              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
                {item.verdict === "UNVERIFIED" ? "Sources reviewed" : "Sources"} {item.sources?.length ? `(${item.sources.length})` : "(none found)"}
              </div>

              {Array.isArray(item.sources) && item.sources.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {item.sources.map((source, sourceIndex) => (
                    <div key={source.url || sourceIndex} className="fc-source-card" style={{
                      padding: 12, borderRadius: 8, background: "var(--bg)",
                      border: "1px solid var(--border)",
                    }}>
                      {source.url && /^https?:\/\//i.test(source.url) ? (
                        <a className="fc-source-link" href={source.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.6, display: "inline-block" }}>
                          {source.title || source.publisher || "Open source"} ↗
                        </a>
                      ) : (
                        <div style={{ color: "var(--text)", fontSize: 12, fontWeight: 700 }}>{source.title || source.publisher || "Source"}</div>
                      )}
                      <div style={{ color: "var(--muted)", fontSize: 10, marginTop: 4 }}>
                        {[source.publisher, formatDate(source.publishedAt), source.rating ? `Published rating: ${source.rating}` : ""].filter(Boolean).join(" · ")}
                      </div>
                      {source.evidenceExcerpt && (
                        <div style={{ color: "var(--text)", opacity: 0.8, fontSize: 11, lineHeight: 1.7, marginTop: 8 }}>
                          {source.evidenceExcerpt}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.7 }}>
                  No usable source links were retrieved for this claim. Treat it as unverified.
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <Card className="fc-note-card" style={{ padding: 16, marginBottom: 16, border: "1px solid var(--border2)" }}>
        <div style={{ color: "var(--warn)", fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>
          IMPORTANT
        </div>
        <div style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.7 }}>
          {result?.warning || "Fact-check results depend on the sources that were accessible at the time of the check. Open the original sources and verify their context, date, and evidence before sharing a claim."}
        </div>
      </Card>

      <Button variant="ghost" onClick={onReset} style={{ width: "100%" }}>
        ← Check Another News Article
      </Button>
    </div>
  );
}
