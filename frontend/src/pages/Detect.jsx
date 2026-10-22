// pages/Detect.jsx
import React, { useState, useRef, useCallback } from "react";
import { detectText, detectUrl, detectFile, factCheckNews } from "../utils/api";
import Results from "../components/Results";
import FactCheckResults from "../components/FactCheckResults";
import { Card, CardHeader, Button, Spinner } from "../components/UI";

function getReadableError(error) {
  const candidate =
    error?.response?.data?.error ??
    error?.response?.data?.message ??
    error?.message;

  if (typeof candidate === "string" && candidate.trim()) return candidate;
  if (candidate && typeof candidate === "object") {
    if (typeof candidate.message === "string" && candidate.message.trim()) return candidate.message;
    try { return JSON.stringify(candidate); } catch (_) {}
  }
  return "Detection failed. Please try again.";
}


export default function Detect() {
  const [tab,       setTab]       = useState("text");
  const [text,      setText]      = useState("");
  const [url,       setUrl]       = useState("");
  const [file,      setFile]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);
  const [dragging,  setDragging]  = useState(false);

  // Separate mode for evidence-backed news claim verification.
  const [mode, setMode] = useState("ai");
  const [factInputTab, setFactInputTab] = useState("text");
  const [factText, setFactText] = useState("");
  const [factUrl, setFactUrl] = useState("");
  const [factLoading, setFactLoading] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState(null);
  const [factCheckError, setFactCheckError] = useState(null);
  const factTextWc = factText.trim() ? factText.trim().split(/\s+/).filter(Boolean).length : 0;
  const canFactCheck = !factLoading && (
    (factInputTab === "text" && factTextWc >= 20) ||
    (factInputTab === "url" && /^https?:\/\//i.test(factUrl.trim()))
  );

  // When URL extraction fails — show inline paste fallback
  const [showPasteFallback, setShowPasteFallback] = useState(false);
  const [pastedText,        setPastedText]        = useState("");

  const fileRef = useRef();
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const pastedWc  = pastedText.trim().split(/\s+/).filter(Boolean).length;

  const canAnalyze = !loading && (
    (tab === "text" && wordCount >= 20) ||
    (tab === "url"  && (url.trim().startsWith("http") || (showPasteFallback && pastedWc >= 20))) ||
    (tab === "file" && file)
  );

  const analyze = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    setStatusMsg("Starting…");

    try {
      let res;

      if (tab === "text") {
        setStatusMsg("Analyzing…");
        res = await detectText(text.trim());

      } else if (tab === "url") {
        // If user pasted text manually after failed extraction
        if (showPasteFallback && pastedWc >= 20) {
          setStatusMsg("Analyzing pasted text…");
          res = await detectText(pastedText.trim());
          res._source_url = url;
        } else {
          res = await detectUrl(url.trim(), msg => setStatusMsg(msg));
        }

      } else {
        setStatusMsg("Reading file…");
        res = await detectFile(file);
      }

      setResult(res);
    } catch (e) {
      // Special case: all extraction methods failed — show inline paste area
      if (e.extractionFailed) {
        setShowPasteFallback(true);
        setStatusMsg("");
        setLoading(false);
        return;
      }
      setError(getReadableError(e));
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  }, [tab, text, url, file, showPasteFallback, pastedText, pastedWc]);

  const runNewsFactCheck = useCallback(async () => {
    setFactCheckError(null);
    setFactCheckResult(null);
    setFactLoading(true);
    try {
      const response = await factCheckNews({
        text: factInputTab === "text" ? factText.trim() : "",
        url: factInputTab === "url" ? factUrl.trim() : "",
      });
      setFactCheckResult(response);
    } catch (e) {
      setFactCheckError(getReadableError(e));
    } finally {
      setFactLoading(false);
    }
  }, [factInputTab, factText, factUrl]);

  const switchMode = nextMode => {
    setMode(nextMode);
    setResult(null); setError(null); setStatusMsg("");
    setFactCheckResult(null); setFactCheckError(null);
    setLoading(false); setFactLoading(false);
  };

  const reset = () => {
    setResult(null); setError(null); setStatusMsg("");
    setText(""); setUrl(""); setFile(null);
    setShowPasteFallback(false); setPastedText("");
    setFactText(""); setFactUrl(""); setFactInputTab("text");
    setFactCheckResult(null); setFactCheckError(null);
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  // ── inline styles ──
  const S = {
    page:     { maxWidth:1000, margin:"0 auto", padding:"48px 20px 80px" },
    hero:     { textAlign:"center", marginBottom:44 },
    h1:       { fontFamily:"var(--head)", fontSize:"clamp(28px,5vw,48px)", fontWeight:800,
                letterSpacing:-1.5, color:"#fff", lineHeight:1.1, marginBottom:12 },
    accent:   { color:"var(--accent)", textShadow:"0 0 30px rgba(0,229,255,0.4)" },
    sub:      { fontSize:13, color:"var(--muted)", letterSpacing:0.5 },
    tabs:     { display:"flex", borderBottom:"1px solid var(--border)" },
    tab:      a => ({
      flex:1, padding:"13px 20px", border:"none",
      fontFamily:"var(--mono)", fontSize:12, fontWeight:700,
      letterSpacing:1, textTransform:"uppercase", cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      transition:"all 0.2s",
      background: a ? "rgba(0,229,255,0.07)" : "var(--surface2)",
      color:      a ? "var(--accent)"        : "var(--muted)",
      borderBottom: a ? "2px solid var(--accent)" : "2px solid transparent",
    }),
    input:    { padding:20 },
    textarea: {
      width:"100%", minHeight:180, background:"var(--bg)",
      border:"1px solid var(--border2)", borderRadius:8,
      padding:16, color:"var(--text)", fontFamily:"var(--mono)",
      fontSize:13, lineHeight:1.7, resize:"vertical", outline:"none",
    },
    urlInput: {
      width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
      borderRadius:8, padding:"14px 16px", color:"var(--text)",
      fontFamily:"var(--mono)", fontSize:13, outline:"none",
    },
    drop:     d => ({
      border:`2px dashed ${d?"var(--accent)":"var(--border2)"}`,
      borderRadius:8, padding:"40px 20px", textAlign:"center",
      cursor:"pointer", transition:"all 0.2s",
      background: d ? "rgba(0,229,255,0.04)" : "var(--bg)",
    }),
    actions:  { padding:"0 20px 20px" },
    wc:       ok => ({ fontSize:11, color:ok?"var(--accent3)":"var(--muted)", textAlign:"right", marginBottom:12 }),
    loadBox:  { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px", gap:20 },
    loadText: { fontSize:12, color:"var(--muted)", letterSpacing:2, textTransform:"uppercase" },
    statusBx: {
      fontSize:12, color:"var(--accent)", letterSpacing:0.5,
      maxWidth:380, textAlign:"center", lineHeight:1.7,
      padding:"10px 18px", background:"rgba(0,229,255,0.06)",
      border:"1px solid rgba(0,229,255,0.2)", borderRadius:8,
    },
    errBox:   {
      background:"rgba(255,60,110,0.08)", border:"1px solid rgba(255,60,110,0.3)",
      borderRadius:10, padding:20, fontSize:13, color:"#ff8aa8",
      display:"flex", gap:12, marginBottom:16,
    },
    // Paste fallback styles
    fallback: {
      marginTop:16, padding:16, background:"rgba(255,184,48,0.06)",
      border:"1px solid rgba(255,184,48,0.3)", borderRadius:10,
    },
    fallbackTitle: { fontSize:13, color:"var(--warn)", fontWeight:700, marginBottom:8, display:"flex", gap:8, alignItems:"center" },
    fallbackSub:   { fontSize:11, color:"var(--muted)", marginBottom:12, lineHeight:1.6 },
  };

  return (
    <main className="detect-page" style={S.page}>
      {/* Hero */}
      <div className="detect-hero" style={S.hero}>
        <div className="detect-hero__eyebrow"><span className="detect-hero__eyebrow-dot" /> Real-time analysis <span aria-hidden="true">·</span> Evidence-led results</div>
        <h1 style={S.h1}>
          {mode === "ai" ? <>Is this text <span style={S.accent}>AI-generated?</span></> : <>Is this news <span style={S.accent}>true or false?</span></>}
        </h1>
        <p style={S.sub}>
          {mode === "ai"
            ? "Multi-signal forensic analysis · Text · URLs · Files"
            : "Claim-by-claim verification · Retrieved sources · Evidence links"}
        </p>
      </div>

      {/* Feature selector — keeps the original page styling and animation system */}
      <div className="detect-mode-switcher" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        {[
          ["ai", "🔎", "AI Text Detection"],
          ["factcheck", "📰", "News Fact Check"],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => switchMode(id)}
            style={{
              padding: "11px 18px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${mode === id ? "var(--accent)" : "var(--border2)"}`,
              background: mode === id ? "rgba(0,229,255,0.08)" : "var(--surface2)",
              color: mode === id ? "var(--accent)" : "var(--muted)",
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
              letterSpacing: 0.8, transition: "all 0.2s",
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Existing AI detector — unchanged form and result layout */}
      {mode === "ai" && !result && !loading && (
        <Card>
          <CardHeader>Input Source</CardHeader>

          <div className="detect-tabs" style={S.tabs}>
            {[["text","✏️","Paste Text"],["url","🌐","From URL"],["file","📁","Upload File"]].map(([id,ic,lb]) => (
              <button key={id} type="button" aria-pressed={tab === id} onClick={() => { setTab(id); setShowPasteFallback(false); setError(null); }} style={S.tab(tab===id)}>
                {ic} {lb}
              </button>
            ))}
          </div>

          <div className="detect-input" style={S.input}>
            {/* TEXT TAB */}
            {tab === "text" && (
              <textarea
                className="detect-textarea"
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Paste the text you want to analyze here… (minimum 20 words)"
                style={S.textarea}
                onFocus={e => e.target.style.borderColor="var(--accent)"}
                onBlur={e  => e.target.style.borderColor="var(--border2)"}
              />
            )}

            {/* URL TAB */}
            {tab === "url" && (
              <div>
                <input
                  className="detect-url-input"
                  type="url" value={url} onChange={e => { setUrl(e.target.value); setShowPasteFallback(false); setError(null); }}
                  placeholder="https://example.com/article"
                  style={S.urlInput}
                  onFocus={e => e.target.style.borderColor="var(--accent)"}
                  onBlur={e  => e.target.style.borderColor="var(--border2)"}
                  onKeyDown={e => e.key === "Enter" && canAnalyze && analyze()}
                />

                {/* Inline paste fallback — shown when all proxies fail */}
                {showPasteFallback && (
                  <div style={S.fallback}>
                    <div style={S.fallbackTitle}>
                      ⚠️ Could not auto-extract text from this URL
                    </div>
                    <div style={S.fallbackSub}>
                      The website blocks automated access (login wall, JavaScript rendering, or anti-scraper protection).<br/>
                      <strong style={{ color:"var(--text)" }}>Open the page, select all text (Ctrl+A / Cmd+A), copy it, then paste below:</strong>
                    </div>
                    <textarea
                      className="detect-textarea"
                      value={pastedText} onChange={e => setPastedText(e.target.value)}
                      placeholder="Paste the article text here…"
                      style={{ ...S.textarea, minHeight:150, borderColor: pastedWc >= 20 ? "var(--accent3)" : "var(--border2)" }}
                      onFocus={e => e.target.style.borderColor="var(--accent)"}
                      onBlur={e  => e.target.style.borderColor = pastedWc >= 20 ? "var(--accent3)" : "var(--border2)"}
                      autoFocus
                    />
                    <div style={{ fontSize:11, color: pastedWc >= 20 ? "var(--accent3)" : "var(--muted)", marginTop:6, textAlign:"right" }}>
                      {pastedWc} words {pastedWc > 0 && pastedWc < 20 ? `· need ${20 - pastedWc} more` : pastedWc >= 20 ? "· ready ✓" : ""}
                    </div>
                  </div>
                )}

                {!showPasteFallback && (
                  <div style={{ marginTop:8, fontSize:11, color:"var(--muted)", lineHeight:1.6 }}>
                    💡 Supports news articles, blogs, Wikipedia, and most public pages.
                    If the URL fails, a text paste area will appear automatically.
                  </div>
                )}
              </div>
            )}

            {/* FILE TAB */}
            {tab === "file" && (
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className="detect-dropzone"
                style={S.drop(dragging)}
              >
                <input ref={fileRef} type="file" accept=".txt,.md,.html,.htm,.pdf"
                  style={{ display:"none" }} onChange={e => setFile(e.target.files[0])} />
                <div style={{ fontSize:36, marginBottom:10 }}>{file ? "📄" : "📂"}</div>
                <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>
                  {file
                    ? <strong style={{ color:"var(--text)" }}>{file.name}</strong>
                    : <><strong style={{ color:"var(--text)" }}>Click or drag</strong> to upload<br/>.txt · .md · .html · .pdf</>
                  }
                </p>
              </div>
            )}
          </div>

          <div className="detect-actions" style={S.actions}>
            {tab === "text" && (
              <div className="detect-word-count" style={S.wc(wordCount >= 20)}>
                {wordCount} words{wordCount > 0 && wordCount < 20 ? ` · need ${20 - wordCount} more` : ""}{wordCount >= 20 ? " · ready ✓" : ""}
              </div>
            )}
            <Button onClick={analyze} disabled={!canAnalyze} style={{ width:"100%", fontSize:14, padding:16 }}>
              🔍 {showPasteFallback && pastedWc >= 20 ? "Analyze Pasted Text" : "Analyze"}
            </Button>
          </div>
        </Card>
      )}

      {/* News Fact Check input */}
      {mode === "factcheck" && !factCheckResult && !factLoading && (
        <Card>
          <CardHeader>News Input</CardHeader>
          <div className="detect-tabs" style={S.tabs}>
            {[
              ["text", "✏️", "Paste News Text"],
              ["url", "🌐", "From URL"],
            ].map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={factInputTab === id}
                onClick={() => { setFactInputTab(id); setFactCheckError(null); }}
                style={S.tab(factInputTab === id)}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="detect-input" style={S.input}>
            {factInputTab === "text" ? (
              <textarea
                className="detect-textarea"
                value={factText}
                onChange={e => { setFactText(e.target.value); setFactCheckError(null); }}
                placeholder="Paste the news article or factual claims here… (minimum 20 words)"
                style={S.textarea}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border2)"}
              />
            ) : (
              <>
                <input
                  className="detect-url-input"
                  type="url"
                  value={factUrl}
                  onChange={e => { setFactUrl(e.target.value); setFactCheckError(null); }}
                  placeholder="https://example.com/news-article"
                  style={S.urlInput}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border2)"}
                  onKeyDown={e => e.key === "Enter" && canFactCheck && runNewsFactCheck()}
                />
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}>
                  Use a public article URL. Pages behind a login or anti-bot wall may not be readable; paste the article text instead.
                </div>
              </>
            )}
          </div>
          <div className="detect-actions" style={S.actions}>
            {factInputTab === "text" && (
              <div className="detect-word-count" style={S.wc(factTextWc >= 20)}>
                {factTextWc} words{factTextWc > 0 && factTextWc < 20 ? ` · need ${20 - factTextWc} more` : ""}{factTextWc >= 20 ? " · ready ✓" : ""}
              </div>
            )}
            <Button onClick={runNewsFactCheck} disabled={!canFactCheck} style={{ width: "100%", fontSize: 14, padding: 16 }}>
              📰 Fact Check News
            </Button>
          </div>
        </Card>
      )}

      {mode === "factcheck" && factCheckError && !factCheckResult && (
        <>
          <div style={S.errBox}>
            <span style={{ flexShrink: 0 }}>⚠️</span><div>{factCheckError}</div>
          </div>
          <Button variant="ghost" onClick={reset} style={{ width: "100%" }}>← Try Again</Button>
        </>
      )}

      {mode === "factcheck" && factLoading && (
        <Card>
          <div style={S.loadBox}>
            <Spinner size={72} />
            <div style={S.loadText}>Checking news claims…</div>
            <div className="status-box" style={S.statusBx}>Extracting claims and checking available source evidence</div>
          </div>
        </Card>
      )}

      {mode === "factcheck" && factCheckResult && (
        <FactCheckResults result={factCheckResult} onReset={reset} />
      )}

      {/* Loading */}
      {mode === "ai" && loading && (
        <Card>
          <div style={S.loadBox}>
            <Spinner size={72} />
            <div style={S.loadText}>Scanning…</div>
            {statusMsg && <div className="status-box" style={S.statusBx}>{statusMsg}</div>}
          </div>
        </Card>
      )}

      {/* Error */}
      {mode === "ai" && error && !showPasteFallback && (
        <>
          <div style={S.errBox}>
            <span style={{ flexShrink:0 }}>⚠️</span><div>{error}</div>
          </div>
          <Button variant="ghost" onClick={reset} style={{ width:"100%" }}>← Try Again</Button>
        </>
      )}

      {/* Results */}
      {mode === "ai" && result && <Results result={result} onReset={reset} />}
    </main>
  );
}