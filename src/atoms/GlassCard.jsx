export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl " +
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-30px_rgba(0,255,255,0.25)] " +
        className
      }
    >
      {children}
    </div>
  );
}
