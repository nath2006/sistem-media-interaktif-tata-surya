import GlassCard from "../atoms/GlassCard";

export default function TopBar({ left, right }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-4">
      <GlassCard className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {left}
        <div className="flex items-center gap-3">{right}</div>
      </GlassCard>
    </div>
  );
}
