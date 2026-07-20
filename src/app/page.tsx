"use client";

import { useState } from "react";

const codeLines = [
  "boot.invitation('faculty')",
  "await envelope.open()",
  "card.reveal({ ratio: '16:9' })",
  "professor.join(ceremony)",
];

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  delay: `${(index % 11) * 0.18}s`,
  duration: `${5.4 + (index % 8) * 0.28}s`,
}));

const nodes = [
  { top: "18%", left: "12%" },
  { top: "24%", left: "82%" },
  { top: "66%", left: "9%" },
  { top: "76%", left: "78%" },
  { top: "47%", left: "92%" },
  { top: "36%", left: "5%" },
];

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className={`invite-film ${isOpened ? "is-open" : ""}`}>
      <div className="film-grain" />
      <div className="matrix-grid" />

      <div className="signal-particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <section className="envelope-stage" aria-label="ซองการ์ดเชิญอาจารย์">
        <button
          className="envelope-button"
          type="button"
          onClick={() => setIsOpened(true)}
          disabled={isOpened}
          aria-label="แตะเพื่อเปิดการ์ดเชิญ"
        >
          <span className="tap-light" />
          <span className="invite-card-peek">
            <span className="peek-grid" />
            <span className="peek-title">CS INVITATION</span>
            <span className="peek-line" />
            <span className="peek-line short" />
          </span>
          <span className="envelope-back" />
          <span className="envelope-left" />
          <span className="envelope-right" />
          <span className="envelope-front" />
          <span className="envelope-flap" />
          <span className="wax-seal">
            <span>CS</span>
          </span>
          <span className="tap-copy">แตะเพื่อเปิดการ์ดเชิญ</span>
        </button>
      </section>

      <section className="card-stage" aria-label="การ์ดเชิญเข้าร่วมงาน">
        <div className="movie-card">
          <div className="banner-scene">
            <div className="banner-image" />
            <div className="banner-glass" />
            <div className="corner-marker marker-a" />
            <div className="corner-marker marker-b" />
            <div className="corner-marker marker-c" />
            <div className="corner-marker marker-d" />
          </div>
        </div>

        <div className="story-copy">
          <p>Faculty Invitation Sequence</p>
          <h1>ขอเรียนเชิญอาจารย์เข้าร่วมงาน</h1>
          <span>
            ร่วมเป็นเกียรติในช่วงเวลาสำคัญของนักศึกษาสายวิทยาการคอมพิวเตอร์
          </span>
        </div>

        <div className="terminal-strip" aria-hidden="true">
          {codeLines.map((line, index) => (
            <p key={line} style={{ animationDelay: `${2.35 + index * 0.2}s` }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {line}
            </p>
          ))}
        </div>

        <div className="node-map" aria-hidden="true">
          {nodes.map((node, index) => (
            <span
              key={`${node.top}-${node.left}`}
              style={{
                top: node.top,
                left: node.left,
                animationDelay: `${1.8 + index * 0.16}s`,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
