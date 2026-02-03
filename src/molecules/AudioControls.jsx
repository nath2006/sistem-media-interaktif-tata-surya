import Button from "../atoms/Button";
import Range from "../atoms/Range";

export default function AudioControls({ isPlaying, onToggle, volume, onVolume }) {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onToggle}
        className="text-2xl hover:scale-110 transition-transform text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        title={isPlaying ? "Pause Musik" : "Putar Musik"}
      >
        {isPlaying ? "⏸️" : "🎵"}
      </button>
      <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs">
        <span>🔊</span>
        <Range min="0" max="1" step="0.01" value={volume} onChange={onVolume} className="w-24 accent-purple-400 cursor-pointer" />
      </div>
    </div>
  );
}
