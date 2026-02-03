import { motion, AnimatePresence } from "framer-motion";

export default function DetailPanel({ selected, onReset }) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "120%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-black/60 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto z-40 shadow-2xl"
        >
          <button
            onClick={onReset}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            ❌
          </button>

          <div className="mt-12">
            <h2
              className="text-5xl font-bold mb-2 font-display uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{ color: selected.planetColor }}
            >
              {selected.name}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-white/50 to-transparent mb-6 rounded-full" />

            <p className="text-xl text-blue-100 italic mb-8 leading-relaxed border-l-4 border-white/30 pl-4">
              "{selected.desc}"
            </p>

            {/* Scientific Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {Object.entries({
                "Massa": selected.stats?.mass,
                "Diameter": selected.stats?.diameter,
                "Gravitasi": selected.stats?.gravity,
                "Suhu Rata-rata": selected.stats?.temp,
                "Satu Hari": selected.stats?.day,
                "Satu Tahun": selected.stats?.year,
                "Jumlah Bulan": selected.stats?.moons,
              }).map(([label, value]) => (value !== undefined &&
                <div key={label} className="bg-white/10 p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-sm font-bold text-white font-mono">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {/* Fun Facts Section */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-colors">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                  🌟 Fakta Unik
                </h3>
                <ul className="space-y-3">
                  {selected.details.funFacts.map((fact, i) => (
                    <li key={i} className="flex gap-3 text-white/90">
                      <span className="text-cyan-400 mt-1">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geographic Details Section */}
              {selected.details.latlon && selected.details.latlon.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-colors">
                  <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                    📍 Tempat Menarik
                  </h3>
                  <div className="space-y-4">
                    {selected.details.latlon.map((item, i) => (
                      <div key={i} className="group">
                        <div className="font-bold text-lg text-white mb-1 group-hover:text-green-200 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-white/60 mb-1 font-mono">
                           {item.lat !== "—" ? `${item.lat}, ${item.lon}` : ""}
                        </div>
                        <div className="text-gray-300 text-sm">{item.what}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
