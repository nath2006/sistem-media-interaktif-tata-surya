import TopBar from "../molecules/TopBar";
import GlassCard from "../atoms/GlassCard";

export default function AppLayout({ topLeft, topRight, children }) {
  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {children}

      <TopBar left={topLeft} right={topRight} />

      <div className="pointer-events-none absolute right-4 top-24 z-20 hidden md:block">
        <GlassCard className="pointer-events-auto max-w-sm p-4 text-white">
          <div className="font-semibold">Cara pakai</div>
          <ul className="mt-2 space-y-1 text-sm text-white/75">
            <li>• Klik planet untuk fokus</li>
            <li>• Drag untuk rotasi view</li>
            <li>• Scroll untuk zoom (khusus canvas)</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
