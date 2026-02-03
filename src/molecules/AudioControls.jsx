import Button from "../atoms/Button";
import Range from "../atoms/Range";

export default function AudioControls({ isPlaying, onToggle, volume, onVolume }) {
  return (
    <div className="flex items-center gap-3">
      <Button onClick={onToggle}>{isPlaying ? "Pause Audio" : "Play Audio"}</Button>
      <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs">
        <span>Vol</span>
        <Range min="0" max="1" step="0.01" value={volume} onChange={onVolume} className="w-28" />
      </div>
    </div>
  );
}
