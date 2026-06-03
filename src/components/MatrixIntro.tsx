/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { hackerAudio } from "../utils/audio";
import { Terminal, ShieldAlert, Cpu, Radio, ShieldCheck } from "lucide-react";

interface MatrixIntroProps {
  lang: "fa" | "en";
  setLang: (lang: "fa" | "en") => void;
  onComplete: () => void;
}

export default function MatrixIntro({ lang, setLang, onComplete }: MatrixIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [percent, setPercent] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  const systemLogsDict = {
    fa: [
      "[SYS]: بارگذاری هسته رمزنگاری سایبری...",
      "[SYS]: اتصال امن به سخت‌افزار آنتروپی محلی...",
      "[SYS]: راه‌اندازی شبیه‌سازهای تصادفی پیشرفته...",
      "[SYS]: بارگذاری فرکانس‌های سینث‌سایزر صونی دیجیتال...",
      "[SEC]: بررسی فایروال محلی و ایزوله‌سازی کلاینت...",
      "[SEC]: بهینه‌سازی الگوریتم تولید توکن های امنیتی...",
      "[SEC]: راه‌اندازی فیلترهای ضدشنود رمز پیشرفته...",
      "[SYS]: هسته با موفقیت بارگذاری شد. آماده بهره‌برداری."
    ],
    en: [
      "[SYS]: Loading cyber cryptography kernel...",
      "[SYS]: Link established to hardware entropy core...",
      "[SYS]: Running advanced randomization systems...",
      "[SYS]: Loading sound waves for digital synth...",
      "[SEC]: Auditing local client-side security policies...",
      "[SEC]: Optimizing token generation algorithms...",
      "[SEC]: Mounting customized secure anti-snoop rules...",
      "[SYS]: Boot successful. System ready for secure access."
    ]
  };

  // 1. Matrix Digital Rain Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const alphabet = "0101100101CRYPTOPASSWORDHACKERGREEN01010101111001010".split("");
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));

    // Dynamic scale helper during transition
    const draw = () => {
      const entering = isEnteringRef.current;
      ctx.fillStyle = entering ? "rgba(10, 14, 18, 0.18)" : "rgba(10, 14, 18, 0.08)";
      ctx.fillRect(0, 0, width, height);

      const currentFontSize = entering ? 9 : fontSize;
      ctx.font = `bold ${currentFontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        let text = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (entering) {
          // Explode with decimal floating hex keys and math fractions
          const extraChars = "01010xAA0xEF0x3B..//..-=+*?0123456789";
          text = extraChars[Math.floor(Math.random() * extraChars.length)];
        }

        // Denser columns layout offset when rendering tiny characters
        const x = i * (entering ? 9 : fontSize);
        const y = rainDrops[i] * (entering ? 8 : fontSize);

        if (rainDrops[i] === 0 || Math.random() > 0.98) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = entering 
            ? `rgba(0, 255, 102, ${0.4 + Math.random() * 0.55})` 
            : "rgba(0, 255, 102, 0.45)";
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.97) {
          rainDrops[i] = 0;
        }
        // Accelerate waterfall speed on active connection sweep
        rainDrops[i] += entering ? Math.floor(Math.random() * 3) + 2 : 1;
      }

      // Supplementary tiny code debris float layer
      if (entering) {
        ctx.fillStyle = "rgba(0, 255, 102, 0.7)";
        ctx.font = "bold 8px monospace";
        for (let j = 0; j < 50; j++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          const textSym = Math.random() > 0.5 ? "0" : "1";
          ctx.fillText(textSym, rx, ry);
        }
      }
    };

    const tick = () => {
      draw();
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 2. Simulated boot progression and beep sounds
  useEffect(() => {
    let logIdx = 0;
    let currentPercent = 0;
    const activeLogs = systemLogsDict[lang];

    const timer = setInterval(() => {
      if (currentPercent < 100) {
        currentPercent += Math.floor(Math.random() * 5) + 3;
        if (currentPercent > 100) currentPercent = 100;
        setPercent(currentPercent);

        const milestone = Math.floor((activeLogs.length * currentPercent) / 100);
        if (milestone > logIdx && logIdx < activeLogs.length) {
          const nextLog = activeLogs[logIdx];
          setLogs((prev) => [...prev, nextLog]);
          logIdx++;
          hackerAudio.playKeyPress();
        }
      } else {
        clearInterval(timer);
        setIsDone(true);
        hackerAudio.playSuccess();
      }
    }, 90);

    return () => clearInterval(timer);
  }, [lang]);

  const [isEntering, setIsEntering] = useState<boolean>(false);
  const isEnteringRef = useRef(false);

  useEffect(() => {
    isEnteringRef.current = isEntering;
  }, [isEntering]);

  const handleStartApp = () => {
    hackerAudio.playCyberSweep();
    hackerAudio.playDecryptLoop();
    setIsEntering(true);
    setTimeout(() => {
      onComplete();
    }, 1250);
  };

  const handleLangToggle = (targetLang: "fa" | "en") => {
    hackerAudio.playClick();
    setLang(targetLang);
    setLogs([]);
    setPercent(0);
    setIsDone(false);
  };

  return (
    <div id="matrix-intro" className={`relative w-screen h-screen overflow-hidden bg-cyber-dark text-white font-sans flex items-center justify-center ${lang === "fa" ? "rtl-layout text-right" : "ltr-layout text-left"}`}>
      {/* Absolute canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Cyber Grid Background overlay */}
      <div className="absolute inset-0 cyber-grid z-5 pointer-events-none" />

      {/* Retro scanline Overlay effect */}
      <div className="absolute inset-0 scanline-overlay z-10 pointer-events-none animate-flicker" />

      {/* Interactive Terminal Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isEntering ? { 
          opacity: [1, 0.82, 0], 
          scale: [1, 1.04, 0.75], 
          y: [0, -15, 120], 
          filter: ["blur(0px)", "blur(4px)", "blur(24px)"]
        } : { 
          opacity: 1, 
          scale: 1,
          y: 0,
          filter: "blur(0px)" 
        }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="relative z-20 w-11/12 max-w-2xl bg-[#0b0f13]/90 border border-cyber-green/40 rounded-lg p-5 sm:p-8 glow-border shadow-2xl backdrop-blur-sm"
      >
        
        {/* Card Header decoration with language picker */}
        <div className={`flex items-center justify-between border-b border-cyber-green/30 pb-4 mb-5 ${lang === "fa" ? "flex-row-reverse" : "flex-row"}`}>
          <div className="flex space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600/80 inline-block animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-cyber-green/80 inline-block" />
          </div>

          {/* Bilingual Language Switches */}
          <div className="flex items-center space-x-1 border border-cyber-green/35 rounded-md p-0.5 bg-black/60 font-mono text-[10px] gap-1">
            <button
              id="lang-fa-btn"
              onClick={() => handleLangToggle("fa")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${lang === "fa" ? "bg-cyber-green/20 text-cyber-green font-bold border border-cyber-green/30" : "text-cyber-green/50 hover:text-cyber-green"}`}
            >
              فارسی [FA]
            </button>
            <button
              id="lang-en-btn"
              onClick={() => handleLangToggle("en")}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${lang === "en" ? "bg-cyber-green/20 text-cyber-green font-bold border border-cyber-green/30" : "text-cyber-green/50 hover:text-cyber-green"}`}
            >
              [EN] ENG
            </button>
          </div>

          <div className={`flex items-center space-x-2 text-cyber-green ${lang === "fa" ? "scale-x-[-1]" : ""}`}>
            <span className="font-mono text-[10px] opacity-60 tracking-wider">SECURE KERNEL V3.09</span>
            <Terminal className="w-4 h-4" />
          </div>
        </div>

        {/* Brand & Main Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-cyber-green/10 rounded-full border border-cyber-green/30 mb-2">
            <ShieldAlert className="w-8 h-8 text-cyber-green animate-pulsate" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight glow-green font-mono leading-relaxed uppercase">
            {lang === "fa" ? "سامانه تولید رمز Pass Generator" : "Pass Generator Core Terminal"}
          </h1>
          <p className="text-cyber-green/70 text-xs mt-1 font-mono tracking-widest uppercase">
            {lang === "fa" ? "سایت ابزاری مخصوص ساختن پسوردهای پیچیده سایبری" : "interactive client-side cryptographic access"}
          </p>
        </div>

        {/* Dynamic Terminal Boot Terminal Logger */}
        <div className="bg-[#040608] border border-cyber-green/25 rounded p-4 h-44 overflow-y-auto mb-5 font-mono text-xs text-cyber-light space-y-1.5 text-left ltr-layout glow-border">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-cyber-green font-bold">&gt;&gt;</span>
              <span className="leading-relaxed select-text tracking-wide">{log}</span>
            </div>
          ))}
          {!isDone && (
            <div className="flex items-center space-x-2">
              <span className="text-cyber-green animate-pulse font-bold">&gt;&gt;</span>
              <span className="w-2 h-4 bg-cyber-green animate-pulse" />
            </div>
          )}
        </div>

        {/* Security Progress Meter */}
        <div className="mb-6">
          <div className={`flex justify-between items-center mb-1 text-xs ${lang === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="font-mono text-cyber-green/60">SECU_BOOT_LINK: {percent}%</span>
            <span className="text-cyber-green font-mono text-[11px] tracking-wide">
              {lang === "fa" ? "در حال اجرای پروتکل راه‌اندازی فرکانس‌ها..." : "Booting local matrix system..."}
            </span>
          </div>
          <div className="w-full bg-[#0d131a] rounded h-2.5 overflow-hidden border border-cyber-green/20">
            <div
              className="bg-cyber-green h-full transition-all duration-100 shadow-[0_0_10px_rgba(0,255,102,0.8)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Action Trigger button */}
        <div className="flex items-center justify-center">
          {isDone ? (
            <button
              id="terminal-enter-btn"
              onClick={handleStartApp}
              className="w-full sm:w-auto px-10 py-3.5 bg-transparent border-2 border-cyber-green hover:bg-cyber-green/20 text-cyber-green font-bold font-mono rounded-md tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 glow-button text-sm"
            >
              <ShieldCheck className="w-5 h-5" />
              {lang === "fa" ? "بارگذاری پایگاه تولید رمزنگاری" : "ENTER CRYPTO RUNTIME"}
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-10 py-3.5 bg-transparent border-2 border-cyber-green/20 text-cyber-green/40 font-bold font-mono rounded-md tracking-wider flex items-center justify-center gap-2 text-sm cursor-not-allowed"
            >
              <Cpu className="w-5 h-5 animate-spin" />
              {lang === "fa" ? "پیکربندی سیستم آدرس فایروال..." : "FIREWALL AUDITING CONFIG..."}
            </button>
          )}
        </div>

        {/* Cyber bottom decoration */}
        <div className={`flex justify-between items-center text-[10px] text-cyber-green/45 mt-6 pt-4 border-t border-cyber-green/20 font-mono ${lang === 'fa' ? 'flex-row-reverse' : 'flex-row'}`}>
          <span>PORT: 3000 // HOST_ADDR: 0.0.0.0</span>
          <span>{lang === "fa" ? "مجوز نفوذ روت: صادر شد" : "ROOT_PRIVILEGE: GRANTED"}</span>
        </div>
      </motion.div>
    </div>
  );
}
