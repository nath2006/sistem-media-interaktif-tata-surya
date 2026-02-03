export default function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center border border-white/10">
        <span className="text-white text-sm">🪐</span>
      </div>
      <div>
        <div className="text-white font-semibold leading-tight">Tata Surya Interaktif</div>
        <div className="text-white/60 text-xs">Three.js + GSAP • React + Tailwind</div>
      </div>
    </div>
  );
}
