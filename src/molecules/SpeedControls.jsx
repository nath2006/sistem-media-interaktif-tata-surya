import Button from "../atoms/Button";
import Range from "../atoms/Range";

const PRESETS = {
  pelan: { orbit: 0.35, spin: 0.35, label: "Pelan" },
  normal: { orbit: 1.0, spin: 1.0, label: "Normal" },
  realistis: { orbit: 0.12, spin: 0.6, label: "Realistis" },
};

export default function SpeedControls({
  mode,
  setMode,
  orbitMul,
  setOrbitMul,
  spinMul,
  setSpinMul,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2">
        {Object.entries(PRESETS).map(([k, v]) => (
          <Button
            key={k}
            onClick={() => {
              setMode(k);
              setOrbitMul(v.orbit);
              setSpinMul(v.spin);
            }}
            className={mode === k ? "bg-white/20" : ""}
            title={`Orbit ${v.orbit}x • Spin ${v.spin}x`}
          >
            {v.label}
          </Button>
        ))}
        <Button
          onClick={() => setMode("custom")}
          className={mode === "custom" ? "bg-white/20" : ""}
        >
          Custom
        </Button>
      </div>

      {mode === "custom" && (
        <div className="hidden lg:flex items-center gap-2 text-white/70 text-xs">
          <span>Orbit</span>
          <Range
            min="0.05"
            max="3"
            step="0.05"
            value={orbitMul}
            onChange={(e) => setOrbitMul(Number(e.target.value))}
            className="w-28"
          />
          <span>Spin</span>
          <Range
            min="0.05"
            max="3"
            step="0.05"
            value={spinMul}
            onChange={(e) => setSpinMul(Number(e.target.value))}
            className="w-28"
          />
        </div>
      )}
    </div>
  );
}
