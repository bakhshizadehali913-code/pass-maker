/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  generatePassword, 
  calculateEntropy, 
  estimateCrackTime, 
  PasswordConfig 
} from "../utils/password";
import { hackerAudio } from "../utils/audio";
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ShieldAlert, 
  History, 
  Terminal, 
  Sparkles,
  Info
} from "lucide-react";

interface PasswordGeneratorProps {
  lang: "fa" | "en";
  setLang: (lang: "fa" | "en") => void;
}

const translations = {
  fa: {
    headerTitle: "پایگاه Pass Generator // ساخت رمز عبور",
    headerSubtitle: "SECU.CRYPT CORE GENERATOR",
    outputLabel: "رشته رمز تولید شده // OUTPUT STREAM",
    lengthLabel: "طول:",
    charsSuffix: "کاراکتر",
    placeholderEmpty: "[ برای تولید رمز ایمن دکمه چرخان سبز را اعمال کنید ]",
    copiedTip: "با موفقیت کپی شد!",
    btnCopyTitle: "کپی کردن رمز عبور",
    btnGenTitle: "تولید رمز عبور مقتدر هکری",
    entropyLabel: "توان آنتروپی رمزنگاری (درجه سختی پسورد):",
    crackTimeLabel: "بازه تخمینی زمان کشف رمز توسط مهاجم:",
    configHeading: "پارامترهای شخصی‌سازی الگوریتم رندومایزر (تنظیمات رمز)",
    presetLabel: "انتخاب پروفایل امنیتی پیش‌فرض هکری سریع:",
    presets: {
      hacker_grade: "🛡️ هکری فوق ایمن",
      hacker_basic: "🔐 حروف و عدد پایه",
      memorable: "🗣️ تلفظ آسان",
      pin_code: "🔢 پین کد عددی"
    },
    settingLength: "تنظیم طول پسورد پس از پردازش نهایی:",
    settingUpper: "شامل حروف بزرگ انگلیسی (A-Z)",
    settingLower: "شامل حروف کوچک انگلیسی (a-z)",
    settingNumbers: "شامل ارقام ریاضی عددی (0-9)",
    settingSymbols: "شامل نشان‌های گارد امنیت (!@#$%)",
    filtersHeading: "فیلترها و منطق‌های بازدارنده امنیتی",
    filterExcludeConfusing: "عدم استفاده از اشکال مشابه انگلیسی",
    filterExcludeConfusingDesc: "حذف حروف با پتانسیل تشابه بالا نظیر (l, I, o, 0, 1, O)",
    filterReadable: "تولید با ساختار منظم سخنگویی (خوانایی تفکیکی)",
    filterReadableDesc: "تناوب ادواری هم‌خوان و مصوت جهت سهولت ماندگاری در مغز انسان",
    filterCustomExcl: "حذف دستی نشانه‌ها و کاراکترهای دلخواه:",
    filterCustomExclPlaceholder: "مثال: @#&*L1i",
    filterCustomExclTip: "* حروف فوق از خروجی تصادفی برچیده خواهند شد.",
    historyHeading: "سابقه تاریخچه ماتریکس (نشست جاری)",
    historyLogs: "گزارش زنده",
    historyEmptyState: "رمزی ثبت نشده است.",
    historyEmptyDesc: "روی دکمه چرخان تولید کلیک کنید.",
    historyTip: "* تاریخچه صرفاً در حافظه موقت مرورگر ثبت شده و با رفرش ناپدید می‌شود.",
    guideHeading: "راهنمای استراتژیک غلبه بر ردیابی سایبری (آنالوگ استایل)",
    guideDesc: "یک رمز عبور مطمئن هکری همواره باید حداقل ۱۲ کاراکتر داشته باشد. بکارگیری حروف بزرگ، ارقام و کاراکترهای ایمن الزامیست. این برنامه کاملاً مستقل، امن و آفلاین روی مرورگر شما توسعه یافته است.",
    weak: "ضعیف - قابل کرک در چنده صدم ثانیه",
    medium: "متوسط - شکست در ۱ ساعت با کارت گرافیک میان‌رده",
    strong: "قوی - نیازمند چندین سال پردازش ابری",
    military: "درجه نظامی - غیرقابل شکست مطلق با تکنولوژی کنونی",
  },
  en: {
    headerTitle: "Cryptography Lab - Pass Generator",
    headerSubtitle: "SECU.CRYPT CORE GENERATOR",
    outputLabel: "DECRYPTED TOKEN RESULT // OUTPUT STREAM",
    lengthLabel: "SIZE:",
    charsSuffix: "chars",
    placeholderEmpty: "[ CONFIG PARAMETERS & TRIGGER DECRYPTION ROLLER ]",
    copiedTip: "COPIED!",
    btnCopyTitle: "Copy Password to clipboard",
    btnGenTitle: "Trigger random sequence roller",
    entropyLabel: "CRYPTOGRAPHIC ENTROPY POWER VALUE:",
    crackTimeLabel: "ESTIMATED BRUTE FORCE DECRYPTION WINDOW:",
    configHeading: "RANDOMIZER ENGINE SEED CONTROLS & PARAMS",
    presetLabel: "LOAD PRE-CONFIGURED SECURITY PROFILES:",
    presets: {
      hacker_grade: "🛡️ Ultra Hacker",
      hacker_basic: "🔐 Basic Mix",
      memorable: "🗣️ Pronounceable Memorable",
      pin_code: "🔢 Pin Digits"
    },
    settingLength: "Adjust output password letter count:",
    settingUpper: "Include UPPERCASE Characters (A-Z)",
    settingLower: "Include lowercase Characters (a-z)",
    settingNumbers: "Include Numeric Digits (0-9)",
    settingSymbols: "Include Safety Symbols (!@#$%)",
    filtersHeading: "RESTRICTIVE FILTERS & ANTI-SNOOP CRITERIA",
    filterExcludeConfusing: "Exclude confusing visual signatures",
    filterExcludeConfusingDesc: "Discard vague look-alikes from the character set (l, I, o, 0, 1, O)",
    filterReadable: "Formulate mnemonic voice-friendly structures",
    filterReadableDesc: "Alternates consonants and vowels to aid speakability and human storage",
    filterCustomExcl: "Manually blacklisted characters:",
    filterCustomExclPlaceholder: "e.g., @#&*L1i",
    filterCustomExclTip: "* Input characters will be fully pruned from the generator pool.",
    historyHeading: "LOCAL COLD CONTAINER ARCHIVES",
    historyLogs: "LOGS",
    historyEmptyState: "Safe logger contains no active streams.",
    historyEmptyDesc: "Execute generator with customized parameters.",
    historyTip: "* Archives are fully sandboxed offline on your machine, vanished on page refresh.",
    guideHeading: "STRATEGIC COUNTER-SNOOP DIRECTIVE // ANALOG SYSTEM",
    guideDesc: "Reliable password hygiene dictates minimum 12-character lengths with multiple uppercase and symbols. This generator works entirely client-side without sharing active configurations.",
    weak: "Weak - vulnerable to dictionary crack in seconds",
    medium: "Medium - cracked within an hour via standard GPUs",
    strong: "Strong - requires multiple decades of supercomputer cluster computation",
    military: "Military Grade - absolutely secure beyond cosmic timelines",
  }
};

export default function PasswordGenerator({ lang, setLang }: PasswordGeneratorProps) {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    readable: false,
    customExclusions: "",
  });

  const [password, setPassword] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [entropy, setEntropy] = useState<number>(0);
  const [history, setHistory] = useState<{ id: string; val: string; timestamp: string; revealed: boolean }[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>("custom");

  // On mount, we do NOT automatically generate a password as requested.
  // We leave password empty initially so they trigger it manually.

  // Update entropy metrics whenever the password recalculates
  useEffect(() => {
    setEntropy(calculateEntropy(password));
  }, [password]);

  // Main high-fidelity generation trigger with matrix decryption animation
  const handleGenerate = () => {
    setIsGenerating(true);
    hackerAudio.playCyberSweep();
    setIsCopied(false);

    let count = 0;
    const intervalTime = 30; // ms
    const maxTicks = 10;
    
    // Play sound cycle
    hackerAudio.playDecryptLoop();

    const rollTimer = setInterval(() => {
      // Create random garbled strings to simulate encryption decoding rolls
      const tmpConfig = { ...config, readable: false };
      const garbled = generatePassword(tmpConfig)
        .split("")
        .map(() => {
          const mockChars = "@#$%&*?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          return mockChars[Math.floor(Math.random() * mockChars.length)];
        })
        .join("");
        
      setPassword(garbled.slice(0, config.length));
      
      count++;
      if (count >= maxTicks) {
        clearInterval(rollTimer);
        const finalPass = generatePassword(config);
        setPassword(finalPass);
        setIsGenerating(false);

        // Add to historical backups
        setHistory((prev) => {
          const fresh = {
            id: Math.random().toString(36).substring(2, 9),
            val: finalPass,
            timestamp: new Date().toLocaleTimeString(lang === "fa" ? "fa-IR" : "en-US"),
            revealed: false,
          };
          return [fresh, ...prev.slice(0, 5)]; // keep last 6 history slots
        });
      }
    }, intervalTime);
  };

  // Toggle quick predefined security profiles (Presets)
  const applyPreset = (preset: string) => {
    hackerAudio.playClick();
    setActivePreset(preset);

    if (preset === "hacker_grade") {
      setConfig({
        length: 18,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        readable: false,
        customExclusions: "",
      });
    } else if (preset === "pin_code") {
      setConfig({
        length: 8,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: false,
        readable: false,
        customExclusions: "",
      });
    } else if (preset === "memorable") {
      setConfig({
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: true,
        readable: true,
        customExclusions: "",
      });
    } else if (preset === "hacker_basic") {
      setConfig({
        length: 10,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: false,
        readable: false,
        customExclusions: "",
      });
    }
  };

  // Safe manual adjustments will reset profile state to custom
  const updateConfig = <K extends keyof PasswordConfig>(key: K, value: PasswordConfig[K]) => {
    hackerAudio.playKeyPress();
    setActivePreset("custom");
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCopy = async (targetText: string) => {
    if (!targetText) return;
    try {
      await navigator.clipboard.writeText(targetText);
      setIsCopied(true);
      hackerAudio.playSuccess();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      hackerAudio.playError();
      const textArea = document.createElement("textarea");
      textArea.value = targetText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleSound = () => {
    const muted = hackerAudio.toggleMute();
    setIsMuted(muted);
  };

  const toggleHistoryReveal = (id: string) => {
    hackerAudio.playKeyPress();
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, revealed: !item.revealed } : item
      )
    );
  };

  const t = translations[lang];

  // Map crack time details to bilingual
  const activeRateText = () => {
    if (entropy < 30) {
      return t.weak;
    } else if (entropy < 50) {
      return t.medium;
    } else if (entropy < 70) {
      return t.strong;
    } else {
      return t.military;
    }
  };

  const getEntropyRating = () => {
    if (entropy === 0) return "-";
    if (entropy < 30) return lang === "fa" ? "[ ضعیف ]" : "[ WEAK ]";
    if (entropy < 50) return lang === "fa" ? "[ متوسط ]" : "[ MEDIUM ]";
    if (entropy < 70) return lang === "fa" ? "[ قوی ]" : "[ STRONG ]";
    return lang === "fa" ? "[ فوق امنیتی ]" : "[ MILITARY GRADE ]";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className={`w-full max-w-5xl mx-auto px-4 py-8 relative z-20 font-sans flex flex-col gap-6 ${lang === "fa" ? "rtl-layout text-right" : "ltr-layout text-left"}`}
    >
      
      {/* Header Bar */}
      <header className={`flex justify-between items-center bg-[#0d131a]/85 border border-cyber-green/20 p-4 rounded-xl shadow-lg backdrop-blur-md ${lang === "fa" ? "flex-row" : "flex-row-reverse"}`}>
        {/* Buttons Controls */}
        <div className="flex items-center space-x-2 gap-1.5 font-mono">
          {/* Audio toggle button */}
          <button 
            id="sound-toggle-btn"
            onClick={toggleSound}
            className="p-2 border border-cyber-green/35 hover:border-cyber-green/95 text-cyber-green rounded bg-cyber-green/5 hover:bg-cyber-green/10 transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
            title={lang === "fa" ? "قطع/وصل صدا" : "Mute/Unmute audio synth"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500 animate-pulse" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
            <span className="text-[10px] uppercase">{isMuted ? "SYNTH: OFF" : "SYNTH: ON"}</span>
          </button>

          {/* Holographic language switch button */}
          <button
            id="lang-switch-main-btn"
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="p-2 border border-cyber-green/45 text-cyber-green font-bold text-xs bg-cyber-green/10 hover:bg-cyber-green/20 transition-all rounded cursor-pointer leading-none flex items-center gap-1.5"
          >
            <span>🌐</span>
            <span>{lang === "fa" ? "ENG (English)" : "فارسی (FA)"}</span>
          </button>
        </div>

        {/* Brand details built with customized monospaces/glows */}
        <div className={`flex items-center gap-3 ${lang === "fa" ? "flex-row" : "flex-row-reverse"}`}>
          <div className="flex flex-col text-right">
            <h2 className="text-xl font-bold text-white glow-green leading-none font-mono tracking-tight uppercase">
              {t.headerTitle}
            </h2>
            <span className="text-[10px] text-cyber-green/50 tracking-widest font-mono select-none mt-1 uppercase">
              // {t.headerSubtitle} // PRIVACY: LOCAL
            </span>
          </div>
          <div className="p-2.5 bg-cyber-green/10 border border-cyber-green/30 rounded-lg text-cyber-green hidden sm:block">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Terminal Screen Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Action Board */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Decoder Output Box with CRT terminal indicators */}
          <section className="bg-gradient-to-b from-[#0c1218] to-[#06090c] border-2 border-cyber-green/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl glow-border">
            {/* Background design ornaments */}
            <div className="absolute top-1 left-2 text-[8px] font-mono text-cyber-green/25 select-none ltr-layout uppercase">
              DECRY_ROLLER_ENG_ONLINE // STATE: READ_PARAMS
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Display Header indicators */}
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-cyber-green/75 flex items-center gap-1.5 uppercase">
                  <span className="w-2 h-2 bg-cyber-green rounded-full animate-ping" />
                  // {t.outputLabel}
                </span>
                <span className="text-cyber-green/40 uppercase">
                  {t.lengthLabel} {password ? password.length : 0} {t.charsSuffix}
                </span>
              </div>
              
              {/* Giant password screen */}
              <div className="bg-[#030608] border border-cyber-green/30 rounded-xl p-5 flex items-center justify-between relative group shadow-inner">
                <span className="absolute right-2 top-1 text-[8px] font-mono text-cyber-green/20 select-none ltr-layout">
                  OUTPUT STREAM CONTAINER
                </span>
                
                {/* Text string display */}
                <div className={`overflow-x-auto overflow-y-hidden text-xl md:text-2.5xl font-mono tracking-wider font-bold pt-3.5 max-w-[80%] whitespace-nowrap scrollbar-thin ${isGenerating ? "opacity-75 animate-pulse text-cyber-green" : password ? "text-cyber-light glow-green" : "text-cyber-green/40 italic font-sans"}`}>
                  {password || t.placeholderEmpty}
                </div>

                {/* Display Control buttons */}
                <div className="flex items-center shrink-0 ltr-layout gap-1">
                  {/* Copy trigger */}
                  <button
                    id="copy-main-btn"
                    onClick={() => handleCopy(password)}
                    disabled={isGenerating || !password}
                    className="p-3 bg-cyber-green/10 hover:bg-cyber-green/20 border border-cyber-green/35 text-cyber-green rounded-lg transition-all duration-200 transform active:scale-90 cursor-pointer disabled:opacity-20 flex items-center justify-center relative"
                    title={t.btnCopyTitle}
                  >
                    {isCopied ? (
                      <span className="text-xs font-mono font-bold text-white uppercase glow-green">{t.copiedTip}</span>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>

                  {/* Refresh/Generation execution button */}
                  <button
                    id="regenerate-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`p-3 bg-cyber-green hover:bg-cyber-light/90 text-[#05080b] rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_20px_rgba(0,255,102,0.6)] cursor-pointer disabled:opacity-40 flex items-center justify-center ${isGenerating ? "animate-spin" : ""}`}
                    title={t.btnGenTitle}
                  >
                    <RefreshCw className="w-5 h-5 font-bold" />
                  </button>
                </div>
              </div>

              {/* Strength HUD Bar with deep analog hacker data */}
              <div className="bg-[#0b1014] border border-cyber-green/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="text-cyber-green/60 font-semibold font-mono uppercase">// {t.entropyLabel}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white font-bold">{entropy} bits</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${entropy > 70 ? "bg-cyber-green/15 text-cyber-green border-cyber-green/30 glow-green" : "bg-red-950/40 text-red-400 border-red-500/25"}`}>
                      {getEntropyRating()}
                    </span>
                  </div>
                </div>

                <div className="h-px md:h-8 w-full md:w-px bg-cyber-green/15" />

                <div className="space-y-1">
                  <div className="text-cyber-green/60 font-semibold font-mono uppercase">// {t.crackTimeLabel}</div>
                  <div className="font-mono font-bold text-cyber-light tracking-wide text-xs glow-green leading-relaxed">
                    {password ? activeRateText() : "---"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration Toolbench Card */}
          <section className="bg-[#0c1218]/90 border border-cyber-green/25 rounded-2xl p-6 shadow-xl relative">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-cyber-green/20 pb-2.5 flex items-center gap-2 font-mono uppercase">
              <Sparkles className="w-5 h-5 text-cyber-green" />
              {t.configHeading}
            </h3>

            {/* Quick Presets row */}
            <div className="mb-6">
              <label className="block text-xs text-cyber-green/60 mb-2 font-mono font-bold uppercase">// {t.presetLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  id="preset-hacker"
                  onClick={() => applyPreset("hacker_grade")}
                  className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${activePreset === "hacker_grade" ? "bg-cyber-green/25 text-cyber-green border-cyber-green glow-green" : "bg-cyber-green/5 text-cyber-green/60 border-cyber-green/15 hover:border-cyber-green/50"}`}
                >
                  {t.presets.hacker_grade}
                </button>
                <button
                  id="preset-basic"
                  onClick={() => applyPreset("hacker_basic")}
                  className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${activePreset === "hacker_basic" ? "bg-cyber-green/25 text-cyber-green border-cyber-green glow-green" : "bg-cyber-green/5 text-cyber-green/60 border-cyber-green/15 hover:border-cyber-green/50"}`}
                >
                  {t.presets.hacker_basic}
                </button>
                <button
                  id="preset-readable"
                  onClick={() => applyPreset("memorable")}
                  className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${activePreset === "memorable" ? "bg-cyber-green/25 text-cyber-green border-cyber-green glow-green" : "bg-cyber-green/5 text-cyber-green/60 border-cyber-green/15 hover:border-cyber-green/50"}`}
                >
                  {t.presets.memorable}
                </button>
                <button
                  id="preset-pin"
                  onClick={() => applyPreset("pin_code")}
                  className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${activePreset === "pin_code" ? "bg-cyber-green/25 text-cyber-green border-cyber-green glow-green" : "bg-cyber-green/5 text-cyber-green/60 border-cyber-green/15 hover:border-cyber-green/50"}`}
                >
                  {t.presets.pin_code}
                </button>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Length controller */}
              <div className="bg-[#040609] border border-cyber-green/15 rounded-xl p-4">
                <div className={`flex justify-between items-center mb-2 text-xs ${lang === 'fa' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="bg-cyber-green/15 text-cyber-green border border-cyber-green/35 px-2.5 py-0.5 rounded-md font-mono font-bold text-sm">
                    {config.length} {t.charsSuffix}
                  </span>
                  <span className="text-cyber-green/75 font-bold uppercase font-mono tracking-wide">{t.settingLength}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-mono text-cyber-green/45 pl-3">8</span>
                  <input
                    id="length-slider"
                    type="range"
                    min="8"
                    max="20"
                    value={config.length}
                    onChange={(e) => updateConfig("length", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#121922] rounded-lg appearance-none cursor-pointer accent-cyber-green hover:accent-cyber-light transition-all"
                  />
                  <span className="text-[10px] font-mono text-cyber-green/45 pr-3">20</span>
                </div>
              </div>

              {/* Grid of basic check boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                
                {/* Uppercase */}
                <label className={`flex items-center justify-between p-3.5 border rounded-xl transition-all cursor-pointer ${config.readable ? "opacity-35 cursor-not-allowed bg-zinc-900/45 border-transparent" : "bg-cyber-green/5 hover:bg-cyber-green/10 border-cyber-green/15 hover:border-cyber-green/35"}`}>
                  <span className="text-xs font-semibold text-white uppercase">{t.settingUpper}</span>
                  <input
                    id="checkbox-upper"
                    type="checkbox"
                    checked={config.includeUppercase}
                    disabled={config.readable}
                    onChange={(e) => updateConfig("includeUppercase", e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-cyber-green bg-[#0a0e12] border-cyber-green/30 focus:ring-cyber-green cursor-pointer disabled:cursor-not-allowed"
                  />
                </label>

                {/* Lowercase */}
                <label className={`flex items-center justify-between p-3.5 border rounded-xl transition-all cursor-pointer ${config.readable ? "opacity-35 cursor-not-allowed bg-zinc-900/45 border-transparent" : "bg-cyber-green/5 hover:bg-cyber-green/10 border-cyber-green/15 hover:border-cyber-green/35"}`}>
                  <span className="text-xs font-semibold text-white uppercase">{t.settingLower}</span>
                  <input
                    id="checkbox-lower"
                    type="checkbox"
                    checked={config.includeLowercase}
                    disabled={config.readable}
                    onChange={(e) => updateConfig("includeLowercase", e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-cyber-green bg-[#0a0e12] border-cyber-green/30 focus:ring-cyber-green cursor-pointer disabled:cursor-not-allowed"
                  />
                </label>

                {/* Numbers */}
                <label className="flex items-center justify-between p-3.5 bg-cyber-green/5 hover:bg-cyber-green/10 border border-cyber-green/15 rounded-xl transition-all cursor-pointer">
                  <span className="text-xs font-semibold text-white uppercase">{t.settingNumbers}</span>
                  <input
                    id="checkbox-numbers"
                    type="checkbox"
                    checked={config.includeNumbers}
                    onChange={(e) => updateConfig("includeNumbers", e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-cyber-green bg-[#0a0e12] border-cyber-green/30 focus:ring-cyber-green cursor-pointer"
                  />
                </label>

                {/* Symbols */}
                <label className={`flex items-center justify-between p-3.5 border rounded-xl transition-all cursor-pointer ${config.readable ? "opacity-35 cursor-not-allowed bg-zinc-900/40 border-transparent text-white/45" : "bg-cyber-green/5 hover:bg-cyber-green/10 border-cyber-green/15 hover:border-cyber-green/30"}`}>
                  <span className="text-xs font-semibold uppercase">{t.settingSymbols}</span>
                  <input
                    id="checkbox-symbols"
                    type="checkbox"
                    checked={config.includeSymbols}
                    disabled={config.readable}
                    onChange={(e) => updateConfig("includeSymbols", e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-cyber-green bg-[#0a0e12] border-cyber-green/30 focus:ring-cyber-green cursor-pointer disabled:cursor-not-allowed"
                  />
                </label>

              </div>

              {/* Advanced Fine-Tuners Rules section */}
              <div className="border border-cyber-green/15 bg-cyber-green/5 rounded-xl p-4 space-y-4 font-mono">
                <div className="text-xs font-bold text-cyber-light flex items-center gap-1.5 uppercase">
                  <Info className="w-4 h-4 text-cyber-green animate-pulse" />
                  // {t.filtersHeading}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Exclude similar characters */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="checkbox-similar"
                      type="checkbox"
                      checked={config.excludeSimilar}
                      onChange={(e) => updateConfig("excludeSimilar", e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-cyber-green bg-[#121922] border-cyber-green/20 focus:ring-cyber-green"
                    />
                    <div className="text-xs">
                      <span className="block font-bold text-white mb-0.5 uppercase">{t.filterExcludeConfusing}</span>
                      <span className="block text-cyber-green/50 font-sans text-[11px] leading-relaxed">{t.filterExcludeConfusingDesc}</span>
                    </div>
                  </label>

                  {/* Phonetic Pronounceability mode */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="checkbox-readable"
                      type="checkbox"
                      checked={config.readable}
                      onChange={(e) => {
                        const val = e.target.checked;
                        updateConfig("readable", val);
                        if (val) {
                          updateConfig("includeSymbols", false);
                          updateConfig("includeUppercase", true);
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded text-cyber-green bg-[#121922] border-cyber-green/20 focus:ring-cyber-green"
                    />
                    <div className="text-xs">
                      <span className="block font-bold text-white mb-0.5 uppercase">{t.filterReadable}</span>
                      <span className="block text-cyber-green/50 font-sans text-[11px] leading-relaxed">{t.filterReadableDesc}</span>
                    </div>
                  </label>

                </div>

                {/* Exclude specific characters field */}
                <div className="pt-2 border-t border-cyber-green/10">
                  <label className="block text-xs font-bold text-white mb-1 uppercase tracking-wide">{t.filterCustomExcl}</label>
                  <input
                    id="input-exclusions"
                    type="text"
                    value={config.customExclusions}
                    onChange={(e) => updateConfig("customExclusions", e.target.value)}
                    placeholder={t.filterCustomExclPlaceholder}
                    className="w-full text-xs font-mono bg-[#040608] border border-cyber-green/20 rounded-lg py-2.5 px-3 text-cyber-light focus:outline-none focus:border-cyber-green text-left ltr-layout"
                  />
                  <span className="block text-[10px] text-cyber-green/40 mt-1 font-sans">
                    {t.filterCustomExclTip}
                  </span>
                </div>

              </div>
              
            </div>
          </section>

        </div>

        {/* Right Column: Historical Logs Console */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="bg-[#0b1014] border border-cyber-green/25 rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-[460px] relative overflow-hidden">
            <div className="absolute top-1 left-3 text-[7px] font-mono text-cyber-green/35 ltr-layout uppercase font-bold">
              SECU_LOG_CONTAINER_ENG
            </div>
            
            <h3 className="text-md font-bold text-white mb-4 pb-2.5 border-b border-cyber-green/15 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono uppercase text-sm">
                <History className="w-4 h-4 text-cyber-green" />
                {t.historyHeading}
              </span>
              <span className="text-[10px] bg-cyber-green/10 border border-cyber-green/25 text-cyber-green px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                {history.length} {t.historyLogs}
              </span>
            </h3>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <ShieldAlert className="w-8 h-8 text-cyber-green/20 mb-2 animate-bounce" />
                <p className="text-xs text-cyber-green/45 font-mono uppercase">{t.historyEmptyState}</p>
                <p className="text-[10px] text-cyber-green/35 mt-1 font-sans">{t.historyEmptyDesc}</p>
              </div>
            ) : (
              <ul className="space-y-3 overflow-y-auto max-h-[480px] flex-1 pr-1">
                {history.map((log) => (
                  <li 
                    key={log.id} 
                    className="bg-[#040608]/90 border border-cyber-green/15 rounded-xl p-3 hover:border-cyber-green/45 transition-all flex flex-col gap-2 relative group"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-cyber-green/50">{log.timestamp}</span>
                      <span className="text-cyber-green/30 text-[8px] uppercase">ID: {log.id}</span>
                    </div>

                    <div className="flex justify-between items-center bg-[#070b0e] border border-cyber-green/5 p-2 rounded-lg gap-2">
                      <div className="text-xs text-cyber-light font-mono truncate max-w-[140px] tracking-wider font-bold">
                        {log.revealed ? log.val : "••••••••••••"}
                      </div>

                      <div className="flex items-center space-x-1 ltr-layout gap-1 shrink-0">
                        {/* Copy log parameter */}
                        <button
                          id={`history-copy-${log.id}`}
                          onClick={() => handleCopy(log.val)}
                          className="p-1 px-1.5 text-[9px] font-mono border border-cyber-green/20 hover:border-cyber-green text-cyber-green bg-cyber-green/5 hover:bg-cyber-green/10 rounded transition-all cursor-pointer"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>

                        {/* Mask or Show toggler */}
                        <button
                          id={`history-toggle-${log.id}`}
                          onClick={() => toggleHistoryReveal(log.id)}
                          className="p-1 px-1.5 text-[9px] font-mono border border-cyber-green/20 hover:border-cyber-green text-cyber-green bg-cyber-green/5 hover:bg-cyber-green/10 rounded transition-all cursor-pointer"
                        >
                          {log.revealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-[10px] text-cyber-green/30 mt-4 pt-2 border-t border-cyber-green/10 text-center font-mono select-none leading-relaxed">
              {t.historyTip}
            </div>
          </section>
        </div>

      </div>

      {/* Responsive Visual Quick Help Guard */}
      <footer className="mt-4 p-5 bg-[#090d11]/90 border border-cyber-green/20 rounded-xl text-xs space-y-2 select-text shadow-md">
        <h4 className="font-extrabold text-white flex items-center gap-1.5 font-mono uppercase">
          <ShieldCheck className="w-4.5 h-4.5 text-cyber-green" />
          // {t.guideHeading}
        </h4>
        <p className="text-cyber-green/75 leading-relaxed text-[11px]">
          {t.guideDesc}
        </p>
      </footer>

    </motion.div>
  );
}
