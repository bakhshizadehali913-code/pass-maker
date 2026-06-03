/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import MatrixIntro from "./components/MatrixIntro";
import PasswordGenerator from "./components/PasswordGenerator";

type Phase = "intro" | "generator";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [lang, setLang] = useState<"fa" | "en">("fa");

  return (
    <div id="app-root-container" className="min-h-screen bg-cyber-dark text-white relative overflow-x-hidden selection:bg-cyber-green/30 selection:text-white">
      {/* Glow ambient background grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />
      
      {/* CRT scanlines screen filter */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none z-10 animate-flicker" />

      {/* Main app navigation container */}
      <main className="relative z-25 min-h-screen flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center">
          {phase === "intro" ? (
            <MatrixIntro lang={lang} setLang={setLang} onComplete={() => setPhase("generator")} />
          ) : (
            <div className="w-full py-6 animate-fade-in">
              <PasswordGenerator lang={lang} setLang={setLang} />
            </div>
          )}
        </div>

        {/* Outer Minimalist footer credit */}
        <footer className="w-full py-4 text-center text-cyber-green/30 font-mono text-[9px] border-t border-cyber-green/5 bg-black/40 relative z-30 select-none">
          SECURE QUANTUM TERMINAL // {lang === "fa" ? "حقوق برای موتور رمزنگاری محفوظ است" : "ENVIRONMENT: PROD // SECURE GATEWAY ENCRYPTED"} // © {new Date().getFullYear()} CYBER_CRYPT.
        </footer>
      </main>
    </div>
  );
}
