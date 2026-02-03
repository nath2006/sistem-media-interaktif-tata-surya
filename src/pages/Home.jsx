import { useMemo, useRef, useState } from "react";
import AppLayout from "../templates/AppLayout";
import Brand from "../molecules/Brand";
import AudioControls from "../molecules/AudioControls";
import DetailPanel from "../molecules/DetailPanel";
import SolarSystemCanvas from "../organisms/SolarSystemCanvas";

export default function Home() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [selected, setSelected] = useState(null);

  const facts = useMemo(() => ({
    mercury: ["Diameter ~4,879 km", "Tidak punya satelit", "Tahun 88 hari"],
    venus: ["Atmosfer CO₂ tebal", "Terpanas di tata surya", "Rotasi sangat lambat"],
    earth: ["70% air", "1 satelit (Bulan)", "Mendukung kehidupan"],
    mars: ["Planet merah", "Olympus Mons", "Punya 2 satelit"],
  }), []);

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
      console.warn("Audio blocked by browser policy:", e);
    }
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const onSelectPlanet = (p) => {
    setSelected({
      key: p.key,
      name: p.name,
      desc: p.desc,
      facts: facts[p.key] ?? [],
    });
  };

  const resetFocus = () => setSelected(null);

  return (
    <AppLayout
      topLeft={<Brand />}
      topRight={
        <AudioControls
          isPlaying={isPlaying}
          onToggle={toggleAudio}
          volume={volume}
          onVolume={onVolume}
        />
      }
    >
      <SolarSystemCanvas onSelectPlanet={onSelectPlanet} onReset={resetFocus} selectedKey={selected?.key ?? null} />

      <audio ref={audioRef} src="/audio/space.mp3" loop preload="auto" />

      <DetailPanel selected={selected} onReset={resetFocus} />
    </AppLayout>
  );
}
