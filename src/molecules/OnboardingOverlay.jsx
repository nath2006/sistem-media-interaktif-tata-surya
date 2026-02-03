import { useState, useEffect } from "react";

export default function OnboardingOverlay({ onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const steps = [
    {
      title: "Halo, Penjelajah Angkasa! 🚀",
      desc: "Selamat datang di Tata Surya Interaktif. Siap untuk berpetualang?",
      icon: "🌍",
    },
    {
      title: "Geser untuk Melihat 🖱️",
      desc: "Klik & tahan mouse, lalu geser untuk memutar pandangan ke sekeliling.",
      icon: "🔄",
    },
    {
      title: "Zoom In & Out 🔍",
      desc: "Gunakan scroll mouse untuk melihat lebih dekat atau lebih jauh.",
      icon: "🔭",
    },
    {
      title: "Klik Planet 🪐",
      desc: "Klik pada planet mana saja untuk mendarat dan membaca fakta seru!",
      icon: "✨",
    },
    {
      title: "Mode Gravitasi 🌌",
      desc: "Coba simulasi gravitasi baru! Lihat bagaimana planet melengkungkan ruang angkasa.",
      icon: "🕸️",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setVisible(false);
      onComplete();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md w-full text-center text-white shadow-[0_0_50px_rgba(80,200,255,0.3)] animate-bounce-in">
        <div className="text-6xl mb-4 animate-pulse">{steps[step].icon}</div>
        <h2 className="text-3xl font-bold mb-3 font-display bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
          {steps[step].title}
        </h2>
        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
          {steps[step].desc}
        </p>

        <div className="flex gap-2 justify-center mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-cyan-400" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xl shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
        >
          {step === steps.length - 1 ? "Mulai Petualangan!" : "Lanjut >"}
        </button>
      </div>
    </div>
  );
}
