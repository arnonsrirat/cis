"use client";

import { useState, useEffect, useRef } from "react";

// Web Audio API Sound Engine for immersive sci-fi sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private initialized: boolean = false;

  constructor() {}

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.error("Failed to initialize AudioContext", e);
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    const targetGain = mute ? 0 : 0.8;
    this.masterGain?.gain.linearRampToValueAtTime(targetGain, this.ctx?.currentTime ? this.ctx.currentTime + 0.4 : 0.4);
  }

  playAmbient() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.ambientOscs.length > 0) return;
    const now = this.ctx.currentTime;

    // Rich dark sci-fi chord loop (C minor 7th: C3, Eb3, G3, Bb3, C4)
    const frequencies = [130.81, 155.56, 196.00, 233.08, 261.63];
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      
      // Pitch LFO for dynamic detuned/chorus texture
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.25 + idx * 0.04, now);
      lfoGain.gain.setValueAtTime(1.8, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      // Low pass filter to make it warm and ambient
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420 + idx * 40, now);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      gainNode.gain.setValueAtTime(0.06, now);

      osc.start();
      this.ambientOscs.push(osc);
      this.ambientGains.push(gainNode);
    });
  }

  playSweep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Cyber sweep sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 1.8);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 1.6);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(now + 2.2);
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Technical beep click for line prints
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(now + 0.06);
  }

  stopAll() {
    this.ambientOscs.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.ambientOscs = [];
    this.ambientGains = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch(e) {}
      this.ctx = null;
      this.initialized = false;
    }
  }
}

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
  const [stage, setStage] = useState<"intro" | "decrypting" | "envelope" | "opening" | "card">("intro");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [activeCodeLine, setActiveCodeLine] = useState(-1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const soundEngineRef = useRef<SoundEngine | null>(null);

  // Initialize sound engine on client side
  useEffect(() => {
    soundEngineRef.current = new SoundEngine();
    return () => {
      soundEngineRef.current?.stopAll();
    };
  }, []);

  // Sync state with audio engine
  useEffect(() => {
    if (soundEngineRef.current) {
      soundEngineRef.current.setMute(!audioEnabled);
      if (audioEnabled) {
        soundEngineRef.current.playAmbient();
      }
    }
  }, [audioEnabled]);

  // Decryption progress logic
  useEffect(() => {
    if (stage !== "decrypting") return;
    
    setDecryptProgress(0);
    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("envelope");
          }, 400);
          return 100;
        }
        // Small click sounds during decryption ticks
        if (prev % 15 === 0 && soundEngineRef.current) {
          soundEngineRef.current.playClick();
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [stage]);

  // Timeline progress logic for card display
  useEffect(() => {
    if (stage !== "card") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const nextVal = prev + 1;
        
        // Trigger code lines typed sounds and appearance at specific timeline milestones
        if (nextVal === 15) { setActiveCodeLine(0); soundEngineRef.current?.playClick(); }
        if (nextVal === 30) { setActiveCodeLine(1); soundEngineRef.current?.playClick(); }
        if (nextVal === 45) { setActiveCodeLine(2); soundEngineRef.current?.playClick(); }
        if (nextVal === 60) { setActiveCodeLine(3); soundEngineRef.current?.playClick(); }
        
        return nextVal;
      });
    }, 90); // ~9 seconds total card reveal timeline

    return () => clearInterval(interval);
  }, [stage]);

  const handleStartDecryption = () => {
    setAudioEnabled(true);
    setStage("decrypting");
    setTimeout(() => {
      soundEngineRef.current?.playSweep();
    }, 200);
  };

  const handleOpenEnvelope = () => {
    setStage("opening");
    soundEngineRef.current?.playSweep();
    setTimeout(() => {
      setStage("card");
      setProgress(0);
      setActiveCodeLine(-1);
    }, 1800); // Wait for flap and card slide animations to complete
  };

  const handleReplay = () => {
    setProgress(0);
    setActiveCodeLine(-1);
    setStage("card");
    soundEngineRef.current?.playSweep();
  };

  // Parallax tilt logic for card hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Max 10 degrees tilt rotation
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <main className={`invite-film ${stage === "card" ? "is-open is-cinematic" : ""}`}>
      <div className="film-grain" />
      <div className="matrix-grid" />
      <div className="scanlines-overlay" />

      {/* Cyber/Cinematic framing bars */}
      <div className="cinematic-letterbox top" />
      <div className="cinematic-letterbox bottom" />

      {/* Sound Visualizer & Equalizer Button */}
      {stage !== "intro" && (
        <button
          className={`equalizer-btn ${audioEnabled ? "active" : ""}`}
          onClick={() => setAudioEnabled(!audioEnabled)}
          aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
        >
          <div className="equalizer-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span>{audioEnabled ? "AUDIO ON" : "AUDIO MUTED"}</span>
        </button>
      )}

      {/* Futuristic Video Overlay Indicators */}
      <div className="camera-overlay">
        <div className="camera-top-row">
          <div className="rec-indicator">
            <span className="rec-dot" />
            <span>REC 24FPS</span>
          </div>
          <div>DECRYPT: 256-BIT</div>
        </div>
        <div className="camera-bottom-row">
          <div>TC 00:0{Math.floor(progress / 20)}:{String(Math.floor((progress % 20) * 3)).padStart(2, "0")}</div>
          <div>HOLOGRAPHIC TRANS [ACTIVE]</div>
        </div>
      </div>

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

      {/* Stage 1: Intro Security Decrypt Request */}
      {stage === "intro" && (
        <section className="intro-stage" aria-label="ยืนยันการรับรหัสสัญญาณการ์ดเชิญ">
          <div className="intro-console">
            <div className="intro-laser" />
            <div className="intro-status-code">Security protocol encrypted</div>
            <h1 className="intro-title font-sans">CS INVITATION</h1>
            <p className="intro-desc">
              ระบบส่งสัญญาณการ์ดเชิญส่วนบุคคลสำหรับอาจารย์วิทยาการคอมพิวเตอร์ <br />
              กรุณากดปุ่มด้านล่างเพื่อเริ่มถอดรหัสสัญญาณสัญญาณเข้าสู่ระบบ
            </p>
            <button className="decrypt-btn" onClick={handleStartDecryption}>
              แตะเพื่อถอดรหัสสัญญาณ
            </button>
          </div>
        </section>
      )}

      {/* Stage 2: Decrypting Loader animation */}
      {stage === "decrypting" && (
        <section className="intro-stage" aria-label="กำลังถอดรหัสข้อมูล">
          <div className="intro-console">
            <div className="intro-laser" />
            <div className="intro-status-code">DECRYPTING PACKETS...</div>
            <div className="decrypting-container">
              <div className="decrypt-bar-track">
                <div className="decrypt-bar-fill" style={{ width: `${decryptProgress}%` }} />
              </div>
              <div className="decrypt-status-text">
                <span>CONNECTING: CS_NODE_ALPHA</span>
                <span>{decryptProgress}%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stage 3: Envelope Stage */}
      {(stage === "envelope" || stage === "opening") && (
        <section className={`envelope-stage ${stage === "opening" ? "is-open" : ""}`} aria-label="ซองการ์ดเชิญอาจารย์">
          <button
            className="envelope-button"
            type="button"
            onClick={handleOpenEnvelope}
            disabled={stage === "opening"}
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
      )}

      {/* Stage 4: Cinematic Widescreen Invitation Card Display */}
      {stage === "card" && (
        <section className="card-stage is-open" aria-label="การ์ดเชิญเข้าร่วมงาน">
          {/* Card wrapper with interactive 3D hover/tilt glare effect */}
          <div
            className="console-card-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            <div className="movie-card is-open">
              <div className="banner-scene">
                <div className="banner-image" />
                <div className="banner-glass" />
                <div className="hologram-glare" />
                <div className="scan-line" />
                <div className="corner-marker marker-a" />
                <div className="corner-marker marker-b" />
                <div className="corner-marker marker-c" />
                <div className="corner-marker marker-d" />
              </div>

              {/* Glowing Thai text elements synced with progress milestones */}
              <div 
                className="story-copy" 
                style={{ 
                  opacity: progress >= 10 ? 1 : 0, 
                  transform: progress >= 10 ? "translateY(0)" : "translateY(15px)",
                  transition: "opacity 1.2s ease, transform 1.2s ease",
                  left: "6%",
                  bottom: "12%"
                }}
              >
                <p>FACULTY INVITATION SEQUENCE</p>
                <h1 className="font-sans text-white text-shadow-md">ขอเรียนเชิญอาจารย์เข้าร่วมงาน</h1>
                <span className="text-gray-200">
                  ร่วมเป็นเกียรติในช่วงเวลาสำคัญของนักศึกษาสายวิทยาการคอมพิวเตอร์
                </span>
              </div>

              {/* Interactive tech typewriter code lines */}
              <div 
                className="terminal-strip" 
                style={{ 
                  opacity: progress >= 30 ? 1 : 0, 
                  transition: "opacity 1s ease",
                  right: "6%",
                  top: "12%"
                }}
              >
                {codeLines.map((line, index) => (
                  <p 
                    key={line} 
                    style={{ 
                      opacity: activeCodeLine >= index ? 1 : 0,
                      transform: activeCodeLine >= index ? "translateX(0)" : "translateX(-15px)",
                      transition: "all 0.5s ease",
                      margin: "0.28rem 0"
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive connections node map */}
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

          {/* Immersive Video Progress Slider Bar at the bottom of the screen */}
          <div className={`player-controls ${progress >= 0 ? "visible" : ""}`}>
            <div className="timeline-row">
              <span className="timeline-time">00:{String(Math.floor(progress / 12)).padStart(2, "0")}</span>
              <div className="timeline-slider-track" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = Math.floor((clickX / rect.width) * 100);
                setProgress(percent);
                setActiveCodeLine(Math.floor(percent / 20) - 1);
              }}>
                <div className="timeline-slider-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="timeline-time">00:08</span>
            </div>
            
            <div className="controls-row">
              <div className="control-group-left">
                <div className="playback-state-text">
                  <span />
                  {progress < 100 ? "TRANSMITTING SIGNALS..." : "TRANSMISSION COMPLETE"}
                </div>
              </div>
              
              <div className="control-group-right">
                <button className="action-btn-pill primary" onClick={handleReplay}>
                  ชมอีกครั้ง (REPLAY)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
