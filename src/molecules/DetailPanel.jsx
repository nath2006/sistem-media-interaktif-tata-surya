import Button from "../atoms/Button";
import GlassCard from "../atoms/GlassCard";

export default function DetailPanel({ selected, onReset }) {
  const accent =
    selected?.key === "mars" ? "from-orange-400/25 to-rose-500/10" :
    selected?.key === "earth" ? "from-cyan-400/25 to-blue-500/10" :
    selected?.key === "venus" ? "from-amber-300/25 to-yellow-500/10" :
    "from-sky-400/20 to-fuchsia-500/10";

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-full max-w-md p-4">
      <GlassCard
        className={[
          "pointer-events-auto h-full rounded-3xl overflow-hidden transition-all duration-300",
          selected ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
        ].join(" ")}
      >
        <div className={`h-full bg-gradient-to-b ${accent}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between p-5">
              <div>
                <div className="text-xs text-white/60">DETAIL PLANET</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {selected?.name ?? "—"}
                </div>
              </div>
              <Button onClick={onReset} className="rounded-2xl">Reset Focus</Button>
            </div>

            <div className="px-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white/85 text-sm leading-relaxed">
                  {selected?.desc ?? "Klik planet untuk melihat deskripsi dan fakta menarik."}
                </div>
              </div>

              {!!selected?.facts?.length && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-white">Fakta singkat</div>
                  <div className="mt-2 grid gap-2">
                    {selected.facts.map((f, i) => (
                      <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto p-5 text-xs text-white/50">
              Tips: audio butuh klik user dulu (autoplay policy browser).
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
