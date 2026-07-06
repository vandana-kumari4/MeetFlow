import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-icon small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <span className="logo-text">MeetFlow</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          {/* ✅ About now navigates to /about page */}
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About</a>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/auth")}>Sign In</button>
          <button className="btn-primary-sm" onClick={() => navigate("/auth")}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Built with WebRTC · 100% Free · No Downloads
        </div>

        <h1 className="hero-title">
          Video calls that <br />
          <span className="highlight">just work</span>
        </h1>

        <p className="hero-sub">
          Connect · Collaborate · Communicate
        </p>

        <p className="hero-desc">
          Start or join a meeting in seconds. No plugins, no complexity —
          just clear video, every time.
        </p>

        <div className="hero-cta">
          <button className="btn-primary-lg" onClick={() => navigate("/auth")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Start a Meeting
          </button>
          <button className="btn-outline-lg" onClick={() => navigate("/auth")}>
            Join with Code
          </button>
        </div>

        {/* VIDEO PREVIEW */}
        <div className="video-preview">
          <div className="preview-header">
            <div className="preview-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="preview-url">meetflow.app/room/mf-291-xyz</span>
          </div>

          <div className="video-grid">
            <div className="vid-tile tile-1">
              <div className="avatar-circle" style={{ background: "#c7c2f8", color: "#3c3489" }}>V</div>
              <span className="tile-name">You</span>
            </div>
            <div className="vid-tile tile-2">
              <div className="avatar-circle" style={{ background: "#9fe1cb", color: "#085041" }}>A</div>
              <span className="tile-name">Arjun</span>
            </div>
            <div className="vid-tile tile-3">
              <div className="avatar-circle" style={{ background: "#fac775", color: "#633806" }}>P</div>
              <span className="tile-name">Priya</span>
            </div>
            <div className="vid-tile tile-4">
              <div className="avatar-circle" style={{ background: "#b5d4f4", color: "#0c447c" }}>R</div>
              <span className="tile-name">Rahul</span>
            </div>
          </div>

          <div className="preview-controls">
            <button className="ctrl-btn" title="Mute">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button className="ctrl-btn" title="Camera">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            </button>
            <button className="ctrl-btn end-call" title="End Call">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.82 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.72 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.7 9.91a16 16 0 0 0 2.98 3.4z"/></svg>
            </button>
            <button className="ctrl-btn" title="Share Screen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-label">Why MeetFlow</p>
        <h2 className="section-title">Everything you need, nothing you don't</h2>

        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-icon purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            </div>
            <h3>HD Video Calls</h3>
            <p>Crystal-clear WebRTC video with adaptive bitrate. Works on any network.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon teal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3>Screen Sharing</h3>
            <p>Share your screen in one click. Present decks, code, anything.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3>Secure Rooms</h3>
            <p>End-to-end encrypted peer connections. Your calls stay private.</p>
          </div>
          <div className="feat-card">
            <div className="feat-icon amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Meeting History</h3>
            <p>All your past meetings in one place. Revisit any session anytime.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">

  <div className="footer-logo">

    <div className="logo-icon small">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    </div>

    <span>MeetFlow</span>

  </div>

  <p className="footer-sub">
    Built with React · Node.js · Socket.io · WebRTC
  </p>

  <p className="footer-copy">
  © {new Date().getFullYear()}  MeetFlow. Made with ♥
</p>

</footer>

    </div>
  );
}