import { useState } from 'react'
import './App.css'
import ScoreRing from './ScoreRing'
import { analyzeJobFit } from './api'

const LOAD_MSGS = [
  'Scanning job description…',
  'Matching your profile…',
  'Finding keyword gaps…',
  'Writing resume tweaks…',
  'Almost done…',
]

function SavedCard({ job, onClick }) {
  const color = job.score >= 75 ? '#4ade80' : job.score >= 50 ? '#eab308' : '#ef4444'
  return (
    <div className="saved-card" onClick={onClick}>
      <div className="saved-top">
        <div>
          <div className="saved-name">{job.company || job.role}</div>
          {job.company && <div className="saved-role-text">{job.role}</div>}
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color }}>{job.score}</span>
      </div>
      <div className="saved-date">{new Date(job.savedAt).toLocaleDateString()}</div>
    </div>
  )
}

export default function App() {
  const [page, setPage]         = useState('input')
  const [jd, setJd]             = useState('')
  const [resume, setResume]     = useState('')
  const [role, setRole]         = useState('Frontend Developer')
  const [company, setCompany]   = useState('')
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')
  const [loadMsg, setLoadMsg]   = useState(LOAD_MSGS[0])
  const [loading, setLoading]   = useState(false)
  const [copied, setCopied]     = useState(false)
  const [saved, setSaved]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('jobfit_saved') || '[]') }
    catch { return [] }
  })

  async function handleAnalyze() {
    if (!jd.trim()) { setError('Please paste a job description.'); return }
    if (!resume.trim()) { setError('Please paste your resume or skills.'); return }

    setError('')
    setLoading(true)
    setPage('loading')

    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % LOAD_MSGS.length
      setLoadMsg(LOAD_MSGS[i])
    }, 1200)

    try {
      const data = await analyzeJobFit(jd, resume, role)
      clearInterval(interval)
      setResult({ ...data, role, company, savedAt: Date.now() })
      setPage('result')
    } catch (err) {
      clearInterval(interval)
      if (err.message === 'NO_KEY') {
        setError('Open src/api.js and replace YOUR_GEMINI_KEY_HERE with your free key from aistudio.google.com/app/apikey')
      } else {
        setError(`Analysis failed: ${err.message}`)
      }
      setPage('input')
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (!result) return
    const updated = [result, ...saved].slice(0, 10)
    setSaved(updated)
    localStorage.setItem('jobfit_saved', JSON.stringify(updated))
  }

  function handleCopy() {
    if (!result?.coverLineHook) return
    navigator.clipboard.writeText(result.coverLineHook)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleNew() {
    setPage('input')
    setResult(null)
    setError('')
  }

  function loadSaved(job) {
    setResult(job)
    setPage('result')
  }

  const scoreColor = (s) => s >= 75 ? '#4ade80' : s >= 50 ? '#eab308' : '#ef4444'

  const verdictStyle = result ? ({
    'Strong Match':   { color: '#4ade80', bg: 'rgba(34,197,94,.1)',  border: 'rgba(34,197,94,.3)'  },
    'Good Potential': { color: '#facc15', bg: 'rgba(234,179,8,.1)',  border: 'rgba(234,179,8,.3)'  },
    'Needs Work':     { color: '#fb923c', bg: 'rgba(251,146,60,.1)', border: 'rgba(251,146,60,.3)' },
    'Poor Fit':       { color: '#f87171', bg: 'rgba(239,68,68,.1)',  border: 'rgba(239,68,68,.3)'  },
  }[result.verdict] || { color: '#aaa', bg: 'rgba(255,255,255,.05)', border: 'rgba(255,255,255,.1)' }) : {}

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">J</div>
          <span className="logo-text">JobFit<span>AI</span></span>
        </div>
        <div className="header-status">
          <div className="status-dot" />
          Powered by Gemini AI
        </div>
      </header>

      <div className="main">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-label">Saved ({saved.length})</div>
          {saved.length === 0
            ? <div className="saved-empty">Your analyzed<br />jobs appear here</div>
            : saved.map((j, i) => (
                <SavedCard key={i} job={j} onClick={() => loadSaved(j)} />
              ))
          }
        </aside>

        {/* PANEL */}
        <div className="panel">

          {/* ── INPUT PAGE ── */}
          {page === 'input' && (
            <div className="fade-up">
              <h1 className="page-title">Analyze your fit</h1>
              <p className="page-sub">Paste a job description + your resume and get an instant AI score, keyword gaps, and resume tweaks.</p>

              {error && <div className="error-box">{error}</div>}

              <div className="input-row">
                <div>
                  <label className="field-label">Target role</label>
                  <input
                    className="text-input"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div>
                  <label className="field-label">Company (optional)</label>
                  <input
                    className="text-input"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="field-wrap">
                <label className="field-label">Job description *</label>
                <textarea
                  className="text-input"
                  rows={10}
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="Paste the full job description here…"
                />
              </div>

              <div className="field-wrap">
                <label className="field-label">Your resume / skills *</label>
                <textarea
                  className="text-input"
                  rows={9}
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  placeholder="Paste your resume or list your skills, projects, and experience…"
                />
              </div>

              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={loading}
              >
                Analyze job fit →
              </button>
            </div>
          )}

          {/* ── LOADING PAGE ── */}
          {page === 'loading' && (
            <div className="loading-wrap">
              <div className="spinner" />
              <div className="loading-msg">{loadMsg}</div>
              <div className="loading-dots">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT PAGE ── */}
          {page === 'result' && result && (
            <div className="fade-up">

              <div className="result-header">
                <div>
                  <div className="result-title">{result.company || result.role}</div>
                  {result.company && <div className="result-sub">{result.role}</div>}
                </div>
                <div className="result-actions">
                  <button className="btn-outline" onClick={handleSave}>Save ↓</button>
                  <button className="btn-green" onClick={handleNew}>+ New</button>
                </div>
              </div>

              {/* Score */}
              <div className="card">
                <div className="score-row">
                  <ScoreRing score={result.score} />
                  <div>
                    <div
                      className="verdict-badge"
                      style={{
                        color: verdictStyle.color,
                        background: verdictStyle.bg,
                        borderColor: verdictStyle.border,
                      }}
                    >
                      {result.verdict}
                    </div>
                    <p className="summary-text">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="card">
                <div className="card-label">Matched keywords</div>
                <div className="kw-row">
                  {(result.matchedKeywords || []).map(k => (
                    <span key={k} className="kw-hit">✓ {k}</span>
                  ))}
                </div>
                <div className="card-label" style={{ marginTop: 16 }}>Missing keywords</div>
                <div className="kw-row">
                  {(result.missingKeywords || []).map(k => (
                    <span key={k} className="kw-miss">✗ {k}</span>
                  ))}
                </div>
              </div>

              {/* Strengths + Gaps */}
              <div className="two-col">
                <div className="str-card">
                  <div className="str-label">Strengths</div>
                  {(result.strengths || []).map((s, i) => (
                    <div key={i} className="point">
                      <span style={{ color: '#22c55e', flexShrink: 0 }}>▸</span>
                      {s}
                    </div>
                  ))}
                </div>
                <div className="gap-card">
                  <div className="gap-label">Gaps to close</div>
                  {(result.gaps || []).map((g, i) => (
                    <div key={i} className="point">
                      <span style={{ color: '#f87171', flexShrink: 0 }}>▸</span>
                      {g}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Tweaks */}
              <div className="card">
                <div className="card-label">AI resume tweaks</div>
                {(result.resumeTweaks || []).map((t, i) => (
                  <div key={i}>
                    <div className="tweak-old">— {t.original}</div>
                    <div className="tweak-new">+ {t.improved}</div>
                    {i < result.resumeTweaks.length - 1 && <hr className="tweak-divider" />}
                  </div>
                ))}
              </div>

              {/* Cover Line */}
              {result.coverLineHook && (
                <div className="cover-card">
                  <div className="card-label" style={{ color: '#22c55e' }}>Cover letter opener</div>
                  <p className="cover-text">"{result.coverLineHook}"</p>
                  <button
                    className="btn-outline"
                    style={{ fontSize: 11, padding: '6px 14px' }}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied ✓' : 'Copy →'}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      <footer className="footer">
        Built with React + Vite + Gemini AI · Open source on GitHub
      </footer>
    </div>
  )
}
