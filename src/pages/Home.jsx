import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import AppLayout from "../templates/AppLayout";
import Brand from "../molecules/Brand";
import AudioControls from "../molecules/AudioControls";
import DetailPanel from "../molecules/DetailPanel";
import SolarSystemCanvas from "../organisms/SolarSystemCanvas";
import OnboardingOverlay from "../molecules/OnboardingOverlay";

export default function Home() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selected, setSelected] = useState(null);
  
  // Hardcoded to standard "Realistic" speed
  const orbitMul = 1.0; 
  const spinMul = 1.0;

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedSpace");
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  const finishOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasVisitedSpace", "true");
  };

  const toggleAudio = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (!isPlaying) {
        a.volume = volume;
        await a.play();
        setIsPlaying(true);
      } else {
        a.pause();
        setIsPlaying(false);
      }
    } catch (e) {
      console.warn("Audio blocked:", e);
    }
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const onSelectPlanet = (p) => {
    setSelected(p);
  };

  const resetFocus = () => setSelected(null);

  return (
    <>
      <AppLayout
        topLeft={
           <div className="flex flex-col">
             <h1 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-md">
               Tata Surya Kita
             </h1>
             <div className="flex gap-3 items-center mt-1">
                <span className="text-xs md:text-sm text-cyan-200/70 font-mono tracking-widest">INTERACTIVE LEARNING</span>
                <Link href="/gravity" className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-[10px] text-cyan-300 font-bold tracking-wider uppercase transition-colors">
                    Mode Gravitasi ➜
                </Link>
             </div>
           </div>
        }
        topRight={
          <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10">
            <AudioControls
              isPlaying={isPlaying}
              onToggle={toggleAudio}
              volume={volume}
              onVolume={onVolume}
            />
          </div>
        }
      >
        <SolarSystemCanvas
          onSelectPlanet={onSelectPlanet}
          onReset={resetFocus}
          selectedKey={selected?.key ?? null}
          speedMultiplier={orbitMul}
          spinMultiplier={spinMul}
        />

        <audio ref={audioRef} src="/audio/bg-music.mp3" loop preload="auto" />

        <DetailPanel selected={selected} onReset={resetFocus} />
      </AppLayout>

      {showOnboarding && <OnboardingOverlay onComplete={finishOnboarding} />}
    </>
  );
}
