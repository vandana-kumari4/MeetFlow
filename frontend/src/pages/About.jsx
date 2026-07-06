import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

export default function About() {
  const navigate = useNavigate();

  const techStack = [
    { name: "React.js", desc: "Frontend UI library", color: "#61DAFB", bg: "#E8F8FD" },
    { name: "Node.js", desc: "Backend runtime", color: "#539E43", bg: "#EBF7E8" },
    { name: "Socket.io", desc: "Real-time communication", color: "#010101", bg: "#F0F0F0" },
    { name: "WebRTC", desc: "Peer-to-peer video", color: "#185FA5", bg: "#E6F1FB" },
    { name: "MongoDB", desc: "Database", color: "#47A248", bg: "#EBF7E8" },
    { name: "TensorFlow.js", desc: "Background blur AI", color: "#FF6F00", bg: "#FFF3E0" },
  ];

  const features = [
    { emoji: "🎥", title: "HD Video Calls", desc: "Crystal-clear WebRTC peer-to-peer video" },
    { emoji: "🎤", title: "Audio Calls", desc: "High quality audio with mic controls" },
    { emoji: "🖥️", title: "Screen Sharing", desc: "Share your screen in one click" },
    { emoji: "💬", title: "In-call Chat", desc: "Real-time messaging during meetings" },
    { emoji: "✋", title: "Raise Hand", desc: "Signal the host without interrupting" },
    { emoji: "😊", title: "Emoji Reactions", desc: "React with floating emojis in real time" },
    { emoji: "🌫️", title: "Background Blur", desc: "AI-powered camera background blur" },
    { emoji: "⏱️", title: "Meeting Timer", desc: "Track meeting duration" },
    { emoji: "👥", title: "Participant Count", desc: "See active participants instantly" },
    { emoji: "🔴", title: "Meeting Recording", desc: "Record important meetings" },
    { emoji: "🔒", title: "Password Rooms", desc: "Secure private meetings" },
    { emoji: "🌙", title: "Dark Mode", desc: "Beautiful dark interface" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#050816,#0f172a,#111827)",
        color: "#ffffff",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      {/* NAVBAR */}

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2.5rem",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          position: "sticky",
          top: 0,
          background: "rgba(5,8,22,.8)",
          backdropFilter: "blur(18px)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(37,99,235,.35)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </div>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            MeetFlow
          </span>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: ".3s",
            }}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/auth")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(37,99,235,.35)",
              transition: ".3s",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section
        style={{
          textAlign: "center",
          padding: "5rem 1.5rem",
          maxWidth: "820px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: "8px",
            background: "rgba(37,99,235,.15)",
            color: "#60a5fa",
            padding: "8px 18px",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "30px",
          }}
        >
          🚀 About MeetFlow
        </div>

        <h1
          style={{
            fontSize: "58px",
            fontWeight: "800",
            color: "#ffffff",
            lineHeight: "1.15",
            marginBottom: "22px",
          }}
        >
          Built for real{" "}
          <span style={{ color: "#3b82f6" }}>connections</span>
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#cbd5e1",
            lineHeight: "1.8",
            maxWidth: "700px",
            margin: "0 auto 40px",
          }}
        >
          MeetFlow is a modern video conferencing platform built with React,
          Node.js, Socket.io and WebRTC. It provides secure, fast and
          crystal-clear communication with a beautiful user experience.
        </p>

        <button
          onClick={() => navigate("/auth")}
          style={{
            background: "linear-gradient(135deg,#2563eb,#3b82f6)",
            color: "#fff",
            border: "none",
            padding: "15px 36px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 15px 35px rgba(37,99,235,.35)",
            transition: ".3s",
          }}
        >
          Try MeetFlow Free
        </button>
      </section>
           {/* FEATURES GRID */}
<section
  style={{
    padding: "2rem 2rem 5rem",
    maxWidth: "1100px",
    margin: "0 auto",
  }}
>
  <p
    style={{
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "0.15em",
      color: "#3b82f6",
      textTransform: "uppercase",
      marginBottom: "12px",
      textAlign: "center",
    }}
  >
    What's Inside
  </p>

  <h2
    style={{
      fontSize: "38px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "3rem",
      textAlign: "center",
    }}
  >
    Everything you need, nothing you don't
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
      gap: "22px",
    }}
  >
    {features.map((feat, i) => (
      <div
        key={i}
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "18px",
          padding: "1.8rem",
          transition: ".35s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow =
            "0 18px 40px rgba(37,99,235,.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span
          style={{
            fontSize: "34px",
            display: "block",
            marginBottom: "18px",
          }}
        >
          {feat.emoji}
        </span>

        <h3
          style={{
            color: "#ffffff",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          {feat.title}
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.7",
            fontSize: "14px",
          }}
        >
          {feat.desc}
        </p>
      </div>
    ))}
  </div>
</section>

{/* TECH STACK */}

<section
  style={{
    padding: "5rem 2rem",
    background: "#0f172a",
    borderTop: "1px solid rgba(255,255,255,.08)",
    borderBottom: "1px solid rgba(255,255,255,.08)",
  }}
>
  <div
    style={{
      maxWidth: "900px",
      margin: "0 auto",
      textAlign: "center",
    }}
  >
    <p
      style={{
        color: "#3b82f6",
        textTransform: "uppercase",
        letterSpacing: ".15em",
        fontSize: "13px",
        marginBottom: "12px",
      }}
    >
      Tech Stack
    </p>

    <h2
      style={{
        color: "#ffffff",
        fontSize: "36px",
        marginBottom: "40px",
      }}
    >
      Built with modern technologies
    </h2>

    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "18px",
        justifyContent: "center",
      }}
    >
      {techStack.map((tech, i) => (
        <div
          key={i}
          style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,.08)",
            padding: "14px 22px",
            borderRadius: "14px",
            transition: ".3s",
          }}
        >
          <div
            style={{
              color: "#60a5fa",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            {tech.name}
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "13px",
              marginTop: "5px",
            }}
          >
            {tech.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* DEVELOPER */}

{/* ABOUT THE PROJECT */}

<section
  style={{
    padding: "5rem 2rem",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
  }}
>
  <h2
    style={{
      color: "#ffffff",
      fontSize: "34px",
      fontWeight: "700",
      marginBottom: "20px",
    }}
  >
    About the Project
  </h2>

  <p
    style={{
      color: "#cbd5e1",
      fontSize: "17px",
      lineHeight: "1.9",
      marginBottom: "18px",
    }}
  >
    MeetFlow is a modern video conferencing platform designed to provide
    seamless, secure, and high-quality online meetings. Built with React,
    Node.js, Socket.io, WebRTC, and MongoDB, it enables real-time
    communication with a fast, responsive, and intuitive user experience.
  </p>

  <p
    style={{
      color: "#cbd5e1",
      fontSize: "17px",
      lineHeight: "1.9",
    }}
  >
    The platform includes features such as HD video calls, screen sharing,
    real-time chat, meeting recording, secure rooms, participant management,
    and AI-powered background blur. MeetFlow demonstrates modern full-stack
    development, real-time communication, and scalable web application
    architecture.
  </p>
</section>
 
    

{/* FOOTER */}

<footer
  style={{
    textAlign: "center",
    padding: "2.5rem",
    borderTop: "1px solid rgba(255,255,255,.08)",
  }}
>
  <p
    style={{
      color: "#94a3b8",
      fontSize: "14px",
    }}
  >
    © {new Date().getFullYear()} MeetFlow • Built with React • Node.js •
    Socket.io • WebRTC
  </p>
</footer>

</div>
);
}