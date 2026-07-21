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

  playArpeggio() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      
      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  playSweep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
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

  playDecryptTick(pct: number) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    // Pitch increases as percentage goes up (from 350Hz to 1250Hz)
    const baseFreq = 350 + (pct * 9);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.04);

    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(now + 0.05);
  }

  playSubBass() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Sub bass drop
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);
    osc.start();
    osc.stop(now + 1.0);

    // Filtered noise pop
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(180, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    noise.start();
  }

  playSealBreak() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Crackle sound
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
  }

  playWhoosh() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Whoosh filter sweep
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(3.0, now);
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(850, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start();
  }

  playClick(pitch?: number) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    const freq = pitch || 1500;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.03);

    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain!);

    osc.start();
    osc.stop(now + 0.04);
  }

  playSuccess() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Major 7th chord chime (C5, E5, G5, B5)
    const notes = [523.25, 659.25, 783.99, 987.77];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gainNode.gain.setValueAtTime(0, now + idx * 0.04);
      gainNode.gain.linearRampToValueAtTime(0.05, now + idx * 0.04 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.6);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.7);
    });
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

// Custom text scrambling component simulating a matrix decrypter
function ScrambledText({ 
  text, 
  speed = 30, 
  delay = 0, 
  trigger = false 
}: { 
  text: string; 
  speed?: number; 
  delay?: number; 
  trigger: boolean 
}) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}|:<>?";

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      return;
    }

    let isMounted = true;
    let iteration = 0;
    const originalText = text;
    
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (!isMounted) return;

        setDisplayText(
          originalText
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
    };
  }, [text, speed, delay, trigger]);

  return <span>{displayText || " "}</span>;
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
  const [replayKey, setReplayKey] = useState(0);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Audio-visual dramatic state triggers
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const soundEngineRef = useRef<SoundEngine | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Load custom uploaded banner from localStorage if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invitation_banner");
      setBannerUrl(stored);
    }
  }, [replayKey, stage]);

  // Decryption progress logic with dynamic ticking speed-up
  useEffect(() => {
    if (stage !== "decrypting") return;
    
    setDecryptProgress(0);
    let current = 0;
    
    const tick = () => {
      if (current >= 100) {
        // Trigger visual boom effects
        soundEngineRef.current?.playSubBass();
        setIsFlashing(true);
        setIsShaking(true);
        setTimeout(() => setIsFlashing(false), 250);
        setTimeout(() => setIsShaking(false), 600);
        
        setTimeout(() => {
          setStage("envelope");
        }, 500);
        return;
      }
      
      current += 1;
      setDecryptProgress(current);
      
      if (soundEngineRef.current) {
        soundEngineRef.current.playDecryptTick(current);
      }
      
      // Speed up delay exponentially as progress reaches 100%
      const delay = Math.max(15, 80 - (current * 0.65)); 
      setTimeout(tick, delay);
    };
    
    const startTimeout = setTimeout(tick, 300);
    return () => clearTimeout(startTimeout);
  }, [stage]);

  // Timeline progress logic for card display
  useEffect(() => {
    if (stage !== "card") return;

    setProgress(0);
    setActiveCodeLine(-1);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const nextVal = prev + 1;
        
        // Trigger code lines typed sounds (random typing clicks) and appearance
        if (nextVal === 15) { setActiveCodeLine(0); soundEngineRef.current?.playClick(1200 + Math.random() * 400); }
        if (nextVal === 30) { setActiveCodeLine(1); soundEngineRef.current?.playClick(1300 + Math.random() * 400); }
        if (nextVal === 45) { setActiveCodeLine(2); soundEngineRef.current?.playClick(1400 + Math.random() * 400); }
        if (nextVal === 60) { setActiveCodeLine(3); soundEngineRef.current?.playClick(1500 + Math.random() * 400); }
        if (nextVal === 100) { soundEngineRef.current?.playSuccess(); }
        
        return nextVal;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [stage, replayKey]);

  const handleStartDecryption = () => {
    setAudioEnabled(true);
    setStage("decrypting");
    setTimeout(() => {
      soundEngineRef.current?.playArpeggio();
    }, 150);
  };

  const handleOpenEnvelope = () => {
    setStage("opening");
    soundEngineRef.current?.playSealBreak();
    setShowRipple(true);
    setIsShaking(true);
    
    setTimeout(() => {
      setShowRipple(false);
      setIsShaking(false);
    }, 850);

    // Play whoosh sound when envelope opens
    setTimeout(() => {
      soundEngineRef.current?.playWhoosh();
    }, 300);

    setTimeout(() => {
      setStage("card");
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }, 1800);
  };

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    soundEngineRef.current?.playSweep();
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 450);
  };

  // Direct DOM manipulation for tilt glare effect (prevents React re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <main className={`invite-film ${stage === "opening" || stage === "card" ? "is-open" : ""} ${stage === "card" ? "is-cinematic" : ""}`}>
      {/* Fullscreen VFX overlays */}
      <div className={`flash-overlay ${isFlashing ? "active" : ""}`} />
      <div className={`glitch-interference ${isGlitching ? "active" : ""}`} />
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
          <div>TC 00:0{Math.floor((progress / 100) * 8)}:{String(Math.floor(((progress / 100) * 8 % 1) * 24)).padStart(2, "0")}</div>
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
            <div className="intro-status-code">
              <ScrambledText text="Security protocol encrypted" trigger={true} speed={25} />
            </div>
            <h1 className="intro-title font-sans">
              <ScrambledText text="CIS INVITATION" trigger={true} speed={40} delay={300} />
            </h1>
            <p className="intro-desc">
              ระบบส่งสัญญาณการ์ดเชิญส่วนบุคคลสำหรับอาจารย์สาขาวิทยาการคอมพิวเตอร์และสารสนเทศ (CIS) <br />
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
          <div className={`intro-console ${isShaking ? "shake-active" : ""}`}>
            <div className="intro-laser" />
            <div className="intro-status-code">DECRYPTING PACKETS...</div>
            <div className="decrypting-container">
              <div className="decrypt-bar-track">
                <div className="decrypt-bar-fill" style={{ width: `${decryptProgress}%` }} />
              </div>
              <div className="decrypt-status-text">
                <span>CONNECTING: CIS_NODE_ALPHA</span>
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
            className={`envelope-button ${isShaking ? "shake-active" : ""}`}
            type="button"
            onClick={handleOpenEnvelope}
            disabled={stage === "opening"}
            aria-label="แตะเพื่อเปิดการ์ดเชิญ"
          >
            {showRipple && <span className="seal-ripple" />}
            <span className="tap-light" />
            <span className="invite-card-peek">
              <span className="peek-grid" />
              <span className="peek-title">CIS INVITATION</span>
              <span className="peek-line" />
              <span className="peek-line short" />
            </span>
            <span className="envelope-back" />
            <span className="envelope-left" />
            <span className="envelope-right" />
            <span className="envelope-front" />
            <span className="envelope-flap" />
            <span className="wax-seal">
              <span>CIS</span>
            </span>
            <span className="tap-copy">แตะเพื่อเปิดการ์ดเชิญ</span>
          </button>
        </section>
      )}

      {/* Stage 4: Cinematic Widescreen Invitation Card Display */}
      {(stage === "opening" || stage === "card") && (
        <section className={`card-stage ${stage === "card" ? "is-open" : ""}`} aria-label="การ์ดเชิญเข้าร่วมงาน">
          {/* Card wrapper with interactive 3D hover/tilt glare effect */}
          <div
            ref={cardRef}
            className="console-card-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: "transform 0.15s ease-out",
            }}
          >
            <div className="movie-card">
              <div className="banner-scene">
                <div 
                  className="banner-image" 
                  style={{
                    backgroundImage: bannerUrl 
                      ? `linear-gradient(90deg, rgba(5, 7, 13, 0.22), rgba(5, 7, 13, 0.02) 54%, rgba(5, 7, 13, 0.36)), url(${bannerUrl})` 
                      : undefined
                  }}
                />
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
                  opacity: (progress >= 10 && progress < 92) ? 1 : 0, 
                  transform: (progress >= 10 && progress < 92) ? "translateY(0)" : "translateY(15px)",
                  transition: "opacity 1.2s ease, transform 1.2s ease",
                  left: "6%",
                  bottom: "12%"
                }}
              >
                <p>FACULTY INVITATION SEQUENCE</p>
                <h1 className="font-sans text-white text-shadow-md">
                  <ScrambledText text="ขอเรียนเชิญอาจารย์เข้าร่วมงาน" trigger={progress >= 10} speed={25} />
                </h1>
                <span className="text-gray-200">
                  ร่วมเป็นเกียรติในช่วงเวลาสำคัญของนักศึกษาสาขาวิทยาการคอมพิวเตอร์และสารสนเทศ (CIS)
                </span>
              </div>

              {/* Interactive tech typewriter code lines */}
              <div 
                className="terminal-strip" 
                style={{ 
                  opacity: (progress >= 30 && progress < 92) ? 1 : 0, 
                  transform: (progress >= 30 && progress < 92) ? "translateY(0)" : "translateY(-10px)",
                  transition: "opacity 1s ease, transform 1s ease",
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
                    <ScrambledText text={line} trigger={activeCodeLine >= index} speed={15} />
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
          {stage === "card" && (
            <div className="player-controls visible">
              <div className="timeline-row">
                <span className="timeline-time">00:0{Math.floor((progress / 100) * 8)}</span>
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
                  {progress === 100 && (
                    <button className="action-btn-pill primary" onClick={handleReplay}>
                      ชมอีกครั้ง (REPLAY)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
